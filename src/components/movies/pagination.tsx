import { cn } from "../../utils/cn";

const VISIBLE_PAGES = 5;

const TMDB_MAX_PAGE = 500;

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const lastPage = Math.min(totalPages, TMDB_MAX_PAGE);
  if (lastPage <= 1) return null;

  // 현재 페이지가 가운데 오도록 5개씩 보여줘요.
  const start = Math.max(1, Math.min(page - Math.floor(VISIBLE_PAGES / 2), lastPage - VISIBLE_PAGES + 1));
  const end = Math.min(lastPage, start + VISIBLE_PAGES - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  const arrowClass = "flex h-8 w-8 items-center justify-center rounded disabled:opacity-30";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="페이지 이동">
      <button className={arrowClass} type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="이전 페이지">
        <img className="h-4 w-4" src="/icons/movie-icons/chevron-left.svg" alt="" />
      </button>
      {pages.map((pageNumber) => (
        <button
          className={cn(
            "h-8 w-8 rounded text-xs font-bold",
            pageNumber === page ? "bg-[#191b20] text-white" : "text-[#191b20] hover:bg-[#e8ebef]",
          )}
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}
      <button className={arrowClass} type="button" onClick={() => onPageChange(page + 1)} disabled={page >= lastPage} aria-label="다음 페이지">
        <img className="h-4 w-4" src="/icons/movie-icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
