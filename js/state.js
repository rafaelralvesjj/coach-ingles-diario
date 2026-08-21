// Estado do app: personagens customizados, progresso e sequência de dias.
// Tudo em localStorage — sem backend, sem conta, sem custo.

const STORAGE_KEY = "coach-ingles-state-v2";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.round(ms / 86400000);
}

function defaultState() {
  return {
    streak: 0,
    lastCompletedDate: null,
    completedScenes: [], // ids tipo "familia-1" — cenas já dominadas (3 critérios) ao menos uma vez
    attemptedScenes: [], // ids de cenas que ela já começou pelo menos uma vez (libera "pular treino")
    masteryLog: [], // [{ sceneId, date }] — um registro por vez que ela fechou uma tarefa
    pace: null, // 'leve' | 'moderado' | 'intenso' — ritmo escolhido por ela
    characters: {} // { [ambienteId]: { [slotId]: { name, roleLabel } } }
  };
}

export const LEVELS = [
  { name: "Começando", min: 0 },
  { name: "Pegando o jeito", min: 3 },
  { name: "Ganhando confiança", min: 7 },
  { name: "Mandando bem", min: 12 },
  { name: "Fluente no dia a dia", min: 20 }
];

export function getLevelInfo(masteredCount) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (masteredCount >= LEVELS[i].min) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const progress = next ? Math.min(1, (masteredCount - current.min) / (next.min - current.min)) : 1;
  return { current, next, progress, masteredCount };
}

export const PACE_OPTIONS = [
  { id: "leve", label: "Tranquilo", desc: "3 tarefas concluídas por semana", weeklyTarget: 3 },
  { id: "moderado", label: "Moderado", desc: "5 tarefas concluídas por semana", weeklyTarget: 5 },
  { id: "intenso", label: "Intenso", desc: "7 tarefas concluídas por semana (1 por dia)", weeklyTarget: 7 }
];

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Retorna { name, roleLabel } de quem ocupa esse slot (customizado ou padrão).
// Retorna null se for um slot opcional que ela ainda não ativou.
export function getCharacter(state, ambiente, slot) {
  const custom = state.characters[ambiente.id]?.[slot.id];
  if (custom) return custom;
  if (slot.optional) return null;
  return { name: slot.defaultName, roleLabel: slot.label };
}

export function setCharacter(state, ambienteId, slotId, name, roleLabel) {
  if (!state.characters[ambienteId]) state.characters[ambienteId] = {};
  state.characters[ambienteId][slotId] = { name, roleLabel };
  saveState(state);
}

export function removeCharacter(state, ambienteId, slotId) {
  if (state.characters[ambienteId]) {
    delete state.characters[ambienteId][slotId];
  }
  saveState(state);
}

// Conta como prática do dia (mantém a sequência), independente de ter tido
// ajuda ou não — o que importa aqui é o hábito de praticar todo dia.
export function recordDailyPractice(state) {
  const today = todayISO();
  if (state.lastCompletedDate === today) {
    // já praticou hoje, não duplica streak
  } else if (state.lastCompletedDate && daysBetween(state.lastCompletedDate, today) === 1) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastCompletedDate = today;
  saveState(state);
}

// Marca que ela já começou essa cena pelo menos uma vez — a partir daqui o
// treino vira opcional (ela pode pular direto pro diálogo nas próximas vezes).
export function markSceneAttempted(state, sceneId) {
  if (!state.attemptedScenes.includes(sceneId)) {
    state.attemptedScenes.push(sceneId);
  }
  saveState(state);
}

// Só marca a cena como "tarefa concluída" (dominada) quando ela termina o
// diálogo inteiro passando nos 3 critérios (sem ajuda, no tempo, boa pronúncia).
export function markSceneMastered(state, sceneId) {
  if (!state.completedScenes.includes(sceneId)) {
    state.completedScenes.push(sceneId);
  }
  state.masteryLog.push({ sceneId, date: todayISO() });
  saveState(state);
}

export function setPace(state, paceId) {
  state.pace = paceId;
  saveState(state);
}

export function getWeeklyMasteryCount(state) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return state.masteryLog.filter(m => new Date(m.date) >= cutoff).length;
}

export function getStreak(state) {
  const today = todayISO();
  if (!state.lastCompletedDate) return 0;
  const gap = daysBetween(state.lastCompletedDate, today);
  if (gap > 1) return 0;
  return state.streak;
}
