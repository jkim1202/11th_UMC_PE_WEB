import ky from "ky";
import { env } from "../config/env";

// 필수 미션: ky 인스턴스
export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});