import { authApi } from "../auth-api";

type MemberInfo = {
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
};

type GetMeResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
};

async function getMe() {
  const response = await authApi.get("members/me").json<GetMeResponse>();
  return response.result;
}

export { getMe, type GetMeResponse, type MemberInfo };
