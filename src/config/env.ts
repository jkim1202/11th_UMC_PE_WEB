const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;

if (!tmdbApiBaseUrl) {
  throw new Error("API 기본 주소 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  // 끝의 "/"를 제거해 api-client에서 이중 슬래시가 생기지 않게 함
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, ""),
};
