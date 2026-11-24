import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import type { MemberRating } from "../../api/ratings/get-member-ratings";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyRatingsQuery,
  useUpdateRatingMutation,
} from "../../hooks/use-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const STARS = [1, 2, 3, 4, 5];

type MyRatingCardProps = {
  movieId: number;
};

type RatingFormProps = {
  movieId: number;
  rating: MemberRating | undefined;
  isLoading: boolean;
};

function RatingForm({ movieId, rating, isLoading }: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isBusy = isLoading || isPending || deleteMutation.isPending;
  const canSave = rating ? score >= 1 && score !== rating.score : score >= 1;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave || isBusy) return;

    if (rating) {
      updateMutation.mutate({ ratingId: rating.ratingId, score });
    } else {
      createMutation.mutate({ movieId, score });
    }
  }

  function handleDelete() {
    if (!rating || isBusy) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteMutation.mutate(rating.ratingId);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mt-1 text-[9px] text-[#9aa1ab]">{rating ? `내가 준 별점: ${rating.score}점` : "별점을 남겨보세요."}</p>
      <div className="mt-2 flex gap-1" role="group" aria-label="별점 선택">
        {STARS.map((star) => (
          <button
            className={cn(
              "h-6 w-6 rounded border border-[#e1e5ea] bg-white text-xs text-[#727b8c] disabled:cursor-not-allowed disabled:opacity-60",
              star <= score && "border-[#f5a623] text-[#f5a623]",
            )}
            key={star}
            type="button"
            aria-label={`${star}점`}
            aria-pressed={star === score}
            disabled={isBusy}
            onClick={() => setScore(star)}
          >
            ★
          </button>
        ))}
      </div>
      <button className="mt-3 w-full rounded bg-[#191b20] py-2 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!canSave || isBusy}>
        {isPending ? "저장 중" : rating ? "평점 수정" : "평점 저장"}
      </button>
      {rating && (
        <button className="mt-2 w-full text-center text-[10px] text-[#727b8c] underline disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={isBusy} onClick={handleDelete}>
          평점 삭제
        </button>
      )}
    </form>
  );
}

export default function MyRatingCard({ movieId }: MyRatingCardProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const ratingsQuery = useMyRatingsQuery();
  const rating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  return (
    <aside className="rounded bg-white p-3">
      <h2 className="m-0 text-xs font-bold text-[#191b20]">내 평점</h2>
      {accessToken ? (
        <RatingForm
          key={`${rating?.ratingId ?? "none"}-${rating?.score ?? 0}`}
          movieId={movieId}
          rating={rating}
          isLoading={ratingsQuery.isPending}
        />
      ) : (
        <>
          <p className="mt-1 text-[9px] text-[#9aa1ab]">로그인하고 별점을 남겨보세요.</p>
          <div className="mt-2 flex gap-1" role="group" aria-label="별점 선택">
            {STARS.map((star) => (
              <button className="h-6 w-6 rounded border border-[#e1e5ea] bg-white text-xs text-[#727b8c] disabled:cursor-not-allowed disabled:opacity-60" key={star} type="button" aria-label={`${star}점`} disabled>★</button>
            ))}
          </div>
          <Link className="mt-3 block w-full rounded bg-[#191b20] py-2 text-center text-[10px] font-bold text-white no-underline" href="/login">로그인</Link>
        </>
      )}
    </aside>
  );
}
