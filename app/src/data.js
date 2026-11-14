// Demo data and helpers. Everything here is sample content; nothing is fetched from a server.

export const nowTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const seedThread = (e, n) => [
  {
    id: 1,
    from: "them",
    text: e,
    time: "09:12",
  },
  {
    id: 2,
    from: "me",
    text: n,
    time: "09:18",
  },
  {
    id: 3,
    from: "them",
    text: "Perfect — let’s keep it on BBchat. I’ll send the update shortly.",
    time: "09:24",
  },
];

export const SEED_CHATS = [
  {
    id: 1,
    name: "BENBAX Family",
    initials: "BF",
    color: "#0a1931",
    last: "Ama: Sunday setup is confirmed",
    time: "09:24",
    unread: 3,
    online: true,
    fav: true,
    group: true,
    messages: seedThread(
      "Welcome to the family group. Apolonia check-in is at 10am.",
      "Noted — I’ll bring the BENBAX folder.",
    ),
  },
  {
    id: 2,
    name: "Ventures Group",
    initials: "VG",
    color: "#075E54",
    last: "New listing is ready for review",
    time: "08:57",
    unread: 2,
    online: true,
    fav: true,
    group: true,
    messages: seedThread(
      "The Tema update is ready for review.",
      "Send the summary and I’ll approve it.",
    ),
  },
  {
    id: 3,
    name: "Ama Mensah",
    initials: "AM",
    color: "#d97706",
    last: "See you in Katamanso",
    time: "08:41",
    unread: 0,
    online: true,
    fav: true,
    group: false,
    messages: seedThread(
      "I’m close to Apolonia now.",
      "Great — meet at the main junction.",
    ),
  },
  {
    id: 4,
    name: "Kwame Asante",
    initials: "KA",
    color: "#128C7E",
    last: "The invoice looks good",
    time: "Yesterday",
    unread: 1,
    online: false,
    fav: false,
    group: false,
    messages: seedThread(
      "Invoice looks good. Can you confirm receipt?",
      "Confirmed. Thank you, Kwame.",
    ),
  },
  {
    id: 5,
    name: "Wallet Alerts (demo)",
    initials: "WA",
    color: "#f2b705",
    last: "Demo: you received GH₵ 250.00",
    time: "Yesterday",
    unread: 0,
    online: false,
    fav: false,
    group: false,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Demo alert: you received GH₵ 250.00 from Kwame Asante. No real money moved.",
        time: "07:20",
      },
    ],
  },
  {
    id: 6,
    name: "Crypto Desk (demo)",
    initials: "CD",
    color: "#f0b90b",
    last: "Your USDT order is complete",
    time: "Yesterday",
    unread: 0,
    online: true,
    fav: false,
    group: false,
    messages: seedThread(
      "Your USDT order is complete.",
      "Thanks — I’ve checked the wallet.",
    ),
  },
  {
    id: 7,
    name: "Yaw Boateng",
    initials: "YB",
    color: "#7c3aed",
    last: "Call me after the meeting",
    time: "Mon",
    unread: 0,
    online: false,
    fav: false,
    group: false,
    messages: seedThread("Call me after the meeting.", "Will do — around 4pm."),
  },
  {
    id: 8,
    name: "Akosua Frimpong",
    initials: "AF",
    color: "#db2777",
    last: "Photos are ready ✨",
    time: "Mon",
    unread: 5,
    online: true,
    fav: true,
    group: false,
    messages: seedThread(
      "Photos are ready. Want the full set?",
      "Yes please — send the best five.",
    ),
  },
  {
    id: 9,
    name: "Tema Traders",
    initials: "TT",
    color: "#0891b2",
    last: "Market opens at 7am",
    time: "Sun",
    unread: 0,
    online: false,
    fav: false,
    group: true,
    messages: seedThread(
      "Tema market opens at 7am tomorrow.",
      "I’ll be there early.",
    ),
  },
  {
    id: 10,
    name: "B Search Team",
    initials: "BS",
    color: "#0a1931",
    last: "Search update: 3 new leads",
    time: "Sun",
    unread: 0,
    online: true,
    fav: false,
    group: true,
    messages: seedThread(
      "Search update: 3 new leads today.",
      "Excellent — assign the first one to me.",
    ),
  },
  {
    id: 11,
    name: "Mum",
    initials: "MU",
    color: "#e11d48",
    last: "God bless you ❤️",
    time: "Sat",
    unread: 0,
    online: true,
    fav: true,
    group: false,
    messages: seedThread(
      "God bless you. Call when you are free.",
      "I will call tonight, Mum ❤️",
    ),
  },
  {
    id: 12,
    name: "Dad",
    initials: "DA",
    color: "#334155",
    last: "Well done, keep going",
    time: "Sat",
    unread: 0,
    online: false,
    fav: false,
    group: false,
    messages: seedThread(
      "Well done. Keep going.",
      "Thank you, Dad. I appreciate it.",
    ),
  },
];

export const COUNTRIES = [
  {
    n: "Ghana",
    c: "+233",
    f: "\uD83C\uDDEC\uD83C\uDDED",
  },
  {
    n: "USA",
    c: "+1",
    f: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    n: "UK",
    c: "+44",
    f: "\uD83C\uDDEC\uD83C\uDDE7",
  },
  {
    n: "Nigeria",
    c: "+234",
    f: "\uD83C\uDDF3\uD83C\uDDEC",
  },
];

export const AUTO_REPLIES = [
  "Got it — thank you!",
  "That works for me. Let’s do it.",
  "I’ll check and get back to you shortly.",
  "Perfect. I’ll share the update on BBchat.",
  "Seen — replying from Katamanso, Tema.",
];

export const EMOJIS = [
  "\uD83D\uDE02",
  "\uD83C\uDF89",
  "❤️",
  "\uD83D\uDE4F",
  "\uD83D\uDD25",
  "\uD83D\uDC4F",
  "\uD83D\uDE0D",
  "\uD83C\uDDEC\uD83C\uDDED",
  "\uD83D\uDE80",
  "\uD83D\uDCBC",
  "\uD83C\uDFB6",
  "\uD83C\uDF0D",
];

export const STICKERS = [
  "\uD83E\uDD81",
  "\uD83D\uDC51",
  "\uD83D\uDC8E",
  "\uD83C\uDFE1",
  "\uD83D\uDE97",
  "\uD83D\uDCF1",
  "\uD83C\uDF4D",
  "⚽",
  "\uD83C\uDF93",
  "\uD83D\uDCB0",
  "\uD83C\uDF1F",
  "\uD83D\uDECD️",
];

export const TRANSLATIONS = {
  Twi: {
    Hello: "Maakye",
    "Thank you": "Meda wo ase",
    "How are you?": "Ɛte sɛn?",
  },
  Ga: {
    Hello: "Mii ŋɔ",
    "Thank you": "Oyiwaladɔŋŋ",
    "How are you?": "Te ŋɔɔ?",
  },
  French: {
    Hello: "Bonjour",
    "Thank you": "Merci",
    "How are you?": "Comment allez-vous?",
  },
};
