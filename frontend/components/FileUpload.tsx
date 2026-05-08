import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import type { UploadStatus } from "../lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export default function FileUpload({
  onStatusChange,
}: {
  onStatusChange: (fileName: string, status: UploadStatus) => void;
}) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      setStatus("uploading");
      setProgress(0);
      setError(null);
      onStatusChange(file.name, "uploading");

      const formData = new FormData();
      formData.append("file", file);

      const request = new XMLHttpRequest();
      request.open("POST", `${API_BASE_URL}/upload`);

      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          setStatus("uploaded");
          setProgress(100);
          onStatusChange(file.name, "uploaded");
        } else {
          setStatus("error");
          setError("Upload failed. Please try again.");
          onStatusChange(file.name, "error");
        }
      };

      request.onerror = () => {
        setStatus("error");
        setError("Upload failed. Please check your connection.");
        onStatusChange(file.name, "error");
      };

      request.send(formData);
    },
    [onStatusChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const statusText = useMemo(() => {
    if (status === "uploading") {
      return `Uploading... ${progress}%`;
    }
    if (status === "uploaded") {
      return "Upload complete";
    }
    if (status === "error") {
      return error ?? "Upload failed";
    }
    return "Drop a PDF or click to browse";
  }, [status, progress, error]);

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border border-dashed px-4 py-5 text-sm transition ${
        isDragActive
          ? "border-accent bg-purple-50"
          : "border-slate-500 bg-white/70"
      }`}
    >
      <input {...getInputProps()} />
      <div className="font-semibold text-slate-800">Upload PDF</div>
      <div className="mt-2 text-slate-500">{statusText}</div>
      {status === "uploading" ? (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
