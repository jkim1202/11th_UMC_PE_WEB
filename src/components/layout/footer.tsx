export default function Footer() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white">
      <div className="mx-auto flex min-h-[38px] w-[calc(100%-96px)] max-w-[1126px] items-center justify-end gap-1.5 box-border py-2 text-[9px] leading-[1.5] text-[#727b8c] max-[640px]:w-[calc(100%-32px)]">
        <img className="w-[18px] shrink-0" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p>This product uses the TMDB API but is not endorsed or certified by <a className="text-inherit" href="https://www.themoviedb.org/">TMDB</a>.</p>
      </div>
    </footer>
  );
}
