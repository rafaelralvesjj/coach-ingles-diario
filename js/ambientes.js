// Conteúdo do Coach de Inglês — modelo por AMBIENTE (não mais por "dia").
// Nível: básico (A1-A2), frases curtas, vocabulário do dia a dia.
// Cada ambiente tem "slots" (posições de personagem) fixos ou opcionais.
// Ela pode trocar quem ocupa cada posição (nome + papel), e também pode
// adicionar ou remover personagens extras (slots opcionais) — o conteúdo
// falado em si é sempre o mesmo, isso mantém o app 100% gratuito, sem IA.

export const STUDENT_NAME = "Denize";

export const AMBIENTES = [
  {
    id: "familia",
    icon: "🏠",
    title: "Família",
    subtitle: "Conversas do dia a dia em casa",
    slots: [
      {
        id: "conjuge", label: "Cônjuge", defaultName: "Rafael", optional: true,
        roles: [
          { id: "marido", label: "Marido" },
          { id: "esposa", label: "Esposa" },
          { id: "namorado", label: "Namorado(a)" }
        ]
      },
      {
        id: "filho", label: "Filho/Filha", defaultName: "João", optional: true,
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
      },
      {
        id: "extra2", label: "Mais um parente", defaultName: null, optional: true,
        roles: [
          { id: "cunhado", label: "Cunhado(a)" },
          { id: "sogro", label: "Sogro(a)" },
          { id: "amigo_familia", label: "Amigo(a) da família" },
          { id: "vizinho", label: "Vizinho(a)" }
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
          { slot: "extra", line_en: "How is the family?", line_pt: "Como está a família?", response_en: "Everyone is well, thank you.", response_pt: "Todo mundo bem, obrigada." },
          { slot: "extra2", line_en: "I brought you something.", line_pt: "Eu trouxe uma coisa para você.", response_en: "Oh, thank you so much!", response_pt: "Ah, muito obrigada!" },
          { slot: "extra2", line_en: "Can I stay for dinner?", line_pt: "Posso ficar para o jantar?", response_en: "Of course, you're always welcome.", response_pt: "Claro, você é sempre bem-vindo(a)." }
        ]
      },
      {
        id: "familia-2",
        title: "Café da manhã",
        intro_pt: "Vamos praticar uma conversa de café da manhã em família.",
        recap_pt: "Você já sabe conversar sobre o café da manhã e os planos do dia em inglês.",
        beats: [
          { slot: "conjuge", line_en: "Good morning! Did you sleep well?", line_pt: "Bom dia! Você dormiu bem?", response_en: "Yes, very well, thank you.", response_pt: "Sim, muito bem, obrigada." },
          { slot: "conjuge", line_en: "What do you want for breakfast?", line_pt: "O que você quer no café da manhã?", response_en: "Just coffee and toast, please.", response_pt: "Só café e torrada, por favor." },
          { slot: "filho", line_en: "Mom, where is my backpack?", line_pt: "Mãe, cadê minha mochila?", response_en: "It's next to the door.", response_pt: "Está do lado da porta." },
          { slot: "filho", line_en: "Can I watch TV after breakfast?", line_pt: "Posso ver TV depois do café?", response_en: "Yes, just for a little while.", response_pt: "Sim, só um pouquinho." },
          { slot: "extra", line_en: "Good morning, everyone!", line_pt: "Bom dia, pessoal!", response_en: "Good morning! Come have breakfast with us.", response_pt: "Bom dia! Vem tomar café com a gente." },
          { slot: "extra", line_en: "This coffee smells great.", line_pt: "Esse café está com um cheiro ótimo.", response_en: "Thank you! Help yourself.", response_pt: "Obrigada! Se sirva." },
          { slot: "extra2", line_en: "Do you need a ride today?", line_pt: "Você precisa de uma carona hoje?", response_en: "No, thank you, I have my car.", response_pt: "Não, obrigada, eu tenho meu carro." },
          { slot: "extra2", line_en: "Have a great day at work!", line_pt: "Tenha um ótimo dia de trabalho!", response_en: "Thanks, you too!", response_pt: "Obrigada, você também!" }
        ]
      },
      {
        id: "familia-3",
        title: "Hora de dormir",
        intro_pt: "Agora uma conversa mais carinhosa, na hora de dormir.",
        recap_pt: "Você já sabe conversar com carinho na hora de dormir em inglês.",
        beats: [
          { slot: "filho", line_en: "Mom, can you read me a story?", line_pt: "Mãe, você pode ler uma história para mim?", response_en: "Of course, which one do you want?", response_pt: "Claro, qual você quer?" },
          { slot: "filho", line_en: "Can you turn on the light?", line_pt: "Você pode acender a luz?", response_en: "Sure, just for a minute.", response_pt: "Claro, só por um minuto." },
          { slot: "conjuge", line_en: "Did you have a good day?", line_pt: "Você teve um bom dia?", response_en: "Yes, a little tiring, but good.", response_pt: "Sim, um pouco cansativo, mas bom." },
          { slot: "conjuge", line_en: "Let's go to sleep early tonight.", line_pt: "Vamos dormir cedo hoje.", response_en: "Good idea, I'm tired too.", response_pt: "Boa ideia, também estou cansada." },
          { slot: "extra", line_en: "Goodnight, everyone!", line_pt: "Boa noite, pessoal!", response_en: "Goodnight! Sleep well.", response_pt: "Boa noite! Durma bem." },
          { slot: "extra", line_en: "See you tomorrow.", line_pt: "Até amanhã.", response_en: "See you tomorrow, take care.", response_pt: "Até amanhã, se cuida." },
          { slot: "extra2", line_en: "Thank you for having me today.", line_pt: "Obrigado(a) por me receber hoje.", response_en: "You're always welcome here.", response_pt: "Você é sempre bem-vindo(a) aqui." },
          { slot: "extra2", line_en: "I'll see myself out.", line_pt: "Eu me despeço e vou indo.", response_en: "Okay, drive safe!", response_pt: "Certo, dirija com cuidado!" }
        ]
      },
      {
        id: "familia-4",
        title: "Fim de semana em família",
        intro_pt: "Vamos planejar um fim de semana em família.",
        recap_pt: "Agora você sabe combinar um passeio em família em inglês.",
        beats: [
          { slot: "conjuge", line_en: "What should we do this weekend?", line_pt: "O que a gente faz nesse fim de semana?", response_en: "Let's go to the park.", response_pt: "Vamos ao parque." },
          { slot: "conjuge", line_en: "What time should we leave?", line_pt: "Que horas a gente sai?", response_en: "How about 9am?", response_pt: "Que tal às 9 da manhã?" },
          { slot: "filho", line_en: "Can we bring the dog?", line_pt: "Podemos levar o cachorro?", response_en: "Yes, that's a great idea.", response_pt: "Sim, ótima ideia." },
          { slot: "filho", line_en: "Can we get ice cream too?", line_pt: "Podemos comer sorvete também?", response_en: "Sure, after lunch.", response_pt: "Claro, depois do almoço." },
          { slot: "extra", line_en: "Can I come with you?", line_pt: "Posso ir com vocês?", response_en: "Of course! We'd love that.", response_pt: "Claro! Adoraríamos." },
          { slot: "extra", line_en: "What time should I be ready?", line_pt: "Que horas eu devo estar pronta?", response_en: "Be ready by 9am.", response_pt: "Esteja pronta às 9." },
          { slot: "extra2", line_en: "This park is beautiful!", line_pt: "Esse parque é lindo!", response_en: "Yes, it's one of our favorites.", response_pt: "Sim, é um dos nossos favoritos." },
          { slot: "extra2", line_en: "Let's take some photos.", line_pt: "Vamos tirar umas fotos.", response_en: "Good idea, let's do it!", response_pt: "Boa ideia, vamos!" }
        ]
      },
      {
        id: "familia-5",
        title: "Ajudando com a lição de casa",
        intro_pt: "Uma situação bem comum: ajudar com a lição de casa.",
        recap_pt: "Você já consegue ajudar com a lição de casa em inglês.",
        beats: [
          { slot: "filho", line_en: "Mom, I need help with my homework.", line_pt: "Mãe, eu preciso de ajuda com a lição.", response_en: "Okay, show me the exercise.", response_pt: "Certo, me mostra o exercício." },
          { slot: "filho", line_en: "I don't understand this question.", line_pt: "Eu não entendi essa pergunta.", response_en: "Let's read it together.", response_pt: "Vamos ler junto." },
          { slot: "filho", line_en: "Can you check my answer?", line_pt: "Você pode conferir minha resposta?", response_en: "Sure, let me see.", response_pt: "Claro, deixa eu ver." },
          { slot: "conjuge", line_en: "How is the homework going?", line_pt: "Como está indo a lição de casa?", response_en: "Almost done, just one more question.", response_pt: "Quase pronta, só mais uma pergunta." },
          { slot: "conjuge", line_en: "Do you need any help?", line_pt: "Você precisa de ajuda?", response_en: "No, thanks, we're doing fine.", response_pt: "Não, obrigada, estamos indo bem." },
          { slot: "extra", line_en: "Is everything okay here?", line_pt: "Está tudo bem por aqui?", response_en: "Yes, we're just finishing homework.", response_pt: "Sim, estamos só terminando a lição." },
          { slot: "extra2", line_en: "Let me know if you need anything.", line_pt: "Me avisa se precisar de algo.", response_en: "Thank you, we will.", response_pt: "Obrigada, a gente avisa." }
        ]
      }
    ]
  },

  {
    id: "amigas",
    icon: "💬",
    title: "Amigas",
    subtitle: "Um bate-papo com as amigas",
    slots: [
      {
        id: "amiga", label: "Amiga", defaultName: "Michele", optional: true,
        roles: [
          { id: "amiga", label: "Amiga" },
          { id: "vizinha", label: "Vizinha" },
          { id: "colega_academia", label: "Colega de academia" }
        ]
      },
      {
        id: "extra", label: "Outra amiga", defaultName: null, optional: true,
        roles: [
          { id: "amiga", label: "Amiga" },
          { id: "prima", label: "Prima" },
          { id: "colega_trabalho", label: "Colega de trabalho" }
        ]
      },
      {
        id: "extra2", label: "Mais uma amiga", defaultName: null, optional: true,
        roles: [
          { id: "amiga", label: "Amiga" },
          { id: "vizinha", label: "Vizinha" },
          { id: "colega_corrida", label: "Colega de corrida" }
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
          { slot: "amiga", line_en: "Perfect, see you then!", line_pt: "Perfeito, te vejo lá!", response_en: "See you soon!", response_pt: "Até logo!" },
          { slot: "extra", line_en: "It's so good to talk to you too!", line_pt: "Que bom falar com você também!", response_en: "It's great to hear from you!", response_pt: "É ótimo ter notícias suas!" },
          { slot: "extra", line_en: "We should all meet up soon.", line_pt: "A gente devia se encontrar todo mundo em breve.", response_en: "Yes, let's plan something!", response_pt: "Sim, vamos planejar algo!" },
          { slot: "extra2", line_en: "Count me in too!", line_pt: "Pode contar comigo também!", response_en: "Great, the more the better!", response_pt: "Ótimo, quanto mais gente, melhor!" }
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
          { slot: "amiga", line_en: "Let's sign up for the race!", line_pt: "Vamos nos inscrever na prova!", response_en: "Yes, let's do it! I'm so excited.", response_pt: "Sim, vamos fazer isso! Estou tão animada." },
          { slot: "extra", line_en: "Can I join your running group?", line_pt: "Posso entrar no grupo de corrida de vocês?", response_en: "Of course! We'd love to have you.", response_pt: "Claro! Adoraríamos ter você." },
          { slot: "extra", line_en: "What day do you usually run?", line_pt: "Que dia vocês costumam correr?", response_en: "We usually run on Saturdays.", response_pt: "A gente geralmente corre aos sábados." },
          { slot: "extra2", line_en: "I want to start running too!", line_pt: "Eu também quero começar a correr!", response_en: "That's great, we can help you start.", response_pt: "Que ótimo, a gente pode te ajudar a começar." }
        ]
      },
      {
        id: "amigas-3",
        title: "Marcando um jantar",
        intro_pt: "Vamos praticar como combinar um jantar com a amiga.",
        recap_pt: "Agora você sabe combinar um jantar com uma amiga em inglês.",
        beats: [
          { slot: "amiga", line_en: "Do you want to have dinner this week?", line_pt: "Você quer jantar essa semana?", response_en: "Yes, I'd love to!", response_pt: "Sim, eu adoraria!" },
          { slot: "amiga", line_en: "What kind of food do you like?", line_pt: "Que tipo de comida você gosta?", response_en: "I love Italian food.", response_pt: "Eu adoro comida italiana." },
          { slot: "amiga", line_en: "There's a new restaurant downtown.", line_pt: "Tem um restaurante novo no centro.", response_en: "Let's try it!", response_pt: "Vamos experimentar!" },
          { slot: "amiga", line_en: "What time works for you?", line_pt: "Que horário funciona pra você?", response_en: "How about 7pm?", response_pt: "Que tal às 19h?" },
          { slot: "amiga", line_en: "Great, I'll make a reservation.", line_pt: "Ótimo, vou fazer a reserva.", response_en: "Perfect, see you there!", response_pt: "Perfeito, te vejo lá!" },
          { slot: "extra", line_en: "Can I join you two?", line_pt: "Posso ir com vocês duas?", response_en: "Of course, the more the merrier!", response_pt: "Claro, quanto mais gente, melhor!" },
          { slot: "extra", line_en: "I know a great dessert place too.", line_pt: "Eu conheço um lugar ótimo de sobremesa também.", response_en: "Let's go there after dinner.", response_pt: "Vamos lá depois do jantar." },
          { slot: "extra2", line_en: "I can't wait for tonight!", line_pt: "Mal posso esperar por hoje à noite!", response_en: "Me too, it's going to be fun!", response_pt: "Eu também, vai ser divertido!" }
        ]
      },
      {
        id: "amigas-4",
        title: "Falando sobre uma série",
        intro_pt: "Assunto favorito entre amigas: falar sobre séries e filmes.",
        recap_pt: "Você já sabe falar sobre séries e filmes favoritos em inglês.",
        beats: [
          { slot: "amiga", line_en: "Have you watched the new series?", line_pt: "Você já assistiu a série nova?", response_en: "Not yet, is it good?", response_pt: "Ainda não, é boa?" },
          { slot: "amiga", line_en: "It's amazing! You have to watch it.", line_pt: "É incrível! Você precisa assistir.", response_en: "Okay, I'll start tonight.", response_pt: "Certo, vou começar hoje à noite." },
          { slot: "amiga", line_en: "Who's your favorite character?", line_pt: "Qual é seu personagem favorito?", response_en: "I don't know yet, I just started.", response_pt: "Ainda não sei, acabei de começar." },
          { slot: "amiga", line_en: "Do you want to watch the next episode together?", line_pt: "Você quer assistir o próximo episódio junto?", response_en: "Yes, let's do it this weekend.", response_pt: "Sim, vamos fazer isso esse fim de semana." },
          { slot: "amiga", line_en: "No spoilers, okay?", line_pt: "Sem spoilers, tá?", response_en: "I promise, no spoilers!", response_pt: "Eu prometo, sem spoilers!" },
          { slot: "extra", line_en: "What show are you talking about?", line_pt: "Que programa vocês estão falando?", response_en: "A new series, it's really good.", response_pt: "Uma série nova, é muito boa." },
          { slot: "extra2", line_en: "Can I watch it with you two?", line_pt: "Posso assistir com vocês duas?", response_en: "Of course, come over!", response_pt: "Claro, vem pra cá!" }
        ]
      },
      {
        id: "amigas-5",
        title: "Compartilhando novidades",
        intro_pt: "Um bate-papo pra colocar as novidades em dia.",
        recap_pt: "Agora você já sabe compartilhar novidades com uma amiga em inglês.",
        beats: [
          { slot: "amiga", line_en: "I have some big news!", line_pt: "Eu tenho uma novidade grande!", response_en: "Really? Tell me everything!", response_pt: "Sério? Me conta tudo!" },
          { slot: "amiga", line_en: "I got a new job!", line_pt: "Eu consegui um emprego novo!", response_en: "Congratulations! That's wonderful!", response_pt: "Parabéns! Que maravilha!" },
          { slot: "amiga", line_en: "How is everything with you?", line_pt: "Como estão as coisas com você?", response_en: "Everything is good, thank you.", response_pt: "Está tudo bem, obrigada." },
          { slot: "amiga", line_en: "We should celebrate soon.", line_pt: "A gente devia comemorar em breve.", response_en: "Yes, let's plan something fun.", response_pt: "Sim, vamos planejar algo divertido." },
          { slot: "amiga", line_en: "Thank you for always supporting me.", line_pt: "Obrigada por sempre me apoiar.", response_en: "Of course, that's what friends are for.", response_pt: "Claro, é pra isso que servem as amigas." },
          { slot: "extra2", line_en: "I heard the good news!", line_pt: "Eu soube da boa notícia!", response_en: "Isn't it great?", response_pt: "Não é ótimo?" },
          { slot: "extra2", line_en: "We really need to celebrate together.", line_pt: "A gente realmente precisa comemorar juntas.", response_en: "Yes, let's set a date.", response_pt: "Sim, vamos marcar uma data." }
        ]
      }
    ]
  },

  {
    id: "trabalho",
    icon: "💼",
    title: "Trabalho",
    subtitle: "No escritório da seguradora, com todo o time",
    slots: [
      {
        id: "colega", label: "Parceira de trabalho", defaultName: "Luciana", optional: true,
        roles: [
          { id: "colega", label: "Colega" },
          { id: "parceira", label: "Parceira de projeto" }
        ]
      },
      {
        id: "chefe", label: "Chefe", defaultName: "Renata", optional: true,
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
          { id: "novo_colega", label: "Novo(a) colega" },
          { id: "candidato", label: "Candidato(a) a uma vaga" }
        ]
      },
      {
        id: "extra2", label: "Outra pessoa da empresa", defaultName: null, optional: true,
        roles: [
          { id: "analista", label: "Analista" },
          { id: "gerente", label: "Gerente" },
          { id: "diretor", label: "Diretor(a)" },
          { id: "ceo", label: "CEO" },
          { id: "corretor", label: "Corretor(a) de seguros" }
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
          { slot: "extra", line_en: "Thank you for your time.", line_pt: "Obrigado(a) pelo seu tempo.", response_en: "You're welcome!", response_pt: "De nada!" },
          { slot: "extra2", line_en: "Do you have a moment to chat?", line_pt: "Você tem um momento para conversar?", response_en: "Sure, what's up?", response_pt: "Claro, o que foi?" }
        ]
      },
      {
        id: "trabalho-2",
        title: "Entrevista com candidato",
        intro_pt: "Hoje você vai treinar uma entrevista simples com um candidato à vaga.",
        recap_pt: "Agora você já sabe conduzir uma entrevista básica em inglês.",
        beats: [
          { slot: "extra", line_en: "Good morning, thank you for having me.", line_pt: "Bom dia, obrigado por me receber.", response_en: "Good morning! Thanks for coming.", response_pt: "Bom dia! Obrigada por vir." },
          { slot: "extra", line_en: "Can you tell me about the position?", line_pt: "Você pode me contar sobre a vaga?", response_en: "Sure, it's a position in our claims team.", response_pt: "Claro, é uma vaga no nosso time de sinistros." },
          { slot: "extra", line_en: "What skills are you looking for?", line_pt: "Que habilidades vocês procuram?", response_en: "Good communication and teamwork.", response_pt: "Boa comunicação e trabalho em equipe." },
          { slot: "extra", line_en: "When can I expect an answer?", line_pt: "Quando posso esperar uma resposta?", response_en: "We'll contact you next week.", response_pt: "A gente entra em contato semana que vem." },
          { slot: "colega", line_en: "How was the interview?", line_pt: "Como foi a entrevista?", response_en: "It went really well.", response_pt: "Foi muito bem." },
          { slot: "extra2", line_en: "Did you find a good candidate?", line_pt: "Você encontrou um bom candidato?", response_en: "Yes, I think we found the right person.", response_pt: "Sim, acho que encontramos a pessoa certa." }
        ]
      },
      {
        id: "trabalho-3",
        title: "Reunião com a diretoria",
        intro_pt: "Agora uma reunião mais formal com a diretoria da empresa.",
        recap_pt: "Você já sabe participar de uma reunião com a diretoria em inglês.",
        beats: [
          { slot: "chefe", line_en: "Let's talk about the new HR budget.", line_pt: "Vamos falar sobre o novo orçamento de RH.", response_en: "Sure, I have the numbers ready.", response_pt: "Claro, tenho os números prontos." },
          { slot: "chefe", line_en: "How many people do we need to hire?", line_pt: "Quantas pessoas precisamos contratar?", response_en: "We need three new people this quarter.", response_pt: "Precisamos de três pessoas novas nesse trimestre." },
          { slot: "extra2", line_en: "What about the training program?", line_pt: "E o programa de treinamento?", response_en: "It starts next month.", response_pt: "Ele começa mês que vem." },
          { slot: "extra2", line_en: "That sounds great.", line_pt: "Isso parece ótimo.", response_en: "Thank you, I worked hard on it.", response_pt: "Obrigada, eu trabalhei bastante nisso." },
          { slot: "chefe", line_en: "Great job on this presentation.", line_pt: "Ótimo trabalho nessa apresentação.", response_en: "Thank you, I appreciate it.", response_pt: "Obrigada, eu agradeço." },
          { slot: "extra", line_en: "Can I ask a question about the budget?", line_pt: "Posso fazer uma pergunta sobre o orçamento?", response_en: "Of course, go ahead.", response_pt: "Claro, pode perguntar." }
        ]
      },
      {
        id: "trabalho-4",
        title: "Treinamento com estagiário",
        intro_pt: "Vamos praticar como treinar um novo estagiário no time.",
        recap_pt: "Agora você sabe treinar um novo estagiário em inglês.",
        beats: [
          { slot: "extra", line_en: "Hi, I'm the new intern.", line_pt: "Oi, eu sou o novo estagiário.", response_en: "Welcome! Nice to meet you.", response_pt: "Bem-vindo! Prazer em te conhecer." },
          { slot: "extra", line_en: "What will I be doing here?", line_pt: "O que eu vou fazer aqui?", response_en: "You'll help with recruitment and interviews.", response_pt: "Você vai ajudar com recrutamento e entrevistas." },
          { slot: "extra", line_en: "Who can I ask if I have questions?", line_pt: "Com quem eu posso perguntar se tiver dúvidas?", response_en: "You can always ask me.", response_pt: "Você sempre pode me perguntar." },
          { slot: "colega", line_en: "How is the new intern doing?", line_pt: "Como o novo estagiário está indo?", response_en: "Very well, he's learning fast.", response_pt: "Muito bem, ele está aprendendo rápido." },
          { slot: "colega", line_en: "That's great to hear.", line_pt: "Que bom ouvir isso.", response_en: "Yes, I'm happy with the team.", response_pt: "Sim, estou feliz com o time." },
          { slot: "extra2", line_en: "Let me know if the intern needs anything.", line_pt: "Me avisa se o estagiário precisar de algo.", response_en: "I will, thank you.", response_pt: "Eu aviso, obrigada." }
        ]
      },
      {
        id: "trabalho-5",
        title: "Conversa de feedback",
        intro_pt: "Uma conversa de feedback, bem comum no dia a dia do RH.",
        recap_pt: "Você já sabe dar e receber feedback em inglês.",
        beats: [
          { slot: "chefe", line_en: "Can we talk about your performance?", line_pt: "Podemos falar sobre seu desempenho?", response_en: "Yes, of course.", response_pt: "Sim, claro." },
          { slot: "chefe", line_en: "You are doing an excellent job.", line_pt: "Você está fazendo um trabalho excelente.", response_en: "Thank you, that means a lot.", response_pt: "Obrigada, isso significa muito." },
          { slot: "chefe", line_en: "Is there anything you need from me?", line_pt: "Tem alguma coisa que você precisa de mim?", response_en: "Just more time for training.", response_pt: "Só mais tempo para treinamento." },
          { slot: "colega", line_en: "How did your feedback meeting go?", line_pt: "Como foi sua reunião de feedback?", response_en: "It went really well, thank you for asking.", response_pt: "Foi muito bem, obrigada por perguntar." },
          { slot: "colega", line_en: "I'm happy for you.", line_pt: "Fico feliz por você.", response_en: "Thank you so much!", response_pt: "Muito obrigada!" },
          { slot: "extra2", line_en: "Congratulations on the great feedback.", line_pt: "Parabéns pelo ótimo feedback.", response_en: "Thank you, I worked hard this year.", response_pt: "Obrigada, eu trabalhei bastante esse ano." }
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
        id: "atendente", label: "Atendente", defaultName: "Sarah", optional: true,
        roles: [
          { id: "vendedora", label: "Vendedora" },
          { id: "caixa", label: "Caixa" }
        ]
      },
      {
        id: "extra", label: "Outra pessoa", defaultName: null, optional: true,
        roles: [
          { id: "gerente", label: "Gerente da loja" },
          { id: "cliente", label: "Outro(a) cliente" }
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
          { slot: "atendente", line_en: "Anything else?", line_pt: "Mais alguma coisa?", response_en: "No, that's all, thank you.", response_pt: "Não, é só isso, obrigada." },
          { slot: "extra", line_en: "Excuse me, is this the checkout line?", line_pt: "Com licença, essa é a fila do caixa?", response_en: "Yes, it is.", response_pt: "Sim, é." },
          { slot: "extra", line_en: "Thank you for waiting.", line_pt: "Obrigado por esperar.", response_en: "No problem, take your time.", response_pt: "Sem problema, sem pressa." }
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
        id: "farmaceutico", label: "Farmacêutico(a)", defaultName: "Mark", optional: true,
        roles: [
          { id: "farmaceutico", label: "Farmacêutico(a)" }
        ]
      },
      {
        id: "extra", label: "Outra pessoa", defaultName: null, optional: true,
        roles: [
          { id: "atendente_auxiliar", label: "Atendente auxiliar" },
          { id: "cliente", label: "Outro(a) cliente" }
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
          { slot: "farmaceutico", line_en: "Here you are. Anything else?", line_pt: "Aqui está. Mais alguma coisa?", response_en: "No, that's everything. Thank you!", response_pt: "Não, é só isso. Obrigada!" },
          { slot: "extra", line_en: "Excuse me, do you sell vitamins here?", line_pt: "Com licença, vocês vendem vitaminas aqui?", response_en: "Yes, they are in aisle two.", response_pt: "Sim, estão no corredor dois." },
          { slot: "extra", line_en: "Thanks for your help today.", line_pt: "Obrigado pela sua ajuda hoje.", response_en: "You're welcome, have a good day.", response_pt: "De nada, tenha um bom dia." }
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
        id: "atendente", label: "Atendente", defaultName: "Emma", optional: true,
        roles: [
          { id: "atendente", label: "Atendente" },
          { id: "padeiro", label: "Padeiro(a)" }
        ]
      },
      {
        id: "extra", label: "Outra pessoa", defaultName: null, optional: true,
        roles: [
          { id: "cliente", label: "Outro(a) cliente" },
          { id: "padeiro_auxiliar", label: "Padeiro(a) auxiliar" }
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
          { slot: "atendente", line_en: "Have a great day!", line_pt: "Tenha um ótimo dia!", response_en: "Thank you, you too!", response_pt: "Obrigada, você também!" },
          { slot: "extra", line_en: "This bread smells amazing.", line_pt: "Esse pão tem um cheiro incrível.", response_en: "It's fresh from the oven.", response_pt: "Está fresquinho do forno." },
          { slot: "extra", line_en: "Can I get one too?", line_pt: "Posso pegar um também?", response_en: "Sure, here you go.", response_pt: "Claro, aqui está." }
        ]
      }
    ]
  }
];
