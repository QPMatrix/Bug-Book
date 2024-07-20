import React from "react";
import { validateReqeust } from "../../auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await validateReqeust();
  if (user) redirect("/");
  return <>{children}</>;
};

export default AuthLayout;
