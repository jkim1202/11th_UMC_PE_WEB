import { authApi } from "../auth-api";

type UpdateRatingRequest = {
  ratingId: number;
  score: number;
};

type UpdateRatingResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    ratingId: number;
    movieId: number;
    score: number;
  };
};

async function updateRating({ ratingId, score }: UpdateRatingRequest) {
  const response = await authApi.patch(`ratings/${ratingId}`, { json: { score } }).json<UpdateRatingResponse>();
  return response.result;
}

export { updateRating, type UpdateRatingRequest, type UpdateRatingResponse };
