import { useState, useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";
import Footer from "../../components/layout/footer";

export default function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 필수 미션: 상세 화면을 TMDB API에 연결
  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

  // 필수 미션: 잘못된 번호, 로딩, 오류 상태 구분
  if (!isValidMovieId) return <main className="p-8 text-sm">올바르지 않은 영화 번호예요.</main>;
  if (isLoading) return <main className="p-8 text-sm">영화 정보를 불러오는 중이에요.</main>;
  if (errorMessage) return <main className="p-8 text-sm">{errorMessage}</main>;
  if (!movie) return null;

  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col">
      <main className="mx-auto w-[calc(100%-96px)] max-w-[1126px] flex-1 box-border max-[640px]:w-[calc(100%-32px)]">
        <div className="relative h-[280px] overflow-hidden bg-[#191b20] max-[640px]:h-[360px]">
          <img className="absolute inset-0 h-full w-full object-cover opacity-80" src={getTmdbBackdropUrl(movie.backdrop_path) ?? undefined} alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white max-[640px]:p-5">
            <Link className="mb-12 block text-[10px] text-white/80 no-underline max-[640px]:mb-8" to="/">‹ 영화 목록</Link>
            <h1 className="m-0 text-3xl font-extrabold tracking-[-1px] max-[640px]:text-2xl">{movie.title}</h1>
            <p className="mt-1 text-[10px] text-white/80">{movie.original_title}</p>
            <p className="mt-2 text-[10px]">{movie.release_date} · {movie.genres.map((genre) => genre.name).join(" · ")}{movie.runtime ? ` · ${movie.runtime}분` : ""}</p>
          </div>
        </div>
        <section className="grid grid-cols-[170px_minmax(0,1fr)_180px] gap-5 bg-[#f5f6f8] p-5 max-[640px]:grid-cols-1" aria-label="영화 상세 정보">
          <img className="h-[196px] w-[170px] rounded object-cover shadow-md max-[640px]:h-auto max-[640px]:w-full" src={getTmdbPosterUrl(movie.poster_path) ?? undefined} alt={`${movie.title} 포스터`} />
          <div>
            <h2 className="m-0 text-sm font-bold text-[#191b20]">{movie.tagline}</h2>
            <p className="mt-3 text-xs leading-[1.8] text-[#727b8c]">{movie.overview}</p>
            <BookmarkButton movieId={movie.id} movieTitle={movie.title} variant="text" className="mt-4" />
          </div>
          <aside className="rounded bg-white p-3">
            <h2 className="m-0 text-xs font-bold text-[#191b20]">내 평점</h2>
            <p className="mt-1 text-[9px] text-[#9aa1ab]">별점을 남겨보세요.</p>
            <div className="mt-2 flex gap-1" aria-label="평점 5점">
              {[1, 2, 3, 4, 5].map((star) => <button className="h-6 w-6 rounded border border-[#e1e5ea] bg-white text-xs text-[#727b8c]" key={star} type="button" aria-label={`${star}점`}>★</button>)}
            </div>
            <textarea className="mt-3 h-16 w-full resize-none rounded border border-[#e1e5ea] p-2 text-[10px] outline-none" placeholder="한줄평을 남겨주세요." />
            <button className="mt-2 w-full rounded bg-[#191b20] py-2 text-[10px] font-bold text-white" type="button">평점 저장</button>
          </aside>
        </section>
      </main>
      {/* 필수 미션: TMDB 출처 표기 */}
      <Footer />
    </div>
  );
}
