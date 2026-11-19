import { authApi } from "../auth-api";

type DeleteRatingResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    ratingId: number;
  };
};

async function deleteRating(ratingId: number) {
  const response = await authApi.delete(`ratings/${ratingId}`).json<DeleteRatingResponse>();
  return response.result;
}

export { deleteRating, type DeleteRatingResponse };
