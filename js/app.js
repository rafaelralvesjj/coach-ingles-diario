import { AMBIENTES, STUDENT_NAME } from "./ambientes.js";
import {
  loadState, saveState, getCharacter, setCharacter, removeCharacter,
  recordDailyPractice, markSceneAttempted, markSceneMastered, getStreak,
  setPace, getWeeklyMasteryCount, getLevelInfo, LEVELS, PACE_OPTIONS
} from "./state.js";
import { speak, stopSpeaking, listen, listenForResponse, sttAvailable } from "./speech.js";

const state = loadState();

const el = (id) => document.getElementById(id);
const screens = {
  pace: el("screen-pace"),
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

// --- Controle de "tarefa concluída" — 3 critérios: sem ajuda, dentro do
// tempo, e qualidade de pronúncia mínima. Pular um passo durante o diálogo
// (não durante o treino) também conta como ajuda.
const TASK_TIME_LIMIT_MS = 20 * 60 * 1000; // 20 minutos
const QUALITY_PASS_PERCENT = 70; // % mínimo de aproveitamento de pronúncia

let inDialoguePhase = false;
let helpCount = 0; // quantas vezes o sistema precisou intervir com ajuda
let sceneNotVerifiable = false;
let sceneStartTime = 0;
let responseLog = []; // [{ phrase, quality: 'bom'|'medio'|'ruim' }], uma por frase respondida

function classifyQuality(result) {
  if (!result || !result.supported) return "ruim";
  if (!result.startedSpeaking) return "ruim";
  const ratio = result.ratio || 0;
  if (ratio >= 0.85) return "bom";
  if (ratio >= 0.5) return "medio";
  return "ruim";
}

function qualityPercent(qualities) {
  if (qualities.length === 0) return 100;
  const points = qualities.reduce((sum, q) => sum + (q === "bom" ? 2 : q === "medio" ? 1 : 0), 0);
  return (points / (qualities.length * 2)) * 100;
}

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
  if (inDialoguePhase) helpCount++;
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

// ---------- ONBOARDING: ESCOLHER RITMO ----------

function renderPaceScreen() {
  el("pace-greeting").textContent = `${timeGreeting()}, ${STUDENT_NAME}!`;
  const list = el("pace-list");
  list.innerHTML = "";
  for (const pace of PACE_OPTIONS) {
    const btn = document.createElement("button");
    btn.className = "review-item" + (state.pace === pace.id ? " selected" : "");
    btn.innerHTML = `<span class="review-day-title">${pace.label}<br><span style="font-weight:400;color:var(--text-muted);font-size:0.85rem">${pace.desc}</span></span>`;
    btn.addEventListener("click", () => {
      setPace(state, pace.id);
      showScreen("home");
      renderHome();
    });
    list.appendChild(btn);
  }
  showScreen("pace");
}

el("btn-change-pace").addEventListener("click", () => renderPaceScreen());

// ---------- TELA INICIAL ----------

function renderHome() {
  if (!state.pace) {
    renderPaceScreen();
    return;
  }

  const streak = getStreak(state);
  el("streak-badge").textContent = `🔥 ${streak}`;
  el("home-greeting").textContent = `${timeGreeting()}, ${STUDENT_NAME}!`;
  el("stt-hint").textContent = sttAvailable
    ? ""
    : "Seu navegador não reconhece fala automaticamente — a prática vira 'repita comigo', sem correção automática.";

  const level = getLevelInfo(state.completedScenes.length);
  el("level-name").textContent = level.current.name;
  el("level-count").textContent = `${level.masteredCount} tarefa${level.masteredCount === 1 ? "" : "s"} concluída${level.masteredCount === 1 ? "" : "s"}`;
  el("level-bar-fill").style.width = `${Math.round(level.progress * 100)}%`;
  el("level-next").textContent = level.next
    ? `Faltam ${level.next.min - level.masteredCount} tarefa${(level.next.min - level.masteredCount) === 1 ? "" : "s"} para o nível "${level.next.name}"`
    : "Você chegou ao nível máximo! 🎉";

  const pace = PACE_OPTIONS.find(p => p.id === state.pace);
  const weekCount = getWeeklyMasteryCount(state);
  if (pace) {
    el("week-progress").textContent = `Essa semana: ${weekCount}/${pace.weeklyTarget} tarefas (ritmo ${pace.label.toLowerCase()})`;
  }

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
      btn.addEventListener("click", () => startScene(ambiente, scene, true, false));
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
  updateSkipTrainingButton();
  showScreen("characters");
}

function updateSkipTrainingButton() {
  const attemptedBefore = state.attemptedScenes.includes(currentScene.id);
  el("btn-skip-training").classList.toggle("hidden", !attemptedBefore);
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
      updateSkipTrainingButton();
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
  startScene(currentAmbiente, currentScene, false, false);
});

