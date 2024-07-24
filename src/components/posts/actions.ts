"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";

export const deletePost = async (id: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthrozied");

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: getPostDataInclude(user.id),
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
