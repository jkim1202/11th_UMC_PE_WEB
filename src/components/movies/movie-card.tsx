import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

type MovieCardProps = {
  movie: TmdbMovieListItem;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0 text-left">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img className="block aspect-[144/163] w-full rounded-lg object-cover" src={getTmdbPosterUrl(movie.poster_path) ?? undefined} alt={`${movie.title} 포스터`} />
        </Link>

        <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="absolute top-[6px] right-[6px]" />
      </div>

      <Link className="mt-[5px] mb-[2px] block text-[10px] font-bold leading-[1.3] text-[#111] no-underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
      <p className="m-0 text-[9px] leading-[1.3] text-[#888]">{movie.release_date}</p>
    </article>
  );
}
