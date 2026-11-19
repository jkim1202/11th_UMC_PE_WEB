import { authApi } from "../auth-api";

type CreateRatingRequest = {
  movieId: number;
  score: number;
};

type CreateRatingResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    ratingId: number;
    movieId: number;
    score: number;
  };
};

async function createRating(body: CreateRatingRequest) {
  const response = await authApi.post("ratings", { json: body }).json<CreateRatingResponse>();
  return response.result;
}

export { createRating, type CreateRatingRequest, type CreateRatingResponse };
