import type { ApiResponse, Ticket, TicketPriority } from "../../contracts/api-contracts";
import { nowIso, toApiResponse, withDelay } from "./mock-utils";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

const spaceScience = "space-science";
const spaceEngineering = "space-engineering";

let tickets: Ticket[] = [
  {
    id: "tkt-001",
    title: "Unable to access documents",
    description: "The documents list is empty for the Science space.",
    status: "OPEN",
    priority: "HIGH",
    spaceId: spaceScience,
    createdByUserId: "user-std-001",
    assignedToUserId: "user-admin-001",
    createdAt: "2026-04-05T10:12:00.000Z",
    updatedAt: "2026-04-05T10:12:00.000Z",
  },
  {
    id: "tkt-002",
    title: "Request: new student ID card",
    description: "Please generate an updated ID card for the semester.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    spaceId: spaceScience,
    createdByUserId: "user-std-001",
    assignedToUserId: "user-admin-001",
    createdAt: "2026-04-03T14:35:00.000Z",
    updatedAt: "2026-04-04T08:20:00.000Z",
  },
  {
    id: "tkt-003",
    title: "Broken link in Engineering portal",
    description: "The 'Course Materials' link returns 404.",
    status: "RESOLVED",
    priority: "LOW",
    spaceId: spaceEngineering,
    createdByUserId: "user-admin-001",
    assignedToUserId: "user-admin-001",
    createdAt: "2026-03-29T09:00:00.000Z",
    updatedAt: "2026-03-30T18:12:00.000Z",
  },
];

export async function mockListTickets(
  params: { spaceId?: string } = {},
  delayMs?: number,
): Promise<ApiResponse<Ticket[]>> {
  return await withDelay(() => {
    const filtered = params.spaceId
      ? tickets.filter((t) => t.spaceId === params.spaceId)
      : tickets;
    return toApiResponse(filtered, "Mock tickets fetched");
  }, delayMs);
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  spaceId: string;
  createdByUserId: string;
}

export async function mockCreateTicket(
  input: CreateTicketInput,
  delayMs?: number,
): Promise<ApiResponse<Ticket>> {
  return await withDelay(() => {
    const timestamp = nowIso();
    const ticket: Ticket = {
      id: newId("tkt"),
      title: input.title,
      description: input.description,
      status: "OPEN",
      priority: input.priority,
      spaceId: input.spaceId,
      createdByUserId: input.createdByUserId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    tickets = [ticket, ...tickets];
    return toApiResponse(ticket, "Mock ticket created");
  }, delayMs);
}
