const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;

if (!tmdbApiBaseUrl) {
  throw new Error("API 기본 주소 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  // 끝의 "/"를 제거해 api-client에서 이중 슬래시가 생기지 않게 함
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, ""),
};
