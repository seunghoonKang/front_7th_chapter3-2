import { atom } from "jotai";

export interface NotificationType {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export const notificationsAtom = atom<NotificationType[]>([]);
