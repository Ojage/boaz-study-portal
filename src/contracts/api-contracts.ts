export type ISODateString = string;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: ISODateString;
}

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  authorities: string[];
  activeSpaceId: string;
  spaceIds: string[];
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  spaceId: string;
  createdByUserId: string;
  assignedToUserId?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type DocumentVisibility = "PRIVATE" | "SPACE" | "PUBLIC";

export interface Document {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  visibility: DocumentVisibility;
  spaceId: string;
  uploadedByUserId: string;
  createdAt: ISODateString;
  url: string;
}

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: ISODateString;
  spaceId?: string;
  href?: string;
}
