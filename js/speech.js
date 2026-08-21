// Wrapper de voz: TTS (SpeechSynthesis) sempre disponível em navegadores modernos.
// STT (SpeechRecognition) só existe de fato no Chrome/Android — em navegadores sem
// suporte (ex.: Safari/iOS) caímos para um modo "repita comigo" sem verificação,
// para nunca travar a aula.

const synth = window.speechSynthesis;
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export const sttAvailable = !!SpeechRecognitionAPI;

let voicesCache = [];
function loadVoices() {
  voicesCache = synth ? synth.getVoices() : [];
}
if (synth) {
  loadVoices();
  synth.onvoiceschanged = loadVoices;
}

// Prioriza um match exato de região (ex.: "pt-BR") antes de aceitar
// qualquer voz só com o mesmo idioma (ex.: "pt-PT") — evita pegar uma voz
// com sotaque/fonética diferente quando existe uma voz certa disponível.
function pickVoice(fullLang, preferFemale) {
  const wanted = fullLang.toLowerCase();
  const base = wanted.split("-")[0];
  const exact = voicesCache.filter(v => v.lang && v.lang.toLowerCase() === wanted);
  const sameLang = voicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith(base));
  const pool = exact.length > 0 ? exact : sameLang;
  if (pool.length === 0) return null;
  if (preferFemale) {
    const female = pool.find(v => /female|woman|samantha|joanna|salli|zira|luciana|maria|francisca/i.test(v.name));
    if (female) return female;
  }
  return pool[0];
}

// hasVoiceFor: existe alguma voz instalada nesse aparelho para esse idioma?
// Usado pra avisar quando o português vai sair mal (ex.: aparelho sem voz
// pt-BR instalada, caindo para uma voz genérica/de outro idioma).
export function hasVoiceFor(lang) {
  const base = lang.toLowerCase().split("-")[0];
  return voicesCache.some(v => v.lang && v.lang.toLowerCase().startsWith(base));
}

// Deriva um pitch estável (0.8–1.3) a partir de um texto qualquer (ex.: nome do
// personagem), para cada personagem soar um pouco diferente sem precisar de
// vozes extras.
function pitchFromKey(key) {
  if (!key) return 1.0;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return 0.8 + (hash % 50) / 100; // 0.80 .. 1.29
}

// speak: fala um texto e resolve quando terminar.
// opts.rate: velocidade explícita (0.6 = devagar, 1.0 = normal). Se omitido,
// usa um padrão razoável por idioma.
// opts.voiceKey: string (ex. nome do personagem) usada para variar o timbre.
export function speak(text, { lang = "en-US", role = "teacher", rate, voiceKey } = {}) {
  return new Promise((resolve) => {
    if (!synth) { resolve(); return; }
    try {
      synth.cancel(); // evita fila acumulada se ela tocar/pausar rápido
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      try {
        const voice = pickVoice(lang, role !== "colleague");
        if (voice) utter.voice = voice;
      } catch {
        // navegador recusou a voz escolhida (ex.: voz inválida/obsoleta) —
        // segue sem voice explícita, o navegador usa a voz padrão do idioma.
      }
      // Português um pouco mais devagar que o padrão do sistema deixa a
      // pronúncia mais nítida (evita soar "engolido" ou parecido com espanhol
      // quando o aparelho não tem uma voz pt-BR de boa qualidade instalada).
      utter.rate = rate != null ? rate : (lang.startsWith("pt") ? 0.9 : 0.95);
      utter.pitch = voiceKey ? pitchFromKey(voiceKey) : (role === "colleague" ? 0.85 : 1.05);
      utter.onend = resolve;
      utter.onerror = resolve;
      synth.speak(utter);
    } catch {
      // qualquer erro inesperado na síntese de voz nunca pode travar o app
      // (ela está dirigindo — o fluxo tem que sempre seguir em frente).
      resolve();
    }
  });
}

export function stopSpeaking() {
  if (synth) synth.cancel();
}

