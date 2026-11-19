import { authApi } from "../auth-api";

type FavoriteItem = {
  movieId: number;
  createdAt: string;
};

type GetFavoritesResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteItem[];
};

async function getFavorites() {
  const response = await authApi.get("favorites").json<GetFavoritesResponse>();
  return response.result;
}

export { getFavorites, type FavoriteItem, type GetFavoritesResponse };
