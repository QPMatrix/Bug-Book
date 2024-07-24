import { LikeInfo } from "@/lib/types";
import React from "react";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import KyInstance from "@/lib/ky";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
interface LikeButtonProps {
  postId: string;
  initinalState: LikeInfo;
}
const LikeButton = ({ initinalState, postId }: LikeButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      KyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initinalState,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? KyInstance.delete(`/api/posts/${postId}/likes`).json<LikeInfo>()
        : KyInstance.post(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<LikeInfo>(queryKey);
      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes: (prevState?.likes || 0) + (prevState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !prevState?.isLikedByUser,
      }));
      return { prevState };
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
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <HeartIcon
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};

export default LikeButton;
