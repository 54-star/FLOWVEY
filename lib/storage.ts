export type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: "checked-in" | "checked-out" | "upcoming";
};

export type MessageStatus = "pending" | "sent" | "failed";

export type MessageRecord = {
  id: string;
  guestName: string;
  phone: string;
  room: string;
  content: string;
  channel: "whatsapp";
  status: MessageStatus;
  scheduledFor: string;
  sentAt: string | null;
  failReason: string | null;
};

const GUESTS_KEY = "flowvey_guests";
const MESSAGES_KEY = "flowvey_messages";

export function loadGuests(): Guest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUESTS_KEY);
    return raw ? (JSON.parse(raw) as Guest[]) : [];
  } catch {
    return [];
  }
}

export function saveGuests(guests: Guest[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
  } catch {
    // ignore write errors (e.g. storage full or blocked)
  }
}

export function loadMessages(): MessageRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as MessageRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: MessageRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // ignore write errors
  }
}

export function addMessageRecord(record: MessageRecord) {
  const current = loadMessages();
  saveMessages([record, ...current]);
}

export function whatsappLink(phone: string, content: string) {
  const digitsOnly = phone.replace(/[^\d]/g, "");
  return "https://wa.me/" + digitsOnly + "?text=" + encodeURIComponent(content);
}

export function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}