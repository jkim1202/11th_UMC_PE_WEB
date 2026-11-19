import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import type { MemberRating } from "../api/ratings/get-member-ratings";
import { updateRating } from "../api/ratings/update-rating";
import { useAuthStore } from "../stores/auth-store";
import { useMeQuery } from "./use-me-query";

export const myRatingsQueryKey = (memberId: number) => ["ratings", "member", memberId] as const;

export function useMyRatingsQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = useMeQuery().data?.memberId;

  return useQuery({
    queryKey: myRatingsQueryKey(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: Boolean(accessToken) && memberId !== undefined,
  });
}

// 캐시가 없으면 갱신하지 않고 그대로 둔다
function useRatingsCacheUpdater() {
  const queryClient = useQueryClient();
  const memberId = useMeQuery().data?.memberId;

  function update(updater: (ratings: MemberRating[]) => MemberRating[]) {
    if (memberId === undefined) return;
    queryClient.setQueryData<MemberRating[]>(myRatingsQueryKey(memberId), (prev) => (prev ? updater(prev) : prev));
  }

  function invalidate() {
    if (memberId === undefined) return;
    void queryClient.invalidateQueries({ queryKey: myRatingsQueryKey(memberId) });
  }

  return { update, invalidate };
}

export function useCreateRatingMutation() {
  const { update, invalidate } = useRatingsCacheUpdater();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (result) => {
      update((ratings) => [...ratings, { ...result, createdAt: new Date().toISOString() }]);
      alert("평점을 저장했어요.");
    },
    onError: () => {
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
      invalidate();
    },
  });
}

export function useUpdateRatingMutation() {
  const { update, invalidate } = useRatingsCacheUpdater();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (result) => {
      update((ratings) =>
        ratings.map((rating) => (rating.ratingId === result.ratingId ? { ...rating, score: result.score } : rating)),
      );
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
      invalidate();
    },
  });
}

export function useDeleteRatingMutation() {
  const { update, invalidate } = useRatingsCacheUpdater();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (result) => {
      update((ratings) => ratings.filter((rating) => rating.ratingId !== result.ratingId));
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
      invalidate();
    },
  });
}
