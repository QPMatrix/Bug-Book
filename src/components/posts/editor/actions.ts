"use server";

import { validateReqeust } from "@/auth";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export const submitPost = async (input: string) => {
  const { user } = await validateReqeust();
  if (!user) throw new Error("Unauthrozied");
  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: PostDataInclude,
  });
  return newPost;
};
