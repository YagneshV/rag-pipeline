import type { UploadedFile, UploadStatus } from "../lib/types";
import FileUpload from "./FileUpload";

const statusStyles: Record<UploadStatus, string> = {
  idle: "text-slate-400",
  uploading: "text-purple-600",
  uploaded: "text-emerald-600",
  error: "text-red-600",
};

export default function Sidebar({
  uploadedFiles,
  onStatusChange,
}: {
  uploadedFiles: UploadedFile[];
  onStatusChange: (fileName: string, status: UploadStatus) => void;
}) {
  return (
    <aside className="flex h-full w-full flex-col gap-6 border-r border-slate-200 bg-white/90 p-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-purple-400">RAG Studio</div>
        <div className="mt-3 text-2xl font-semibold text-ink">PDF Research Desk</div>
        <div className="mt-2 text-sm text-slate-500">
          Drop files, ask questions, and keep context tight.
        </div>
      </div>

      <FileUpload onStatusChange={onStatusChange} />

      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Uploaded files
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {uploadedFiles.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
              No uploads yet.
            </div>
          ) : (
            uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
              >
                <div className="font-semibold text-slate-700">{file.name}</div>
                <div className={statusStyles[file.status]}>{file.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
