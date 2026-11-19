import { Ionicons } from "@expo/vector-icons";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Contacts from "expo-contacts";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Sharing from "expo-sharing";
import { getAdminPasscode, saveAdminPasscode } from "./adminPasscode";
import {
  configureNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification as scheduleTestNotification,
} from "./notificationService";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Tab = "Chats" | "Updates" | "Communities" | "Dashboard" | "Calls";
type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
  attachmentUri?: string;
  audioUri?: string;
  fileName?: string;
  fileMimeType?: string;
  locationUri?: string;
  replyTo?: string;
  reactions?: string[];
  starred?: boolean;
};
type Chat = {
  id: string;
  name: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  unread: number;
  online?: boolean;
  pinned?: boolean;
  archived?: boolean;
  muted?: boolean;
  isGroup?: boolean;
  members?: string[];
  messages: Message[];
};
type StatusUpdate = { id: string; name: string; initials: string; color: string; text: string; time: string; attachmentUri?: string };
type ConnectionEvent = { id: string; chatId: string; chatName: string; connectedAt: string };
type InboxFilter = "all" | "unread" | "groups" | "archived" | "starred";
type Contact = { id: string; name: string; initials: string; color: string; phoneNumber?: string };

const STORAGE_KEY = "bbchat.local.v1";

const palette = {
  ink: "#18331D",
  muted: "#718073",
  green: "#2EBC3B",
  deepGreen: "#14581C",
  cyan: "#35C3D8",
  amber: "#F4B400",
  paleGreen: "#EAF7EB",
  canvas: "#F5F8F3",
  line: "#E7EDE4",
  white: "#FFFFFF",
};

const seedChats: Chat[] = [
  {
    id: "maya",
    name: "Maya Chen",
    initials: "MC",
    color: "#EBC4B5",
    preview: "That little coffee place was perfect ☕",
    time: "9:42",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", text: "Hey! How was your weekend?", time: "9:34", fromMe: false },
      { id: "m2", text: "So good, finally got out for a long walk 🌿", time: "9:38", fromMe: true },
      { id: "m3", text: "That little coffee place was perfect ☕", time: "9:42", fromMe: false },
    ],
  },
  {
    id: "design",
    name: "Design friends ✨",
    initials: "DF",
    color: "#D8C8EE",
    preview: "Leo: Dropping the new screens here",
    time: "9:18",
    unread: 4,
    isGroup: true,
    members: ["maya", "eli", "sophie"],
    messages: [
      { id: "d1", text: "Welcome to the group! Share your ideas anytime.", time: "Yesterday", fromMe: false },
      { id: "d2", text: "Leo: Dropping the new screens here", time: "9:18", fromMe: false },
    ],
  },
  {
    id: "noah",
    name: "Noah Williams",
    initials: "NW",
    color: "#B7D9D0",
    preview: "Voice message · 0:18",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [{ id: "n1", text: "Voice message · 0:18", time: "Yesterday", fromMe: false }],
  },
  {
    id: "family",
    name: "Sunday lunch crew",
    initials: "SL",
    color: "#F1D99C",
    preview: "You: I'll bring something sweet 🍰",
    time: "Yesterday",
    unread: 0,
    isGroup: true,
    members: ["maya", "noah", "aria"],
    messages: [{ id: "f1", text: "You: I'll bring something sweet 🍰", time: "Yesterday", fromMe: true }],
  },
  {
    id: "aria",
    name: "Aria Patel",
    initials: "AP",
    color: "#E8BBD0",
    preview: "See you soon!",
    time: "Mon",
    unread: 0,
    messages: [{ id: "a1", text: "See you soon!", time: "Mon", fromMe: false }],
  },
];

const contacts: Contact[] = [
  { id: "maya", name: "Maya Chen", initials: "MC", color: "#EBC4B5" },
  { id: "noah", name: "Noah Williams", initials: "NW", color: "#B7D9D0" },
  { id: "aria", name: "Aria Patel", initials: "AP", color: "#E8BBD0" },
  { id: "eli", name: "Eli Thompson", initials: "ET", color: "#C3D0EE" },
  { id: "sophie", name: "Sophie Martin", initials: "SM", color: "#E9D1A8" },
];

const initialStatuses: StatusUpdate[] = [
  { id: "maya-status", name: "Maya Chen", initials: "MC", color: "#EBC4B5", text: "Fresh coffee, slow mornings ☕", time: "Today, 9:20 am" },
  { id: "noah-status", name: "Noah Williams", initials: "NW", color: "#B7D9D0", text: "Out exploring 🌿", time: "Yesterday, 6:45 pm" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMessage(value: unknown): value is Message {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.time === "string" &&
    typeof value.fromMe === "boolean" &&
    (value.attachmentUri === undefined || typeof value.attachmentUri === "string") &&
    (value.audioUri === undefined || typeof value.audioUri === "string") &&
    (value.fileName === undefined || typeof value.fileName === "string") &&
    (value.fileMimeType === undefined || typeof value.fileMimeType === "string") &&
    (value.locationUri === undefined || typeof value.locationUri === "string") &&
    (value.replyTo === undefined || typeof value.replyTo === "string") &&
    (value.starred === undefined || typeof value.starred === "boolean") &&
    (value.reactions === undefined || (Array.isArray(value.reactions) && value.reactions.every((item) => typeof item === "string")))
  );
}

function isContact(value: unknown): value is Contact {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.initials === "string" &&
    typeof value.color === "string" &&
    (value.phoneNumber === undefined || typeof value.phoneNumber === "string")
  );
}

function isChat(value: unknown): value is Chat {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.initials === "string" &&
    typeof value.color === "string" &&
    typeof value.preview === "string" &&
    typeof value.time === "string" &&
    typeof value.unread === "number" &&
    Array.isArray(value.messages) &&
    value.messages.every(isMessage)
  );
}

function isStatusUpdate(value: unknown): value is StatusUpdate {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.initials === "string" &&
    typeof value.color === "string" &&
    typeof value.text === "string" &&
    typeof value.time === "string" &&
    (value.attachmentUri === undefined || typeof value.attachmentUri === "string")
  );
}

function isConnectionEvent(value: unknown): value is ConnectionEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.chatId === "string" &&
    typeof value.chatName === "string" &&
    typeof value.connectedAt === "string" &&
    Number.isFinite(Date.parse(value.connectedAt))
  );
}

function Avatar({
  initials,
  color,
  size = 54,
  online = false,
}: {
  initials: string;
  color: string;
  size?: number;
  online?: boolean;
}) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>{initials}</Text>
      {online && <View style={styles.onlineDot} />}
    </View>
  );
}

function BrandMark() {
  return <Image source={require("./assets/benbax-logo.png")} resizeMode="contain" style={styles.brandLogo} accessibilityLabel="Benbax logo" />;
}

function LogoPattern() {
  return (
    <View pointerEvents="none" style={styles.logoPattern}>
      {Array.from({ length: 240 }, (_, index) => (
        <Image key={index} source={require("./assets/benbax-logo.png")} resizeMode="contain" style={styles.patternLogo} />
      ))}
    </View>
  );
}

function AudioNote({ uri, fromMe }: { uri: string; fromMe: boolean }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const duration = Math.max(1, Math.round(status.duration));
  return (
    <Pressable
      style={styles.audioNote}
      onPress={(event) => {
        event.stopPropagation();
        if (status.playing) player.pause();
        else player.play();
      }}
      accessibilityLabel={status.playing ? "Pause voice message" : "Play voice message"}
    >
      <View style={[styles.audioPlayButton, fromMe && styles.audioPlayButtonSent]}>
        <Ionicons name={status.playing ? "pause" : "play"} size={16} color={fromMe ? palette.deepGreen : palette.white} />
      </View>
      <View style={styles.audioWave}>
        {Array.from({ length: 19 }, (_, index) => (
          <View key={index} style={[styles.audioWaveBar, { height: 7 + ((index * 7) % 12) }]} />
        ))}
        <Text style={styles.audioDuration}>{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}</Text>
      </View>
    </Pressable>
  );
}

