import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import React, { useRef } from "react";
interface AddAttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disbaled: boolean;
}
const AddAttachmentButton = ({
  disbaled,
  onFilesSelected,
}: AddAttachmentButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disbaled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/* , video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};

export default AddAttachmentButton;
