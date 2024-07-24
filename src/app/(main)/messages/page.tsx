import { Metadata } from "next";
import React from "react";
import Chat from "./chat";
export const metadata: Metadata = {
  title: "Messages",
};
const Pages = () => {
  return <Chat />;
};

export default Pages;
