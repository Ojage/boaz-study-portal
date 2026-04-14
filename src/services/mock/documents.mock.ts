import type { ApiResponse, Document, DocumentVisibility } from "../../contracts/api-contracts";
import { nowIso, toApiResponse, withDelay } from "./mock-utils";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

const spaceScience = "space-science";
const spaceEngineering = "space-engineering";

let documents: Document[] = [
  {
    id: "doc-001",
    name: "Science - Semester Syllabus.pdf",
    mimeType: "application/pdf",
    sizeBytes: 482_120,
    visibility: "SPACE",
    spaceId: spaceScience,
    uploadedByUserId: "user-admin-001",
    createdAt: "2026-03-20T11:15:00.000Z",
    url: "/mock/documents/science-syllabus.pdf",
  },
  {
    id: "doc-002",
    name: "Engineering - Lab Safety.pdf",
    mimeType: "application/pdf",
    sizeBytes: 291_004,
    visibility: "SPACE",
    spaceId: spaceEngineering,
    uploadedByUserId: "user-admin-001",
    createdAt: "2026-03-18T08:40:00.000Z",
    url: "/mock/documents/engineering-lab-safety.pdf",
  },
  {
    id: "doc-003",
    name: "Public - Student Handbook.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_201_330,
    visibility: "PUBLIC",
    spaceId: spaceScience,
    uploadedByUserId: "user-admin-001",
    createdAt: "2026-02-01T09:00:00.000Z",
    url: "/mock/documents/student-handbook.pdf",
  },
];

export async function mockListDocuments(
  params: { spaceId?: string; visibility?: DocumentVisibility } = {},
  delayMs?: number,
): Promise<ApiResponse<Document[]>> {
  return await withDelay(() => {
    let filtered = documents;
    if (params.spaceId) filtered = filtered.filter((d) => d.spaceId === params.spaceId);
    if (params.visibility) filtered = filtered.filter((d) => d.visibility === params.visibility);
    return toApiResponse(filtered, "Mock documents fetched");
  }, delayMs);
}

export interface UploadDocumentInput {
  name: string;
  mimeType: string;
  sizeBytes: number;
  visibility: DocumentVisibility;
  spaceId: string;
  uploadedByUserId: string;
}

export async function mockUploadDocument(
  input: UploadDocumentInput,
  delayMs?: number,
): Promise<ApiResponse<Document>> {
  return await withDelay(() => {
    const doc: Document = {
      id: newId("doc"),
      name: input.name,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      visibility: input.visibility,
      spaceId: input.spaceId,
      uploadedByUserId: input.uploadedByUserId,
      createdAt: nowIso(),
      url: `/mock/documents/${encodeURIComponent(input.name)}`,
    };

    documents = [doc, ...documents];
    return toApiResponse(doc, "Mock document uploaded");
  }, delayMs);
}
