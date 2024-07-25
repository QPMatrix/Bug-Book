import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import GoogleLogo from "@/assets/google-logo.svg";
import GithubLogo from "@/assets/github-logo.svg";
import Image from "next/image";
const OAuthSignInButton = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
      <Button
        variant="outline"
        className="bg-white text-black hover:bg-gray-100 hover:text-black"
        asChild
      >
        <a href="/login/google" className="flex w-full items-center gap-2">
          <Image src={GoogleLogo} width={30} height={30} alt="google logo" />
          Sign in with google
        </a>
      </Button>
      <Button
        variant="outline"
        className="bg-white text-black hover:bg-gray-100 hover:text-black"
        asChild
      >
        <a href="/login/github" className="flex w-full items-center gap-2">
          <Image src={GithubLogo} width={30} height={30} alt="google logo" />
          Sign in with github
        </a>
      </Button>
    </div>
  );
};

export default OAuthSignInButton;
