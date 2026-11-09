import { apiClient } from "../api-client";

type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
};

type SignupResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
};

function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup, type SignupRequest, type SignupResponse };
