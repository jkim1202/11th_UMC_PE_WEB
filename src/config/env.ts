const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;

if (!tmdbApiBaseUrl) {
  throw new Error("API 기본 주소 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
};
