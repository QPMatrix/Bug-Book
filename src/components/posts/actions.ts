"use server";

import { validateReqeust } from "@/auth";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

export const deletePost = async (id: string) => {
  const { user } = await validateReqeust();
  if (!user) throw new Error("Unauthrozied");

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: PostDataInclude,
  });
  if (!post) throw new Error("Post not found");
  if (post.userId !== user.id) throw new Error("Unauthrozied");

  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
  });
  return deletedPost;
};
