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
    completedScenes: [], // ids tipo "familia-1"
    characters: {} // { [ambienteId]: { [slotId]: { name, roleLabel } } }
  };
}

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

export function markSceneComplete(state, sceneId) {
  const today = todayISO();
  if (!state.completedScenes.includes(sceneId)) {
    state.completedScenes.push(sceneId);
  }
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

export function getStreak(state) {
  const today = todayISO();
  if (!state.lastCompletedDate) return 0;
  const gap = daysBetween(state.lastCompletedDate, today);
  if (gap > 1) return 0;
  return state.streak;
}
