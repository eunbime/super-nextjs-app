"use client";

import { useRouter } from "next/navigation";
import Button from "./common/Button";
import Heading from "./common/Heading";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  showCategoryReset?: boolean;
  params?: string;
}

const EmptyState = ({
  title = "일치하는 게 없습니다.",
  subtitle = "필터를 제거해 보세요.",
  showReset,
  showCategoryReset,
  params,
}: EmptyStateProps) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center w-full">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="모든 필터 제거"
            onClick={() => router.push("/")}
          />
        )}
        {showCategoryReset && (
          <Button
            outline
            label="카테고리 필터 제거"
            onClick={() => router.push(`/?category=${params}`)}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
