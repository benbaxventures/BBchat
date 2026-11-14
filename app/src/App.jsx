import React, { Fragment } from "react";
import logoUrl from "./assets/benbax-logo.png";
import logoSmallUrl from "./assets/benbax-logo-64.png";
import {
  nowTime,
  SEED_CHATS,
  COUNTRIES,
  AUTO_REPLIES,
  EMOJIS,
  STICKERS,
  TRANSLATIONS,
} from "./data.js";
import {
  ArrowLeftIcon,
  BellIcon,
  CameraIcon,
  ChartColumnIcon,
  CheckCheckIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FileTextIcon,
  Gamepad2Icon,
  GiftIcon,
  ImageIcon,
  LanguagesIcon,
  LogOutIcon,
  MapPinIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MicIcon,
  PaperclipIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlusIcon,
  QrCodeIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  ShieldIcon,
  SmileIcon,
  SparklesIcon,
  StickerIcon,
  UsersIcon,
  VideoIcon,
  XIcon,
} from "./icons.jsx";

function Avatar({ chat: chat, size = 44 }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="w-full h-full rounded-full grid place-items-center text-white font-display font-bold"
        style={{
          background: chat.color,
          fontSize: size * 0.35,
        }}
      >
        {chat.initials}
      </div>
      {chat.online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-white rounded-full" />
      )}
    </div>
  );
}

