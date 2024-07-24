import React from "react";
import { Attachment } from "../useMediaUpload";
import { cn } from "@/lib/utils";
import AttachmentPreview from "./attachments-preview";
interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachemnt: (fileName: string) => void;
}
const AttachmentPreviews = ({
  attachments,
  removeAttachemnt,
}: AttachmentPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((a) => (
        <AttachmentPreview
          key={a.file.name}
          attachment={a}
          onRemoveClick={() => removeAttachemnt(a.file.name)}
        />
      ))}
    </div>
  );
};

export default AttachmentPreviews;
