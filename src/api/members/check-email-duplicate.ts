import { apiClient } from "../api-client";

type CheckEmailDuplicateResponse = {
  available: boolean;
};

function checkEmailDuplicate(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailDuplicateResponse>();
}

export { checkEmailDuplicate, type CheckEmailDuplicateResponse };
