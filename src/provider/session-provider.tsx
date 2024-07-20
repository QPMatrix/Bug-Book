"use client";
import React, { createContext } from "react";
import { Session, User } from "lucia";

interface SessionContext {
  user: User;
  session: Session;
}
export const SessionContext = createContext<SessionContext | null>(null);

export const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
