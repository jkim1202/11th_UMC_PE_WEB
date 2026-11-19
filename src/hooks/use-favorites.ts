import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { getFavorite } from "../api/favorites/get-favorite";
import type { FavoriteStatus } from "../api/favorites/get-favorite";
import { getFavorites } from "../api/favorites/get-favorites";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { useAuthStore } from "../stores/auth-store";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;
export const FAVORITES_LIST_QUERY_KEY = ["favorites", "list"] as const;
export const favoriteQueryKey = (movieId: number) => ["favorites", "detail", movieId] as const;

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: FAVORITES_LIST_QUERY_KEY,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

export function useFavoriteQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteQueryKey(movieId),
    queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken) && enabled,
  });
}

// 현재 즐겨찾기 상태(boolean)를 인자로 받아 추가/삭제를 결정
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite({ movieId });
      }
      return !isFavorite;
    },
    onSuccess: (nextIsFavorite) => {
      queryClient.setQueryData<FavoriteStatus>(favoriteQueryKey(movieId), {
        movieId,
        isFavorite: nextIsFavorite,
      });
      void queryClient.invalidateQueries({ queryKey: FAVORITES_LIST_QUERY_KEY });
    },
    onError: () => {
      // 409(이미 추가됨)·404(이미 삭제됨)처럼 화면 상태가 서버와 어긋났을 수 있어 다시 조회
      void queryClient.invalidateQueries({ queryKey: favoriteQueryKey(movieId) });
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
