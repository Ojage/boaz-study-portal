import type { ApiResponse, Notification, NotificationType } from "../../contracts/api-contracts";
import { nowIso, toApiResponse, withDelay } from "./mock-utils";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

const spaceScience = "space-science";

let notifications: Notification[] = [
  {
    id: "ntf-001",
    type: "INFO",
    title: "Welcome",
    message: "Your StudyPortal access is ready.",
    read: false,
    createdAt: "2026-04-06T07:10:00.000Z",
  },
  {
    id: "ntf-002",
    type: "SUCCESS",
    title: "Document uploaded",
    message: "Science - Semester Syllabus.pdf is now available in your space.",
    read: true,
    createdAt: "2026-04-05T12:00:00.000Z",
    spaceId: spaceScience,
    href: "/documents",
  },
  {
    id: "ntf-003",
    type: "WARNING",
    title: "Ticket update",
    message: "Your ticket tkt-002 is now in progress.",
    read: false,
    createdAt: "2026-04-04T08:25:00.000Z",
    spaceId: spaceScience,
    href: "/tickets",
  },
];

export async function mockListNotifications(
  params: { spaceId?: string; unreadOnly?: boolean } = {},
  delayMs?: number,
): Promise<ApiResponse<Notification[]>> {
  return await withDelay(() => {
    let filtered = notifications;
    if (params.spaceId) filtered = filtered.filter((n) => n.spaceId === params.spaceId);
    if (params.unreadOnly) filtered = filtered.filter((n) => !n.read);
    return toApiResponse(filtered, "Mock notifications fetched");
  }, delayMs);
}

export async function mockMarkNotificationRead(
  id: string,
  delayMs?: number,
): Promise<ApiResponse<Notification | null>> {
  return await withDelay(() => {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return toApiResponse(null, "Notification not found");
    const updated: Notification = { ...notifications[index], read: true };
    notifications = [
      ...notifications.slice(0, index),
      updated,
      ...notifications.slice(index + 1),
    ];
    return toApiResponse(updated, "Mock notification marked as read");
  }, delayMs);
}

export interface PushNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  spaceId?: string;
  href?: string;
}

export async function mockPushNotification(
  input: PushNotificationInput,
  delayMs?: number,
): Promise<ApiResponse<Notification>> {
  return await withDelay(() => {
    const notification: Notification = {
      id: newId("ntf"),
      type: input.type,
      title: input.title,
      message: input.message,
      read: false,
      createdAt: nowIso(),
      spaceId: input.spaceId,
      href: input.href,
    };

    notifications = [notification, ...notifications];
    return toApiResponse(notification, "Mock notification pushed");
  }, delayMs);
}
