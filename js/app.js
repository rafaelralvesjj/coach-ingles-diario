import { AMBIENTES, STUDENT_NAME } from "./ambientes.js";
import { loadState, saveState, getCharacter, setCharacter, removeCharacter, recordDailyPractice, markSceneMastered, getStreak } from "./state.js";
import { speak, stopSpeaking, listen, listenForResponse, sttAvailable } from "./speech.js";

const state = loadState();

const el = (id) => document.getElementById(id);
const screens = {
  home: el("screen-home"),
  review: el("screen-review"),
  characters: el("screen-characters"),
  customize: el("screen-customize"),
  lesson: el("screen-lesson"),
  done: el("screen-done")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function findScene(sceneId) {
  for (const ambiente of AMBIENTES) {
    const scene = ambiente.scenes.find(s => s.id === sceneId);
    if (scene) return { ambiente, scene };
  }
  return null;
}

// --- Navegação: ambiente/cena/slot em foco ---
let currentAmbiente = null;
let currentScene = null;
let pendingSlot = null;
let selectedRole = null;

// --- Controle de pausa / pular, usado durante treino e diálogo ---
let paused = false;
let skipCurrentStep = null;
let currentReplay = null;

// --- Controle de "tarefa concluída sem ajuda" ---
// Só marcamos uma cena como concluída quando ela responde tudo sozinha, no
// tempo certo, sem precisar de nenhuma dica. Pular um passo durante o
// diálogo (não durante o treino) também conta como ajuda.
let inDialoguePhase = false;
let sceneHadHelp = false;

function setPauseUI() {
  el("btn-pause").textContent = paused ? "▶" : "⏸";
}

el("btn-pause").addEventListener("click", () => {
  paused = !paused;
  if (paused) window.speechSynthesis?.pause();
  else window.speechSynthesis?.resume();
  setPauseUI();
});

el("btn-skip").addEventListener("click", () => {
  if (inDialoguePhase) sceneHadHelp = true;
  if (skipCurrentStep) skipCurrentStep();
});

el("btn-repeat").addEventListener("click", () => {
  if (currentReplay) currentReplay();
});

el("btn-exit").addEventListener("click", () => {
  stopSpeaking();
  showScreen("home");
  renderHome();
});

async function waitWhilePaused() {
  while (paused) {
    await new Promise(r => setTimeout(r, 200));
  }
}

function runStep(taskFn) {
  return new Promise((resolve) => {
    let finished = false;
    skipCurrentStep = () => {
      if (finished) return;
      finished = true;
      stopSpeaking();
      resolve();
    };
    taskFn().then((v) => {
      if (finished) return;
      finished = true;
      resolve(v);
    });
  });
}

async function say(text, opts) {
  await waitWhilePaused();
  await speak(text, opts);
  await waitWhilePaused();
}

function setCaption(pt, en) {
  el("caption-pt").textContent = pt || "";
  el("caption-en").textContent = en || "";
}

function setFeedback(text) {
  el("feedback").textContent = text || "";
}

function setMic(on) {
  el("mic-indicator").classList.toggle("hidden", !on);
}

const PHASES = ["Treino", "Diálogo", "Resumo"];
function setPhase(index) {
  el("phase-label").textContent = PHASES[index];
  const dots = el("progress-dots");
  dots.innerHTML = "";
  PHASES.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i < index) dot.classList.add("filled");
    if (i === index) dot.classList.add("active");
    dots.appendChild(dot);
  });
}

// ---------- TELA INICIAL ----------

