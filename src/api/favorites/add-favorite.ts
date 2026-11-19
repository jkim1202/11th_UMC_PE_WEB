import { authApi } from "../auth-api";
import type { FavoriteItem } from "./get-favorites";

type AddFavoriteRequest = {
  movieId: number;
};

type AddFavoriteResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteItem;
};

async function addFavorite(body: AddFavoriteRequest) {
  const response = await authApi.post("favorites", { json: body }).json<AddFavoriteResponse>();
  return response.result;
}

export { addFavorite, type AddFavoriteRequest, type AddFavoriteResponse };
