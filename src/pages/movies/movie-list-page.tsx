import { useState, useEffect } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Footer from "../../components/layout/footer";

export default function MovieListPage() {
const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState<string | null>(null);

// 필수 미션: 목록 화면을 TMDB API에 연결
useEffect(() => {
  let ignore = false;
  async function loadMovies() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getMovies({ page: 1 });
      if (!ignore) setMovies(response.results);
    } catch {
      if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
    } finally {
      if (!ignore) setIsLoading(false);
    }
  }

  loadMovies();

  return () => {
    ignore = true;
  };
}, []);

  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col">
      <main className="mx-auto w-[calc(100%-96px)] max-w-[1126px] flex-1 box-border py-4 pb-[76px] max-[640px]:w-[calc(100%-32px)]">
        <h1 className="mb-3 text-2xl font-extrabold leading-[1.3] tracking-[-1px] text-[#191b20]">영화 목록</h1>
        {/* 필수 미션: 로딩, 오류, 빈 결과, 성공 상태 구분 */}
        {isLoading ? <p className="py-24 text-center text-sm text-[#727b8c]">영화 목록을 불러오는 중이에요.</p>
        : errorMessage ? <p className="py-24 text-center text-sm text-[#727b8c]">{errorMessage}</p>
        : movies.length === 0 ? <p className="py-24 text-center text-sm text-[#727b8c]">영화가 없어요.</p>
        : <MovieGrid movies={movies} />}
      </main>
      {/* 필수 미션: TMDB 출처 표기 */}
      <Footer />
    </div>
  );
}
