import { authApi } from "../auth-api";

type FavoriteStatus = {
  movieId: number;
  isFavorite: boolean;
};

type GetFavoriteResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteStatus;
};

async function getFavorite(movieId: number) {
  const response = await authApi.get(`favorites/${movieId}`).json<GetFavoriteResponse>();
  return response.result;
}

export { getFavorite, type FavoriteStatus, type GetFavoriteResponse };