// listen: tenta reconhecer fala em inglês por até `timeoutMs`.
// Retorna { supported, transcript, matched } — quando não suportado, resolve
// imediatamente com supported:false após o timeout, simulando o tempo de fala
// (modo "shadow practice": ela fala, mas não é avaliada).
export function listen(targetPhrase, { timeoutMs = 6000 } = {}) {
  if (!sttAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ supported: false, transcript: "", matched: null, ratio: 0 }), timeoutMs);
    });
  }
  return new Promise((resolve) => {
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    let done = false;

    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { recognition.stop(); } catch {}
      resolve(result);
    };

    const timer = setTimeout(() => finish({ supported: true, transcript: "", matched: false, ratio: 0 }), timeoutMs);

    recognition.onresult = (event) => {
      const alternatives = Array.from(event.results[0]).map(r => r.transcript);
      const ratio = bestRatio(alternatives, targetPhrase);
      finish({ supported: true, transcript: alternatives[0] || "", matched: ratio >= 0.6, ratio });
    };
    recognition.onerror = () => finish({ supported: true, transcript: "", matched: false, ratio: 0 });
    recognition.onend = () => finish({ supported: true, transcript: "", matched: false, ratio: 0 });

    try {
      recognition.start();
    } catch {
      finish({ supported: true, transcript: "", matched: false, ratio: 0 });
    }
  });
}

// listenForResponse: como listen(), mas detecta se ela DEMOROU pra começar a
// falar (hesitação) — usado no diálogo pra decidir se precisa entrar a "ajuda".
// graceMs: tempo máximo esperando ela começar a falar antes de considerar que
// ela travou. timeoutMs: tempo total máximo pra terminar a frase.
// Retorna { supported, startedSpeaking, transcript, matched }.
export function listenForResponse(targetPhrase, { graceMs = 3000, timeoutMs = 7000 } = {}) {
  if (!sttAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ supported: false, startedSpeaking: false, transcript: "", matched: null, ratio: 0 }), timeoutMs);
    });
  }
  return new Promise((resolve) => {
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    let done = false;
    let startedSpeaking = false;

    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(graceTimer);
      clearTimeout(totalTimer);
      try { recognition.stop(); } catch {}
      resolve(result);
    };

    const graceTimer = setTimeout(() => {
      if (!startedSpeaking) {
        finish({ supported: true, startedSpeaking: false, transcript: "", matched: false, ratio: 0 });
      }
    }, graceMs);

    const totalTimer = setTimeout(() => {
      finish({ supported: true, startedSpeaking, transcript: "", matched: false, ratio: 0 });
    }, timeoutMs);

    recognition.onspeechstart = () => { startedSpeaking = true; };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      startedSpeaking = true;
      if (!result.isFinal) return;
      const alternatives = Array.from(result).map(r => r.transcript);
      const ratio = bestRatio(alternatives, targetPhrase);
      finish({ supported: true, startedSpeaking: true, transcript: alternatives[0] || "", matched: ratio >= 0.6, ratio });
    };
    recognition.onerror = () => finish({ supported: true, startedSpeaking, transcript: "", matched: false, ratio: 0 });
    recognition.onend = () => finish({ supported: true, startedSpeaking, transcript: "", matched: false, ratio: 0 });

    try {
      recognition.start();
    } catch {
      finish({ supported: true, startedSpeaking: false, transcript: "", matched: false, ratio: 0 });
    }
  });
}

// listenRaw: escuta e devolve só o texto transcrito (sem comparar com nada) —
// usado pro menu de navegação por voz (sim/não, escolher número).
export function listenRaw({ lang = "pt-BR", timeoutMs = 6000 } = {}) {
  if (!sttAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ supported: false, transcript: "" }), 300);
    });
  }
  return new Promise((resolve) => {
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let done = false;

    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { recognition.stop(); } catch {}
      resolve(result);
    };

    const timer = setTimeout(() => finish({ supported: true, transcript: "" }), timeoutMs);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0]?.transcript || "";
      finish({ supported: true, transcript });
    };
    recognition.onerror = () => finish({ supported: true, transcript: "" });
    recognition.onend = () => finish({ supported: true, transcript: "" });

    try {
      recognition.start();
    } catch {
      finish({ supported: true, transcript: "" });
    }
  });
}

export function normalizeText(s) {
  return normalize(s);
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

// Retorna de 0 a 1 o quanto "said" bate com "target" — usado tanto pra decidir
// se acertou (matched) quanto pra classificar a qualidade da pronúncia
// (bom/médio/ruim), já que o navegador não tem um avaliador de pronúncia real.
function matchRatio(said, target) {
  const a = normalize(said);
  const b = normalize(target);
  if (!a) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.95;
  const wordsA = new Set(a.split(/\s+/));
  const wordsB = b.split(/\s+/);
  const hits = wordsB.filter(w => wordsA.has(w)).length;
  return hits / wordsB.length;
}

function fuzzyMatch(said, target) {
  return matchRatio(said, target) >= 0.6;
}

function bestRatio(alternatives, target) {
  return Math.max(0, ...alternatives.map(alt => matchRatio(alt, target)));
}