export default function App() {
  const [chats, setChats] = useState(seedChats);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>(contacts);
  const [tab, setTab] = useState<Tab>("Chats");
  const [adminPasscodeConfigured, setAdminPasscodeConfigured] = useState<boolean | null>(null);
  const [dashboardUnlocked, setDashboardUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [adminPasscodeConfirmation, setAdminPasscodeConfirmation] = useState("");
  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [showGroupComposer, setShowGroupComposer] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>("all");
  const [chatActionId, setChatActionId] = useState<string | null>(null);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [messageAction, setMessageAction] = useState<{ chatId: string; messageId: string } | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showStatusComposer, setShowStatusComposer] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
  const [importedContactCount, setImportedContactCount] = useState(0);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  useEffect(() => {
    configureNotifications();
    void getNotificationPermission().then((granted) => {
      setNotificationPermission(granted);
    }).catch(() => {
      setNotificationPermission(false);
    });
  }, []);

  useEffect(() => {
    if (tab !== "Dashboard") {
      setDashboardUnlocked(false);
      setAdminPasscode("");
      setAdminPasscodeConfirmation("");
      setAdminPasscodeError(null);
      return;
    }

    let active = true;
    void getAdminPasscode()
      .then((savedPasscode) => {
        if (active) setAdminPasscodeConfigured(savedPasscode !== null);
      })
      .catch(() => {
        if (active) {
          setAdminPasscodeConfigured(false);
          setAdminPasscodeError("The dashboard password could not be loaded. Please try again.");
        }
      });
    return () => {
      active = false;
    };
  }, [tab]);

  const submitDashboardPasscode = async () => {
    if (adminPasscodeConfigured === null) return;
    if (adminPasscodeConfigured) {
      try {
        const savedPasscode = await getAdminPasscode();
        if (savedPasscode && savedPasscode === adminPasscode) {
          setDashboardUnlocked(true);
          setAdminPasscodeError(null);
          setAdminPasscode("");
        } else {
          setAdminPasscodeError("That password doesn't match. Try again.");
        }
      } catch {
        setAdminPasscodeError("The saved password could not be checked. Please try again.");
      }
      return;
    }

    if (adminPasscode.trim().length < 8) {
      setAdminPasscodeError("Choose a password with at least 8 characters.");
      return;
    }
    if (adminPasscode !== adminPasscodeConfirmation) {
      setAdminPasscodeError("The passwords don't match.");
      return;
    }
    try {
      await saveAdminPasscode(adminPasscode);
      setAdminPasscodeConfigured(true);
      setDashboardUnlocked(true);
      setAdminPasscode("");
      setAdminPasscodeConfirmation("");
      setAdminPasscodeError(null);
    } catch {
      setAdminPasscodeError("The password couldn't be saved securely on this device.");
    }
  };

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && active) {
          const parsed: unknown = JSON.parse(saved);
          if (isRecord(parsed)) {
            if (Array.isArray(parsed.chats) && parsed.chats.every(isChat)) {
              setChats(parsed.chats);
            } else {
              setStorageError("Saved conversations couldn't be read. Showing sample chats instead.");
            }
            if (Array.isArray(parsed.statuses) && parsed.statuses.every(isStatusUpdate)) {
              setStatuses(parsed.statuses);
            }
            if (Array.isArray(parsed.connectionEvents) && parsed.connectionEvents.every(isConnectionEvent)) {
              setConnectionEvents(parsed.connectionEvents);
            }
            if (typeof parsed.profilePhoto === "string" && parsed.profilePhoto.startsWith("data:image/")) {
              setProfilePhoto(parsed.profilePhoto);
            }
            if (Array.isArray(parsed.contacts) && parsed.contacts.every(isContact)) {
              const savedContacts = parsed.contacts.filter((savedContact) => !contacts.some((item) => item.id === savedContact.id));
              setAvailableContacts([...contacts, ...savedContacts]);
              setImportedContactCount(savedContacts.length);
            }
          } else {
            setStorageError("Saved conversations couldn't be read. Showing sample chats instead.");
          }
        }
      } catch {
        if (active) setStorageError("Local data couldn't be loaded. Changes may not be saved.");
      } finally {
        if (active) setStorageReady(true);
      }
    };
    void restore();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          chats,
          statuses,
          connectionEvents,
          profilePhoto,
          contacts: availableContacts.filter((contact) => contact.id.startsWith("device-")),
        }));
        setStorageError(null);
      } catch {
        setStorageError("BBchat couldn't save your latest changes on this device.");
      }
    };
    saveQueue.current = saveQueue.current.then(save, save);
  }, [chats, statuses, connectionEvents, profilePhoto, availableContacts, storageReady]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const visibleChats = useMemo(
    () =>
      chats
        .filter((chat) => {
          if (inboxFilter === "archived" ? !chat.archived : chat.archived) return false;
          if (inboxFilter === "unread" && chat.unread === 0) return false;
          if (inboxFilter === "groups" && !chat.isGroup) return false;
          if (inboxFilter === "starred" && !chat.messages.some((message) => message.starred)) return false;
          const query = search.trim().toLowerCase();
          return (
            !query ||
            chat.name.toLowerCase().includes(query) ||
            chat.preview.toLowerCase().includes(query) ||
            chat.messages.some((message) => message.text.toLowerCase().includes(query))
          );
        })
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [chats, search, inboxFilter],
  );

  const openChat = (id: string, name?: string, initials?: string, color?: string) => {
    const knownChat = chats.find((chat) => chat.id === id);
    const knownContact = availableContacts.find((contact) => contact.id === id);
    setConnectionEvents((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        chatId: id,
        chatName: name ?? knownChat?.name ?? knownContact?.name ?? "New chat",
        connectedAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setChats((current) => {
      const existing = current.find((chat) => chat.id === id);
      if (existing) {
        return current.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat));
      }
      const contact = availableContacts.find((item) => item.id === id);
      return [
        {
          id,
          name: name ?? contact?.name ?? "New chat",
          initials: initials ?? contact?.initials ?? "BB",
          color: color ?? contact?.color ?? "#C8DED5",
          preview: "Say hello 👋",
          time: "Now",
          unread: 0,
          online: true,
          messages: [],
        },
        ...current,
      ];
    });
    setShowContacts(false);
    setSearch("");
    setDraft("");
    setActiveChatId(id);
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeChatId) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const message: Message = {
      id: `${Date.now()}`,
      text,
      time,
      fromMe: true,
      replyTo: replyTo?.text,
    };
    setChats((current) =>
      current.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, message], preview: text, time: "Now" }
          : chat,
      ),
    );
    setDraft("");
    setReplyTo(null);
  };

  const createGroup = () => {
    const name = groupName.trim();
    if (!name || groupMembers.length === 0) return;
    const id = `group-${Date.now()}`;
    const members = availableContacts.filter((contact) => groupMembers.includes(contact.id));
    setChats((current) => [
      {
        id,
        name,
        initials: name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join(""),
        color: "#C9EACB",
        preview: `Group created · ${members.length + 1} members`,
        time: "Now",
        unread: 0,
        online: false,
        isGroup: true,
        members: groupMembers,
        messages: [{ id: `${Date.now()}-welcome`, text: `Welcome to ${name}! 👋`, time: "Now", fromMe: true }],
      },
      ...current,
    ]);
    setGroupName("");
    setGroupMembers([]);
    setShowGroupComposer(false);
    setActiveChatId(id);
    setInboxFilter("all");
    setTab("Chats");
  };

  const updateChat = (chatId: string, updates: Partial<Chat>) =>
    setChats((current) => current.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)));

  const handleChatAction = (action: "pin" | "archive" | "unread" | "mute" | "delete") => {
    const chat = chats.find((item) => item.id === chatActionId);
    if (!chat) return;
    if (action === "delete") {
      setChatActionId(null);
      setDeleteChatId(chat.id);
      return;
    } else if (action === "pin") {
      updateChat(chat.id, { pinned: !chat.pinned });
    } else if (action === "archive") {
      updateChat(chat.id, { archived: !chat.archived });
    } else if (action === "unread") {
      updateChat(chat.id, { unread: chat.unread > 0 ? 0 : 1 });
    } else {
      updateChat(chat.id, { muted: !chat.muted });
    }
    setChatActionId(null);
  };

  const handleMessageAction = (action: "reply" | "react" | "star" | "delete") => {
    if (!messageAction) return;
    const { chatId, messageId } = messageAction;
    const chat = chats.find((item) => item.id === chatId);
    const message = chat?.messages.find((item) => item.id === messageId);
    if (message && action === "reply") {
      setReplyTo(message);
      setActiveChatId(chatId);
    } else if (message && action === "react") {
      const reactions = message.reactions ?? [];
      const next = reactions.includes("❤️") ? reactions.filter((item) => item !== "❤️") : [...reactions, "❤️"];
      setChats((current) =>
        current.map((item) =>
          item.id === chatId
            ? { ...item, messages: item.messages.map((entry) => (entry.id === messageId ? { ...entry, reactions: next } : entry)) }
            : item,
        ),
      );
    } else if (message && action === "star") {
      setChats((current) =>
        current.map((item) =>
          item.id === chatId ? {
            ...item,
            messages: item.messages.map((entry) => entry.id === messageId ? { ...entry, starred: !entry.starred } : entry),
          } : item,
        ),
      );
    } else if (message?.fromMe) {
      setChats((current) =>
        current.map((item) =>
          item.id === chatId
            ? { ...item, messages: item.messages.filter((entry) => entry.id !== messageId) }
            : item,
        ),
      );
    }
    setMessageAction(null);
  };

  const sendPhoto = async (useCamera: boolean) => {
    setShowAttachmentOptions(false);
    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.85 });
      if (result.canceled || !activeChatId) return;
      const photo = result.assets[0];
      if (!photo?.uri) return;
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const message: Message = {
        id: `${Date.now()}`,
        text: draft.trim() || "Photo",
        time,
        fromMe: true,
        attachmentUri: photo.uri,
        replyTo: replyTo?.text,
      };
      setChats((current) =>
        current.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, message], preview: "📷 Photo", time: "Now" }
            : chat,
        ),
      );
      setDraft("");
      setReplyTo(null);
    } catch {
      Alert.alert("Photo unavailable", "BBchat couldn't open your camera or photo library. Check the device permissions and try again.");
    }
  };

  const toggleVoiceRecording = async () => {
    try {
      if (recorderState.isRecording) {
        const duration = Math.max(1, Math.round(recorder.currentTime));
        await recorder.stop();
        const uri = recorder.uri;
        await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
        if (!uri || !activeChatId) return;
        const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        const message: Message = { id: `${Date.now()}`, text: "Voice message", time, fromMe: true, audioUri: uri };
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: [...chat.messages, message], preview: `🎤 Voice message · ${duration}s`, time: "Now" }
              : chat,
          ),
        );
        return;
      }
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone permission needed", "Allow microphone access to record a voice message.");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      Alert.alert("Voice message unavailable", "BBchat couldn't record or save this voice message. Check the microphone permission and try again.");
    }
  };

  const createStatus = () => {
    const text = statusDraft.trim();
    if (!text) return;
    setStatuses((current) => [
      { id: `status-${Date.now()}`, name: "You", initials: "B", color: "#C9EACB", text, time: "Just now" },
      ...current,
    ]);
    setStatusDraft("");
    setShowStatusComposer(false);
    setTab("Updates");
  };

  const createPhotoStatus = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.85 });
      if (result.canceled || !result.assets[0]?.uri) return;
      setStatuses((current) => [
        {
          id: `status-${Date.now()}`,
          name: "You",
          initials: "B",
          color: "#C9EACB",
          text: "Photo update",
          time: "Just now",
          attachmentUri: result.assets[0].uri,
        },
        ...current,
      ]);
      setTab("Updates");
    } catch {
      Alert.alert("Photo unavailable", "BBchat couldn't open your photo library. Check the device permissions and try again.");
    }
  };

  const importDeviceContacts = async () => {
    try {
      if (!(await Contacts.isAvailableAsync())) {
        Alert.alert("Contacts unavailable", "Device contacts can only be imported from the iOS or Android app.");
        return;
      }
      const permission = await Contacts.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Contacts permission needed", "Allow contacts access to choose people to start a chat with.");
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });
      const imported = data
        .filter((contact) => Boolean(contact.firstName || contact.lastName || contact.name))
        .map((contact, index) => {
          const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim() || contact.name || "New contact";
          return {
            id: `device-${contact.id}`,
            name,
            initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""),
            color: ["#D8C8EE", "#C3D0EE", "#E9D1A8", "#B7D9D0"][index % 4],
            phoneNumber: contact.phoneNumbers?.[0]?.number,
          };
        })
        .filter((contact) => contact.phoneNumber);
      setAvailableContacts((current) => {
        const existing = new Set(current.map((contact) => contact.id));
        return [...current, ...imported.filter((contact) => !existing.has(contact.id))];
      });
      setImportedContactCount(imported.length);
      if (imported.length === 0) {
        Alert.alert("No phone contacts found", "Your address book has no contacts with phone numbers to start chats with.");
      }
    } catch {
      Alert.alert("Contacts unavailable", "BBchat couldn't read contacts from this device. Check the contacts permission and try again.");
    }
  };

  const enableNotifications = async () => {
    try {
      if (Platform.OS === "web") {
        Alert.alert("Device notifications", "Local notifications are available in the iOS and Android app. Web push requires a service worker and notification server.");
        return;
      }
      const granted = await requestNotificationPermission();
      setNotificationPermission(granted);
      if (!granted) {
        Alert.alert("Notifications are off", "Allow notifications in your device settings to receive BBchat alerts.");
      }
    } catch {
      setNotificationPermission(false);
      Alert.alert("Notifications unavailable", "BBchat couldn't configure notifications on this device.");
    }
  };

  const sendTestNotification = async () => {
    try {
      if (!notificationPermission) {
        await enableNotifications();
        return;
      }
      await scheduleTestNotification();
      Alert.alert("Test notification sent", "BBchat sent a local notification to this device.");
    } catch {
      Alert.alert("Notification unavailable", "BBchat couldn't send a test notification. Check device notification settings.");
    }
  };

  const sendLocation = async () => {
    if (!activeChatId) return;
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Location permission needed", "Allow location access to share your current location in this conversation.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const message: Message = { id: `${Date.now()}`, text: "📍 My current location · Open map", time, fromMe: true, locationUri: mapUrl };
      setChats((current) =>
        current.map((chat) =>
          chat.id === activeChatId ? { ...chat, messages: [...chat.messages, message], preview: "📍 Location", time: "Now" } : chat,
        ),
      );
      setShowAttachmentOptions(false);
    } catch {
      Alert.alert("Location unavailable", "BBchat couldn't get your current location. Check device location settings and try again.");
    }
  };

  const sendDocument = async () => {
    setShowAttachmentOptions(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false });
      if (result.canceled || !activeChatId) return;
      const file = result.assets[0];
      if (!file) return;
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const message: Message = {
        id: `${Date.now()}`,
        text: `📎 ${file.name}`,
        time,
        fromMe: true,
        attachmentUri: file.uri,
        fileName: file.name,
        fileMimeType: file.mimeType,
      };
      setChats((current) =>
        current.map((chat) =>
          chat.id === activeChatId ? { ...chat, messages: [...chat.messages, message], preview: `📎 ${file.name}`, time: "Now" } : chat,
        ),
      );
      setShowAttachmentOptions(false);
    } catch {
      Alert.alert("File unavailable", "BBchat couldn't open this file. Check file access and try again.");
    }
  };

  const shareFile = async (uri: string, mimeType?: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing unavailable", "File sharing isn't supported in this browser. Open the chat on a mobile device to share this file.");
        return;
      }
      await Sharing.shareAsync(uri, { mimeType, dialogTitle: "Share BBchat attachment" });
    } catch {
      Alert.alert("Couldn't share file", "BBchat couldn't open the system share sheet for this attachment.");
    }
  };

  const handleMessageShare = async (action: "copy" | "share") => {
    if (!messageAction) return;
    const message = chats.find((chat) => chat.id === messageAction.chatId)?.messages.find((item) => item.id === messageAction.messageId);
    if (!message) return;
    try {
      if (action === "copy") {
        await Clipboard.setStringAsync(message.text);
        Alert.alert("Copied", "Message copied to clipboard.");
      } else {
        await Share.share({ message: message.text });
      }
    } catch {
      Alert.alert(action === "copy" ? "Couldn't copy message" : "Couldn't share message", "Please try again.");
    } finally {
      setMessageAction(null);
    }
  };

  const showCallNotice = (kind: string) =>
    Alert.alert(`${kind} call`, "Live calling requires a call-signaling and media backend. The call UI can be connected when that service is added.");

  const pickProfilePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert("Photo unavailable", "BBchat couldn't save this photo. Please choose another image.");
        return;
      }
      setProfilePhoto(`data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`);
    } catch {
      Alert.alert("Couldn't choose a photo", "BBchat couldn't open your photo library. Please check photo access and try again.");
    }
  };

  const openMetaAI = async () => {
    try {
      await Linking.openURL("https://www.meta.ai/");
    } catch {
      Alert.alert("Meta AI unavailable", "BBchat couldn't open Meta AI. Try again or open meta.ai in your browser.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        {activeChat ? (
          <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
          >
            <LogoPattern />
            <View style={styles.chatHeader}>
              <Pressable onPress={() => setActiveChatId(null)} hitSlop={12} style={styles.backButton} disabled={recorderState.isRecording}>
                <Ionicons name="arrow-back" size={23} color={palette.ink} />
              </Pressable>
              <Avatar initials={activeChat.initials} color={activeChat.color} size={42} online={activeChat.online} />
              <View style={styles.chatHeaderText}>
                <Text style={styles.chatHeaderName}>{activeChat.name}</Text>
                <Text style={styles.chatHeaderStatus}>
                  {activeChat.isGroup
                    ? `${(activeChat.members?.length ?? 0) + 1} members`
                    : activeChat.online
                      ? "online"
                      : "tap here for contact info"}
                </Text>
              </View>
              <Pressable onPress={() => showCallNotice("Video")} style={styles.headerAction} hitSlop={8}>
                <Ionicons name="videocam-outline" size={23} color={palette.deepGreen} />
              </Pressable>
              <Pressable onPress={() => showCallNotice("Voice")} style={styles.headerAction} hitSlop={8}>
                <Ionicons name="call-outline" size={21} color={palette.deepGreen} />
              </Pressable>
            </View>
            {storageError && (
              <Pressable onPress={() => setStorageError(null)} style={styles.storageNotice}>
                <Ionicons name="alert-circle-outline" size={16} color="#8F5A00" />
                <Text style={styles.storageNoticeText}>{storageError}</Text>
                <Ionicons name="close" size={15} color="#8F5A00" />
              </Pressable>
            )}
            <ScrollView
              style={styles.messageScroll}
              contentContainerStyle={styles.messageList}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.encryptionNote}>
                <Ionicons name="chatbubble-ellipses-outline" size={12} color="#8A9B92" />
                <Text style={styles.encryptionText}>A little space for a good conversation.</Text>
              </View>
              {activeChat.messages.map((message) => (
                <Pressable
                  key={message.id}
                  style={[styles.messageBubble, message.fromMe ? styles.myMessage : styles.theirMessage]}
                  onLongPress={() => setMessageAction({ chatId: activeChat.id, messageId: message.id })}
                  onPress={() =>
                    setChats((current) =>
                      current.map((chat) =>
                        chat.id === activeChat.id
                          ? {
                              ...chat,
                              messages: chat.messages.map((item) =>
                                item.id === message.id
                                  ? {
                                      ...item,
                                      reactions: item.reactions?.includes("❤️")
                                        ? item.reactions.filter((reaction) => reaction !== "❤️")
                                        : [...(item.reactions ?? []), "❤️"],
                                    }
                                  : item,
                              ),
                            }
                          : chat,
                      ),
                    )
                  }
                >
                  {message.replyTo && (
                    <View style={styles.replyPreview}>
                      <Text style={styles.replyPreviewText} numberOfLines={2}>{message.replyTo}</Text>
                    </View>
                  )}
                  {message.attachmentUri && (
                    message.fileName ? (
                      <Pressable
                        style={styles.documentAttachment}
                        onPress={(event) => {
                          event.stopPropagation();
                          void shareFile(message.attachmentUri!, message.fileMimeType);
                        }}
                      >
                        <View style={styles.documentIcon}><Ionicons name="document-text" size={20} color={palette.deepGreen} /></View>
                        <View style={styles.documentCopy}><Text style={styles.documentName} numberOfLines={2}>{message.fileName}</Text><Text style={styles.documentHint}>Tap to share file</Text></View>
                        <Ionicons name="share-outline" size={18} color={palette.deepGreen} />
                      </Pressable>
                    ) : (
                      <Image source={{ uri: message.attachmentUri }} resizeMode="cover" style={styles.messageImage} />
                    )
                  )}
                  {message.audioUri && <AudioNote uri={message.audioUri} fromMe={message.fromMe} />}
                  {!message.audioUri && !message.fileName && message.locationUri && (
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        void Linking.openURL(message.locationUri!);
                      }}
                    >
                      <Text style={[styles.messageText, styles.locationLink]}>{message.text}</Text>
                    </Pressable>
                  )}
                  {!message.audioUri && !message.fileName && !message.locationUri && message.text !== "Photo" && <Text style={styles.messageText}>{message.text}</Text>}
                  <Text style={styles.messageTime}>{message.time}{message.fromMe ? "  ✓✓" : ""}</Text>
                  {Boolean(message.reactions?.length) && (
                    <View style={styles.reactionRow}>
                      {message.reactions?.map((reaction) => <Text key={reaction} style={styles.reactionChip}>{reaction}</Text>)}
                    </View>
                  )}
                      {message.starred && (
                        <View style={styles.starredIndicator}>
                          <Ionicons name="star" size={10} color={palette.amber} />
                          <Text style={styles.starredIndicatorText}>Starred</Text>
                        </View>
                      )}
                </Pressable>
              ))}
            </ScrollView>
            {replyTo && (
              <View style={styles.replyComposer}>
                <View style={styles.replyComposerCopy}>
                  <Text style={styles.replyComposerTitle}>Replying to</Text>
                  <Text style={styles.replyComposerText} numberOfLines={1}>{replyTo.text}</Text>
                </View>
                <Pressable onPress={() => setReplyTo(null)} accessibilityLabel="Cancel reply">
                  <Ionicons name="close-circle" size={22} color={palette.muted} />
                </Pressable>
              </View>
            )}
            <View style={styles.composer}>
              <Pressable
                style={styles.attachButton}
                onPress={() => setShowAttachmentOptions(true)}
              >
                <Ionicons name="add" size={28} color="#778780" />
              </Pressable>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Message"
                placeholderTextColor="#A0AAA5"
                style={styles.messageInput}
                multiline
                returnKeyType="default"
              />
              {draft.trim() ? (
                <Pressable style={styles.sendButton} onPress={sendMessage} accessibilityLabel="Send message">
                  <Ionicons name="arrow-up" size={21} color={palette.white} />
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.micButton, recorderState.isRecording && styles.recordingButton]}
                  onPress={() => void toggleVoiceRecording()}
                  accessibilityLabel={recorderState.isRecording ? "Stop recording voice message" : "Record voice message"}
                >
                  <Ionicons name={recorderState.isRecording ? "stop" : "mic"} size={21} color={palette.white} />
                </Pressable>
              )}
            </View>
            {recorderState.isRecording && (
              <View style={styles.recordingStatus}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording voice message · {Math.floor(recorderState.durationMillis / 1000)}s</Text>
                <Text style={styles.recordingHint}>Tap stop to send</Text>
              </View>
            )}
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.screen}>
            <LogoPattern />
            <View style={styles.topBar}>
              <View style={styles.brand}>
                <BrandMark />
                <Text style={styles.brandName}>BBchat</Text>
              </View>
              <View style={styles.topActions}>
                <Pressable
                  style={styles.topAction}
                  onPress={() => void openMetaAI()}
                  accessibilityLabel="Open Meta AI"
                >
                  <Ionicons name="sparkles-outline" size={21} color={palette.deepGreen} />
                </Pressable>
                <Pressable
                  style={styles.topAction}
                  onPress={() => void createPhotoStatus()}
                  accessibilityLabel="Share a photo status"
                >
                  <Ionicons name="camera-outline" size={22} color={palette.ink} />
                </Pressable>
                <Pressable style={styles.topAction} onPress={() => setShowContacts(true)}>
                  <Ionicons name="create-outline" size={23} color={palette.ink} />
                </Pressable>
                <Pressable
                  style={styles.profileAvatar}
                  onPress={() => setShowProfile(true)}
                  accessibilityLabel="Open your profile"
                >
                  {profilePhoto
                    ? <Image source={{ uri: profilePhoto }} resizeMode="cover" style={styles.profileAvatarImage} />
                    : <Text style={styles.profileInitials}>B</Text>}
                </Pressable>
              </View>
            </View>
            {storageError && (
              <Pressable onPress={() => setStorageError(null)} style={styles.storageNotice}>
                <Ionicons name="alert-circle-outline" size={16} color="#8F5A00" />
                <Text style={styles.storageNoticeText}>{storageError}</Text>
                <Ionicons name="close" size={15} color="#8F5A00" />
              </Pressable>
            )}
            {tab === "Chats" ? (
              <>
                <View style={styles.welcomeBlock}>
                  <View style={styles.welcomeCard}>
                    <View style={styles.welcomeCopy}>
                      <View style={styles.welcomeEyebrow}>
                        <View style={styles.welcomeEyebrowDot} />
                        <Text style={styles.welcomeEyebrowText}>YOUR SPACE, YOUR PEOPLE</Text>
                      </View>
                      <Text style={styles.welcomeTitle}>Your people,{"\n"}right here.</Text>
                      <Text style={styles.welcomeSubtitle}>Good conversations, a little closer.</Text>
                    </View>
                    <View style={styles.welcomeArt}>
                      <View style={styles.welcomeOrb} />
                      <View style={styles.welcomeLogoBadge}>
                        <Image source={require("./assets/benbax-logo.png")} resizeMode="contain" style={styles.welcomeLogo} />
                      </View>
                      <View style={styles.welcomeBubble}>
                        <Ionicons name="chatbubble-ellipses" size={28} color={palette.deepGreen} />
                      </View>
                      <View style={styles.welcomeBubbleAccent}>
                        <Ionicons name="heart" size={17} color={palette.deepGreen} />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={19} color="#82918B" />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search conversations"
                    placeholderTextColor="#94A09A"
                    style={styles.searchInput}
                    clearButtonMode="while-editing"
                  />
                </View>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>
                    {search ? "SEARCH RESULTS" : inboxFilter === "archived" ? "ARCHIVED CHATS" : inboxFilter === "unread" ? "UNREAD CHATS" : inboxFilter === "groups" ? "GROUP CHATS" : inboxFilter === "starred" ? "STARRED MESSAGES" : "RECENT CHATS"}
                  </Text>
                  {inboxFilter !== "all" && (
                    <Pressable onPress={() => setInboxFilter("all")}>
                      <Text style={styles.seeAll}>Clear filter</Text>
                    </Pressable>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
                  {([
                    { id: "all", label: "All" },
                    { id: "unread", label: "Unread" },
                    { id: "groups", label: "Groups" },
                    { id: "starred", label: "Starred" },
                    { id: "archived", label: "Archived" },
                  ] as const).map((filter) => (
                    <Pressable
                      key={filter.id}
                      style={[styles.filterChip, inboxFilter === filter.id && styles.activeFilterChip]}
                      onPress={() => setInboxFilter(filter.id)}
                    >
                      <Text style={[styles.filterChipText, inboxFilter === filter.id && styles.activeFilterText]}>{filter.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <ScrollView contentContainerStyle={styles.chatList} keyboardShouldPersistTaps="handled">
                  {visibleChats.length ? (
                    visibleChats.map((chat) => (
                      <Pressable
                        key={chat.id}
                        style={styles.chatRow}
                        onPress={() => openChat(chat.id)}
                        onLongPress={() => setChatActionId(chat.id)}
                      >
                        <Avatar initials={chat.initials} color={chat.color} online={chat.online} />
                        <View style={styles.chatSummary}>
                          <View style={styles.chatTitleRow}>
                            <View style={styles.chatNameLine}>
                              <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                              {chat.pinned && <Ionicons name="pin" size={12} color={palette.green} />}
                              {chat.muted && <Ionicons name="volume-mute" size={13} color={palette.muted} />}
                            </View>
                            <Text style={[styles.chatTime, chat.unread > 0 && styles.chatTimeUnread]}>{chat.time}</Text>
                          </View>
                          <View style={styles.previewRow}>
                            <Text style={styles.chatPreview} numberOfLines={1}>
                              {chat.preview}
                            </Text>
                            {chat.unread > 0 && (
                              <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{chat.unread}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <Pressable
                          style={styles.chatMore}
                          onPress={(event) => {
                            event.stopPropagation();
                            setChatActionId(chat.id);
                          }}
                          accessibilityLabel={`Options for ${chat.name}`}
                        >
                          <Ionicons name="ellipsis-vertical" size={18} color="#929E98" />
                        </Pressable>
                      </Pressable>
                    ))
                  ) : (
                    <View style={styles.emptySearch}>
                      <Ionicons name="chatbubble-ellipses-outline" size={28} color="#A1B0A9" />
                      <Text style={styles.emptyText}>No conversations found</Text>
                    </View>
                  )}
                </ScrollView>
              </>
            ) : tab === "Dashboard" ? (
              dashboardUnlocked ? (
                <ConnectionDashboard events={connectionEvents} />
              ) : (
                <DashboardPasscodeGate
                  configured={adminPasscodeConfigured}
                  passcode={adminPasscode}
                  confirmation={adminPasscodeConfirmation}
                  error={adminPasscodeError}
                  onChangePasscode={setAdminPasscode}
                  onChangeConfirmation={setAdminPasscodeConfirmation}
                  onSubmit={() => void submitDashboardPasscode()}
                />
              )
            ) : (
              <TabContent
                tab={tab}
                onStartChat={() => setShowContacts(true)}
                onCreateGroup={() => setShowGroupComposer(true)}
                onCreateStatus={() => setShowStatusComposer(true)}
                onCreatePhotoStatus={() => void createPhotoStatus()}
                onOpenChat={(id) => {
                  openChat(id);
                  setTab("Chats");
                }}
                statuses={statuses}
                connectionEvents={connectionEvents}
              />
            )}
            <View style={styles.tabBar}>
              {([
                { name: "Chats" as const, icon: "chatbubbles" as const },
                { name: "Updates" as const, icon: "aperture" as const },
                { name: "Communities" as const, icon: "people" as const },
                { name: "Dashboard" as const, icon: "stats-chart" as const },
                { name: "Calls" as const, icon: "call" as const },
              ]).map((item) => {
                const selected = tab === item.name;
                return (
                  <Pressable
                    key={item.name}
                    style={styles.tabItem}
                    onPress={() => {
                      setTab(item.name);
                      setSearch("");
                    }}
                  >
                    <View style={[styles.tabIconWrap, selected && styles.selectedTabIcon]}>
                      <Ionicons name={item.icon} size={20} color={selected ? palette.green : "#95A19B"} />
                      {item.name === "Chats" && !selected && <View style={styles.tabDot} />}
                    </View>
                    <Text style={[styles.tabLabel, selected && styles.selectedTabLabel]}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
        <Modal visible={showContacts} animationType="slide" transparent onRequestClose={() => setShowContacts(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.contactSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Start a conversation</Text>
                  <Text style={styles.sheetSubtitle}>Pick someone to say hello to</Text>
                </View>
                <Pressable onPress={() => setShowContacts(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={21} color={palette.ink} />
                </Pressable>
              </View>
              <ScrollView>
                {availableContacts.map((contact) => (
                  <Pressable
                    key={contact.id}
                    style={styles.contactRow}
                    onPress={() => openChat(contact.id, contact.name, contact.initials, contact.color)}
                  >
                    <Avatar initials={contact.initials} color={contact.color} size={48} online />
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#A2ADA8" />
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.importContactsAction} onPress={() => void importDeviceContacts()}>
                <Ionicons name="phone-portrait-outline" size={18} color={palette.deepGreen} />
                <Text style={styles.importContactsText}>
                  {importedContactCount ? `Refresh device contacts · ${importedContactCount} found` : "Import device contacts"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={palette.muted} />
              </Pressable>
              <Pressable
                style={styles.createGroupButton}
                onPress={() => {
                  setShowContacts(false);
                  setShowGroupComposer(true);
                }}
              >
                <Ionicons name="people" size={18} color={palette.white} />
                <Text style={styles.createGroupButtonText}>Create a group</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={showGroupComposer} animationType="slide" transparent onRequestClose={() => setShowGroupComposer(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.contactSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Create a group</Text>
                  <Text style={styles.sheetSubtitle}>Name your group and invite people</Text>
                </View>
                <Pressable onPress={() => setShowGroupComposer(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={21} color={palette.ink} />
                </Pressable>
              </View>
              <TextInput value={groupName} onChangeText={setGroupName} placeholder="Group name" placeholderTextColor="#94A09A" style={styles.groupNameInput} maxLength={40} />
              <Text style={styles.groupInviteHeading}>ADD MEMBERS</Text>
              <ScrollView style={styles.groupContacts}>
                {availableContacts.map((contact) => {
                  const selected = groupMembers.includes(contact.id);
                  return (
                    <Pressable
                      key={contact.id}
                      style={styles.contactRow}
                      onPress={() => setGroupMembers((current) => selected ? current.filter((id) => id !== contact.id) : [...current, contact.id])}
                    >
                      <Avatar initials={contact.initials} color={contact.color} size={44} />
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Ionicons name={selected ? "checkbox" : "square-outline"} size={21} color={selected ? palette.deepGreen : "#A2ADA8"} />
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Pressable
                style={[styles.createGroupButton, (!groupName.trim() || groupMembers.length === 0) && styles.disabledAction]}
                disabled={!groupName.trim() || groupMembers.length === 0}
                onPress={createGroup}
              >
                <Text style={styles.createGroupButtonText}>Create group · {groupMembers.length} selected</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={showAttachmentOptions} animationType="fade" transparent onRequestClose={() => setShowAttachmentOptions(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.actionSheet}>
              <Text style={styles.sheetTitle}>Share a photo</Text>
              <Text style={styles.sheetSubtitle}>Send a picture in this conversation</Text>
              <Pressable style={styles.actionRow} onPress={() => void sendPhoto(false)}>
                <Ionicons name="images" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Choose from library</Text>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => void sendPhoto(true)}>
                <Ionicons name="camera" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Take a photo</Text>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => void sendDocument()}>
                <Ionicons name="document-attach-outline" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Share a document</Text>
              </Pressable>
              <Pressable style={styles.actionRow} onPress={() => void sendLocation()}>
                <Ionicons name="location-outline" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Share current location</Text>
              </Pressable>
              <Pressable style={styles.cancelAction} onPress={() => setShowAttachmentOptions(false)}><Text style={styles.cancelActionText}>Cancel</Text></Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={chatActionId !== null} animationType="fade" transparent onRequestClose={() => setChatActionId(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.actionSheet}>
              {(() => {
                const selectedChat = chats.find((chat) => chat.id === chatActionId);
                if (!selectedChat) return null;
                return (
                  <>
                    <Text style={styles.sheetTitle}>{selectedChat.name}</Text>
                    <Text style={styles.sheetSubtitle}>Conversation options</Text>
                    <Pressable style={styles.actionRow} onPress={() => handleChatAction("pin")}>
                      <Ionicons name={selectedChat.pinned ? "pin-outline" : "pin"} size={20} color={palette.deepGreen} />
                      <Text style={styles.actionText}>{selectedChat.pinned ? "Unpin chat" : "Pin chat"}</Text>
                    </Pressable>
                    <Pressable style={styles.actionRow} onPress={() => handleChatAction("archive")}>
                      <Ionicons name={selectedChat.archived ? "archive-outline" : "archive"} size={20} color={palette.deepGreen} />
                      <Text style={styles.actionText}>{selectedChat.archived ? "Move to inbox" : "Archive chat"}</Text>
                    </Pressable>
                    <Pressable style={styles.actionRow} onPress={() => handleChatAction("unread")}>
                      <Ionicons name="mail-unread-outline" size={20} color={palette.deepGreen} />
                      <Text style={styles.actionText}>{selectedChat.unread ? "Mark as read" : "Mark as unread"}</Text>
                    </Pressable>
                    <Pressable style={styles.actionRow} onPress={() => handleChatAction("mute")}>
                      <Ionicons name={selectedChat.muted ? "volume-high-outline" : "volume-mute-outline"} size={20} color={palette.deepGreen} />
                      <Text style={styles.actionText}>{selectedChat.muted ? "Unmute notifications" : "Mute notifications"}</Text>
                    </Pressable>
                    <Pressable style={styles.actionRow} onPress={() => handleChatAction("delete")}>
                      <Ionicons name="trash-outline" size={20} color="#B83232" />
                      <Text style={[styles.actionText, styles.destructiveText]}>Delete conversation</Text>
                    </Pressable>
                  </>
                );
              })()}
              <Pressable style={styles.cancelAction} onPress={() => setChatActionId(null)}><Text style={styles.cancelActionText}>Cancel</Text></Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={deleteChatId !== null} animationType="fade" transparent onRequestClose={() => setDeleteChatId(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.actionSheet}>
              <Text style={styles.sheetTitle}>Delete this conversation?</Text>
              <Text style={styles.sheetSubtitle}>Its messages will be removed from this device and can't be recovered.</Text>
              <Pressable
                style={styles.deleteConfirmButton}
                onPress={() => {
                  if (deleteChatId) {
                    setChats((current) => current.filter((chat) => chat.id !== deleteChatId));
                    if (activeChatId === deleteChatId) setActiveChatId(null);
                  }
                  setDeleteChatId(null);
                }}
              >
                <Text style={styles.deleteConfirmText}>Delete conversation</Text>
              </Pressable>
              <Pressable style={styles.cancelAction} onPress={() => setDeleteChatId(null)}><Text style={styles.cancelActionText}>Keep conversation</Text></Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={messageAction !== null} animationType="fade" transparent onRequestClose={() => setMessageAction(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.actionSheet}>
              <Text style={styles.sheetTitle}>Message options</Text>
              <View style={styles.quickReactions}>
                {["❤️", "😂", "👍", "😮", "🙏"].map((emoji) => (
                  <Pressable
                    key={emoji}
                    style={styles.quickReaction}
                    onPress={() => {
                      if (messageAction) {
                        const { chatId, messageId } = messageAction;
                        setChats((current) => current.map((chat) => chat.id === chatId ? {
                          ...chat,
                          messages: chat.messages.map((message) => message.id === messageId ? {
                            ...message,
                            reactions: [...(message.reactions ?? []).filter((item) => item !== emoji), emoji],
                          } : message),
                        } : chat));
                      }
                      setMessageAction(null);
                    }}
                  >
                    <Text style={styles.quickReactionText}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.actionRow} onPress={() => handleMessageAction("reply")}><Ionicons name="return-up-back" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Reply</Text></Pressable>
              <Pressable style={styles.actionRow} onPress={() => void handleMessageShare("copy")}><Ionicons name="copy-outline" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Copy text</Text></Pressable>
              <Pressable style={styles.actionRow} onPress={() => void handleMessageShare("share")}><Ionicons name="share-outline" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Share</Text></Pressable>
              <Pressable style={styles.actionRow} onPress={() => handleMessageAction("star")}><Ionicons name="star-outline" size={20} color={palette.deepGreen} /><Text style={styles.actionText}>Star / unstar</Text></Pressable>
              {messageAction && chats.find((chat) => chat.id === messageAction.chatId)?.messages.find((message) => message.id === messageAction.messageId)?.fromMe && (
                <Pressable style={styles.actionRow} onPress={() => handleMessageAction("delete")}><Ionicons name="trash-outline" size={20} color="#B83232" /><Text style={[styles.actionText, styles.destructiveText]}>Delete message</Text></Pressable>
              )}
              <Pressable style={styles.cancelAction} onPress={() => setMessageAction(null)}><Text style={styles.cancelActionText}>Cancel</Text></Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={showStatusComposer} animationType="slide" transparent onRequestClose={() => setShowStatusComposer(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.actionSheet}>
              <View style={styles.sheetHeader}>
                <View><Text style={styles.sheetTitle}>Share a status</Text><Text style={styles.sheetSubtitle}>Let your people know what’s up</Text></View>
                <Pressable onPress={() => setShowStatusComposer(false)} style={styles.closeButton}><Ionicons name="close" size={21} color={palette.ink} /></Pressable>
              </View>
              <TextInput value={statusDraft} onChangeText={setStatusDraft} placeholder="Write a quick update…" placeholderTextColor="#94A09A" style={styles.statusInput} multiline maxLength={240} />
              <Text style={styles.statusCounter}>{statusDraft.length}/240</Text>
              <Pressable style={[styles.createGroupButton, !statusDraft.trim() && styles.disabledAction]} disabled={!statusDraft.trim()} onPress={createStatus}><Text style={styles.createGroupButtonText}>Share status</Text></Pressable>
            </View>
          </View>
        </Modal>
        <Modal visible={showProfile} animationType="slide" transparent onRequestClose={() => setShowProfile(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.profileSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.profileHeader}>
                <Pressable style={styles.profilePictureButton} onPress={() => void pickProfilePhoto()} accessibilityLabel="Choose profile picture">
                  <View style={styles.profilePicture}>
                    {profilePhoto
                      ? <Image source={{ uri: profilePhoto }} resizeMode="cover" style={styles.profilePictureImage} />
                      : <Text style={styles.profilePictureInitial}>B</Text>}
                  </View>
                  <View style={styles.profileCameraBadge}><Ionicons name="camera" size={13} color={palette.white} /></View>
                </Pressable>
                <View style={styles.profileHeaderCopy}>
                  <Text style={styles.sheetTitle}>Your BBchat</Text>
                  <Text style={styles.sheetSubtitle}>This device · local profile</Text>
                  <Pressable onPress={() => void pickProfilePhoto()} accessibilityLabel="Change profile picture">
                    <Text style={styles.profilePhotoAction}>{profilePhoto ? "Change profile picture" : "Add a profile picture"}</Text>
                  </Pressable>
                </View>
                {profilePhoto && (
                  <Pressable onPress={() => setProfilePhoto(null)} accessibilityLabel="Remove profile picture" style={styles.removeProfilePhoto}>
                    <Ionicons name="trash-outline" size={18} color="#B83232" />
                  </Pressable>
                )}
              </View>
              <View style={styles.profileInfoRow}><Ionicons name="shield-checkmark-outline" size={20} color={palette.deepGreen} /><Text style={styles.profileInfoText}>Your chats are stored on this device. No account is connected.</Text></View>
              <Pressable style={styles.profileInfoRow} onPress={() => void enableNotifications()}>
                <Ionicons name="notifications-outline" size={20} color={palette.deepGreen} />
                <View style={styles.profileActionCopy}>
                  <Text style={styles.profileInfoText}>Device notifications</Text>
                  <Text style={styles.profileActionDetail}>{notificationPermission ? "Enabled on this device" : "Tap to request notification permission"}</Text>
                </View>
                <Ionicons name="chevron-forward" size={17} color={palette.muted} />
              </Pressable>
              {notificationPermission && (
                <Pressable style={styles.notificationTestButton} onPress={() => void sendTestNotification()}>
                  <Text style={styles.notificationTestText}>Send test notification</Text>
                </Pressable>
              )}
              <View style={styles.profileInfoRow}><Ionicons name="cloud-offline-outline" size={20} color={palette.deepGreen} /><Text style={styles.profileInfoText}>Remote push and message sync need a server and push credentials.</Text></View>
              <Pressable style={styles.cancelAction} onPress={() => setShowProfile(false)}><Text style={styles.cancelActionText}>Close</Text></Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabContent({
  tab,
  onStartChat,
  onCreateGroup,
  onCreateStatus,
  onCreatePhotoStatus,
  onOpenChat,
  statuses,
  connectionEvents,
}: {
  tab: Exclude<Tab, "Chats">;
  onStartChat: () => void;
  onCreateGroup: () => void;
  onCreateStatus: () => void;
  onCreatePhotoStatus: () => void;
  onOpenChat: (chatId: string) => void;
  statuses: StatusUpdate[];
  connectionEvents: ConnectionEvent[];
}) {
  if (tab === "Dashboard") {
    return <ConnectionDashboard events={connectionEvents} />;
  }
  if (tab === "Updates") {
    return (
      <View style={styles.secondaryPage}>
        <Text style={styles.pageTitle}>Little life</Text>
        <Text style={styles.pageTitle}>updates.</Text>
        <Text style={styles.pageSubtitle}>A few moments from your friends.</Text>
        <Text style={[styles.sectionTitle, styles.secondaryHeading]}>RECENT UPDATES</Text>
        <Pressable style={styles.statusCreateCard} onPress={onCreateStatus}>
          <View style={styles.statusCreateIcon}><Ionicons name="add" size={22} color={palette.deepGreen} /></View>
          <View style={styles.updateInfo}><Text style={styles.chatName}>Add your status</Text><Text style={styles.chatPreview}>Share a moment with your people</Text></View>
          <Ionicons name="chevron-forward" size={18} color="#A2ADA8" />
        </Pressable>
        <Pressable style={styles.photoStatusCard} onPress={onCreatePhotoStatus}>
          <View style={styles.statusCreateIcon}><Ionicons name="image-outline" size={20} color={palette.deepGreen} /></View>
          <View style={styles.updateInfo}><Text style={styles.chatName}>Share a photo</Text><Text style={styles.chatPreview}>Add a picture to your status</Text></View>
          <Ionicons name="chevron-forward" size={18} color="#A2ADA8" />
        </Pressable>
        {statuses.map((status) => (
          <Pressable
            key={status.id}
            style={styles.updateCard}
            onPress={() => Alert.alert(status.name, `${status.text}\n\n${status.time}`)}
          >
            <View style={styles.storyRing}>
              {status.attachmentUri
                ? <Image source={{ uri: status.attachmentUri }} resizeMode="cover" style={styles.statusPhoto} />
                : <Avatar initials={status.initials} color={status.color} size={52} />}
            </View>
            <View style={styles.updateInfo}>
              <Text style={styles.chatName}>{status.name}</Text>
              <Text style={styles.chatPreview} numberOfLines={1}>{status.text}</Text>
              <Text style={styles.statusTime}>{status.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A2ADA8" />
          </Pressable>
        ))}
      </View>
    );
  }
  if (tab === "Communities") {
    return (
      <View style={styles.secondaryPage}>
        <Text style={styles.pageTitle}>Better together.</Text>
        <Text style={styles.pageSubtitle}>Bring your favorite groups into one place.</Text>
        <Pressable style={styles.communityCard} onPress={() => onOpenChat("design")}>
          <View style={[styles.communityIcon, { backgroundColor: "#E9DFF6" }]}>
            <Ionicons name="color-palette" size={24} color="#7657A4" />
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.chatName}>Design friends ✨</Text>
            <Text style={styles.chatPreview}>4 members · Open group chat</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A2ADA8" />
        </Pressable>
        <Pressable style={styles.outlineAction} onPress={onCreateGroup}>
          <Ionicons name="people" size={19} color={palette.deepGreen} />
          <Text style={styles.outlineActionText}>Create a group</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.secondaryPage}>
      <Text style={styles.pageTitle}>Catch up,</Text>
      <Text style={styles.pageTitle}>voice to voice.</Text>
      <Text style={styles.pageSubtitle}>Your recent calls will show up here.</Text>
      <View style={styles.emptyCalls}>
        <View style={styles.emptyCallIcon}>
          <Ionicons name="call-outline" size={28} color={palette.green} />
        </View>
        <Text style={styles.emptyCallsTitle}>No recent calls</Text>
        <Text style={styles.emptyCallsText}>When you make or receive a call, it’ll appear here.</Text>
        <Pressable style={styles.primaryAction} onPress={onStartChat}>
          <Text style={styles.primaryActionText}>Start a conversation</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ConnectionDashboard({ events }: { events: ConnectionEvent[] }) {
  return (
    <ScrollView style={styles.dashboardScroll} contentContainerStyle={styles.dashboardPage}>
      <Text style={styles.pageTitle}>Your dashboard.</Text>
      <Text style={styles.pageSubtitle}>A clear view of chat activity and verified Bitcoin.</Text>

      <View style={styles.connectionMetricCard}>
        <View style={styles.metricIcon}><Ionicons name="people" size={20} color={palette.deepGreen} /></View>
        <Text style={styles.metricEyebrow}>CHAT CONNECTIONS</Text>
        <Text style={styles.connectionMetricValue}>{events.length.toLocaleString()}</Text>
        <Text style={styles.connectionMetricHint}>Chat openings recorded on this device</Text>
      </View>

      <View style={styles.bitcoinMetricCard}>
        <View style={styles.bitcoinMetricIcon}><Ionicons name="logo-bitcoin" size={20} color="#765400" /></View>
        <View style={styles.bitcoinMetricCopy}>
          <Text style={styles.bitcoinMetricTitle}>Verified Bitcoin received</Text>
          <Text style={styles.bitcoinMetricHint}>Only confirmed payments count</Text>
        </View>
        <Text style={styles.bitcoinMetricValue}>0 BTC</Text>
      </View>

      <View style={styles.ledgerNotice}>
        <Ionicons name="information-circle-outline" size={19} color="#765400" />
        <Text style={styles.ledgerNoticeText}>
          Opening a chat does not create Bitcoin. Payments are not configured, so no BTC is being received or accumulated. These activity records stay on this device and are not shared with other users.
        </Text>
      </View>

      <View style={styles.dashboardSectionHeading}>
        <Text style={styles.sectionTitle}>RECENT CHAT CONNECTIONS</Text>
        <Text style={styles.connectionTotal}>{events.length}</Text>
      </View>
      {events.length ? events.map((event) => (
        <View key={event.id} style={styles.connectionEventRow}>
          <View style={styles.connectionEventIcon}><Ionicons name="chatbubble-outline" size={18} color={palette.deepGreen} /></View>
          <View style={styles.connectionEventCopy}>
            <Text style={styles.connectionEventName} numberOfLines={1}>{event.chatName}</Text>
            <Text style={styles.connectionEventDate}>{new Date(event.connectedAt).toLocaleString()}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={18} color={palette.green} />
        </View>
      )) : (
        <View style={styles.dashboardEmpty}>
          <Ionicons name="chatbubbles-outline" size={25} color={palette.muted} />
          <Text style={styles.dashboardEmptyText}>Open a conversation to record its first connection here.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function DashboardPasscodeGate({
  configured,
  passcode,
  confirmation,
  error,
  onChangePasscode,
  onChangeConfirmation,
  onSubmit,
}: {
  configured: boolean | null;
  passcode: string;
  confirmation: string;
  error: string | null;
  onChangePasscode: (value: string) => void;
  onChangeConfirmation: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.dashboardGate}>
      <View style={styles.dashboardGateIcon}>
        <Ionicons name={configured ? "lock-closed" : "shield-checkmark"} size={27} color={palette.deepGreen} />
      </View>
      <Text style={styles.dashboardGateTitle}>
        {configured === null ? "Checking dashboard access…" : configured ? "Admin access" : "Protect your dashboard"}
      </Text>
      <Text style={styles.dashboardGateSubtitle}>
        {configured
          ? "Enter your password to view this device’s dashboard."
          : "Create a password to keep this dashboard private on this device."}
      </Text>
      {configured !== null && (
        <>
          <TextInput
            value={passcode}
            onChangeText={onChangePasscode}
            placeholder={configured ? "Admin password" : "Create password (8+ characters)"}
            placeholderTextColor="#94A09A"
            style={styles.adminPasscodeInput}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType={configured ? "password" : "newPassword"}
            onSubmitEditing={configured ? onSubmit : undefined}
            returnKeyType={configured ? "go" : "next"}
          />
          {!configured && (
            <TextInput
              value={confirmation}
              onChangeText={onChangeConfirmation}
              placeholder="Confirm password"
              placeholderTextColor="#94A09A"
              style={styles.adminPasscodeInput}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              onSubmitEditing={onSubmit}
              returnKeyType="done"
            />
          )}
          {error && <Text style={styles.adminPasscodeError}>{error}</Text>}
          <Pressable
            style={[styles.adminPasscodeButton, (!passcode || (!configured && !confirmation)) && styles.disabledAction]}
            onPress={onSubmit}
            disabled={!passcode || (!configured && !confirmation)}
          >
            <Text style={styles.adminPasscodeButtonText}>{configured ? "Unlock dashboard" : "Set password"}</Text>
          </Pressable>
          <Text style={styles.dashboardGateNotice}>
            This is a device-local app lock, not server authentication. On web, the password is stored in this browser and does not protect against someone with browser access.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F1E2BA", alignItems: "center" },
  screen: { flex: 1, width: "100%", maxWidth: 520, backgroundColor: "#FFFAEC", shadowColor: "#143D18", shadowOpacity: 0.1, shadowRadius: 28, shadowOffset: { width: 0, height: 6 }, elevation: 3, overflow: "hidden" },
  logoPattern: { ...StyleSheet.absoluteFillObject, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignContent: "flex-start" },
  patternLogo: { width: 20, height: 20, margin: 18, opacity: 0.12 },
  topBar: { height: 62, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandLogo: { width: 42, height: 42 },
  brandName: { color: palette.ink, fontWeight: "800", fontSize: 20, letterSpacing: -0.5 },
  topActions: { flexDirection: "row", alignItems: "center", gap: 13 },
  topAction: { width: 37, height: 37, borderRadius: 13, backgroundColor: palette.canvas, alignItems: "center", justifyContent: "center" },
  profileAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.deepGreen, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#C9EACB" },
  profileAvatarImage: { width: "100%", height: "100%", borderRadius: 18 },
  profileInitials: { color: palette.white, fontWeight: "800", fontSize: 15 },
  welcomeBlock: { paddingTop: 10, paddingHorizontal: 18, paddingBottom: 17 },
  welcomeCard: { minHeight: 164, borderRadius: 25, backgroundColor: palette.deepGreen, paddingHorizontal: 20, paddingVertical: 18, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  welcomeCopy: { flex: 1, zIndex: 1 },
  welcomeEyebrow: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(255,255,255,0.11)", borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6, marginBottom: 10 },
  welcomeEyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.amber },
  welcomeEyebrowText: { color: "#EAF8EA", fontSize: 8, fontWeight: "800", letterSpacing: 0.75 },
  welcomeTitle: { color: palette.white, fontSize: 27, lineHeight: 31, letterSpacing: -0.6, fontWeight: "800" },
  welcomeSubtitle: { color: "#D1E9D1", fontSize: 11, marginTop: 7 },
  welcomeArt: { width: 72, height: 116, alignItems: "center", justifyContent: "center", marginLeft: -2 },
  welcomeOrb: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(46,188,59,0.28)", right: -49, top: -1 },
  welcomeLogoBadge: { position: "absolute", top: 5, right: -2, width: 40, height: 40, borderRadius: 15, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", transform: [{ rotate: "8deg" }], shadowColor: "#061E0A", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  welcomeLogo: { width: 31, height: 31 },
  welcomeBubble: { width: 57, height: 57, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: palette.cyan, transform: [{ rotate: "7deg" }], shadowColor: "#061E0A", shadowOpacity: 0.18, shadowRadius: 11, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  welcomeBubbleAccent: { width: 35, height: 35, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: palette.amber, position: "absolute", bottom: 4, right: -1, borderWidth: 3, borderColor: palette.deepGreen, transform: [{ rotate: "-9deg" }] },
  pageTitle: { color: palette.ink, fontSize: 32, lineHeight: 37, letterSpacing: -1.05, fontWeight: "800" },
  pageSubtitle: { color: palette.muted, fontSize: 14, marginTop: 9, lineHeight: 20 },
  searchBox: { marginHorizontal: 22, height: 48, borderRadius: 15, backgroundColor: palette.canvas, borderWidth: 1, borderColor: "#ECF1E9", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, padding: 0, color: palette.ink, fontSize: 14 },
  storageNotice: { marginHorizontal: 18, marginBottom: 8, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10, backgroundColor: "#FFF4D8", flexDirection: "row", alignItems: "center", gap: 7 },
  storageNoticeText: { flex: 1, color: "#795400", fontSize: 11 },
  sectionHeading: { marginHorizontal: 24, marginTop: 25, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: "#87948E", fontSize: 11, fontWeight: "800", letterSpacing: 1.15 },
  secondaryHeading: { marginTop: 34, marginBottom: 8 },
  seeAll: { color: palette.deepGreen, fontSize: 12, fontWeight: "700" },
  filterList: { paddingHorizontal: 22, paddingBottom: 8, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: palette.canvas, borderWidth: 1, borderColor: palette.line },
  activeFilterChip: { backgroundColor: palette.deepGreen, borderColor: palette.deepGreen },
  filterChipText: { color: palette.muted, fontSize: 11, fontWeight: "700" },
  activeFilterText: { color: palette.white },
  chatList: { paddingHorizontal: 22, paddingBottom: 14 },
  chatRow: { minHeight: 77, flexDirection: "row", alignItems: "center", gap: 11 },
  chatMore: { width: 26, height: 44, alignItems: "center", justifyContent: "center" },
  avatar: { alignItems: "center", justifyContent: "center", position: "relative" },
  avatarText: { color: "#394940", fontWeight: "800", letterSpacing: 0.1 },
  onlineDot: { position: "absolute", right: 0, bottom: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: palette.green, borderWidth: 2, borderColor: palette.white },
  chatSummary: { flex: 1, height: "100%", justifyContent: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line },
  chatTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  chatNameLine: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  chatName: { color: palette.ink, fontSize: 15, fontWeight: "700", flexShrink: 1 },
  chatTime: { color: "#9AA59F", fontSize: 11 },
  chatTimeUnread: { color: palette.green, fontWeight: "700" },
  previewRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5, gap: 8 },
  chatPreview: { color: palette.muted, fontSize: 12, flex: 1 },
  unreadBadge: { minWidth: 19, height: 19, paddingHorizontal: 5, borderRadius: 10, backgroundColor: palette.deepGreen, alignItems: "center", justifyContent: "center" },
  unreadText: { color: palette.white, fontSize: 10, fontWeight: "800" },
  emptySearch: { alignItems: "center", paddingTop: 42, gap: 10 },
  emptyText: { color: palette.muted, fontSize: 14 },
  tabBar: { height: 68, borderTopWidth: 1, borderTopColor: "#F0F3F1", paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: palette.white },
  tabItem: { width: "20%", alignItems: "center", justifyContent: "center", gap: 3 },
  tabIconWrap: { height: 30, minWidth: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", position: "relative" },
  selectedTabIcon: { backgroundColor: palette.paleGreen },
  tabDot: { position: "absolute", width: 7, height: 7, borderRadius: 4, right: 10, top: 3, backgroundColor: palette.amber, borderWidth: 1, borderColor: palette.white },
  tabLabel: { color: "#929E98", fontSize: 10, fontWeight: "600" },
  selectedTabLabel: { color: palette.deepGreen, fontWeight: "800" },
  chatHeader: { height: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, borderBottomColor: palette.line, borderBottomWidth: 1, gap: 10 },
  backButton: { width: 28, alignItems: "flex-start", justifyContent: "center" },
  chatHeaderText: { flex: 1, justifyContent: "center" },
  chatHeaderName: { color: palette.ink, fontSize: 15, fontWeight: "700" },
  chatHeaderStatus: { color: palette.green, fontSize: 11, marginTop: 2 },
  headerAction: { width: 34, height: 40, alignItems: "center", justifyContent: "center" },
  messageScroll: { flex: 1, backgroundColor: "transparent" },
  messageList: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 18, flexGrow: 1 },
  encryptionNote: { alignSelf: "center", backgroundColor: "#EAF7EB", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 19 },
  encryptionText: { color: "#7A8981", fontSize: 10 },
  messageBubble: { maxWidth: "82%", paddingHorizontal: 13, paddingTop: 10, paddingBottom: 7, borderRadius: 16, marginBottom: 9, minWidth: 80 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#DDF3DE", borderBottomRightRadius: 5 },
  theirMessage: { alignSelf: "flex-start", backgroundColor: palette.white, borderBottomLeftRadius: 5 },
  messageText: { color: palette.ink, fontSize: 14, lineHeight: 20 },
  messageTime: { alignSelf: "flex-end", color: "#88968F", fontSize: 9, marginTop: 4 },
  starredIndicator: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  starredIndicatorText: { color: palette.muted, fontSize: 9 },
  messageImage: { width: 224, height: 172, borderRadius: 11, marginBottom: 5, backgroundColor: palette.canvas },
  documentAttachment: { width: 230, minHeight: 68, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "rgba(255,255,255,0.65)", borderRadius: 12, padding: 9, marginBottom: 4 },
  documentIcon: { width: 38, height: 42, borderRadius: 11, backgroundColor: palette.paleGreen, alignItems: "center", justifyContent: "center" },
  documentCopy: { flex: 1, gap: 4 },
  documentName: { color: palette.ink, fontSize: 11, fontWeight: "700" },
  documentHint: { color: palette.muted, fontSize: 9 },
  locationLink: { color: palette.deepGreen, textDecorationLine: "underline" },
  replyPreview: { borderLeftWidth: 3, borderLeftColor: palette.green, backgroundColor: "rgba(20,88,28,0.07)", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5, marginBottom: 7 },
  replyPreviewText: { color: palette.muted, fontSize: 11 },
  reactionRow: { flexDirection: "row", gap: 4, paddingTop: 3 },
  reactionChip: { overflow: "hidden", borderRadius: 9, backgroundColor: palette.white, paddingHorizontal: 6, paddingVertical: 2, fontSize: 12 },
  replyComposer: { marginHorizontal: 12, paddingHorizontal: 12, paddingVertical: 8, borderLeftWidth: 3, borderLeftColor: palette.green, backgroundColor: palette.paleGreen, borderRadius: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  replyComposerCopy: { flex: 1, gap: 2 },
  replyComposerTitle: { color: palette.deepGreen, fontSize: 10, fontWeight: "800" },
  replyComposerText: { color: palette.muted, fontSize: 11 },
  recordingButton: { backgroundColor: "#B83232" },
  recordingStatus: { minHeight: 34, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFF1EF" },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D23A32" },
  recordingText: { color: "#7A322C", fontSize: 11, fontWeight: "700" },
  recordingHint: { color: "#A05A50", fontSize: 10, marginLeft: "auto" },
  audioNote: { flexDirection: "row", alignItems: "center", gap: 10, minWidth: 188, paddingVertical: 5 },
  audioPlayButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.deepGreen, alignItems: "center", justifyContent: "center" },
  audioPlayButtonSent: { backgroundColor: "#A7DBAA" },
  audioWave: { flex: 1, flexDirection: "row", alignItems: "center", gap: 2 },
  audioWaveBar: { width: 2, borderRadius: 1, backgroundColor: palette.green },
  audioDuration: { color: palette.muted, fontSize: 9, marginLeft: 3 },
  composer: { minHeight: 62, paddingHorizontal: 11, paddingVertical: 8, flexDirection: "row", alignItems: "flex-end", gap: 7, backgroundColor: palette.white },
  attachButton: { width: 34, height: 42, alignItems: "center", justifyContent: "center" },
  messageInput: { flex: 1, maxHeight: 100, minHeight: 42, borderRadius: 22, backgroundColor: palette.canvas, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 9, color: palette.ink, fontSize: 14 },
  sendButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: palette.deepGreen },
  micButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: palette.deepGreen },
  secondaryPage: { flex: 1, paddingHorizontal: 24, paddingTop: 36 },
  dashboardScroll: { flex: 1 },
  dashboardPage: { paddingHorizontal: 22, paddingTop: 30, paddingBottom: 28 },
  connectionMetricCard: { marginTop: 23, minHeight: 160, padding: 20, borderRadius: 22, backgroundColor: palette.deepGreen },
  metricIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#EAF7EB", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  metricEyebrow: { color: "#C9EACB", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  connectionMetricValue: { color: palette.white, fontSize: 34, lineHeight: 40, fontWeight: "800", marginTop: 3 },
  connectionMetricHint: { color: "#D1E9D1", fontSize: 11, marginTop: 2 },
  bitcoinMetricCard: { marginTop: 13, minHeight: 78, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 17, backgroundColor: "#FFF1C9", flexDirection: "row", alignItems: "center", gap: 10 },
  bitcoinMetricIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#FFE39A", alignItems: "center", justifyContent: "center" },
  bitcoinMetricCopy: { flex: 1 },
  bitcoinMetricTitle: { color: palette.ink, fontSize: 12, fontWeight: "800" },
  bitcoinMetricHint: { color: palette.muted, fontSize: 10, marginTop: 3 },
  bitcoinMetricValue: { color: "#765400", fontSize: 14, fontWeight: "800" },
  ledgerNotice: { marginTop: 13, padding: 12, borderRadius: 13, backgroundColor: "#FFF9E9", borderWidth: 1, borderColor: "#F1E2BA", flexDirection: "row", alignItems: "flex-start", gap: 8 },
  ledgerNoticeText: { flex: 1, color: "#6E5A28", fontSize: 10, lineHeight: 15 },
  dashboardSectionHeading: { marginTop: 25, marginBottom: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  connectionTotal: { color: palette.muted, fontSize: 11, fontWeight: "700" },
  connectionEventRow: { minHeight: 67, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line },
  connectionEventIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: palette.paleGreen, alignItems: "center", justifyContent: "center" },
  connectionEventCopy: { flex: 1, gap: 4 },
  connectionEventName: { color: palette.ink, fontSize: 13, fontWeight: "700" },
  connectionEventDate: { color: palette.muted, fontSize: 10 },
  dashboardEmpty: { alignItems: "center", gap: 9, paddingVertical: 25, paddingHorizontal: 20 },
  dashboardEmptyText: { color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
  dashboardGate: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 26 },
  dashboardGateIcon: { width: 68, height: 68, borderRadius: 23, backgroundColor: "#FFF1C9", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  dashboardGateTitle: { color: palette.ink, fontSize: 21, fontWeight: "800", textAlign: "center" },
  dashboardGateSubtitle: { color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7, marginBottom: 18 },
  adminPasscodeInput: { width: "100%", height: 48, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white, paddingHorizontal: 14, fontSize: 14, color: palette.ink, marginBottom: 10 },
  adminPasscodeError: { width: "100%", color: "#B83232", fontSize: 11, marginBottom: 8 },
  adminPasscodeButton: { width: "100%", minHeight: 46, borderRadius: 14, backgroundColor: palette.deepGreen, alignItems: "center", justifyContent: "center", marginTop: 3 },
  adminPasscodeButtonText: { color: palette.white, fontSize: 13, fontWeight: "800" },
  dashboardGateNotice: { color: palette.muted, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 16 },
  statusCreateCard: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 13, borderBottomColor: palette.line, borderBottomWidth: 1 },
  statusCreateIcon: { width: 54, height: 54, borderRadius: 20, backgroundColor: palette.paleGreen, borderWidth: 1, borderColor: "#B9DDBB", alignItems: "center", justifyContent: "center" },
  photoStatusCard: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 13, borderBottomColor: palette.line, borderBottomWidth: 1 },
  statusPhoto: { width: 52, height: 52, borderRadius: 26 },
  updateCard: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 13, borderBottomColor: palette.line, borderBottomWidth: 1 },
  statusTime: { color: "#9AA59F", fontSize: 10 },
  storyRing: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: palette.green, alignItems: "center", justifyContent: "center" },
  updateInfo: { flex: 1, gap: 5 },
  communityCard: { marginTop: 27, minHeight: 82, flexDirection: "row", alignItems: "center", gap: 13, borderBottomColor: palette.line, borderBottomWidth: 1 },
  communityIcon: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  outlineAction: { height: 50, borderRadius: 15, borderWidth: 1, borderColor: "#B9DDBB", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 25 },
  outlineActionText: { color: palette.deepGreen, fontSize: 13, fontWeight: "700" },
  emptyCalls: { alignItems: "center", marginTop: 94, paddingHorizontal: 25 },
  emptyCallIcon: { width: 66, height: 66, borderRadius: 23, backgroundColor: palette.paleGreen, alignItems: "center", justifyContent: "center", marginBottom: 17 },
  emptyCallsTitle: { color: palette.ink, fontSize: 17, fontWeight: "700" },
  emptyCallsText: { color: palette.muted, textAlign: "center", fontSize: 13, lineHeight: 20, marginTop: 8 },
  primaryAction: { backgroundColor: palette.deepGreen, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 19, marginTop: 22 },
  primaryActionText: { color: palette.white, fontWeight: "700", fontSize: 13 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(15, 34, 27, 0.28)", justifyContent: "flex-end" },
  contactSheet: { backgroundColor: palette.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 32, maxHeight: "78%" },
  sheetHandle: { width: 36, height: 4, backgroundColor: "#D9E1DC", borderRadius: 2, alignSelf: "center", marginBottom: 18 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sheetTitle: { color: palette.ink, fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
  sheetSubtitle: { color: palette.muted, fontSize: 12, marginTop: 4 },
  closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.canvas, alignItems: "center", justifyContent: "center" },
  contactRow: { height: 67, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.line },
  importContactsAction: { minHeight: 46, flexDirection: "row", alignItems: "center", gap: 9, borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.line, marginTop: 4 },
  importContactsText: { flex: 1, color: palette.deepGreen, fontSize: 12, fontWeight: "700" },
  contactName: { flex: 1, color: palette.ink, fontWeight: "600", fontSize: 14 },
  createGroupButton: { height: 48, borderRadius: 14, backgroundColor: palette.deepGreen, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 15 },
  createGroupButtonText: { color: palette.white, fontWeight: "700", fontSize: 13 },
  groupNameInput: { height: 48, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.canvas, paddingHorizontal: 14, fontSize: 14, color: palette.ink },
  groupInviteHeading: { color: palette.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1, marginTop: 18, marginBottom: 4 },
  groupContacts: { maxHeight: 250 },
  disabledAction: { opacity: 0.4 },
  deleteConfirmButton: { height: 46, borderRadius: 14, backgroundColor: "#B83232", alignItems: "center", justifyContent: "center", marginTop: 18 },
  deleteConfirmText: { color: palette.white, fontSize: 13, fontWeight: "700" },
  actionSheet: { backgroundColor: palette.white, marginHorizontal: 16, marginBottom: 16, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 14, borderRadius: 22, maxWidth: 488, width: "100%", alignSelf: "center" },
  actionRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line },
  actionText: { color: palette.ink, fontSize: 14, fontWeight: "600" },
  destructiveText: { color: "#B83232" },
  cancelAction: { minHeight: 44, alignItems: "center", justifyContent: "center", marginTop: 5 },
  cancelActionText: { color: palette.deepGreen, fontSize: 14, fontWeight: "700" },
  quickReactions: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 },
  quickReaction: { width: 44, height: 44, borderRadius: 15, backgroundColor: palette.canvas, alignItems: "center", justifyContent: "center" },
  quickReactionText: { fontSize: 22 },
  statusInput: { minHeight: 110, textAlignVertical: "top", backgroundColor: palette.canvas, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: palette.ink, fontSize: 15 },
  statusCounter: { color: palette.muted, fontSize: 10, textAlign: "right", marginTop: 6 },
  profileSheet: { backgroundColor: palette.white, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  profileHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  profilePictureButton: { width: 62, height: 62, position: "relative" },
  profilePicture: { width: 62, height: 62, borderRadius: 22, backgroundColor: palette.deepGreen, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  profilePictureImage: { width: "100%", height: "100%" },
  profilePictureInitial: { color: palette.white, fontSize: 25, fontWeight: "800" },
  profileCameraBadge: { position: "absolute", right: -3, bottom: -3, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: palette.white, backgroundColor: palette.green, alignItems: "center", justifyContent: "center" },
  profileHeaderCopy: { flex: 1, gap: 3 },
  profilePhotoAction: { color: palette.deepGreen, fontSize: 11, fontWeight: "700", marginTop: 3 },
  removeProfilePhoto: { width: 34, height: 38, alignItems: "center", justifyContent: "center" },
  profileLogo: { width: 52, height: 52, borderRadius: 17, backgroundColor: palette.paleGreen, alignItems: "center", justifyContent: "center" },
  profileInfoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.line },
  profileInfoText: { flex: 1, color: palette.muted, fontSize: 12, lineHeight: 18 },
  profileActionCopy: { flex: 1, gap: 3 },
  profileActionDetail: { color: palette.muted, fontSize: 10 },
  notificationTestButton: { height: 40, borderRadius: 12, backgroundColor: palette.paleGreen, alignItems: "center", justifyContent: "center", marginVertical: 5 },
  notificationTestText: { color: palette.deepGreen, fontSize: 12, fontWeight: "700" },
});
