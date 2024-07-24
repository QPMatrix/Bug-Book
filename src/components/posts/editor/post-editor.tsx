"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/user-avatar";
import { useSession } from "@/hooks/use-session";
import "./styles.css";
import LoadingButton from "@/components/loading-btn";
import { useSumbitPostMutation } from "./mutation";
import { useMediaUpload } from "./useMediaUpload";
import AddAttachmentButton from "./components/add-attachments-button";
import AttachmentPreviews from "./components/attachments-previews";
import { Loader2 } from "lucide-react";
const PostEditor = () => {
  const { user } = useSession();
  const mutation = useSumbitPostMutation();
  const {
    attachments,
    isUploading,
    removeAttachment,
    rest: resetMediaUpload,
    startUpload,
    uploadProgress,
  } = useMediaUpload();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin?",
      }),
    ],
  });
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = () => {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      },
    );
  };
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachemnt={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentButton
          onFilesSelected={startUpload}
          disbaled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;