function renderHome() {
  const streak = getStreak(state);
  el("streak-badge").textContent = `🔥 ${streak}`;
  el("home-greeting").textContent = `${timeGreeting()}, ${STUDENT_NAME}!`;
  el("stt-hint").textContent = sttAvailable
    ? ""
    : "Seu navegador não reconhece fala automaticamente — a prática vira 'repita comigo', sem correção automática.";

  const grid = el("ambiente-grid");
  grid.innerHTML = "";
  for (const ambiente of AMBIENTES) {
    const masteredCount = ambiente.scenes.filter(s => state.completedScenes.includes(s.id)).length;
    const badge = masteredCount > 0 ? `<span class="ambiente-badge">🏆 ${masteredCount}/${ambiente.scenes.length}</span>` : "";
    const card = document.createElement("button");
    card.className = "ambiente-card";
    card.innerHTML = `
      ${badge}
      <span class="ambiente-icon">${ambiente.icon}</span>
      <span class="ambiente-title">${ambiente.title}</span>
      <span class="ambiente-subtitle">${ambiente.subtitle}</span>
    `;
    card.addEventListener("click", () => openAmbiente(ambiente));
    grid.appendChild(card);
  }
}

el("btn-review").addEventListener("click", () => {
  const list = el("review-list");
  list.innerHTML = "";

  const completedInfo = state.completedScenes
    .map(findScene)
    .filter(Boolean);

  if (completedInfo.length === 0) {
    const empty = document.createElement("p");
    empty.className = "review-empty";
    empty.textContent = "Você ainda não concluiu nenhuma cena.";
    list.appendChild(empty);
  } else {
    for (const { ambiente, scene } of completedInfo) {
      const btn = document.createElement("button");
      btn.className = "review-item";
      btn.innerHTML = `<span class="review-day-num">${ambiente.icon}</span><span class="review-day-title">${ambiente.title} · ${scene.title}</span>`;
      btn.addEventListener("click", () => startScene(ambiente, scene, true));
      list.appendChild(btn);
    }
  }
  showScreen("review");
});

el("btn-review-back").addEventListener("click", () => showScreen("home"));

// ---------- TELA DE PERSONAGENS ----------

function openAmbiente(ambiente) {
  currentAmbiente = ambiente;
  currentScene = ambiente.scenes[0];
  renderCharacters();
  renderScenePicker();
  showScreen("characters");
}

function renderScenePicker() {
  const picker = el("scene-picker");
  const list = el("scene-list");
  if (currentAmbiente.scenes.length <= 1) {
    picker.classList.add("hidden");
    return;
  }
  picker.classList.remove("hidden");
  list.innerHTML = "";
  for (const scene of currentAmbiente.scenes) {
    const btn = document.createElement("button");
    btn.className = "review-item" + (scene.id === currentScene.id ? " selected" : "");
    btn.innerHTML = `<span class="review-day-title">${scene.title}</span>`;
    btn.addEventListener("click", () => {
      currentScene = scene;
      renderScenePicker();
    });
    list.appendChild(btn);
  }
}

function renderCharacters() {
  el("characters-title").textContent = currentAmbiente.title;
  const list = el("character-list");
  list.innerHTML = "";

  for (const slot of currentAmbiente.slots) {
    const character = getCharacter(state, currentAmbiente, slot);
    const row = document.createElement("div");
    row.className = "character-row";

    if (character) {
      row.innerHTML = `
        <div class="character-info">
          <span class="character-name">${character.name}</span>
          <span class="character-role">${character.roleLabel}</span>
        </div>
        <button class="btn-chip">Trocar</button>
      `;
      row.querySelector(".btn-chip").addEventListener("click", () => openCustomize(slot));
    } else {
      row.innerHTML = `
        <div class="character-info">
          <span class="character-name character-empty">${slot.label}</span>
          <span class="character-role">Ninguém adicionado ainda</span>
        </div>
        <button class="btn-chip btn-chip-accent">+ Adicionar</button>
      `;
      row.querySelector(".btn-chip").addEventListener("click", () => openCustomize(slot));
    }
    list.appendChild(row);
  }
}

el("btn-characters-back").addEventListener("click", () => showScreen("home"));

el("btn-start-scene").addEventListener("click", () => {
  startScene(currentAmbiente, currentScene, false);
});

// ---------- TELA DE CUSTOMIZAÇÃO ----------

