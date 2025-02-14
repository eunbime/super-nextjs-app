"use client";

import dynamic from "next/dynamic";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";
import { useProductAction } from "@/hooks/product/useProductAction";
import { useProduct } from "@/hooks/product/useProduct";
import { useUserStore } from "@/store/userStore";
import { useOpenChat } from "@/hooks/chat/useOpenChat";

interface ProductClientProps {
  productId?: string;
}

const ProductClient = ({ productId }: ProductClientProps) => {
  const currentUser = useUserStore((state) => state.currentUser);

  const { product, error, category, subCategory } = useProduct({
    productId,
  });

  const { handleDeleteClick, handleUpdateClick } = useProductAction({
    productId,
  });

  const { handleOpenChat } = useOpenChat({
    user: product?.user,
  });

  const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
        지도 로딩중...
      </div>
    ),
  });

  if (error) {
    return <div>상품 로딩 중 오류가 발생했습니다.</div>;
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pt-14">
        <div className="flex flex-col gap-6">
          <ProductHead
            title={product?.title}
            imageSrc={product?.imageSrc}
            id={product?.id}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-10 w-full mb-10">
            <ProductInfo
              user={product?.user}
              category={category?.name as string}
              createdAt={product?.createdAt}
              price={product?.price}
              description={product?.description}
              subCategory={subCategory?.name as string}
            />

            <div>
              <KakaoMap
                detailPage
                latitude={product?.latitude}
                longitude={product?.longitude}
              />
            </div>
          </div>

          {currentUser?.id !== product?.user?.id && (
            <div>
              <Button onClick={handleOpenChat} label="이 유저와 채팅하기" />
            </div>
          )}
          {currentUser?.id === product?.user?.id && (
            <div className="flex gap-2">
              <Button onClick={handleDeleteClick} label="삭제" />
              <Button onClick={handleUpdateClick} label="수정" />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductClient;
