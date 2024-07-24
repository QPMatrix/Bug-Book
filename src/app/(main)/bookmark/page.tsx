import { Metadata } from "next";
import React from "react";
import BookmarkFeed from "./bookmark-feed";
import TrendsSidebar from "@/components/trends-sidebar";
export const metadata: Metadata = {
  title: "Bookmarks",
};
const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmark</h1>
        </div>
        <BookmarkFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
