"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updatedUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
  const validateValues = updatedUserProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validateValues,
    select: getUserDataSelect(user.id),
  });
  return updatedUser;
};
