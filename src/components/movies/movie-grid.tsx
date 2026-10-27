import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

type MovieGridProps = {
  movies: TmdbMovieListItem[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className="grid grid-cols-5 gap-x-2.5 gap-y-3.5 max-[640px]:grid-cols-3 max-[420px]:grid-cols-2" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
