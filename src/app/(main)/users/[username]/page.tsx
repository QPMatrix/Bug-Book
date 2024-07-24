import { validateRequest } from "@/lib/auth";
import TrendsSidebar from "@/components/trends-sidebar";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import UserProfile from "./components/user-profile";
import UserPostFeed from "./components/user-posts-feed";
interface PageProps {
  params: { username: string };
}
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();
  return user;
});

export const generateMetadata = async ({
  params: { username },
}: PageProps): Promise<Metadata> => {
  const { user: loggedInUserId } = await validateRequest();
  if (!loggedInUserId) return {};

  const user = await getUser(username, loggedInUserId.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
};
const Page = async ({ params: { username } }: PageProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return <p>You&apos;re not authrized to see this page</p>;
  }
  const user = await getUser(username, loggedInUser.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPostFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
