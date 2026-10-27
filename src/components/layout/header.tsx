import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

function Logo() {
  return (
    <Link className="flex items-center gap-1.5 text-base font-extrabold text-[#111] no-underline" to="/">
      <img className="h-6 w-6" src="/icons/movie-icons/movie.svg" alt="" />
      <span>UMCine</span>
    </Link>
  );
}

function Navigation() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav className="flex gap-[22px]" aria-label="메인 메뉴">
      <Link className={cn("text-[11px] text-[#555] no-underline", pathname === "/" && "font-bold text-[#111] underline underline-offset-[5px]")} to="/">영화</Link>
      <Link className={cn("text-[11px] text-[#555] no-underline", pathname === "/search" && "font-bold text-[#111] underline underline-offset-[5px]")} to="/search" search={{ query: "" }}>검색</Link>
      <a className="text-[11px] text-[#555] no-underline" href="/my">내 정보</a>
    </nav>
  );
}

function HeaderActions() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Link className="grid h-[30px] w-[30px] place-items-center rounded-md border border-[#e5e7eb] p-1.5" to="/search" search={{ query: "" }} aria-label="검색">
        <img className="h-4 w-4" src="/icons/movie-icons/search.svg" alt="" />
      </Link>
      <a className="rounded-md bg-[#2563eb] px-3.5 py-1.5 text-[11px] font-bold text-white no-underline" href="/login">로그인</a>
    </div>
  );
}

export default function Header() {
  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex min-h-14 w-[calc(100%-96px)] max-w-[1126px] items-center gap-7 box-border max-[640px]:w-[calc(100%-32px)] max-[640px]:flex-wrap max-[640px]:gap-4 max-[640px]:py-2">
        <Logo />
        <Navigation />
        <HeaderActions />
      </div>
    </header>
  );
}
