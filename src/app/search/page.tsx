import { Suspense } from "react";
import SearchPage from "../../views/movies/search-page";

export default function Page() {
  // useSearchParams()는 요청 URL을 알아야 하므로 Suspense 경계 안에서 사용한다.
  return (
    <Suspense fallback={<main className="p-8">검색 화면을 불러오는 중이에요.</main>}>
      <SearchPage />
    </Suspense>
  );
}
