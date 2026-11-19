import { apiClient } from "../api-client";

type MemberRating = {
  ratingId: number;
  movieId: number;
  score: number;
  createdAt: string;
};

type GetMemberRatingsResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberRating[];
};

async function getMemberRatings(memberId: number) {
  const response = await apiClient.get(`members/${memberId}/ratings`).json<GetMemberRatingsResponse>();
  return response.result;
}

export { getMemberRatings, type GetMemberRatingsResponse, type MemberRating };
