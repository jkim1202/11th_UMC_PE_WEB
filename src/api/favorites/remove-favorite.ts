import { authApi } from "../auth-api";

type RemoveFavoriteResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    movieId: number;
  };
};

async function removeFavorite(movieId: number) {
  const response = await authApi.delete(`favorites/${movieId}`).json<RemoveFavoriteResponse>();
  return response.result;
}

export { removeFavorite, type RemoveFavoriteResponse };
