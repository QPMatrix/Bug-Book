import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import Linkify from "@/components/linkfy";
import UserAvatar from "@/components/user-avatar";
import UserToolTip from "@/components/user-tooltip";
import { UserData } from "@/lib/types";
import Link from "next/link";
import React from "react";
interface UserInfoSidebarProps {
  user: UserData;
}
const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return;
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <UserToolTip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initailState={{
            followers: user._count.followers,
            isFollwedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
};

export default UserInfoSidebar;