function openCustomize(slot) {
  pendingSlot = slot;
  selectedRole = null;
  el("role-step").classList.remove("hidden");
  el("name-step").classList.add("hidden");
  el("character-name-input").value = "";

  const roleList = el("role-list");
  roleList.innerHTML = "";
  for (const role of slot.roles) {
    const btn = document.createElement("button");
    btn.className = "review-item";
    btn.innerHTML = `<span class="review-day-title">${role.label}</span>`;
    btn.addEventListener("click", () => {
      selectedRole = role;
      el("name-step-label").textContent = `Papel: ${role.label} — qual é o nome?`;
      el("role-step").classList.add("hidden");
      el("name-step").classList.remove("hidden");
      const existing = getCharacter(state, currentAmbiente, slot);
      el("character-name-input").value = existing ? existing.name : "";
      el("btn-remove-character").classList.toggle("hidden", !(slot.optional && state.characters[currentAmbiente.id]?.[slot.id]));
      el("character-name-input").focus();
    });
    roleList.appendChild(btn);
  }

  showScreen("customize");
}

el("btn-customize-back").addEventListener("click", () => showScreen("characters"));

el("btn-save-character").addEventListener("click", () => {
  const name = el("character-name-input").value.trim();
  if (!name || !selectedRole) return;
  setCharacter(state, currentAmbiente.id, pendingSlot.id, name, selectedRole.label);
  renderCharacters();
  showScreen("characters");
});

el("btn-remove-character").addEventListener("click", () => {
  removeCharacter(state, currentAmbiente.id, pendingSlot.id);
  renderCharacters();
  showScreen("characters");
});

// ---------- TREINO + DIÁLOGO ----------

function activeBeatsFor(ambiente, scene) {
  return scene.beats.filter((beat) => {
    const slot = ambiente.slots.find(s => s.id === beat.slot);
    return !!getCharacter(state, ambiente, slot);
  });
}

async function startScene(ambiente, scene, isReview) {
  paused = false;
  setPauseUI();
  sceneHadHelp = false;
  showScreen("lesson");
  const beats = activeBeatsFor(ambiente, scene);
  await runTraining(ambiente, scene, beats);
  await runDialogue(ambiente, scene, beats);
  await runWrapup(ambiente, scene, isReview);
}

function characterFor(ambiente, beat) {
  const slot = ambiente.slots.find(s => s.id === beat.slot);
  return getCharacter(state, ambiente, slot);
}

async function runTraining(ambiente, scene, beats) {
  inDialoguePhase = false;
  setPhase(0);
  setMic(false);
  setCaption(scene.title, "");
  setFeedback("Treino de frases");
  currentReplay = () => say(scene.intro_pt, { lang: "pt-BR" });
  await runStep(() => say(scene.intro_pt, { lang: "pt-BR" }));

  for (const beat of beats) {
    const character = characterFor(ambiente, beat);

    setCaption(`${character.name} vai dizer:`, beat.line_en);
    currentReplay = () => say(beat.line_en, { lang: "en-US", rate: 0.65, voiceKey: character.name });
    await runStep(() => say(beat.line_en, { lang: "en-US", rate: 0.65, voiceKey: character.name }));
    await runStep(() => say(beat.line_en, { lang: "en-US", rate: 0.95, voiceKey: character.name }));
    setCaption("Isso significa:", beat.line_pt);
    await runStep(() => say(beat.line_pt, { lang: "pt-BR" }));

    setCaption("Sua resposta será:", beat.response_en);
    currentReplay = () => say(beat.response_en, { lang: "en-US", rate: 0.65 });
    await runStep(() => say(beat.response_en, { lang: "en-US", rate: 0.65 }));
    await runStep(() => say(beat.response_en, { lang: "en-US", rate: 0.95 }));
    setCaption("Isso significa:", beat.response_pt);
    await runStep(() => say(beat.response_pt, { lang: "pt-BR" }));
  }
}

