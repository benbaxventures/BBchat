// Icons from the Lucide set (ISC licence, https://lucide.dev), as used by the original build.
import { forwardRef, createElement } from "react";

const toKebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const cx = (...c) =>
  c
    .filter((x, i, a) => Boolean(x) && x.trim() !== "" && a.indexOf(x) === i)
    .join(" ")
    .trim();
const DEFAULTS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function createIcon(name, nodes) {
  const Icon = forwardRef(
    (
      {
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth,
        className = "",
        children,
        ...rest
      },
      ref,
    ) =>
      createElement(
        "svg",
        {
          ref,
          ...DEFAULTS,
          width: size,
          height: size,
          stroke: color,
          strokeWidth: absoluteStrokeWidth
            ? (Number(strokeWidth) * 24) / Number(size)
            : strokeWidth,
          className: cx("lucide", `lucide-${toKebab(name)}`, className),
          ...rest,
        },
        [
          ...nodes.map(([tag, attrs]) => createElement(tag, attrs)),
          ...(Array.isArray(children) ? children : [children]),
        ],
      ),
  );
  Icon.displayName = name;
  return Icon;
}

export const ArrowLeftIcon = createIcon("ArrowLeft", [
  [
    "path",
    {
      d: "m12 19-7-7 7-7",
      key: "1l729n",
    },
  ],
  [
    "path",
    {
      d: "M19 12H5",
      key: "x3x0zl",
    },
  ],
]);
export const BellIcon = createIcon("Bell", [
  [
    "path",
    {
      d: "M10.268 21a2 2 0 0 0 3.464 0",
      key: "vwvbt9",
    },
  ],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi",
    },
  ],
]);
export const CameraIcon = createIcon("Camera", [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "13",
      r: "3",
      key: "1vg3eu",
    },
  ],
]);
export const ChartColumnIcon = createIcon("ChartColumn", [
  [
    "path",
    {
      d: "M3 3v16a2 2 0 0 0 2 2h16",
      key: "c24i48",
    },
  ],
  [
    "path",
    {
      d: "M18 17V9",
      key: "2bz60n",
    },
  ],
  [
    "path",
    {
      d: "M13 17V5",
      key: "1frdt8",
    },
  ],
  [
    "path",
    {
      d: "M8 17v-3",
      key: "17ska0",
    },
  ],
]);
export const CheckCheckIcon = createIcon("CheckCheck", [
  [
    "path",
    {
      d: "M18 6 7 17l-5-5",
      key: "116fxf",
    },
  ],
  [
    "path",
    {
      d: "m22 10-7.5 7.5L13 16",
      key: "ke71qq",
    },
  ],
]);
export const ChevronRightIcon = createIcon("ChevronRight", [
  [
    "path",
    {
      d: "m9 18 6-6-6-6",
      key: "mthhwq",
    },
  ],
]);
export const CircleHelpIcon = createIcon("CircleHelp", [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      key: "1mglay",
    },
  ],
  [
    "path",
    {
      d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
      key: "1u773s",
    },
  ],
  [
    "path",
    {
      d: "M12 17h.01",
      key: "p32p05",
    },
  ],
]);
export const CreditCardIcon = createIcon("CreditCard", [
  [
    "rect",
    {
      width: "20",
      height: "14",
      x: "2",
      y: "5",
      rx: "2",
      key: "ynyp8z",
    },
  ],
  [
    "line",
    {
      x1: "2",
      x2: "22",
      y1: "10",
      y2: "10",
      key: "1b3vmo",
    },
  ],
]);
export const EllipsisVerticalIcon = createIcon("EllipsisVertical", [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "1",
      key: "41hilf",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "5",
      r: "1",
      key: "gxeob9",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "19",
      r: "1",
      key: "lyex9k",
    },
  ],
]);
export const EyeIcon = createIcon("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "3",
      key: "1v7zrd",
    },
  ],
]);
export const FileTextIcon = createIcon("FileText", [
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      key: "1rqfz7",
    },
  ],
  [
    "path",
    {
      d: "M14 2v4a2 2 0 0 0 2 2h4",
      key: "tnqrlb",
    },
  ],
  [
    "path",
    {
      d: "M10 9H8",
      key: "b1mrlr",
    },
  ],
  [
    "path",
    {
      d: "M16 13H8",
      key: "t4e002",
    },
  ],
  [
    "path",
    {
      d: "M16 17H8",
      key: "z1uh3a",
    },
  ],
]);
export const Gamepad2Icon = createIcon("Gamepad2", [
  [
    "line",
    {
      x1: "6",
      x2: "10",
      y1: "11",
      y2: "11",
      key: "1gktln",
    },
  ],
  [
    "line",
    {
      x1: "8",
      x2: "8",
      y1: "9",
      y2: "13",
      key: "qnk9ow",
    },
  ],
  [
    "line",
    {
      x1: "15",
      x2: "15.01",
      y1: "12",
      y2: "12",
      key: "krot7o",
    },
  ],
  [
    "line",
    {
      x1: "18",
      x2: "18.01",
      y1: "10",
      y2: "10",
      key: "1lcuu1",
    },
  ],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
      key: "mfqc10",
    },
  ],
]);
export const GiftIcon = createIcon("Gift", [
  [
    "rect",
    {
      x: "3",
      y: "8",
      width: "18",
      height: "4",
      rx: "1",
      key: "bkv52",
    },
  ],
  [
    "path",
    {
      d: "M12 8v13",
      key: "1c76mn",
    },
  ],
  [
    "path",
    {
      d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",
      key: "6wjy6b",
    },
  ],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl",
    },
  ],
]);
export const ImageIcon = createIcon("Image", [
  [
    "rect",
    {
      width: "18",
      height: "18",
      x: "3",
      y: "3",
      rx: "2",
      ry: "2",
      key: "1m3agn",
    },
  ],
  [
    "circle",
    {
      cx: "9",
      cy: "9",
      r: "2",
      key: "af1f0g",
    },
  ],
  [
    "path",
    {
      d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
      key: "1xmnt7",
    },
  ],
]);
export const LanguagesIcon = createIcon("Languages", [
  [
    "path",
    {
      d: "m5 8 6 6",
      key: "1wu5hv",
    },
  ],
  [
    "path",
    {
      d: "m4 14 6-6 2-3",
      key: "1k1g8d",
    },
  ],
  [
    "path",
    {
      d: "M2 5h12",
      key: "or177f",
    },
  ],
  [
    "path",
    {
      d: "M7 2h1",
      key: "1t2jsx",
    },
  ],
  [
    "path",
    {
      d: "m22 22-5-10-5 10",
      key: "don7ne",
    },
  ],
  [
    "path",
    {
      d: "M14 18h6",
      key: "1m8k6r",
    },
  ],
]);
export const LogOutIcon = createIcon("LogOut", [
  [
    "path",
    {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      key: "1uf3rs",
    },
  ],
  [
    "polyline",
    {
      points: "16 17 21 12 16 7",
      key: "1gabdz",
    },
  ],
  [
    "line",
    {
      x1: "21",
      x2: "9",
      y1: "12",
      y2: "12",
      key: "1uyos4",
    },
  ],
]);
export const MapPinIcon = createIcon("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "10",
      r: "3",
      key: "ilqhr7",
    },
  ],
]);
export const MegaphoneIcon = createIcon("Megaphone", [
  [
    "path",
    {
      d: "m3 11 18-5v12L3 14v-3z",
      key: "n962bs",
    },
  ],
  [
    "path",
    {
      d: "M11.6 16.8a3 3 0 1 1-5.8-1.6",
      key: "1yl0tm",
    },
  ],
]);
export const MessageSquareIcon = createIcon("MessageSquare", [
  [
    "path",
    {
      d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
      key: "1lielz",
    },
  ],
]);
export const MicIcon = createIcon("Mic", [
  [
    "path",
    {
      d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",
      key: "131961",
    },
  ],
  [
    "path",
    {
      d: "M19 10v2a7 7 0 0 1-14 0v-2",
      key: "1vc78b",
    },
  ],
  [
    "line",
    {
      x1: "12",
      x2: "12",
      y1: "19",
      y2: "22",
      key: "x3vr5v",
    },
  ],
]);
export const PaperclipIcon = createIcon("Paperclip", [
  [
    "path",
    {
      d: "M13.234 20.252 21 12.3",
      key: "1cbrk9",
    },
  ],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6",
    },
  ],
]);
export const PhoneCallIcon = createIcon("PhoneCall", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5",
    },
  ],
  [
    "path",
    {
      d: "M14.05 2a9 9 0 0 1 8 7.94",
      key: "vmijpz",
    },
  ],
  [
    "path",
    {
      d: "M14.05 6A5 5 0 0 1 18 10",
      key: "13nbpp",
    },
  ],
]);
export const PhoneIcon = createIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5",
    },
  ],
]);
export const PlusIcon = createIcon("Plus", [
  [
    "path",
    {
      d: "M5 12h14",
      key: "1ays0h",
    },
  ],
  [
    "path",
    {
      d: "M12 5v14",
      key: "s699le",
    },
  ],
]);
export const QrCodeIcon = createIcon("QrCode", [
  [
    "rect",
    {
      width: "5",
      height: "5",
      x: "3",
      y: "3",
      rx: "1",
      key: "1tu5fj",
    },
  ],
  [
    "rect",
    {
      width: "5",
      height: "5",
      x: "16",
      y: "3",
      rx: "1",
      key: "1v8r4q",
    },
  ],
  [
    "rect",
    {
      width: "5",
      height: "5",
      x: "3",
      y: "16",
      rx: "1",
      key: "1x03jg",
    },
  ],
  [
    "path",
    {
      d: "M21 16h-3a2 2 0 0 0-2 2v3",
      key: "177gqh",
    },
  ],
  [
    "path",
    {
      d: "M21 21v.01",
      key: "ents32",
    },
  ],
  [
    "path",
    {
      d: "M12 7v3a2 2 0 0 1-2 2H7",
      key: "8crl2c",
    },
  ],
  [
    "path",
    {
      d: "M3 12h.01",
      key: "nlz23k",
    },
  ],
  [
    "path",
    {
      d: "M12 3h.01",
      key: "n36tog",
    },
  ],
  [
    "path",
    {
      d: "M12 16v.01",
      key: "133mhm",
    },
  ],
  [
    "path",
    {
      d: "M16 12h1",
      key: "1slzba",
    },
  ],
  [
    "path",
    {
      d: "M21 12v.01",
      key: "1lwtk9",
    },
  ],
  [
    "path",
    {
      d: "M12 21v-1",
      key: "1880an",
    },
  ],
]);
export const SearchIcon = createIcon("Search", [
  [
    "circle",
    {
      cx: "11",
      cy: "11",
      r: "8",
      key: "4ej97u",
    },
  ],
  [
    "path",
    {
      d: "m21 21-4.3-4.3",
      key: "1qie3q",
    },
  ],
]);
export const SendIcon = createIcon("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3",
    },
  ],
  [
    "path",
    {
      d: "m21.854 2.147-10.94 10.939",
      key: "12cjpa",
    },
  ],
]);
export const SettingsIcon = createIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "3",
      key: "1v7zrd",
    },
  ],
]);
export const ShieldIcon = createIcon("Shield", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
]);
export const SmileIcon = createIcon("Smile", [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      key: "1mglay",
    },
  ],
  [
    "path",
    {
      d: "M8 14s1.5 2 4 2 4-2 4-2",
      key: "1y1vjs",
    },
  ],
  [
    "line",
    {
      x1: "9",
      x2: "9.01",
      y1: "9",
      y2: "9",
      key: "yxxnd0",
    },
  ],
  [
    "line",
    {
      x1: "15",
      x2: "15.01",
      y1: "9",
      y2: "9",
      key: "1p4y9e",
    },
  ],
]);
export const SparklesIcon = createIcon("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx",
    },
  ],
  [
    "path",
    {
      d: "M20 3v4",
      key: "1olli1",
    },
  ],
  [
    "path",
    {
      d: "M22 5h-4",
      key: "1gvqau",
    },
  ],
  [
    "path",
    {
      d: "M4 17v2",
      key: "vumght",
    },
  ],
  [
    "path",
    {
      d: "M5 18H3",
      key: "zchphs",
    },
  ],
]);
export const StickerIcon = createIcon("Sticker", [
  [
    "path",
    {
      d: "M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",
      key: "1wis1t",
    },
  ],
  [
    "path",
    {
      d: "M14 3v4a2 2 0 0 0 2 2h4",
      key: "36rjfy",
    },
  ],
  [
    "path",
    {
      d: "M8 13h.01",
      key: "1sbv64",
    },
  ],
  [
    "path",
    {
      d: "M16 13h.01",
      key: "wip0gl",
    },
  ],
  [
    "path",
    {
      d: "M10 16s.8 1 2 1c1.3 0 2-1 2-1",
      key: "1vvgv3",
    },
  ],
]);
export const UsersIcon = createIcon("Users", [
  [
    "path",
    {
      d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      key: "1yyitq",
    },
  ],
  [
    "circle",
    {
      cx: "9",
      cy: "7",
      r: "4",
      key: "nufk8",
    },
  ],
  [
    "path",
    {
      d: "M22 21v-2a4 4 0 0 0-3-3.87",
      key: "kshegd",
    },
  ],
  [
    "path",
    {
      d: "M16 3.13a4 4 0 0 1 0 7.75",
      key: "1da9ce",
    },
  ],
]);
export const VideoIcon = createIcon("Video", [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec",
    },
  ],
  [
    "rect",
    {
      x: "2",
      y: "6",
      width: "14",
      height: "12",
      rx: "2",
      key: "158x01",
    },
  ],
]);
export const XIcon = createIcon("X", [
  [
    "path",
    {
      d: "M18 6 6 18",
      key: "1bl5f8",
    },
  ],
  [
    "path",
    {
      d: "m6 6 12 12",
      key: "d8bk6v",
    },
  ],
]);
