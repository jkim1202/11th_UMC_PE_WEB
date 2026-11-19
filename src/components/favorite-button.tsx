import { useNavigate } from "@tanstack/react-router";
import { useFavoriteQuery, useToggleFavoriteMutation } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle?: string;
  className?: string;
}

export function FavoriteButton({ movieId, movieTitle, className }: FavoriteButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const favoriteQuery = useFavoriteQuery(movieId, isValidMovieId);
  const toggleMutation = useToggleFavoriteMutation(movieId);

  const isFavorite = Boolean(accessToken) && favoriteQuery.data?.isFavorite === true;
  const isBusy = Boolean(accessToken) && (favoriteQuery.isPending || toggleMutation.isPending);
  const label = isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";

  function handleClick() {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      void navigate({ to: "/login" });
      return;
    }
    if (isBusy) return;
    toggleMutation.mutate(isFavorite);
  }

  return (
    <button
      className={cn(
        "cursor-pointer rounded bg-[#2563eb] px-4 py-2 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60",
        isFavorite && "bg-[#191b20]",
        className,
      )}
      type="button"
      aria-label={movieTitle ? `${movieTitle} ${label}` : label}
      aria-pressed={isFavorite}
      disabled={isBusy}
      onClick={handleClick}
    >
      {isFavorite ? "찜 해제" : "찜하기"}
    </button>
  );
}
