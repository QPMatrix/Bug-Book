import { CommentData } from "@/lib/types";
import React from "react";
import UserToolTip from "../users/user-tooltip";
import Link from "next/link";
import UserAvatar from "../users/user-avatar";
import { formatRelativeDate } from "../../lib/utils";
import { useSession } from "@/hooks/use-session";
import CommentMoreButton from "./commnet-more-button";
interface CommentProps {
  comment: CommentData;
}
const Comment = ({ comment }: CommentProps) => {
  const { user } = useSession();
  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserToolTip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserToolTip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserToolTip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserToolTip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
};

export default Comment;
