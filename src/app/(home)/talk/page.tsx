import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkBoard from "@/components/talk/TalkBoard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export const metadata: Metadata = {
  title: "TALK!T 토크",
  description: "TALK!T 커뮤니티입니다.",
};

export default async function TalkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queryClient = new QueryClient();
  console.log(searchParams);

  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      "talk-posts",
      searchParams.category,
      searchParams.subcategory,
      "createdAt",
      "desc",
      "",
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/talk/posts`,
        {
          params: {
            page: pageParam,
            limit: 20,
            sort: "createdAt",
            order: "desc",
            category: searchParams.category,
            subcategory: searchParams.subcategory,
          },
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
      return data;
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        <div className="flex h-full w-full justify-between gap-10">
          <TalkMenuNav />
          <Suspense
            fallback={
              <div className="w-full h-full">
                <div className="w-full h-full bg-gray-100">Loading...</div>
              </div>
            }
          >
            <TalkBoard />
          </Suspense>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
