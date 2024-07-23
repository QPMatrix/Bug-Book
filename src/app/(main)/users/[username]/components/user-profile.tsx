import FollowButton from "@/components/follow-button";
import FollowerCount from "@/components/follower-counter";
import Linkify from "@/components/linkfy";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import React from "react";
interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}
const UserProfile = ({ user, loggedInUserId }: UserProfileProps) => {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollwedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "d MMM, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Editor</Button>
        ) : (
          <FollowButton userId={user.id} initailState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
};

export default UserProfile;
