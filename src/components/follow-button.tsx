"use client";
import { useFollowerInfo } from "@/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import KyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  initailState: FollowerInfo;
}

const FollowButton = ({ userId, initailState }: FollowButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { data } = useFollowerInfo(userId, initailState);
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? KyInstance.delete(`/api/users/${userId}/followers`)
        : KyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<FollowerInfo>(queryKey);
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !prevState?.isFollowedByUser,
      }));

      return {
        prevState,
      };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.prevState);
      console.log(error);
      toast({
        variant: "destructive",
        description: "Some thing went wrong. Please try again",
      });
    },
  });
  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
