import TrendsSidebar from "@/components/trends-sidebar";
import { Metadata } from "next";
import React from "react";
import SearchResult from "./serach-result";
interface PageProps {
  searchParams: { q: string };
}
export const generateMetadata = ({
  searchParams: { q },
}: PageProps): Metadata => {
  return {
    title: `Search result for "${q}"`,
  };
};
const Page = ({ searchParams: { q } }: PageProps) => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-1 break-all text-center text-2xl font-bold">
            Search for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResult query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
};
export default Page;
