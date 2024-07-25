import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import NotificationsButton from "./notifications-button";
import MessageButton from "./messages-button";
import streamServerClient from "@/lib/stream";
interface MenubarProps {
  className?: string;
}
const Menubar = async ({ className }: MenubarProps) => {
  const { user } = await validateRequest();
  if (!user) return null;
  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessageButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmark"
        asChild
      >
        <Link href="/bookmark">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default Menubar;
