"use client";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export const useMediaUpload = () => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renemdaedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });
      setAttachments((prev) => [
        ...prev,
        ...renemdaedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renemdaedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);
          if (!uploadResult) return a;
          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });
  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload finsh.",
      });
      return;
    }
    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload 5 attachment at post!",
      });
    }
    startUpload(files);
  };

  const removeAttachment = (fileName: String) => {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  };

  const rest = () => {
    setAttachments([]);
    setUploadProgress(undefined);
  };
  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    rest,
  };
};
