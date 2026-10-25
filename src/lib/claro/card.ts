import type { Lang } from "@/lib/claro/compose";

export type ContactKind = "call" | "whatsapp" | "quote" | "appointment";

export type SavedCard = {
  id: string;
  name: string;
  area: string;
  hours: string;
  price: string;
  lang: Lang;
  contact: ContactKind;
  phone: string;
  beats: [string, string, string];
  photo: string;
  published: boolean;
  weekly: string;
  visits: number;
  taps: number;
  requests: string[];
  outcomes: string[];
};

const KEY = "claro-card";

export function loadCard(): SavedCard | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const card = JSON.parse(raw) as SavedCard;
    if (!card?.id || !Array.isArray(card.beats)) return null;
    return card;
  } catch {
    return null;
  }
}

export function saveCard(card: SavedCard) {
  const next = { ...card };
  if (next.photo.length > 180_000) next.photo = "";
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function deleteCard() {
  localStorage.removeItem(KEY);
}

export function phoneOk(value: string) {
  return value.replace(/\D/g, "").length >= 8;
}

export function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