el("btn-skip-training").addEventListener("click", () => {
  startScene(currentAmbiente, currentScene, false, true);
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

async function startScene(ambiente, scene, isReview, skipTraining) {
  paused = false;
  setPauseUI();
  helpCount = 0;
  sceneNotVerifiable = false;
  sceneStartTime = Date.now();
  responseLog = [];
  markSceneAttempted(state, scene.id);
  showScreen("lesson");
  const beats = activeBeatsFor(ambiente, scene);
  if (skipTraining) {
    await runStep(() => say("Beleza, vamos direto pro diálogo!", { lang: "pt-BR" }));
  } else {
    await runTraining(ambiente, scene, beats);
  }
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

    responseLog.push({ phrase: beat.response_en, quality: classifyQuality(result) });

    if (!result || !result.supported) {
      // sem reconhecimento de fala no navegador: modo "repita comigo".
      // Não dá pra verificar o que ela falou, então essa cena nunca pode
      // ser certificada como tarefa concluída neste aparelho.
      sceneNotVerifiable = true;
      setCaption(character.name, beat.response_en);
      setFeedback("Repita em voz alta.");
      await runStep(() => say(beat.response_en, { lang: "en-US" }));
      continue;
    }

    if (!result.startedSpeaking) {
      // ela hesitou — entra a ajuda
      helpCount++;
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
      // ela tentou sozinha, só não bateu certinho — isso pesa na qualidade
      // da pronúncia (critério 3), mas não conta como "ajuda" (critério 1):
      // ninguém interveio, ela só errou por conta própria.
      setCaption(character.name, beat.response_en);
      setFeedback(`Quase lá! A frase é: "${beat.response_en}"`);
      await runStep(() => say(beat.response_en, { lang: "en-US" }));
    }
  }
}

function formatMinutes(ms) {
  return Math.round((ms / 60000) * 10) / 10;
}

async function runWrapup(ambiente, scene, isReview) {
  inDialoguePhase = false;
  setPhase(2);
  setMic(false);
  setCaption("", "");
  setFeedback("");

  const elapsedMs = Date.now() - sceneStartTime;
  const elapsedMin = formatMinutes(elapsedMs);
  const percent = Math.round(qualityPercent(responseLog.map(r => r.quality)));

  const passedHelp = helpCount === 0;
  const passedTime = elapsedMs <= TASK_TIME_LIMIT_MS;
  const passedQuality = percent >= QUALITY_PASS_PERCENT;
  const taskCompleted = passedHelp && passedTime && passedQuality && !sceneNotVerifiable;

  const levelBefore = getLevelInfo(state.completedScenes.length);

  if (!isReview) recordDailyPractice(state);
  if (taskCompleted) markSceneMastered(state, scene.id);
  else saveState(state);

  const levelAfter = getLevelInfo(state.completedScenes.length);
  const leveledUp = taskCompleted && levelAfter.current.name !== levelBefore.current.name;

  let recapMsg;
  if (taskCompleted) {
    recapMsg = `${scene.recap_pt} Você concluiu essa tarefa: sem ajuda, em ${elapsedMin} minutos, com ${percent}% de qualidade na pronúncia! Parabéns, você está evoluindo.`;
  } else {
    const reasons = [];
    if (sceneNotVerifiable) reasons.push("seu navegador não consegue verificar sua pronúncia, então essa cena não pode virar tarefa concluída neste aparelho");
    if (!passedHelp) reasons.push(`você precisou de ajuda ${helpCount} ${helpCount === 1 ? "vez" : "vezes"}`);
    if (!passedTime) reasons.push(`você passou de 20 minutos (levou ${elapsedMin} minutos)`);
    if (!passedQuality) reasons.push(`sua pronúncia ficou em ${percent}%, abaixo dos ${QUALITY_PASS_PERCENT}% necessários`);
    recapMsg = `${scene.recap_pt} Essa tarefa ainda não fechou porque ${reasons.join(", e ")}. Continue praticando!`;
  }
  await runStep(() => say(recapMsg, { lang: "pt-BR" }));
  if (leveledUp) {
    await runStep(() => say(`Você subiu de nível! Agora você está em: ${levelAfter.current.name}.`, { lang: "pt-BR" }));
  }

  const streak = getStreak(state);
  el("done-title").textContent = taskCompleted ? "Tarefa concluída! 🏆" : "Cena praticada";
  el("done-streak").textContent = `Sequência: ${streak} dia${streak === 1 ? "" : "s"}`;
  el("done-recap").textContent = recapMsg;

  el("done-training-summary").textContent =
    `${ambiente.title} · ${scene.title}. Use isso quando: ${ambiente.subtitle.toLowerCase()}.`;

  const checklist = el("task-checklist");
  checklist.innerHTML = `
    <div class="check-row ${passedHelp ? "ok" : "fail"}">${passedHelp ? "✅" : "❌"} Ajudas usadas: ${helpCount}</div>
    <div class="check-row ${passedTime ? "ok" : "fail"}">${passedTime ? "✅" : "❌"} Dentro de 20 min (${elapsedMin} min)</div>
    <div class="check-row ${passedQuality ? "ok" : "fail"}">${passedQuality ? "✅" : "❌"} Pronúncia: ${percent}%</div>
  `;

  const qualityList = el("quality-list");
  qualityList.innerHTML = responseLog.map(r => `
    <div class="quality-item">
      <span class="quality-phrase">${r.phrase}</span>
      <span class="quality-tag ${r.quality}">${r.quality === "bom" ? "Bom" : r.quality === "medio" ? "Médio" : "Ruim"}</span>
    </div>
  `).join("");

  const taskWord = levelAfter.masteredCount === 1 ? "tarefa concluída" : "tarefas concluídas";
  const levelUpText = el("level-up-text");
  if (leveledUp) {
    levelUpText.textContent = `🎉 Você subiu de nível: ${levelAfter.current.name}! (${levelAfter.masteredCount} ${taskWord} no total)`;
  } else {
    levelUpText.textContent = `Nível atual: ${levelAfter.current.name} (${levelAfter.masteredCount} ${taskWord} no total)`;
  }

  showScreen("done");
}

el("btn-back-home").addEventListener("click", () => {
  showScreen("home");
  renderHome();
});

renderHome();
