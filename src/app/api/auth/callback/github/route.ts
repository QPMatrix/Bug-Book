import { github, lucia } from "@/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import { generateIdFromEntropySize } from "lucia";
import { slugify } from "@/lib/utils";
import streamServerClient from "@/lib/stream";
import { OAuth2RequestError } from "arctic";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("github_oauth_state")?.value;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, { status: 400 });
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await kyInstance
      .get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<{ id: string; name: string; avatar_url: string }>();
    const existingUser = await prisma.user.findUnique({
      where: {
        githubId: parseInt(githubUser.id),
      },
    });
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }
    const userId = generateIdFromEntropySize(10);
    const username = slugify(githubUser.name) + "-" + userId.slice(0, 4);
    const githubId = JSON.parse(githubUser.id);
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: githubUser.name,
          githubId,
          avatarUrl: githubUser.avatar_url,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
