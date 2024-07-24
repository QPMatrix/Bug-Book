import React from "react";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import KyInstance from "@/lib/ky";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookmarkInfo } from "@/lib/types";
interface BookmarkButtonProps {
  postId: string;
  initinalState: BookmarkInfo;
}
const BookmarkButton = ({ initinalState, postId }: BookmarkButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      KyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initinalState,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookedmarkByUser
        ? KyInstance.delete(
            `/api/posts/${postId}/bookmark`,
          ).json<BookmarkInfo>()
        : KyInstance.post(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookedmarkByUser ? "un" : ""}bookmarked`,
      });
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookedmarkByUser: !prevState?.isBookedmarkByUser,
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
      <BookmarkIcon
        className={cn(
          "size-5",
          data.isBookedmarkByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
};

export default BookmarkButton;
