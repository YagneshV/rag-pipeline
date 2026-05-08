export type ChatRole = "user" | "assistant";

export type ChatSource = {
  id?: string;
  text: string;
  metadata?: Record<string, unknown>;
  distance?: number;
};

export type ChatMessage = {
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
};

export type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

export type UploadedFile = {
  name: string;
  status: UploadStatus;
};
