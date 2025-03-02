"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { TPostWithCategoryWithAuthor } from "@/types";
import { useUserStore } from "@/store/userStore";
import { useTalkPosts } from "@/hooks/talk/usePosts";
import BoardFilter from "@/components/talk/BoardFilter";
import BoardList from "@/components/talk/BoardList";
import PaginationWrapper from "@/components/talk/PaginationWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const TalkBoard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useUserStore();
  const categoryParam = searchParams?.get("category") || "all";
  const subCategoryParam = searchParams?.get("subcategory") || "전체";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOrder, setSelectOrder] = useState<string>("desc");
  const [selectedSort, setSelectedSort] = useState<string>("createdAt");
  const [keyword, setKeyword] = useState<string>("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTalkPosts(
      categoryParam,
      subCategoryParam,
      selectedSort,
      selectOrder,
      keyword
    );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!data) return;

    const pageToFetch = page - data.pages.length;
    if (pageToFetch > 0) {
      for (let i = 0; i < pageToFetch; i++) {
        fetchNextPage();
      }
    }
  };

  const handleWriteButtonClick = () => {
    if (!currentUser) {
      toast.warn("로그인 후 이용해주세요.");
      return;
    }
    router.push("/talk/write");
  };

  // 현재 페이지의 게시물 목록
  const currentPosts = data?.pages[currentPage - 1]?.posts || [];
  // 전체 페이지 수
  const totalPages = data?.pages[0]?.totalPages || 0;

  return (
    <div className="w-full min-w-[350px] h-full rounded-md">
      <BoardFilter
        categoryParam={categoryParam}
        subCategoryParam={subCategoryParam}
        setSelectOrder={setSelectOrder}
        setSelectedSort={setSelectedSort}
        setKeyword={setKeyword}
      />
      <div className="flex w-full items-center justify-between p-4 pt-10 text-gray-600 border-b-2 border-gray-200 text-xs md:text-base">
        <div className="flex gap-8 md:gap-10">
          <p className="w-[120px] md:w-[200px] sm:block hidden">
            카테고리 / 서브카테고리
          </p>
          <p>제목</p>
        </div>
        <div className="flex gap-2 md:gap-5">
          <p>작성자</p>
          <p>작성일</p>
          <p>조회수</p>
          <p>추천수</p>
        </div>
      </div>
      {data?.pages[0]?.posts.length === 0 && (
        <div className="w-full items-center justify-center p-28 gap-10 flex flex-col text-xl font-semibold text-center ">
          <p>작성된 게시물이 없습니다.</p>
          <Button
            onClick={handleWriteButtonClick}
            variant="primary"
            className="px-6 py-5 rounded-md text-lg"
          >
            게시물 작성하기
          </Button>
        </div>
      )}
      {(isLoading || isFetchingNextPage) && (
        <div className="w-full h-full flex flex-col gap-[2px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[58px]" />
          ))}
        </div>
      )}

      {currentPosts.map((post: TPostWithCategoryWithAuthor) => (
        <BoardList key={post.id} post={post} />
      ))}

      {totalPages > 0 && (
        <PaginationWrapper
          page={currentPage}
          setPage={handlePageChange}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </div>
  );
};

export default TalkBoard;
