import React from "react";
import { validateReqeust } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/provider/session-provider";
import Navbar from "./components/navbar";
import Menubar from "./components/menu-bar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateReqeust();
  if (!session.user) redirect("/login");
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <Menubar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <Menubar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
};

export default MainLayout;
