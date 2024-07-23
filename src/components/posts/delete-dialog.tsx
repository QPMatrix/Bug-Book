import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../loading-btn";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

const DeletePostDialog = ({ post, open, onClose }: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();
  const handleOpenChanges = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChanges}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
