"use client";
import { PostData } from "@/lib/types";
import Link from "next/link";
import React from "react";
import UserAvatar from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import PostMoreButton from "./post-more-button";
import Linkify from "../linkfy";
import UserToolTip from "../user-tooltip";
import MediaPreviews from "./media-privews";
import LikeButton from "./like-button";
import BookmarkButton from "./bookmark-button";
interface PostsPros {
  post: PostData;
}
const Post = ({ post }: PostsPros) => {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserToolTip>

          <div>
            <UserToolTip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserToolTip>
            <Link
              href={`/posts/${post.id}`}
              className="bloc text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <LikeButton
          postId={post.id}
          initinalState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((like) => like.userId === user.id),
          }}
        />
        <BookmarkButton
          postId={post.id}
          initinalState={{
            isBookedmarkByUser: post.bookmark.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
    </article>
  );
};

export default Post;
