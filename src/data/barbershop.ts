export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  duration: string;
  description: string;
  highlight?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  alt: string;
  caption: string;
  aspectClass?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  service: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const BUSINESS_INFO = {
  name: 'Barbearia Alcateia',
  slogan: 'Onde o homem se sente bem',
  niche: 'Barbearia',
  address: 'Av. Hermógenes Coelho - Jardim vila boa, Goiás - GO, 76600-000',
  shortAddress: 'Av. Hermógenes Coelho, Jardim Vila Boa · Goiás - GO',
  cep: '76600-000',
  phoneDisplay: '(62) 99657-3854',
  phoneRaw: '5562996573854',
  email: 'contato@barbeariaalcateia.com.br',
  coordinates: {
    lat: -15.9339,
    lng: -50.1404,
  },
  hours: [
    { days: 'Terça a Sexta', time: '09:00 às 19:30' },
    { days: 'Sábado', time: '08:30 às 18:00' },
    { days: 'Domingo e Segunda', time: 'Fechado' },
  ],
} as const;

export const ESTABLISHMENT_PHOTOS: GalleryPhoto[] = [
  {
    id: 'foto-1',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLeIRx0WyoFzRt1Btt99bqeHcPWJbqrp465Mlcoji6YwEfHwbFkIUopeoUjqpg_O5a3IhJhxdxzbQxc_OQRu6x-fDR96mfYl5QKrqxzlr0TLrT_HdfDmhiZq-zykeXGbFLk0tLWi=s4800-w581',
    alt: 'Bancada principal e espelho iluminado da Barbearia Alcateia em Goiás - GO',
    caption: 'Bancada e espelho — Barbearia Alcateia',
  },
  {
    id: 'foto-2',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLd54jeS9ozO74fNWmblHfDWW2ffWi2dyOOxbYCpenluKBTj_3ZPDMNw9uSCZaVr7OEckrmBrizQUy5qPifjYqlYtPzzCkEQ7VEbGIpWORj9ra9VeDNKlral1u8McsTGt1BTMXX-=s4800-w1024',
    alt: 'Ambiente interno e decoração da Barbearia Alcateia no Jardim Vila Boa',
    caption: 'Ambiente interno no Jardim Vila Boa',
  },
  {
    id: 'foto-3',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLdqjXZcYYgSTUTy7N0FvzQVL6gwTYHnuSxrf22VMNAYzPudr4TY6__un-vPZ52kcWfU6_kpqyXaJcmpMQbRe2MTjqdjH845wTabS2vMmHqa569Dvo8ywf5-YTsNArneYHhCWOKgRRgaRsAR=s4800-w1024',
    alt: 'Corte degradê e alinhamento completo de barba feito na Barbearia Alcateia',
    caption: 'Degradê e barba alinhada na navalha',
  },
  {
    id: 'foto-4',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLcWEiYxATW-E72Oc_qtteGRebGtxrEL2l2Yg8XaL71HLtMlJzs3GzyJmO70uPEB8gTtlK7pH47Hu3t05KxnudwsnlWEghESOkJuo4XdbetusvP09RNN8pmRLnScEGLEFm-KQtiqHQ=s4800-w1024',
    alt: 'Acabamento lateral preciso em corte masculino realizado na Barbearia Alcateia',
    caption: 'Corte masculino com acabamento preciso',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'corte-classico',
    code: '01',
    name: 'Corte Clássico',
    duration: '45 min',
    description:
      'Execução na tesoura e máquina respeitando o caimento natural dos fios, com finalização e acabamento na navalha.',
  },
  {
    id: 'barba-completa',
    code: '02',
    name: 'Barba Completa',
    duration: '35 min',
    description:
      'Alinhamento simétrico dos contornos, ritual com toalha quente, espuma cremosa e óleo hidratante pós-barba.',
  },
  {
    id: 'hidratacao-facial',
    code: '03',
    name: 'Hidratação Facial',
    duration: '30 min',
    description:
      'Limpeza profunda, esfoliação suave e máscara calmante para renovar a pele e evitar irritações no barbear.',
  },
  {
    id: 'combo-alcateia',
    code: '04',
    name: 'Combo Corte & Barba',
    duration: '75 min',
    description:
      'Atendimento completo reunindo corte personalizado e barba com toalha quente em uma única sessão.',
  },
  {
    id: 'acabamento-pezinho',
    code: '05',
    name: 'Acabamento & Pezinho',
    duration: '20 min',
    description:
      'Manutenção rápida de nuca, costeletas e contornos para manter o visual alinhado entre os cortes principais.',
  },
  {
    id: 'sobrancelha-navalha',
    code: '06',
    name: 'Sobrancelha na Navalha',
    duration: '15 min',
    description:
      'Limpeza discreta dos excessos mantendo o desenho natural e masculino sem artificialidade.',
  },
];

export const TIME_SLOTS: string[] = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'dep-1',
    name: 'Rafael Mendonça',
    service: 'Combo Corte & Barba',
    rating: 5,
    text: 'Ambiente muito bem cuidado, pontualidade no horário marcado e um acabamento na barba que dura a semana inteira sem irritar a pele.',
  },
  {
    id: 'dep-2',
    name: 'Thiago Vasconcelos',
    service: 'Corte Clássico',
    rating: 5,
    text: 'Já passei por várias barbearias aqui em Goiás e a Alcateia se destaca pela atenção aos detalhes. Você sai realmente satisfeito com o corte.',
  },
  {
    id: 'dep-3',
    name: 'Eduardo Guimarães',
    service: 'Barba Completa e Hidratação',
    rating: 5,
    text: 'A toalha quente com hidratação facial faz toda a diferença depois de uma semana corrida. Atendimento direto, sem pressa e muito profissional.',
  },
  {
    id: 'dep-4',
    name: 'Marcelo Rezende',
    service: 'Corte Clássico',
    rating: 5,
    text: 'Fácil de chegar pela Av. Hermógenes Coelho, espaço limpo e confortável. Hoje corto só aqui e sempre recomendo para os amigos.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Preciso agendar horário ou há atendimento por ordem de chegada?',
    answer:
      'Trabalhamos prioritariamente com horário marcado para garantir que você não enfrente filas. Caso surja uma janela livre no dia, também atendemos encaixes mediante confirmação pelo WhatsApp (62) 99657-3854.',
  },
  {
    id: 'faq-2',
    question: 'Quais formas de pagamento são aceitas na Barbearia Alcateia?',
    answer:
      'Aceitamos Pix, dinheiro, cartões de débito e crédito diretamente no balcão após o atendimento.',
  },
  {
    id: 'faq-3',
    question: 'Com quanto tempo de antecedência posso remarcar ou cancelar?',
    answer:
      'Pedimos apenas que avise com pelo menos 2 horas de antecedência pelo WhatsApp para podermos liberar o horário para outro cliente.',
  },
  {
    id: 'faq-4',
    question: 'A hidratação facial é indicada para qualquer tipo de pele?',
    answer:
      'Sim. Utilizamos produtos suaves que limpam os poros, acalmam a pele após a lâmina e ajudam a reduzir pelos encravados e vermelhidão.',
  },
  {
    id: 'faq-5',
    question: 'Onde exatamente fica a barbearia e há facilidade para estacionar?',
    answer:
      'Estamos na Av. Hermógenes Coelho, no Jardim Vila Boa, em Goiás - GO (CEP 76600-000). A avenida oferece fácil acesso e estacionamento próximo à porta.',
  },
];
