import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

type UpdateMeRequest = {
  nickname: string;
};

type UpdateMeResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
};

function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
}

export { updateMe, type UpdateMeRequest, type UpdateMeResponse };
