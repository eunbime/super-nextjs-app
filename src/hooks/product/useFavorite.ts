import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Like, User } from "@prisma/client";

interface UseFavoriteProps {
  productId: string;
  currentUser?: User | null;
}

const useFavorite = ({ productId, currentUser }: UseFavoriteProps) => {
  const queryClient = useQueryClient();

  const { data: likes } = useQuery<Like[]>({
    queryKey: ["likes", { userId: currentUser?.id }],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/likes/by-user/${currentUser?.id}`
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error("찜 목록을 불러오는 중 오류가 발생했습니다.");
          throw new Error(
            `찜 목록을 불러오는 중 오류가 발생했습니다.: ${error.message}`
          );
        }
        toast.error("찜 목록을 불러오는 중 오류가 발생했습니다.");
        throw new Error("찜 목록을 불러오는 중 오류가 발생했습니다.");
      }
    },
    enabled: !!currentUser,
  });

  const isLiked = likes?.some((like) => like.productId === productId) || false;

  const { mutate: toggleFavorite } = useMutation<
    void,
    Error,
    void,
    { previousLikes: Like[] }
  >({
    mutationFn: async () => {
      return isLiked
        ? axios.delete(`/api/likes/${productId}`)
        : axios.post(`/api/likes/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes", { userId: currentUser?.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["products", "favorites", { userId: currentUser?.id }],
      });
      toast.success(
        !isLiked ? "찜 목록에 추가되었습니다." : "찜 목록에서 제거되었습니다."
      );
    },
    onError: (error) => {
      toast.error("일시적인 오류가 발생했습니다.");
      throw new Error(`${error.message}`);
    },
  });

  return { isLiked, toggleFavorite };
};

export default useFavorite;
