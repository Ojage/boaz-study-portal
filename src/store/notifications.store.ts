import { create } from "zustand";
import type { Notification } from "../contracts/api-contracts";
import { mockListNotifications, mockMarkNotificationRead } from "../services/mock/notifications.mock";

export interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
  refresh: (spaceId?: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  refresh: async (spaceId) => {
    set({ loading: true, error: null });
    try {
      const res = await mockListNotifications({ spaceId });
      set({ items: res.data, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch notifications";
      set({ loading: false, error: message });
    }
  },

  markRead: async (id) => {
    const prev = get().items;
    set({ items: prev.map((n) => (n.id === id ? { ...n, read: true } : n)) });
    try {
      await mockMarkNotificationRead(id);
    } catch {
      set({ items: prev });
    }
  },
}));