function Logo({
  size = 24,
  watermark = false,
  pulse = false,
  spin = false,
  header = false,
}) {
  return (
    <div
      aria-hidden={watermark}
      className={`relative shrink-0 overflow-hidden rounded-full bg-white grid place-items-center ${pulse ? "logo-pulse" : ""} ${spin ? "logo-spin" : ""}`}
      style={{
        width: size,
        height: size,
        boxShadow: watermark ? "none" : "0 2px 8px rgba(0,0,0,.18)",
        opacity: watermark ? 0.05 : 1,
      }}
    >
      <img
        src={header ? logoSmallUrl : logoUrl}
        alt="Original BENBAX logo"
        width={size}
        height={size}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

function LogoSmall({ size = 24 }) {
  return <Logo size={size} />;
}

export default function App() {
  let [screen, setScreen] = React.useState("splash"),
    [country, setCountry] = React.useState(COUNTRIES[0]),
    [phone, setPhone] = React.useState(""),
    [phoneError, setPhoneError] = React.useState(""),
    [otp, setOtp] = React.useState(["", "", "", "", "", ""]),
    [otpError, setOtpError] = React.useState(false),
    [resendSeconds, setResendSeconds] = React.useState(30),
    [canResend, setCanResend] = React.useState(false),
    [profile, setProfile] = React.useState({
      name: "",
      about: "Available on BBchat",
      color: "#075E54",
    }),
    [showQr, setShowQr] = React.useState(false),
    [tab, setTab] = React.useState("chats"),
    [chats, setChats] = React.useState(SEED_CHATS),
    [activeChatId, setActiveChatId] = React.useState(1),
    [search, setSearch] = React.useState(""),
    [filter, setFilter] = React.useState("All"),
    [draft, setDraft] = React.useState(""),
    [isTyping, setIsTyping] = React.useState(false),
    [toast, setToast] = React.useState(""),
    [showEmoji, setShowEmoji] = React.useState(false),
    [showAttach, setShowAttach] = React.useState(false),
    [showPlugins, setShowPlugins] = React.useState(false),
    [plugins, setPlugins] = React.useState({
      Stickers: true,
      GIFs: true,
      Polls: true,
      Payments: true,
      Location: true,
      "AI Assistant": true,
      "Business Catalog": true,
      "Status Saver": false,
      Backup: true,
      Themes: true,
      Privacy: true,
      "Disappearing Messages": false,
      "Voice Changer": false,
      "Video Filters": false,
      Translate: true,
      Scheduler: true,
      Broadcast: true,
      Channels: true,
      Communities: true,
      Games: true,
      Music: true,
      Files: true,
    }),
    [sheet, setSheet] = React.useState(""),
    [pollQuestion, setPollQuestion] = React.useState(
      "Which time works for the BENBAX meetup?",
    ),
    [pollOptions, setPollOptions] = React.useState([
      "Saturday 10am",
      "Saturday 2pm",
      "Sunday 10am",
      "Sunday 2pm",
    ]),
    [payAmount, setPayAmount] = React.useState("120"),
    [payMethod, setPayMethod] = React.useState("MTN MoMo"),
    [payPin, setPayPin] = React.useState(""),
    [payStep, setPayStep] = React.useState("form"),
    [scheduleDate, setScheduleDate] = React.useState("2026-06-20"),
    [scheduleTime, setScheduleTime] = React.useState("10:00"),
    [scheduleText, setScheduleText] = React.useState("BENBAX weekly update"),
    [scheduled, setScheduled] = React.useState([
      {
        d: "2026-06-20",
        t: "09:00",
        text: "Send Tema Traders market update",
      },
    ]),
    [board, setBoard] = React.useState(Array(9).fill("")),
    [gameResult, setGameResult] = React.useState(""),
    [translatePhrase, setTranslatePhrase] = React.useState("Thank you"),
    [translateLang, setTranslateLang] = React.useState("Twi"),
    // BB-04: start from the device's light/dark setting; the Settings toggle then overrides it.
    [darkMode, setDarkMode] = React.useState(
      () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
    ),
    [wallpaper, setWallpaper] = React.useState("Classic"),
    [notifications, setNotifications] = React.useState(true),
    [chatLock, setChatLock] = React.useState(false),
    [followedChannels, setFollowedChannels] = React.useState([1]),
    [myStatus, setMyStatus] = React.useState(
      "Building BENBAX from Katamanso ✨",
    ),
    [activeCall, setActiveCall] = React.useState(""),
    [menuOpen, setMenuOpen] = React.useState(false),
    otpRefs = React.useRef([]),
    messagesRef = React.useRef(null),
    activeChat = chats.find((m) => m.id === activeChatId) || chats[0];
  React.useEffect(() => {
    if (screen === "splash") {
      let m = setTimeout(() => setScreen("welcome"), 1900);
      return () => clearTimeout(m);
    }
  }, [screen]),
    React.useEffect(() => {
      if (screen === "otp" && resendSeconds > 0) {
        let m = setTimeout(() => setResendSeconds(resendSeconds - 1), 1000);
        return () => clearTimeout(m);
      }
      if (resendSeconds === 0) setCanResend(true);
    }, [screen, resendSeconds]),
    React.useEffect(() => {
      messagesRef.current?.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, [activeChat?.messages, isTyping, activeChatId]),
    React.useEffect(() => {
      if (toast) {
        let m = setTimeout(() => setToast(""), 2600);
        return () => clearTimeout(m);
      }
    }, [toast]);
  // BB-04: put the chosen theme on <html> so the colour variables in index.css
  // (and Tailwind `dark:` classes) apply to the whole page, body included.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    root.classList.toggle("light", !darkMode);
  }, [darkMode]);
  let showToast = (m) => setToast(m),
    verifyOtp = () => {
      if (otp.join("") === "123456") setScreen("profile");
      else setOtpError(true), setTimeout(() => setOtpError(false), 500);
    },
    sendMessage = (m, C = "text", T = {}) => {
      if (!m.trim() && C === "text") return;
      let F = {
        id: Date.now(),
        from: "me",
        text: m,
        kind: C,
        ...T,
        time: nowTime(),
      };
      setChats((R) =>
        R.map((ne) =>
          ne.id === activeChatId
            ? {
                ...ne,
                messages: [...ne.messages, F],
                last: m || T.poll?.q || "New message",
                time: "now",
              }
            : ne,
        ),
      ),
        setDraft(""),
        setShowAttach(false),
        setShowEmoji(false),
        setIsTyping(true),
        setTimeout(() => {
          setIsTyping(false);
          let R = {
            id: Date.now() + 1,
            from: "them",
            text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
            time: nowTime(),
          };
          setChats((ne) =>
            ne.map((ie) =>
              ie.id === activeChatId
                ? {
                    ...ie,
                    messages: [...ie.messages, R],
                    last: R.text,
                  }
                : ie,
            ),
          );
        }, 1400);
    },
    votePoll = (m, C) => {
      setChats((T) =>
        T.map((F) => ({
          ...F,
          messages: F.messages.map((R) =>
            R.id === m && R.poll
              ? {
                  ...R,
                  poll: {
                    ...R.poll,
                    opts: R.poll.opts.map((ne, ie) =>
                      ie === C
                        ? {
                            ...ne,
                            votes: ne.votes + 1,
                          }
                        : ne,
                    ),
                  },
                }
              : R,
          ),
        })),
      ),
        showToast("Vote counted");
    },
    visibleChats = chats.filter(
      (m) =>
        (filter === "All" ||
          (filter === "Unread" && m.unread > 0) ||
          (filter === "Favourites" && m.fav) ||
          (filter === "Groups" && m.group)) &&
        m.name.toLowerCase().includes(search.toLowerCase()),
    ),
    playMove = (m) => {
      if (board[m] || gameResult) return;
      let C = [...board];
      C[m] = "X";
      let T = (R) => {
          let ne = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
          for (let ie of ne)
            if (R[ie[0]] && R[ie[0]] === R[ie[1]] && R[ie[1]] === R[ie[2]])
              return R[ie[0]];
          return R.every(Boolean) ? "Draw" : "";
        },
        F = T(C);
      if (!F) {
        let R = C.map((ne, ie) => (ne ? null : ie)).filter((ne) => ne !== null);
        if (R.length)
          (C[R[Math.floor(Math.random() * R.length)]] = "O"), (F = T(C));
      }
      setBoard(C), setGameResult(F);
    },
    openChat = (m) => {
      setActiveChatId(m),
        setTab("chats"),
        setChats((C) =>
          C.map((T) =>
            T.id === m
              ? {
                  ...T,
                  unread: 0,
                }
              : T,
          ),
        );
    },
    themeClass = darkMode ? "dark" : "";
  if (screen === "splash")
    return (
      <div
        className="relative min-h-[100dvh] bg-[#0a1931] text-white grid place-items-center p-6 overflow-x-clip"
        style={{
          paddingTop: "var(--safe-area-inset-top)",
        }}
      >
        <div className="relative text-center">
          <div className="mx-auto w-fit">
            <Logo size={96} />
          </div>
          <p
            className="text-white/70 mt-2 font-bold"
            style={{
              fontSize: 11,
            }}
          >
            Original BENBAX Logo
          </p>
          <h1
            className="font-display font-extrabold mt-3 tracking-tight leading-none"
            style={{
              fontSize: 42,
            }}
          >
            BBchat
          </h1>
          <p className="text-white/80 mt-3 font-bold">
            Chat • Call • Connect • Ghana 🇬🇭
          </p>
          <span className="inline-flex items-center gap-1.5 mt-4 bg-[#f2b705] text-[#0a1931] text-[11px] font-extrabold tracking-widest px-3.5 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#075E54]" />
            BENBAX ORIGINAL LOGO
          </span>
          <p className="text-white/60 mt-3 text-sm">
            by BENBAX • Katamanso • Apolonia • Tema
          </p>
          <div className="flex items-center gap-3 w-64 max-w-full mx-auto mt-8">
            <span className="grid shrink-0">
              <Logo size={24} spin={true} header={true} />
            </span>
            <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-[#25D366] loadbar rounded-full" />
            </div>
          </div>
          <p className="text-xs text-white/50 mt-4">Loading BBchat demo…</p>
        </div>
      </div>
    );
  if (screen === "welcome")
    return PageShell({
      children: (
        <div className="min-h-[100dvh] grid lg:grid-cols-2 bg-[#0a1931] text-white overflow-x-clip">
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">
                Ghana • Tema
              </span>
              <span className="text-xs bg-[#f2b705] text-[#0a1931] px-3 py-1.5 rounded-full font-extrabold">
                BENBAX ORIGINAL
              </span>
            </div>
            <div className="py-8 text-center sm:text-left">
              <div className="relative mx-auto sm:mx-0 w-fit">
                <Logo size={96} />
              </div>
              <p
                className="text-white/70 font-bold mt-2"
                style={{
                  fontSize: 11,
                }}
              >
                Original BENBAX Logo
              </p>
              <p className="text-[#25D366] font-bold tracking-widest text-xs mt-6">
                WELCOME TO BBCHAT
              </p>
              <h2 className="font-display text-2xl font-extrabold mt-2">
                Welcome to BBchat
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Powered by BENBAX • Original Logo
              </p>
              <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-[0.95] mt-4">
                Chat closer.
                <br />
                <span className="text-[#25D366]">Build bigger.</span>
              </h1>
              <p className="text-white/70 mt-5 max-w-md leading-relaxed mx-auto sm:mx-0">
                Messaging, payments, business catalogues and community — made
                for BENBAX in Katamanso, Apolonia and Tema.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-6">
                {[
                  "Payments (demo)",
                  "Polls",
                  "Games",
                  "Translate",
                  "Stickers",
                ].map((m) => (
                  <span
                    className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs"
                    key={m}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <button
                onClick={() => setScreen("phone")}
                className="w-full bg-[#25D366] text-[#0a1931] font-extrabold py-4 rounded-2xl hover:bg-white transition"
              >
                Agree and Continue →
              </button>
              <p className="text-[11px] text-white/45 text-center mt-3">
                By continuing you agree to the BBchat local preview terms.
              </p>
            </div>
          </div>
          <div className="hidden lg:block relative bg-[#075E54] overflow-hidden">
            <div className="absolute inset-0 opacity-20 doodle" />
            <div className="relative p-10 h-full flex flex-col justify-end">
              <div className="bg-white text-[#0a1931] rounded-3xl rounded-bl-md p-4 max-w-sm shadow-2xl">
                <b>BENBAX Ventures</b>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome to BBchat. Your Tema community is already here.
                </p>
              </div>
              <div className="bg-[#d9fdd3] text-[#0a1931] rounded-3xl rounded-br-md p-4 max-w-sm ml-auto mt-3 shadow-xl">
                <b>You</b>
                <p className="text-sm">Ready to build 🚀</p>
              </div>
              <p className="text-white/70 text-sm mt-8">
                benbaxco.com • benbaxventures.com
              </p>
            </div>
          </div>
        </div>
      ),
    });
  if (screen === "phone")
    return PageShell({
      children: (
        <div className="min-h-[100dvh] bg-[var(--surface)] p-5 sm:p-8 max-w-xl mx-auto">
          <button
            onClick={() => setScreen("welcome")}
            className="text-sm font-bold text-[#128C7E]"
          >
            ← Back
          </button>
          <div className="mt-6 flex flex-col items-center text-center">
            <Logo size={32} />
            <p
              className="font-bold text-[var(--muted)] mt-2"
              style={{
                fontSize: 10,
              }}
            >
              Original BENBAX Logo
            </p>
            <p className="font-display text-2xl font-extrabold mt-3 leading-none">
              BBchat
            </p>
            <p className="text-xs font-bold text-[var(--muted)] tracking-widest mt-1">
              by BENBAX
            </p>
            <h1 className="font-display text-3xl font-extrabold mt-4">
              Enter your number
            </h1>
            <p className="text-sm text-[var(--muted)]">
              BBchat will send a 6-digit demo code.
            </p>
          </div>
          <div className="mt-8 bg-[var(--card)] border border-[var(--line)] rounded-3xl p-5 shadow-sm">
            <label className="text-xs font-bold text-[var(--muted)]">
              COUNTRY
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {COUNTRIES.map((m) => (
                <button
                  onClick={() => setCountry(m)}
                  className={`p-3 rounded-2xl border text-left ${country.c === m.c ? "bg-[#075E54] text-white border-[#075E54]" : "bg-[var(--surface)] border-[var(--line)]"}`}
                  key={m.c}
                >
                  <div className="text-xl">{m.f}</div>
                  <div className="text-xs font-bold">{m.n}</div>
                  <div className="text-xs opacity-70">{m.c}</div>
                </button>
              ))}
            </div>
            <label className="block text-xs font-bold text-[var(--muted)] mt-6">
              PHONE NUMBER
            </label>
            <div className="flex mt-2 border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--surface)]">
              <span className="px-4 grid place-items-center font-bold bg-[#0a1931] text-white">
                {country.c}
              </span>
              <input
                value={phone}
                onChange={(m) =>
                  setPhone(m.target.value.replace(/[^0-9]/g, ""))
                }
                inputMode="numeric"
                placeholder="24 123 4567"
                className="flex-1 min-w-0 px-4 py-4 bg-transparent outline-none font-bold"
              />
            </div>
            {phoneError && (
              <p className="text-red-500 text-sm mt-2">{phoneError}</p>
            )}
            <button
              onClick={() => {
                if (phone.length < 9) {
                  setPhoneError("Enter at least 9 digits for this demo.");
                  return;
                }
                setResendSeconds(30), setCanResend(false), setScreen("otp");
              }}
              className="w-full mt-5 bg-[#25D366] text-[#0a1931] font-extrabold py-4 rounded-2xl"
            >
              Next →
            </button>
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full mt-3 border border-[var(--line)] py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <QrCodeIcon size={18} /> {showQr ? "Hide QR" : "Use QR instead"}
            </button>
            {showQr && (
              <div className="mt-4 bg-white p-4 rounded-2xl text-center border">
                <div className="mx-auto w-40 h-40 grid grid-cols-5 gap-1">
                  {Array.from({
                    length: 25,
                  }).map((m, C) => (
                    <span
                      className={
                        C % 3 === 0 || C === 12
                          ? "bg-[#0a1931]"
                          : "bg-[#e5e7eb]"
                      }
                      key={C}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3 font-bold">
                  BBchat Web • Scan in the app preview
                </p>
                <p className="text-[11px] text-slate-400">
                  QR placeholder for this demo
                </p>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-[var(--muted)] mt-4">
            {"Demo OTP is "}
            <b>123456</b>
          </p>
        </div>
      ),
    });
  if (screen === "otp")
    return PageShell({
      children: (
        <div className="min-h-[100dvh] bg-[var(--surface)] p-5 max-w-xl mx-auto">
          <button
            onClick={() => setScreen("phone")}
            className="text-sm font-bold text-[#128C7E]"
          >
            ← Change number
          </button>
          <div className="mt-8">
            <LogoSmall size={24} />
            <p
              className="font-bold text-[var(--muted)] mt-2"
              style={{
                fontSize: 10,
              }}
            >
              Original BENBAX Logo
            </p>
            <h1 className="font-display text-3xl font-extrabold mt-5">
              {"Verify "}
              {country.c} {phone}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Enter the 6-digit code sent in this demo.
            </p>
            <div
              className={`flex gap-2 sm:gap-3 mt-8 ${otpError ? "shake" : ""}`}
            >
              {otp.map((m, C) => (
                <input
                  ref={(T) => {
                    otpRefs.current[C] = T;
                  }}
                  value={m}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(T) => {
                    let F = T.target.value.replace(/[^0-9]/g, ""),
                      R = [...otp];
                    if (((R[C] = F), setOtp(R), F && C < 5))
                      otpRefs.current[C + 1]?.focus();
                  }}
                  onKeyDown={(T) => {
                    if (T.key === "Backspace" && !otp[C] && C > 0)
                      otpRefs.current[C - 1]?.focus();
                  }}
                  className={`w-full h-14 sm:h-16 text-center text-2xl font-extrabold rounded-2xl border-2 bg-[var(--card)] outline-none ${otpError ? "border-red-500" : "border-[var(--line)] focus:border-[#25D366]"}`}
                  key={C}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-red-500 text-sm mt-3 font-bold">
                That code didn’t match. Try 123456.
              </p>
            )}
            <button
              onClick={verifyOtp}
              className="w-full mt-6 bg-[#25D366] text-[#0a1931] font-extrabold py-4 rounded-2xl"
            >
              Verify
            </button>
            <button
              disabled={!canResend}
              onClick={() => {
                setResendSeconds(30),
                  setCanResend(false),
                  showToast("Demo code resent: 123456");
              }}
              className="w-full mt-3 font-bold py-3 disabled:opacity-50"
            >
              {canResend
                ? "Resend code"
                : "Resend in 00:" + String(resendSeconds).padStart(2, "0")}
            </button>
            <div className="bg-[#d9fdd3] text-[#0a1931] p-4 rounded-2xl mt-6 text-sm">
              <b>Demo hint:</b>
              {" Use "}
              <b>123456</b>
              {" to continue."}
            </div>
          </div>
        </div>
      ),
    });
  if (screen === "profile")
    return PageShell({
      children: (
        <div className="min-h-[100dvh] bg-[var(--surface)] p-5 max-w-xl mx-auto">
          <div className="mt-6">
            <h1 className="font-display text-3xl font-extrabold">
              Profile setup
            </h1>
            <p className="text-sm text-[var(--muted)]">
              How should Tema see you on BBchat?
            </p>
            <div className="flex items-center gap-4 mt-7">
              <div
                className="w-24 h-24 rounded-full grid place-items-center text-white text-3xl font-display font-bold"
                style={{
                  background: profile.color,
                }}
              >
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : "BB"}
              </div>
              <div>
                <p className="font-bold">Choose avatar colour</p>
                <div className="flex gap-2 mt-2">
                  {[
                    "#075E54",
                    "#0a1931",
                    "#d97706",
                    "#db2777",
                    "#7c3aed",
                    "#0891b2",
                  ].map((m) => (
                    <button
                      onClick={() =>
                        setProfile({
                          ...profile,
                          color: m,
                        })
                      }
                      className="w-9 h-9 rounded-full border-4"
                      style={{
                        background: m,
                        borderColor:
                          profile.color === m ? "#25D366" : "transparent",
                      }}
                      aria-label={`Avatar colour ${m}`}
                      key={m}
                    />
                  ))}
                </div>
              </div>
            </div>
            <label className="block text-xs font-bold text-[var(--muted)] mt-7">
              YOUR NAME
            </label>
            <input
              value={profile.name}
              onChange={(m) =>
                setProfile({
                  ...profile,
                  name: m.target.value,
                })
              }
              placeholder="e.g. BENBAX"
              className="w-full mt-2 px-4 py-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] outline-none font-bold"
            />
            <label className="block text-xs font-bold text-[var(--muted)] mt-5">
              ABOUT
            </label>
            <input
              value={profile.about}
              onChange={(m) =>
                setProfile({
                  ...profile,
                  about: m.target.value,
                })
              }
              className="w-full mt-2 px-4 py-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] outline-none"
            />
            <button
              disabled={!profile.name.trim()}
              onClick={() => setScreen("app")}
              className="w-full mt-6 bg-[#25D366] text-[#0a1931] font-extrabold py-4 rounded-2xl disabled:opacity-40"
            >
              Done → Enter BBchat
            </button>
          </div>
        </div>
      ),
    });
  return (
    <div className={themeClass}>
      {PageShell({
        children: (
          <div className="min-h-[100dvh] bg-[#0a1931] lg:p-3">
            <div className="max-w-[1480px] mx-auto bg-[var(--surface)] lg:rounded-[24px] overflow-hidden shadow-2xl flex flex-col min-h-[100dvh] lg:min-h-[calc(100dvh-24px)]">
              <div className="bg-[#075E54] text-white px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] live-dot" />
                  <b>Demo mode • local only</b>
                  <span className="hidden sm:inline opacity-70">
                    • Katamanso • Apolonia • Tema
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPlugins(true)}
                    className="bg-white/15 px-2.5 py-1.5 rounded-full font-bold flex items-center gap-1"
                  >
                    <SparklesIcon size={13} />
                    {" Plugins"}
                  </button>
                  <button
                    onClick={() => setScreen("welcome")}
                    className="flex items-center gap-1 font-bold"
                  >
                    <LogOutIcon size={14} />
                    {" Logout"}
                  </button>
                </div>
              </div>
              <div className="flex flex-1 min-h-0">
                <aside
                  className={`w-full lg:w-[32%] xl:w-[30%] shrink-0 border-r border-[var(--line)] bg-[var(--card)] flex-col min-h-0 ${tab === "chats" && activeChatId ? "hidden lg:flex" : "flex"} ${tab !== "chats" ? "hidden lg:flex" : ""}`}
                >
                  <div className="relative overflow-hidden px-3 py-2.5 flex items-center justify-between bg-[#0a1931] text-white">
                    <div className="relative flex items-center gap-2">
                      <Logo size={24} header={true} />
                      <div>
                        <p className="font-display font-extrabold leading-none text-lg">
                          BBchat
                        </p>
                        <p className="text-[10px] text-white/60">by BENBAX</p>
                      </div>
                    </div>
                    <div className="relative flex gap-1">
                      <button
                        onClick={() => setSheet("addstatus")}
                        className="p-2 rounded-full hover:bg-white/10"
                        aria-label="Add status"
                      >
                        <PlusIcon />
                      </button>
                      <button
                        onClick={() => setShowPlugins(true)}
                        className="p-2 rounded-full hover:bg-white/10"
                        aria-label="Plugins"
                      >
                        <SparklesIcon />
                      </button>
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-full hover:bg-white/10"
                        aria-label="Menu"
                      >
                        <EllipsisVerticalIcon />
                      </button>
                    </div>
                  </div>
                  {menuOpen && (
                    <div className="mx-3 mt-2 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-2 text-sm pop">
                      <button
                        onClick={() => {
                          setSheet("profile"), setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--card)]"
                      >
                        My profile
                      </button>
                      <button
                        onClick={() => {
                          setTab("settings"), setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--card)]"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => setScreen("welcome")}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--card)] text-red-500"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 bg-[var(--surface)] rounded-2xl px-3 py-2.5">
                      <SearchIcon size={18} className="text-[var(--muted)]" />
                      <input
                        value={search}
                        onChange={(m) => setSearch(m.target.value)}
                        placeholder="Search or start new chat"
                        className="bg-transparent outline-none w-full text-sm"
                      />
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                      {["All", "Unread", "Favourites", "Groups"].map((m) => (
                        <button
                          onClick={() => setFilter(m)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === m ? "bg-[#25D366] text-[#0a1931]" : "bg-[var(--surface)]"}`}
                          key={m}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2 pb-4">
                    {visibleChats.map((m) => (
                      <button
                        onClick={() => openChat(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left ${activeChatId === m.id ? "bg-[#e8f6ee] dark:bg-[#16241f]" : ""}`}
                        key={m.id}
                      >
                        <Avatar chat={m} />
                        <span className="flex-1 min-w-0">
                          <span className="flex justify-between gap-2">
                            <b className="truncate text-sm">{m.name}</b>
                            <small
                              className={
                                m.unread
                                  ? "text-[#128C7E] font-bold"
                                  : "text-[var(--muted)]"
                              }
                            >
                              {m.time}
                            </small>
                          </span>
                          <span className="flex justify-between gap-2 mt-0.5">
                            <span className="text-xs text-[var(--muted)] truncate">
                              {m.last}
                            </span>
                            {m.unread > 0 && (
                              <span className="bg-[#25D366] text-[#0a1931] text-[10px] font-extrabold min-w-[20px] h-5 grid place-items-center rounded-full px-1">
                                {m.unread}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                    {visibleChats.length === 0 && (
                      <p className="text-center text-sm text-[var(--muted)] py-10">
                        No chats in this view.
                      </p>
                    )}
                  </div>
                  <div className="hidden lg:block px-4 py-3 border-t border-[var(--line)] text-xs text-[var(--muted)]">
                    benbaxco.com • benbaxventures.com • Tema, Ghana
                  </div>
                </aside>
                <main className="flex-1 min-w-0 flex-col min-h-0 hidden lg:flex">
                  {tab === "chats"
                    ? ChatPane({})
                    : tab === "settings"
                      ? SettingsTab({})
                      : tab === "status"
                        ? StatusTab({})
                        : tab === "calls"
                          ? CallsTab({})
                          : tab === "channels"
                            ? ChannelsTab({})
                            : CommunitiesTab({})}
                </main>
                <div className="flex-1 lg:hidden min-w-0 flex flex-col min-h-0">
                  {tab === "chats"
                    ? activeChatId
                      ? ChatPane({
                          mobile: true,
                        })
                      : null
                    : tab === "settings"
                      ? SettingsTab({})
                      : tab === "status"
                        ? StatusTab({})
                        : tab === "calls"
                          ? CallsTab({})
                          : tab === "channels"
                            ? ChannelsTab({})
                            : CommunitiesTab({})}
                </div>
              </div>
              <nav className="lg:hidden bg-[var(--card)] border-t border-[var(--line)] grid grid-cols-5 py-2 px-1 text-[10px] font-bold">
                {[
                  ["chats", "Chats", MessageSquareIcon],
                  ["status", "Status", UsersIcon],
                  ["calls", "Calls", PhoneCallIcon],
                  ["channels", "Channels", MegaphoneIcon],
                  ["settings", "Settings", SettingsIcon],
                ].map(([m, C, T]) => (
                  <button
                    onClick={() => setTab(m)}
                    className={`flex flex-col items-center gap-1 py-1 ${tab === m ? "text-[#128C7E]" : "text-[var(--muted)]"}`}
                    key={m}
                  >
                    <T size={22} />
                    {C}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        ),
      })}
      {showPlugins && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setShowPlugins(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--card)] p-5 overflow-y-auto pop"
            onClick={(m) => m.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold">
                  Plugins
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  Turn BBchat features on or off.
                </p>
              </div>
              <button
                onClick={() => setShowPlugins(false)}
                className="p-2 rounded-full bg-[var(--surface)]"
              >
                <XIcon />
              </button>
            </div>
            <div className="mt-5 space-y-2">
              {Object.entries(plugins).map(([m, C]) => (
                <div
                  className="flex items-center justify-between p-3 border border-[var(--line)] rounded-2xl"
                  key={m}
                >
                  <span className="font-bold text-sm">{m}</span>
                  <button
                    onClick={() => {
                      setPlugins({
                        ...plugins,
                        [m]: !C,
                      }),
                        showToast(`${m} ${!C ? "enabled" : "disabled"}`);
                    }}
                    className={`w-12 h-7 rounded-full p-1 transition ${C ? "bg-[#25D366]" : "bg-slate-300"}`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full transition ${C ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSheet("schedule"), setShowPlugins(false);
              }}
              className="w-full mt-4 bg-[#0a1931] text-white py-3 rounded-2xl font-bold"
            >
              Open Scheduler →
            </button>
          </div>
        </div>
      )}
      {sheet && (
        <div
          className="fixed inset-0 z-50 bg-black/55 grid place-items-end sm:place-items-center p-0 sm:p-4"
          onClick={() => setSheet("")}
        >
          <div
            className="bg-[var(--card)] w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] p-5 pop"
            onClick={(m) => m.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display text-xl font-extrabold">
                {sheet === "poll"
                  ? "Create poll"
                  : sheet === "pay"
                    ? "Send payment — DEMO"
                    : sheet === "location"
                      ? "Share location"
                      : sheet === "gif"
                        ? "GIFs"
                        : sheet === "sticker"
                          ? "Stickers"
                          : sheet === "schedule"
                            ? "Scheduler"
                            : sheet === "game"
                              ? "Tic Tac Toe"
                              : sheet === "translate"
                                ? "Translate"
                                : sheet === "addstatus"
                                  ? "Add status"
                                  : sheet === "call"
                                    ? "Start a call"
                                    : "My profile"}
              </h3>
              <button
                onClick={() => setSheet("")}
                className="p-2 bg-[var(--surface)] rounded-full"
              >
                <XIcon />
              </button>
            </div>
            {sheet === "poll" && (
              <div className="mt-4">
                <label className="text-xs font-bold text-[var(--muted)]">
                  QUESTION
                </label>
                <input
                  value={pollQuestion}
                  onChange={(m) => setPollQuestion(m.target.value)}
                  className="w-full mt-1 p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] outline-none font-bold"
                />
                {pollOptions.map((m, C) => (
                  <input
                    value={m}
                    onChange={(T) => {
                      let F = [...pollOptions];
                      (F[C] = T.target.value), setPollOptions(F);
                    }}
                    className="w-full mt-2 p-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] outline-none"
                    key={C}
                  />
                ))}
                <button
                  onClick={() => {
                    sendMessage(pollQuestion, "poll", {
                      poll: {
                        q: pollQuestion,
                        opts: pollOptions.map((m) => ({
                          label: m,
                          votes: 0,
                        })),
                      },
                    }),
                      setSheet("");
                  }}
                  className="w-full mt-4 bg-[#25D366] text-[#0a1931] font-extrabold py-3.5 rounded-2xl"
                >
                  {"Send poll to "}
                  {activeChat.name}
                </button>
              </div>
            )}
            {sheet === "pay" && (
              <div className="mt-4">
                {payStep === "form" ? (
                  <Fragment>
                    <p
                      role="note"
                      style={{
                        background: "#f2b705",
                        color: "#0a1931",
                        fontWeight: 800,
                        fontSize: 12,
                        borderRadius: 16,
                        padding: "8px 12px",
                        marginBottom: 12,
                        textAlign: "center",
                      }}
                    >
                      DEMO ONLY — no money is moved. Never enter your real PIN.
                    </p>
                    <label className="text-xs font-bold text-[var(--muted)]">
                      AMOUNT (GH₵)
                    </label>
                    <input
                      value={payAmount}
                      onChange={(m) =>
                        setPayAmount(m.target.value.replace(/[^0-9.]/g, ""))
                      }
                      inputMode="decimal"
                      className="w-full mt-1 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-2xl font-extrabold outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[
                        "MTN MoMo",
                        "Vodafone Cash",
                        "AirtelTigo",
                        "Binance Pay",
                      ].map((m) => (
                        <button
                          onClick={() => setPayMethod(m)}
                          className={`p-3 rounded-2xl border text-xs font-bold ${payMethod === m ? "bg-[#075E54] text-white" : "bg-[var(--surface)]"}`}
                          key={m}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <label className="block text-xs font-bold text-[var(--muted)] mt-4">
                      DEMO PIN: 1234 (never your real PIN)
                    </label>
                    <input
                      value={payPin}
                      onChange={(m) =>
                        setPayPin(
                          m.target.value.replace(/[^0-9]/g, "").slice(0, 4),
                        )
                      }
                      inputMode="numeric"
                      placeholder="••••"
                      className="w-full mt-1 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-center tracking-[1em] font-extrabold outline-none"
                    />
                    <button
                      onClick={() => {
                        if (payPin !== "1234") {
                          showToast("PIN is 1234 in this demo");
                          return;
                        }
                        setPayStep("done");
                      }}
                      className="w-full mt-4 bg-[#25D366] text-[#0a1931] font-extrabold py-4 rounded-2xl"
                    >
                      {"Demo pay GH₵ "}
                      {payAmount || "0"}
                    </button>
                  </Fragment>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-[#25D366] rounded-full grid place-items-center mx-auto text-2xl">
                      ✓
                    </div>
                    <h4 className="font-display text-2xl font-extrabold mt-3">
                      Demo payment — no money moved
                    </h4>
                    <p className="text-sm text-[var(--muted)]">
                      {"GH₵ "}
                      {payAmount}
                      {" • "}
                      {payMethod}
                      {" • To "}
                      {activeChat.name}
                    </p>
                    <button
                      onClick={() => {
                        sendMessage(
                          `DEMO payment (no money moved): GH₵ ${payAmount} via ${payMethod}`,
                          "payment",
                          {
                            amount: payAmount,
                            method: payMethod,
                          },
                        ),
                          setSheet(""),
                          setPayStep("form"),
                          setPayPin("");
                      }}
                      className="w-full mt-5 bg-[#0a1931] text-white py-3.5 rounded-2xl font-bold"
                    >
                      Share demo receipt in chat
                    </button>
                  </div>
                )}
              </div>
            )}
            {sheet === "location" && (
              <div className="mt-4">
                <div className="h-56 rounded-3xl bg-[#d7ead9] relative overflow-hidden border">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-gradient(#9cc7a2 1px,transparent 1px),linear-gradient(90deg,#9cc7a2 1px,transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="w-12 h-12 bg-red-500 text-white rounded-full rounded-bl-none grid place-items-center text-xl shadow-xl mx-auto">
                      📍
                    </div>
                    <b className="bg-white px-2 py-1 rounded-full text-xs shadow">
                      Katamanso • Apolonia
                    </b>
                  </div>
                  <span className="absolute left-4 top-4 bg-white px-2 py-1 rounded-full text-xs font-bold">
                    Tema, Ghana
                  </span>
                </div>
                <p className="text-sm mt-3">
                  <b>Katamanso — Apolonia, Tema</b>
                  <br />
                  <span className="text-[var(--muted)]">
                    BENBAX location • Live sharing preview
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => {
                      sendMessage(
                        "\uD83D\uDCCD Location: Katamanso — Apolonia, Tema",
                        "location",
                      ),
                        setSheet("");
                    }}
                    className="bg-[#25D366] text-[#0a1931] font-extrabold py-3 rounded-2xl"
                  >
                    Share location
                  </button>
                  <button
                    onClick={() => {
                      sendMessage(
                        "\uD83D\uDCCD Live location shared — Katamanso, Tema (1 hour)",
                        "location",
                      ),
                        setSheet("");
                    }}
                    className="bg-[#0a1931] text-white font-bold py-3 rounded-2xl"
                  >
                    Share Live • 1 hr
                  </button>
                </div>
              </div>
            )}
            {(sheet === "gif" || sheet === "sticker") && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {(sheet === "gif" ? EMOJIS : STICKERS).map((m, C) => (
                  <button
                    onClick={() => {
                      sendMessage(m, sheet), setSheet("");
                    }}
                    className="aspect-square text-4xl bg-[var(--surface)] rounded-2xl hover:scale-105 transition"
                    key={C}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
            {sheet === "schedule" && (
              <div className="mt-4">
                <label className="text-xs font-bold text-[var(--muted)]">
                  MESSAGE
                </label>
                <input
                  value={scheduleText}
                  onChange={(m) => setScheduleText(m.target.value)}
                  className="w-full mt-1 p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] outline-none"
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(m) => setScheduleDate(m.target.value)}
                    className="p-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)]"
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(m) => setScheduleTime(m.target.value)}
                    className="p-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)]"
                  />
                </div>
                <button
                  onClick={() => {
                    setScheduled([
                      ...scheduled,
                      {
                        d: scheduleDate,
                        t: scheduleTime,
                        text: scheduleText,
                      },
                    ]),
                      showToast("Message scheduled"),
                      setSheet("");
                  }}
                  className="w-full mt-4 bg-[#25D366] text-[#0a1931] font-extrabold py-3.5 rounded-2xl"
                >
                  Schedule message
                </button>
                <div className="mt-4 space-y-2">
                  {scheduled.map((m, C) => (
                    <div
                      className="flex justify-between p-3 bg-[var(--surface)] rounded-2xl text-sm"
                      key={C}
                    >
                      <span>
                        <b>{m.text}</b>
                        <br />
                        <small className="text-[var(--muted)]">
                          {m.d}
                          {" • "}
                          {m.t}
                        </small>
                      </span>
                      <span className="text-xs bg-[#e8f6ee] text-[#075E54] h-fit px-2 py-1 rounded-full font-bold">
                        Scheduled
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sheet === "game" && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
                  {board.map((m, C) => (
                    <button
                      onClick={() => playMove(C)}
                      className="aspect-square bg-[var(--surface)] rounded-2xl text-3xl font-display font-extrabold"
                      key={C}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-center font-bold mt-4">
                  {gameResult
                    ? gameResult === "Draw"
                      ? "It’s a draw!"
                      : `${gameResult} wins!`
                    : "You are X • Tap a square"}
                </p>
                <button
                  onClick={() => {
                    setBoard(Array(9).fill("")), setGameResult("");
                  }}
                  className="w-full mt-3 bg-[#0a1931] text-white py-3 rounded-2xl font-bold"
                >
                  Play again
                </button>
                <button
                  onClick={() => {
                    sendMessage(
                      "\uD83C\uDFAE I just played Tic Tac Toe on BBchat!",
                      "game",
                    ),
                      setSheet("");
                  }}
                  className="w-full mt-2 border border-[var(--line)] py-3 rounded-2xl font-bold"
                >
                  Send game result to chat
                </button>
              </div>
            )}
            {sheet === "translate" && (
              <div className="mt-4">
                <label className="text-xs font-bold text-[var(--muted)]">
                  ENGLISH
                </label>
                <input
                  value={translatePhrase}
                  onChange={(m) => setTranslatePhrase(m.target.value)}
                  className="w-full mt-1 p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] outline-none font-bold"
                />
                <div className="flex gap-2 mt-3">
                  {["Twi", "Ga", "French"].map((m) => (
                    <button
                      onClick={() => setTranslateLang(m)}
                      className={`px-4 py-2 rounded-full font-bold text-sm ${translateLang === m ? "bg-[#075E54] text-white" : "bg-[var(--surface)]"}`}
                      key={m}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="bg-[#e8f6ee] text-[#0a1931] p-4 rounded-2xl mt-4">
                  <small className="font-bold text-[#075E54]">
                    {translateLang}
                  </small>
                  <p className="font-display text-xl font-bold">
                    {TRANSLATIONS[translateLang]?.[translatePhrase] ||
                      `“${translatePhrase}” in ${translateLang} — ask in chat for the local phrasing.`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    sendMessage(
                      `\uD83C\uDF0D ${translatePhrase} → ${TRANSLATIONS[translateLang]?.[translatePhrase] || translateLang}`,
                      "translate",
                    ),
                      setSheet("");
                  }}
                  className="w-full mt-4 bg-[#25D366] text-[#0a1931] font-extrabold py-3.5 rounded-2xl"
                >
                  Send translation
                </button>
              </div>
            )}
            {sheet === "addstatus" && (
              <div className="mt-4">
                <textarea
                  value={myStatus}
                  onChange={(m) => setMyStatus(m.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] outline-none font-bold"
                />
                <button
                  onClick={() => {
                    showToast("Status added"), setSheet(""), setTab("status");
                  }}
                  className="w-full mt-3 bg-[#25D366] text-[#0a1931] font-extrabold py-3.5 rounded-2xl"
                >
                  Post status
                </button>
              </div>
            )}
            {sheet === "profile" && (
              <div className="mt-4 text-center">
                <div
                  className="w-20 h-20 rounded-full grid place-items-center text-white text-2xl font-bold mx-auto"
                  style={{
                    background: profile.color,
                  }}
                >
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
                <h4 className="font-display text-xl font-extrabold mt-3">
                  {profile.name}
                </h4>
                <p className="text-sm text-[var(--muted)]">{profile.about}</p>
                <p className="text-sm mt-2 font-bold">
                  {country.c} {phone}
                  {" • Tema, Ghana"}
                </p>
              </div>
            )}
            {sheet === "call" && (
              <div className="mt-4 text-center">
                <Avatar chat={activeChat} size={72} />
                <h4 className="font-display text-xl font-extrabold mt-3">
                  {activeChat.name}
                </h4>
                <p className="text-sm text-[var(--muted)]">
                  Voice call preview • BBchat
                </p>
                <button
                  onClick={() => {
                    setActiveCall(activeChat.name),
                      setSheet(""),
                      showToast(`Calling ${activeChat.name}…`);
                  }}
                  className="w-full mt-5 bg-[#25D366] text-[#0a1931] font-extrabold py-3.5 rounded-2xl"
                >
                  Start call
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {activeCall && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0a1931] text-white pl-3 pr-2 py-2 rounded-full flex items-center gap-3 shadow-2xl">
          <span className="w-2 h-2 bg-[#25D366] rounded-full live-dot" />{" "}
          <span className="text-sm font-bold">
            {"On call • "}
            {activeCall}
          </span>
          <button
            onClick={() => {
              setActiveCall(""), showToast("Call ended");
            }}
            className="bg-red-500 px-3 py-1.5 rounded-full text-xs font-bold"
          >
            End
          </button>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0a1931] text-white px-4 py-3 rounded-full text-sm font-bold shadow-2xl pop max-w-[92vw] text-center">
          {toast}
        </div>
      )}
    </div>
  );
  function PageShell({ children: children }) {
    return (
      <div
        className="min-h-[100dvh] bg-[var(--surface)] overflow-x-clip"
        style={{
          paddingTop: "var(--safe-area-inset-top)",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    );
  }
  function ChatPane({ mobile = false }) {
    return (
      <section className="flex-1 flex flex-col min-h-0 min-w-0">
        <header className="bg-[var(--card)] border-b border-[var(--line)] px-3 py-2.5 flex items-center gap-2">
          {mobile && (
            <button
              onClick={() => setActiveChatId(0)}
              className="lg:hidden p-2"
              aria-label="Back to chats"
            >
              <ArrowLeftIcon />
            </button>
          )}
          <Avatar chat={activeChat} />
          <button
            className="flex-1 min-w-0 text-left"
            onClick={() => setSheet("profile")}
          >
            <b className="block truncate text-sm sm:text-base">
              {activeChat.name}
            </b>
            <span className="text-xs text-[#128C7E]">
              {activeChat.online
                ? "Online"
                : `Last seen ${activeChat.time} • Tap for profile`}
            </span>
          </button>
          <div className="flex gap-0.5">
            <button
              onClick={() => {
                setSheet("call");
              }}
              className="p-2.5 rounded-full hover:bg-[var(--surface)]"
              aria-label="Video call"
            >
              <VideoIcon size={20} />
            </button>
            <button
              onClick={() => setSheet("call")}
              className="p-2.5 rounded-full hover:bg-[var(--surface)]"
              aria-label="Voice call"
            >
              <PhoneIcon size={20} />
            </button>
            <button
              onClick={() => setShowPlugins(true)}
              className="p-2.5 rounded-full hover:bg-[var(--surface)]"
              aria-label="More"
            >
              <EllipsisVerticalIcon size={20} />
            </button>
          </div>
        </header>
        <div className="bg-[#e7dfc9] dark:bg-[#16241f] text-center text-[11px] py-1.5 px-3 text-[#0a1931] dark:text-white">
          🔒 Demo mode — messages stay on this device and are not sent or
          encrypted
        </div>
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 relative"
          style={{
            backgroundColor:
              wallpaper === "Dark"
                ? "#111b21"
                : wallpaper === "Green"
                  ? "#d9ead9"
                  : "var(--chatbg)", // Classic: #efeae2 in light theme, dark in dark theme (BB-04)
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${logoUrl})`,
              backgroundSize: "120px",
              backgroundRepeat: "repeat",
              opacity: 0.06,
              zIndex: 0,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              zIndex: 0,
            }}
          >
            <img
              src={logoUrl}
              alt=""
              width={280}
              height={280}
              style={{
                width: 280,
                height: 280,
                objectFit: "contain",
                opacity: 0.05,
                borderRadius: "9999px",
                display: "block",
              }}
            />
          </div>
          <div
            className="relative"
            style={{
              zIndex: 1,
            }}
          >
            <div className="text-center my-2">
              <span className="bg-[var(--card)] shadow text-[11px] px-3 py-1 rounded-full font-bold">
                TODAY
              </span>
            </div>
            {activeChat.messages.map((C) => (
              <div
                className={`flex mb-2 ${C.from === "me" ? "justify-end" : "justify-start"}`}
                key={C.id}
              >
                <div
                  className={`max-w-[84%] sm:max-w-[68%] px-3.5 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${C.from === "me" ? "bg-[#d9fdd3] dark:bg-[#005c4b] rounded-tr-sm" : "bg-white dark:bg-[#202c33] rounded-tl-sm"}`}
                >
                  {C.kind === "poll" && C.poll ? (
                    <div>
                      <b>
                        {"\uD83D\uDCCA "}
                        {C.poll.q}
                      </b>
                      {C.poll.opts.map((T, F) => {
                        let R =
                          C.poll.opts.reduce((ne, ie) => ne + ie.votes, 0) || 1;
                        return (
                          <button
                            onClick={() => votePoll(C.id, F)}
                            className="block w-full text-left mt-2"
                            key={F}
                          >
                            <span className="flex justify-between text-xs font-bold">
                              <span>{T.label}</span>
                              <span>{Math.round((T.votes / R) * 100)}%</span>
                            </span>
                            <span className="block h-2 bg-black/10 rounded-full mt-1 overflow-hidden">
                              <span
                                className="block h-full bg-[#25D366]"
                                style={{
                                  width: `${(T.votes / R) * 100}%`,
                                }}
                              />
                            </span>
                          </button>
                        );
                      })}
                      <small className="text-[var(--muted)]">
                        Tap an option to vote
                      </small>
                    </div>
                  ) : C.kind === "payment" ? (
                    <div className="flex gap-3 items-center">
                      <span className="w-10 h-10 bg-[#25D366] rounded-full grid place-items-center">
                        💸
                      </span>
                      <span>
                        <b>
                          {"DEMO • GH₵ "}
                          {C.amount}
                          {" (not real)"}
                        </b>
                        <br />
                        <small>
                          {C.method}
                          {" • demo receipt, no money moved"}
                        </small>
                      </span>
                    </div>
                  ) : (
                    <span
                      className={
                        C.kind === "gif" || C.kind === "sticker"
                          ? "text-4xl"
                          : ""
                      }
                    >
                      {C.text}
                    </span>
                  )}
                  <span className="flex justify-end items-center gap-1 mt-1 text-[10px] text-[var(--muted)]">
                    {C.time}{" "}
                    {C.from === "me" && (
                      <CheckCheckIcon size={14} className="text-[#53bdeb]" />
                    )}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex">
                <div className="bg-white dark:bg-[#202c33] px-3 py-2 rounded-2xl rounded-tl-sm typing flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full inline-block" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full inline-block" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full inline-block" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[var(--card)] p-2 sm:p-3">
          {showEmoji && (
            <div className="flex gap-1 flex-wrap p-2">
              {[
                "\uD83D\uDE00",
                "\uD83D\uDE02",
                "❤️",
                "\uD83D\uDE4F",
                "\uD83D\uDD25",
                "\uD83D\uDC4F",
                "\uD83D\uDE0D",
                "\uD83C\uDDEC\uD83C\uDDED",
                "\uD83C\uDF89",
                "\uD83D\uDCBC",
                "\uD83D\uDE80",
                "\uD83C\uDF0D",
                "\uD83D\uDC51",
                "\uD83D\uDC8E",
              ].map((C) => (
                <button
                  onClick={() => setDraft(draft + C)}
                  className="text-2xl p-1.5 hover:scale-110"
                  key={C}
                >
                  {C}
                </button>
              ))}
            </div>
          )}
          {showAttach && (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 pop">
              {[
                ["Document", FileTextIcon, "doc"],
                ["Photos", ImageIcon, "photo"],
                ["Camera", CameraIcon, "camera"],
                ["Poll", ChartColumnIcon, "poll"],
                ["Location", MapPinIcon, "location"],
                ["Sticker", StickerIcon, "sticker"],
                ["GIF", GiftIcon, "gif"],
                ["Payment", CreditCardIcon, "pay"],
              ].map(([C, T, F]) => (
                <button
                  onClick={() => {
                    if (F === "poll") setSheet("poll");
                    else if (F === "location") setSheet("location");
                    else if (F === "sticker") setSheet("sticker");
                    else if (F === "gif") setSheet("gif");
                    else if (F === "pay") setSheet("pay");
                    else
                      sendMessage(`\uD83D\uDCCE ${C} shared`),
                        showToast(`${C} shared in chat`);
                    setShowAttach(false);
                  }}
                  className="flex flex-col items-center gap-1 text-[11px] font-bold py-2"
                  key={C}
                >
                  <span className="w-10 h-10 rounded-full bg-[#e8f6ee] text-[#075E54] grid place-items-center">
                    <T size={18} />
                  </span>
                  {C}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-3 rounded-full hover:bg-[var(--surface)]"
              aria-label="Emoji"
            >
              <SmileIcon />
            </button>
            <button
              onClick={() => setShowAttach(!showAttach)}
              className="p-3 rounded-full hover:bg-[var(--surface)]"
              aria-label="Attach"
            >
              <PaperclipIcon />
            </button>
            <input
              value={draft}
              onChange={(C) => setDraft(C.target.value)}
              onKeyDown={(C) => {
                if (C.key === "Enter") sendMessage(draft);
              }}
              placeholder="Type a message"
              className="flex-1 min-w-0 bg-[var(--surface)] rounded-full px-4 py-3 outline-none text-sm"
            />
            <button
              onClick={() => setSheet("game")}
              className="hidden sm:grid p-3 rounded-full hover:bg-[var(--surface)]"
              aria-label="Games"
            >
              <Gamepad2Icon />
            </button>
            <button
              onClick={() => setSheet("translate")}
              className="hidden sm:grid p-3 rounded-full hover:bg-[var(--surface)]"
              aria-label="Translate"
            >
              <LanguagesIcon />
            </button>
            {draft.trim() ? (
              <button
                onClick={() => sendMessage(draft)}
                className="bg-[#25D366] text-[#0a1931] p-3.5 rounded-full shadow"
                aria-label="Send"
              >
                <SendIcon size={20} />
              </button>
            ) : (
              <button
                onClick={() =>
                  showToast(
                    "Voice note preview — hold to record in the full app",
                  )
                }
                className="bg-[#25D366] text-[#0a1931] p-3.5 rounded-full shadow"
                aria-label="Voice"
              >
                <MicIcon size={20} />
              </button>
            )}
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
            {[
              ["Poll", () => setSheet("poll")],
              ["Payment", () => setSheet("pay")],
              ["Location", () => setSheet("location")],
              ["GIF", () => setSheet("gif")],
              ["Schedule", () => setSheet("schedule")],
              [
                "AI",
                () => {
                  sendMessage("Hi BB AI — help me draft a BENBAX update");
                },
              ],
            ].map(([C, T]) => (
              <button
                onClick={T}
                className="px-3 py-1.5 rounded-full bg-[var(--surface)] text-xs font-bold whitespace-nowrap"
                key={C}
              >
                {C}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }
  function StatusTab() {
    return (
      <section className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl font-extrabold">Status</h2>
            <p className="text-sm text-[var(--muted)]">
              Updates disappear after 24 hours.
            </p>
          </div>
          <button
            onClick={() => setSheet("addstatus")}
            className="bg-[#25D366] text-[#0a1931] px-4 py-2.5 rounded-full font-bold"
          >
            + Add
          </button>
        </div>
        <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar pb-2">
          {[
            {
              n: "My Status",
              c: "#0a1931",
              t: "Tap to add",
            },
            {
              n: "Ama",
              c: "#d97706",
              t: "12 min ago",
            },
            {
              n: "Akosua",
              c: "#db2777",
              t: "1 hr ago",
            },
            {
              n: "BENBAX",
              c: "#075E54",
              t: "2 hrs ago",
            },
            {
              n: "Kwame",
              c: "#128C7E",
              t: "4 hrs ago",
            },
          ].map((m, C) => (
            <button
              onClick={() => {
                setSheet("status"), showToast(`Viewing ${m.n} status`);
              }}
              className="shrink-0 text-center"
              key={m.n}
            >
              <span className="block w-[72px] h-[72px] rounded-full p-[3px] bg-[#25D366]">
                <span
                  className="w-full h-full rounded-full grid place-items-center bg-[var(--card)] font-bold"
                  style={{
                    color: m.c,
                  }}
                >
                  {m.n.slice(0, 2)}
                </span>
              </span>
              <span className="block text-xs font-bold mt-2">{m.n}</span>
              <span className="text-[10px] text-[var(--muted)]">{m.t}</span>
            </button>
          ))}
        </div>
        <div className="bg-[#0a1931] text-white rounded-3xl p-5 mt-4">
          <p className="text-xs text-[#25D366] font-bold">MY STATUS PREVIEW</p>
          <p className="font-display text-xl font-bold mt-2 leading-snug">
            {myStatus}
          </p>
          <p className="text-white/60 text-sm mt-2">
            Katamanso • Apolonia • Tema
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {[
            "BENBAX Official: New week, new listings",
            "Ama: Market day in Tema",
            "Akosua: Photos are ready",
          ].map((m, C) => (
            <div
              className="bg-[var(--card)] border border-[var(--line)] p-4 rounded-3xl"
              key={C}
            >
              <EyeIcon size={18} className="text-[#128C7E]" />
              <p className="font-bold mt-2">{m}</p>
              <p className="text-xs text-[var(--muted)]">
                Viewed in this preview
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  function CallsTab() {
    return (
      <section className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h2 className="font-display text-3xl font-extrabold">Calls</h2>
        <p className="text-sm text-[var(--muted)]">Recent BBchat calls.</p>
        <div className="mt-5 space-y-2">
          {[
            {
              n: "Ama Mensah",
              t: "Missed • 09:12",
              miss: true,
            },
            {
              n: "Kwame Asante",
              t: "Outgoing • Yesterday",
              miss: false,
            },
            {
              n: "Mum",
              t: "Incoming • Yesterday",
              miss: false,
            },
            {
              n: "Yaw Boateng",
              t: "Missed • Monday",
              miss: true,
            },
          ].map((C, T) => (
            <div
              className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-4 flex items-center gap-3"
              key={T}
            >
              <div className="w-11 h-11 rounded-full bg-[#075E54] text-white grid place-items-center font-bold">
                {C.n.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <b className="block truncate">{C.n}</b>
                <small
                  className={
                    C.miss ? "text-red-500 font-bold" : "text-[var(--muted)]"
                  }
                >
                  {C.t}
                </small>
              </div>
              <button
                onClick={() => {
                  setActiveCall(C.n), showToast(`Calling ${C.n}…`);
                }}
                className="bg-[#25D366] text-[#0a1931] px-3 py-2 rounded-full text-xs font-bold"
              >
                Call back
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setSheet("call")}
          className="w-full mt-4 bg-[#0a1931] text-white py-3.5 rounded-2xl font-bold"
        >
          Start new call
        </button>
      </section>
    );
  }
  function ChannelsTab() {
    return (
      <section className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h2 className="font-display text-3xl font-extrabold">Channels</h2>
        <p className="text-sm text-[var(--muted)]">
          Follow updates without joining a group.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {[
            {
              id: 1,
              n: "BENBAX Official",
              d: "Ventures, property & community updates",
              f: "42.1k",
            },
            {
              id: 2,
              n: "Ventures News",
              d: "New listings and Tema business news",
              f: "18.4k",
            },
            {
              id: 3,
              n: "Crypto Basics",
              d: "Crypto education and market updates",
              f: "96.2k",
            },
          ].map((C) => (
            <div
              className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-4"
              key={C.id}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0a1931] text-white grid place-items-center font-display font-bold">
                {C.n.slice(0, 2)}
              </div>
              <b className="block mt-3">{C.n}</b>
              <p className="text-sm text-[var(--muted)]">{C.d}</p>
              <p className="text-xs font-bold mt-1">
                {C.f}
                {" followers"}
              </p>
              <button
                onClick={() =>
                  setFollowedChannels((T) =>
                    T.includes(C.id)
                      ? T.filter((F) => F !== C.id)
                      : [...T, C.id],
                  )
                }
                className={`w-full mt-3 py-2.5 rounded-full font-bold text-sm ${followedChannels.includes(C.id) ? "bg-[var(--surface)]" : "bg-[#25D366] text-[#0a1931]"}`}
              >
                {followedChannels.includes(C.id) ? "Following ✓" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }
  function CommunitiesTab() {
    return (
      <section className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h2 className="font-display text-3xl font-extrabold">Communities</h2>
        <p className="text-sm text-[var(--muted)]">
          Bring related groups together.
        </p>
        <div className="mt-5 space-y-3">
          {[
            {
              n: "BENBAX Tema Community",
              d: "Family • Ventures • Traders",
              m: "1,240 members",
            },
            {
              n: "Katamanso Neighbours",
              d: "Local updates & support",
              m: "860 members",
            },
          ].map((m, C) => (
            <div
              className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-5 flex gap-4 items-center"
              key={C}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#075E54] text-white grid place-items-center font-bold text-xl">
                {m.n.slice(0, 2)}
              </div>
              <div className="flex-1">
                <b>{m.n}</b>
                <p className="text-sm text-[var(--muted)]">
                  {m.d}
                  {" • "}
                  {m.m}
                </p>
              </div>
              <ChevronRightIcon />
            </div>
          ))}
        </div>
      </section>
    );
  }
  function SettingsTab() {
    return (
      <section className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h2 className="font-display text-3xl font-extrabold">Settings</h2>
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-4 mt-5 flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full grid place-items-center text-white font-bold text-lg"
            style={{
              background: profile.color,
            }}
          >
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <b className="block truncate">{profile.name}</b>
            <span className="text-sm text-[var(--muted)] truncate block">
              {profile.about}
            </span>
          </div>
          <button
            onClick={() => setScreen("profile")}
            className="font-bold text-[#128C7E] text-sm"
          >
            Edit
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {[
            {
              icon: BellIcon,
              label: "Notifications",
              desc: notifications ? "On" : "Off",
              fn: () => {
                setNotifications(!notifications),
                  showToast(`Notifications ${!notifications ? "on" : "off"}`);
              },
            },
            {
              icon: ShieldIcon,
              label: "Privacy • Disappearing & Lock Chat",
              desc: chatLock ? "Chat lock on" : "Chat lock off",
              fn: () => {
                setChatLock(!chatLock),
                  showToast(`Chat lock ${!chatLock ? "enabled" : "disabled"}`);
              },
            },
            {
              icon: SparklesIcon,
              label: "Theme",
              desc: darkMode ? "Dark" : "Light",
              fn: () => {
                setDarkMode(!darkMode),
                  showToast(darkMode ? "Light theme" : "Dark theme");
              },
            },
            {
              icon: CircleHelpIcon,
              label: "Help • BENBAX Support",
              desc: "benbaxco.com",
              fn: () => showToast("BENBAX support: benbaxco.com"),
            },
          ].map((m, C) => (
            <button
              onClick={m.fn}
              className="w-full bg-[var(--card)] border border-[var(--line)] rounded-3xl p-4 flex items-center gap-3 text-left"
              key={C}
            >
              <m.icon className="text-[#128C7E]" />
              <span className="flex-1">
                <b className="block text-sm">{m.label}</b>
                <small className="text-[var(--muted)]">{m.desc}</small>
              </span>
              <ChevronRightIcon size={18} />
            </button>
          ))}
        </div>
        <p className="font-bold mt-5 mb-2 text-sm">Wallpaper</p>
        <div className="grid grid-cols-3 gap-2">
          {["Classic", "Green", "Dark"].map((m) => (
            <button
              onClick={() => {
                setWallpaper(m), showToast(`${m} wallpaper selected`);
              }}
              className={`py-4 rounded-2xl border-2 font-bold text-sm ${wallpaper === m ? "border-[#25D366]" : "border-[var(--line)]"} ${m === "Green" ? "bg-[#d9ead9] text-[#0a1931]" : m === "Dark" ? "bg-[#111b21] text-white" : "bg-[#efeae2] text-[#0a1931]"}`}
              key={m}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={() => setScreen("welcome")}
          className="w-full mt-6 bg-red-50 text-red-600 font-bold py-3.5 rounded-2xl"
        >
          Log out
        </button>
        <p className="text-center text-xs text-[var(--muted)] mt-4">
          BBchat by BENBAX • Katamanso Apolonia Tema • benbaxventures.com
        </p>
      </section>
    );
  }
}
