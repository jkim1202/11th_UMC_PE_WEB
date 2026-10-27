import { createFileRoute } from "@tanstack/react-router";
import MovieDetailPage from "../pages/movies/movie-detail-page";
import { movies } from "../data/movies";

export const Route = createFileRoute("/movies/$movieId")({
  component: function MovieDetailRoute() {
    const { movieId } = Route.useParams();
    return <MovieDetailPage movie={movies.find((movie) => movie.id === Number(movieId))} />;
  },
});
