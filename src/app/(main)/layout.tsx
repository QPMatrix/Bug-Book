import React from "react";
import { validateReqeust } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/provider/session-provider";
import Navbar from "@/components/navbar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateReqeust();
  if (!session.user) redirect("/login");
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </div>
    </SessionProvider>
  );
};

export default MainLayout;
