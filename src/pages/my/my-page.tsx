import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieListItem } from "../../api/movies/models";
import Footer from "../../components/layout/footer";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { mockProfile } from "../../data/mock-profile";
import { useBookmarkStore } from "../../stores/bookmark-store";

const PAGE_SIZE = 20;

export default function MyPage() {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageIds = bookmarkedMovieIds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const detailQueries = useQueries({
    queries: pageIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000, // 상세 페이지와 같은 캐시 유지 시간
    })),
  });

  const isLoading = detailQueries.some((query) => query.isPending);
  const hasError = detailQueries.some((query) => query.isError);
  const movies: TmdbMovieListItem[] = detailQueries.flatMap((query) =>
    query.data ? [{ ...query.data, genre_ids: query.data.genres.map((genre) => genre.id) }] : [],
  );

  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col">
      <main className="mx-auto w-[calc(100%-96px)] max-w-[1126px] flex-1 box-border py-4 pb-[76px] max-[640px]:w-[calc(100%-32px)]">
        <div className="flex items-center justify-between border-b border-[#dfe3e8] pb-4">
          <h1 className="text-2xl font-extrabold leading-[1.3] tracking-[-1px] text-[#191b20]">내 정보</h1>
          <Link className="rounded-md bg-[#2563eb] px-4 py-2 text-[11px] font-bold text-white no-underline" to="/my/edit">정보 수정</Link>
        </div>

        <section className="border-b border-[#dfe3e8] py-5" aria-labelledby="basic-info">
          <h2 className="mb-3 text-xs font-bold text-[#111]" id="basic-info">기본 정보</h2>
          <div className="flex items-center gap-5 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4">
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#e8ebef] text-[#111]">
              {mockProfile.profileImageUrl ? (
                <img className="h-full w-full object-cover" src={mockProfile.profileImageUrl} alt="프로필 이미지" />
              ) : (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6z" />
                </svg>
              )}
            </div>
            <dl className="m-0 flex gap-[120px] max-[640px]:flex-col max-[640px]:gap-3">
              <div>
                <dt className="text-[9px] text-[#727b8c]">닉네임</dt>
                <dd className="m-0 mt-1 text-xs font-bold text-[#111]">{mockProfile.nickname}</dd>
              </div>
              <div>
                <dt className="text-[9px] text-[#727b8c]">이메일</dt>
                <dd className="m-0 mt-1 break-all text-xs font-bold text-[#111]">{mockProfile.email}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="py-5" aria-labelledby="my-bookmarks">
          <h2 className="mb-3 text-xs font-bold text-[#111]" id="my-bookmarks">내 즐겨찾기</h2>
          {bookmarkedMovieIds.length === 0 ? <p className="py-16 text-center text-sm text-[#727b8c]">즐겨찾기한 영화가 없어요.</p>
          : isLoading ? <p className="py-16 text-center text-sm text-[#727b8c]">즐겨찾기를 불러오는 중이에요.</p>
          : hasError && movies.length === 0 ? <p className="py-16 text-center text-sm text-[#727b8c]">즐겨찾기를 불러오지 못했어요.</p>
          : <MovieGrid movies={movies} />}
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
