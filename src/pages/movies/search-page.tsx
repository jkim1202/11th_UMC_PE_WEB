import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import Footer from "../../components/layout/footer";
import { BookmarkButton } from "../../components/bookmark-button";

export default function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [input, setInput] = useState(query);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 필수 미션: 검색 화면을 TMDB API에 연결
  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ search: { query: input.trim() } });
  }

  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col">
      <main className="mx-auto w-[calc(100%-96px)] max-w-[1126px] flex-1 box-border py-4 pb-10 max-[640px]:w-[calc(100%-32px)]">
        <h1 className="mb-3 text-2xl font-extrabold leading-[1.3] tracking-[-1px] text-[#191b20]">영화 검색</h1>
        <form className="flex h-10 items-center gap-2 rounded border border-[#dfe3e8] bg-white px-3" onSubmit={handleSubmit}>
          <img className="h-4 w-4" src="/icons/movie-icons/search.svg" alt="" />
          <input className="min-w-0 flex-1 border-0 bg-transparent text-xs outline-none" value={input} onChange={(event) => setInput(event.target.value)} placeholder="영화 제목을 검색해보세요" aria-label="영화 검색어" />
          {input && <button className="text-lg leading-none text-[#727b8c]" type="button" onClick={() => setInput("")} aria-label="검색어 지우기">×</button>}
          <button className="rounded bg-[#191b20] px-3 py-1.5 text-[10px] font-bold text-white" type="submit"> {query ? "다시 검색" : "검색"}</button>
        </form>

        {query ? (
          <>
            <h2 className="mt-4 mb-3 text-xs font-bold text-[#191b20]">‘{query}’ 검색 결과 <span className="font-normal text-[#9aa1ab]">{movies.length}건</span></h2>
            {/* 필수 미션: 로딩, 오류, 빈 결과, 성공 상태 구분 */}
            {isLoading ? <p className="py-20 text-center text-sm text-[#727b8c]">검색 중이에요.</p>
            : errorMessage ? <p className="py-20 text-center text-sm text-[#727b8c]">{errorMessage}</p>
            : movies.length > 0 ? (
              <section className="grid grid-cols-2 gap-x-8 gap-y-3 max-[640px]:grid-cols-1" aria-label="검색 결과">
                {movies.map((movie) => (
                  <article className="relative min-w-0 border-b border-[#e8ebef] pb-3" key={movie.id}>
                    <Link className="flex min-w-0 gap-3 no-underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                      <img className="h-[88px] w-[58px] shrink-0 rounded object-cover" src={movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : undefined} alt={`${movie.title} 포스터`} />
                      <span className="min-w-0 pt-0.5">
                        <strong className="block truncate text-xs text-[#191b20]">{movie.title}</strong>
                        <span className="mt-0.5 block text-[9px] text-[#9aa1ab]">{movie.original_title} · {movie.release_date}</span>
                        <span className="mt-2 line-clamp-2 block text-[10px] leading-[1.5] text-[#727b8c]">{movie.overview}</span>
                        <span className="mt-1.5 block text-[9px] font-bold text-[#2563eb]">상세 보기 →</span>
                      </span>
                    </Link>
                    <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="absolute top-[6px] left-[30px]" />
                  </article>
                ))}
              </section>
            ) : <p className="py-20 text-center text-sm text-[#727b8c]">검색 결과가 없어요.</p>}
          </>
        ) : <p className="py-24 text-center text-sm text-[#727b8c]">검색어를 입력해 주세요.</p>}
      </main>
      {/* 필수 미션: TMDB 출처 표기 */}
      <Footer />
    </div>
  );
}