async function runDialogue(ambiente, scene, beats) {
  inDialoguePhase = true;
  setPhase(1);
  setFeedback("");
  await runStep(() => say(`Agora vamos para o diálogo de verdade, ${STUDENT_NAME}. ${characterFor(ambiente, beats[0])?.name || "Eles"} vão começar, e você responde quando for sua vez. Se você travar, eu te ajudo.`, { lang: "pt-BR" }));

  for (const beat of beats) {
    const character = characterFor(ambiente, beat);

    setCaption(character.name, beat.line_en);
    setFeedback("");
    currentReplay = () => say(beat.line_en, { lang: "en-US", voiceKey: character.name });
    await runStep(() => say(beat.line_en, { lang: "en-US", voiceKey: character.name }));

    setMic(true);
    const result = await runStep(() => listenForResponse(beat.response_en, { graceMs: 1500, timeoutMs: 7000 }));
    setMic(false);

    if (!result || !result.supported) {
      // sem reconhecimento de fala no navegador: modo "repita comigo",
      // nunca pode ser certificado como "sem ajuda".
      sceneHadHelp = true;
      setCaption(character.name, beat.response_en);
      setFeedback("Repita em voz alta.");
      await runStep(() => say(beat.response_en, { lang: "en-US" }));
      continue;
    }

    if (!result.startedSpeaking) {
      // ela hesitou — entra a ajuda
      sceneHadHelp = true;
      setFeedback("💡 Ajuda");
      setCaption(`${STUDENT_NAME}, você deveria responder:`, beat.response_en);
      await runStep(() => say(`${STUDENT_NAME}, você deveria responder:`, { lang: "pt-BR" }));
      await runStep(() => say(beat.response_en, { lang: "en-US", rate: 0.65 }));
      await runStep(() => say(beat.response_en, { lang: "en-US", rate: 0.95 }));

      setFeedback("Agora tente você:");
      setMic(true);
      const retry = await runStep(() => listen(beat.response_en, { timeoutMs: 7000 }));
      setMic(false);

      if (retry && retry.matched) {
        setFeedback("✅ Boa! (essa cena teve ajuda)");
        await runStep(() => say("Great!", { lang: "en-US" }));
      } else {
        setFeedback(`Tudo bem. A frase era: "${beat.response_en}"`);
      }
      continue;
    }

    if (result.matched) {
      setFeedback("✅ Perfeito!");
      await runStep(() => say("Perfect!", { lang: "en-US" }));
    } else {
      // ela tentou, mas não bateu com a frase esperada — também conta como ajuda
      sceneHadHelp = true;
      setCaption(character.name, beat.response_en);
      setFeedback(`Quase lá! A frase é: "${beat.response_en}"`);
      await runStep(() => say(beat.response_en, { lang: "en-US" }));
    }
  }
}

async function runWrapup(ambiente, scene, isReview) {
  inDialoguePhase = false;
  setPhase(2);
  setMic(false);
  setCaption("", "");
  setFeedback("");

  const wasMasteredBefore = state.completedScenes.includes(scene.id);
  const justMastered = !sceneHadHelp && !wasMasteredBefore;

  if (!isReview) recordDailyPractice(state);
  if (!sceneHadHelp) markSceneMastered(state, scene.id);
  else saveState(state);

  if (sceneHadHelp) {
    await runStep(() => say(`${scene.recap_pt} Você teve ajuda dessa vez — tenta de novo pra concluir essa cena sem nenhuma ajuda!`, { lang: "pt-BR" }));
  } else {
    await runStep(() => say(`${scene.recap_pt} E o melhor: você fez tudo sozinha, sem nenhuma ajuda!`, { lang: "pt-BR" }));
  }

  const streak = getStreak(state);
  el("done-title").textContent = sceneHadHelp ? "Cena praticada" : (justMastered ? "Tarefa concluída! 🏆" : "Cena dominada de novo! 🏆");
  el("done-streak").textContent = `Sequência: ${streak} dia${streak === 1 ? "" : "s"}`;
  el("done-recap").textContent = sceneHadHelp
    ? `${scene.recap_pt} Você teve ajuda — pratique de novo sem ajuda pra concluir essa tarefa.`
    : `${scene.recap_pt} Você concluiu sem nenhuma ajuda!`;
  showScreen("done");
}

el("btn-back-home").addEventListener("click", () => {
  showScreen("home");
  renderHome();
});

renderHome();
