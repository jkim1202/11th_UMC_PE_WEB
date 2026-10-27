import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle?: string;
  className?: string;
  variant?: "icon" | "text";
}

export function BookmarkButton({ movieId, movieTitle, className, variant = "icon" }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const label = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      className={cn(
        variant === "icon"
          ? "grid h-6 w-[22px] cursor-pointer place-items-center rounded-[5px] border border-white bg-black/45 p-[3px]"
          : "cursor-pointer rounded bg-[#2563eb] px-4 py-2 text-[10px] font-bold text-white",
        isBookmarked && (variant === "icon" ? "border-blue-600 bg-blue-600" : "bg-[#191b20]"),
        className,
      )}
      type="button"
      aria-label={movieTitle ? `${movieTitle} ${label}` : label}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      {variant === "icon" ? (
        <img
          src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"}
          className="h-full w-full brightness-0 invert"
          alt=""
        />
      ) : (isBookmarked ? "찜 해제" : "찜하기")}
    </button>
  );
}
