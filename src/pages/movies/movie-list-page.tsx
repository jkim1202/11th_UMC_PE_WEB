import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import Footer from "../../components/layout/footer";

export default function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col">
      <main className="mx-auto w-[calc(100%-96px)] max-w-[1126px] flex-1 box-border py-4 pb-[76px] max-[640px]:w-[calc(100%-32px)]">
        <h1 className="mb-3 text-2xl font-extrabold leading-[1.3] tracking-[-1px] text-[#191b20]">영화 목록</h1>
        {/* 필수 미션: 로딩, 오류, 빈 결과, 성공 상태 구분 */}
        {moviesQuery.isPending ? <p className="py-24 text-center text-sm text-[#727b8c]">영화 목록을 불러오는 중이에요.</p>
        : moviesQuery.isError ? <p className="py-24 text-center text-sm text-[#727b8c]">{moviesQuery.error.message}</p>
        : movies.length === 0 ? <p className="py-24 text-center text-sm text-[#727b8c]">영화가 없어요.</p>
        : <MovieGrid movies={movies} />}
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </main>
      {/* 필수 미션: TMDB 출처 표기 */}
      <Footer />
    </div>
  );
}
