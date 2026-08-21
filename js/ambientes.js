// Conteúdo do Coach de Inglês — modelo por AMBIENTE (não mais por "dia").
// Nível: básico (A1-A2), frases curtas, vocabulário do dia a dia.
// Cada ambiente tem "slots" (posições de personagem) fixos ou opcionais.
// Ela pode trocar quem ocupa cada posição (nome + papel), mas o conteúdo
// falado em si é sempre o mesmo — isso mantém o app 100% gratuito, sem IA.

export const STUDENT_NAME = "Denize";

export const AMBIENTES = [
  {
    id: "familia",
    icon: "🏠",
    title: "Família",
    subtitle: "Uma conversa em casa",
    slots: [
      {
        id: "conjuge", label: "Cônjuge", defaultName: "Rafael", optional: false,
        roles: [
          { id: "marido", label: "Marido" },
          { id: "esposa", label: "Esposa" },
          { id: "namorado", label: "Namorado(a)" }
        ]
      },
      {
        id: "filho", label: "Filho/Filha", defaultName: "João", optional: false,
        roles: [
          { id: "filho", label: "Filho" },
          { id: "filha", label: "Filha" },
          { id: "neto", label: "Neto(a)" }
        ]
      },
      {
        id: "extra", label: "Outro parente", defaultName: null, optional: true,
        roles: [
          { id: "prima", label: "Prima" },
          { id: "tio", label: "Tio/Tia" },
          { id: "avo", label: "Avô/Avó" },
          { id: "sobrinho", label: "Sobrinho(a)" }
        ]
      }
    ],
    scenes: [
      {
        id: "familia-1",
        title: "Chegando em casa",
        intro_pt: "Vamos praticar uma conversa bem simples de quando você chega em casa.",
        recap_pt: "Você já consegue conversar em casa em inglês, do jeitinho mais simples.",
        beats: [
          { slot: "conjuge", line_en: "Hi! How was your day?", line_pt: "Oi! Como foi seu dia?", response_en: "It was good, thanks!", response_pt: "Foi bom, obrigada!" },
          { slot: "conjuge", line_en: "Are you hungry?", line_pt: "Você está com fome?", response_en: "Yes, a little.", response_pt: "Sim, um pouco." },
          { slot: "filho", line_en: "Mom, can you help me?", line_pt: "Mãe, você pode me ajudar?", response_en: "Sure, one minute.", response_pt: "Claro, um minuto." },
          { slot: "filho", line_en: "I love you!", line_pt: "Eu te amo!", response_en: "I love you too!", response_pt: "Eu também te amo!" },
          { slot: "extra", line_en: "It's so good to see you!", line_pt: "Que bom te ver!", response_en: "It's good to see you too!", response_pt: "Bom te ver também!" },
          { slot: "extra", line_en: "How is the family?", line_pt: "Como está a família?", response_en: "Everyone is well, thank you.", response_pt: "Todo mundo bem, obrigada." }
        ]
      }
    ]
  },

  {
    id: "amigas",
    icon: "💬",
    title: "Amigas",
    subtitle: "Um bate-papo com a amiga",
    slots: [
      {
        id: "amiga", label: "Amiga", defaultName: "Michele", optional: false,
        roles: [
          { id: "amiga", label: "Amiga" },
          { id: "vizinha", label: "Vizinha" },
          { id: "colega_academia", label: "Colega de academia" }
        ]
      }
    ],
    scenes: [
      {
        id: "amigas-1",
        title: "Colocando o papo em dia",
        intro_pt: "Aqui é um bate-papo bem tranquilo, tipo uma ligação rápida com uma amiga.",
        recap_pt: "Pequenas conversas assim são ótimas para perder o medo de falar.",
        beats: [
          { slot: "amiga", line_en: "Hey! How are you?", line_pt: "Oi! Como você está?", response_en: "I'm good! And you?", response_pt: "Estou bem! E você?" },
          { slot: "amiga", line_en: "What are you doing this weekend?", line_pt: "O que você vai fazer nesse fim de semana?", response_en: "Nothing special, just resting.", response_pt: "Nada especial, só descansando." },
          { slot: "amiga", line_en: "Do you want to have coffee together?", line_pt: "Você quer tomar um café junto?", response_en: "Yes, I'd love that!", response_pt: "Sim, eu adoraria!" },
          { slot: "amiga", line_en: "What time is good for you?", line_pt: "Que horário fica bom para você?", response_en: "How about 10am?", response_pt: "Que tal às 10 da manhã?" },
          { slot: "amiga", line_en: "Perfect, see you then!", line_pt: "Perfeito, te vejo lá!", response_en: "See you soon!", response_pt: "Até logo!" }
        ]
      },
      {
        id: "amigas-2",
        title: "Falando sobre corrida",
        intro_pt: "Agora um assunto que vocês duas adoram: corrida! Vamos treinar frases pra falar sobre treinos e provas.",
        recap_pt: "Agora você já sabe falar sobre corrida em inglês — treino, provas, e até planejar correr fora do país.",
        beats: [
          { slot: "amiga", line_en: "Do you want to run with me this weekend?", line_pt: "Você quer correr comigo nesse fim de semana?", response_en: "Yes! What time?", response_pt: "Sim! Que horas?" },
          { slot: "amiga", line_en: "How many kilometers do you run?", line_pt: "Quantos quilômetros você corre?", response_en: "I usually run five kilometers.", response_pt: "Eu geralmente corro cinco quilômetros." },
          { slot: "amiga", line_en: "I want to run a 10k race next month.", line_pt: "Eu quero correr uma prova de 10 km mês que vem.", response_en: "That sounds great! I want to join too.", response_pt: "Que ótimo! Eu quero participar também." },
          { slot: "amiga", line_en: "We can train together every week.", line_pt: "A gente pode treinar junto toda semana.", response_en: "Good idea, let's do it.", response_pt: "Boa ideia, vamos fazer isso." },
          { slot: "amiga", line_en: "Do you want to run a race in another country?", line_pt: "Você quer correr uma prova em outro país?", response_en: "Yes, I would love that!", response_pt: "Sim, eu adoraria isso!" },
          { slot: "amiga", line_en: "Let's sign up for the race!", line_pt: "Vamos nos inscrever na prova!", response_en: "Yes, let's do it! I'm so excited.", response_pt: "Sim, vamos fazer isso! Estou tão animada." }
        ]
      }
    ]
  },

  {
    id: "trabalho",
    icon: "💼",
    title: "Trabalho",
    subtitle: "No escritório, do jeito simples",
    slots: [
      {
        id: "colega", label: "Parceira de trabalho", defaultName: "Luciana", optional: false,
        roles: [
          { id: "colega", label: "Colega" },
          { id: "parceira", label: "Parceira de projeto" }
        ]
      },
      {
        id: "chefe", label: "Chefe", defaultName: "Renata", optional: false,
        roles: [
          { id: "chefe", label: "Chefe" },
          { id: "diretora", label: "Diretora" },
          { id: "ceo", label: "CEO" }
        ]
      },
      {
        id: "extra", label: "Outra pessoa", defaultName: null, optional: true,
        roles: [
          { id: "estagiario", label: "Estagiário(a)" },
          { id: "cliente", label: "Cliente" },
          { id: "novo_colega", label: "Novo(a) colega" }
        ]
      }
    ],
    scenes: [
      {
        id: "trabalho-1",
        title: "Um dia comum no escritório",
        intro_pt: "Hoje é inglês bem básico de escritório — frases curtas do dia a dia.",
        recap_pt: "Essas são frases que você pode usar em qualquer dia comum de trabalho.",
        beats: [
          { slot: "colega", line_en: "Good morning! How are you?", line_pt: "Bom dia! Como você está?", response_en: "Good morning! I'm fine, thanks.", response_pt: "Bom dia! Estou bem, obrigada." },
          { slot: "colega", line_en: "Can we talk later?", line_pt: "Podemos conversar mais tarde?", response_en: "Sure, no problem.", response_pt: "Claro, sem problema." },
          { slot: "chefe", line_en: "Do you have a minute?", line_pt: "Você tem um minuto?", response_en: "Yes, of course.", response_pt: "Sim, claro." },
          { slot: "chefe", line_en: "Great job today.", line_pt: "Ótimo trabalho hoje.", response_en: "Thank you so much!", response_pt: "Muito obrigada!" },
          { slot: "extra", line_en: "Can you help me, please?", line_pt: "Você pode me ajudar, por favor?", response_en: "Of course, let me see.", response_pt: "Claro, deixa eu ver." },
          { slot: "extra", line_en: "Thank you for your time.", line_pt: "Obrigado(a) pelo seu tempo.", response_en: "You're welcome!", response_pt: "De nada!" }
        ]
      }
    ]
  },

  {
    id: "mercado",
    icon: "🛒",
    title: "Mercado",
    subtitle: "Fazendo compras no exterior",
    slots: [
      {
        id: "atendente", label: "Atendente", defaultName: "Sarah", optional: false,
        roles: [
          { id: "vendedora", label: "Vendedora" },
          { id: "caixa", label: "Caixa" }
        ]
      }
    ],
    scenes: [
      {
        id: "mercado-1",
        title: "Comprando no mercado",
        intro_pt: "Agora imagina que você está num mercado lá fora. Vamos praticar frases básicas de compra.",
        recap_pt: "Com essas frases você já consegue fazer compras básicas em qualquer mercado no exterior.",
        beats: [
          { slot: "atendente", line_en: "Hi, can I help you?", line_pt: "Oi, posso te ajudar?", response_en: "Yes, please. I'm looking for milk.", response_pt: "Sim, por favor. Estou procurando leite." },
          { slot: "atendente", line_en: "It's over there, next to the bread.", line_pt: "Está ali, perto do pão.", response_en: "Thank you very much.", response_pt: "Muito obrigada." },
          { slot: "atendente", line_en: "How much is this?", line_pt: "(Pergunta que VOCÊ pode fazer) Quanto custa isso?", response_en: "It's five dollars.", response_pt: "São cinco dólares." },
          { slot: "atendente", line_en: "Do you have a bag?", line_pt: "Você tem uma sacola?", response_en: "Yes, here you go.", response_pt: "Sim, aqui está." },
          { slot: "atendente", line_en: "Anything else?", line_pt: "Mais alguma coisa?", response_en: "No, that's all, thank you.", response_pt: "Não, é só isso, obrigada." }
        ]
      }
    ]
  },

  {
    id: "farmacia",
    icon: "💊",
    title: "Farmácia",
    subtitle: "Comprando remédio no exterior",
    slots: [
      {
        id: "farmaceutico", label: "Farmacêutico(a)", defaultName: "Mark", optional: false,
        roles: [
          { id: "farmaceutico", label: "Farmacêutico(a)" }
        ]
      }
    ],
    scenes: [
      {
        id: "farmacia-1",
        title: "Na farmácia",
        intro_pt: "Situação comum em viagem: precisar de algo na farmácia. Vamos treinar isso.",
        recap_pt: "Agora você sabe pedir ajuda numa farmácia no exterior.",
        beats: [
          { slot: "farmaceutico", line_en: "Hello, how can I help you?", line_pt: "Olá, como posso te ajudar?", response_en: "I need something for a headache.", response_pt: "Eu preciso de algo para dor de cabeça." },
          { slot: "farmaceutico", line_en: "Do you have any allergies?", line_pt: "Você tem alguma alergia?", response_en: "No, I don't.", response_pt: "Não, não tenho." },
          { slot: "farmaceutico", line_en: "Take one pill every eight hours.", line_pt: "Tome um comprimido a cada oito horas.", response_en: "Okay, thank you.", response_pt: "Certo, obrigada." },
          { slot: "farmaceutico", line_en: "Anything else you need?", line_pt: "Mais alguma coisa que você precisa?", response_en: "Yes, some sunscreen too.", response_pt: "Sim, um protetor solar também." },
          { slot: "farmaceutico", line_en: "Here you are. Anything else?", line_pt: "Aqui está. Mais alguma coisa?", response_en: "No, that's everything. Thank you!", response_pt: "Não, é só isso. Obrigada!" }
        ]
      }
    ]
  },

  {
    id: "padaria",
    icon: "🥐",
    title: "Padaria",
    subtitle: "Pedindo um lanche no exterior",
    slots: [
      {
        id: "atendente", label: "Atendente", defaultName: "Emma", optional: false,
        roles: [
          { id: "atendente", label: "Atendente" },
          { id: "padeiro", label: "Padeiro(a)" }
        ]
      }
    ],
    scenes: [
      {
        id: "padaria-1",
        title: "Pedindo café e pão",
        intro_pt: "Uma das situações mais comuns em viagem: pedir um café e um pãozinho.",
        recap_pt: "Pedido de café e pão em inglês já não é mais um problema!",
        beats: [
          { slot: "atendente", line_en: "Good morning! What would you like?", line_pt: "Bom dia! O que você gostaria?", response_en: "I'd like a coffee, please.", response_pt: "Eu gostaria de um café, por favor." },
          { slot: "atendente", line_en: "Anything to eat?", line_pt: "Algo para comer?", response_en: "Yes, a croissant too.", response_pt: "Sim, um croissant também." },
          { slot: "atendente", line_en: "For here or to go?", line_pt: "Para comer aqui ou para levar?", response_en: "To go, please.", response_pt: "Para levar, por favor." },
          { slot: "atendente", line_en: "That's six dollars.", line_pt: "São seis dólares.", response_en: "Here you go.", response_pt: "Aqui está." },
          { slot: "atendente", line_en: "Have a great day!", line_pt: "Tenha um ótimo dia!", response_en: "Thank you, you too!", response_pt: "Obrigada, você também!" }
        ]
      }
    ]
  }
];
