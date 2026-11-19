import { apiClient } from "../api-client";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
};

function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}

export { login, type LoginRequest, type LoginResponse };
