"use client";

import { PostData, PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import Post from "@/components/posts/post";
import KyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import PostsSkeleton from "@/components/posts/posts-skeleton";

const FollowingFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      KyInstance.get(
        "/api/posts/following",
        pageParam ? { searchParams: { cursor: pageParam } } : {},
      ).json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const posts = data?.pages.flatMap((page) => page.posts) || [];
  if (status === "pending") {
    return <PostsSkeleton />;
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No post found. Start follwing pepole to see their posts
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while lodaing posts.
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default FollowingFeed;
