import MovieGrid from "../../components/movies/movie-grid";

export default function MovieListPage() {
  return (
    <main className="mx-auto w-[calc(100%-96px)] max-w-[1126px] flex-1 box-border py-4 pb-[76px] max-[640px]:w-[calc(100%-32px)]">
        <h1 className="mb-3 text-2xl font-extrabold leading-[1.3] tracking-[-1px] text-[#191b20]">영화 목록</h1>
        <MovieGrid />
    </main>
  );
}
