import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ChangeEvent, SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { cn } from "../../utils/cn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

type FieldKey = "email" | "nickname" | "password" | "passwordConfirm";
type DuplicateKey = "email" | "nickname";

type DuplicateState = {
  isChecking: boolean;
  isAvailable: boolean;
};

const DUPLICATE_LABEL: Record<DuplicateKey, string> = {
  email: "이메일",
  nickname: "닉네임",
};

const initialDuplicateState: DuplicateState = { isChecking: false, isAvailable: false };

type FieldProps = {
  id: FieldKey;
  label: string;
  type?: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  errorMessage?: string;
  hint?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  duplicateButton?: { label: string; disabled: boolean; onClick: () => void };
};

function Field({ id, label, type = "text", autoComplete, placeholder, value, disabled, errorMessage, hint, onChange, duplicateButton }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, errorMessage ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#111]" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          className={cn(
            "h-12 w-full rounded-md border border-[#dfe3e8] bg-white px-3.5 text-sm text-[#111] outline-none placeholder:text-[#9aa1ab] focus:border-[#2563eb] disabled:bg-[#f5f6f8]",
            duplicateButton && "pr-20",
          )}
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy}
          onChange={onChange}
        />
        {duplicateButton && (
          <button
            className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded px-2 py-2 text-[11px] font-bold text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            aria-label={`${label} ${duplicateButton.label}`}
            disabled={duplicateButton.disabled}
            onClick={duplicateButton.onClick}
          >
            {duplicateButton.label}
          </button>
        )}
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-[#9aa1ab]" id={hintId}>{hint}</p>}
      {errorMessage && <p className="mt-1.5 text-[11px] text-[#e5484d]" id={errorId} aria-live="polite">{errorMessage}</p>}
    </div>
  );
}

export default function SignupPage() {
  const [form, setForm] = useState<Record<FieldKey, string>>({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    email: false,
    nickname: false,
    password: false,
    passwordConfirm: false,
  });
  const [duplicateCheck, setDuplicateCheck] = useState<Record<DuplicateKey, DuplicateState>>({
    email: initialDuplicateState,
    nickname: initialDuplicateState,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const nicknameLength = form.nickname.trim().length;
  const isNicknameValid = nicknameLength >= 2 && nicknameLength <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid = form.passwordConfirm !== "" && form.password === form.passwordConfirm;

  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  const canSubmit = isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FieldKey) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if ((key === "email" || key === "nickname") && duplicateCheck[key].isChecking) return;

      const value = event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setTouched((prev) => ({ ...prev, [key]: true }));

      if (key === "email" || key === "nickname") {
        setDuplicateCheck((prev) => ({ ...prev, [key]: initialDuplicateState }));
      }
    };
  }

  async function handleCheckDuplicate(key: DuplicateKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = DUPLICATE_LABEL[key];
    setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: true } }));

    try {
      const value = form[key].trim();
      const response = key === "email" ? await checkEmailDuplicate(value) : await checkNicknameDuplicate(value);
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable: response.available } }));
      alert(response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable: false } }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: false } }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      void navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const emailChecking = duplicateCheck.email.isChecking;
  const nicknameChecking = duplicateCheck.nickname.isChecking;

  return (
    <main className="flex min-h-[calc(100svh-57px)] items-center justify-center bg-[#f5f6f8] px-4 py-10">
      <form className="w-full max-w-[430px]" noValidate onSubmit={handleSubmit}>
        <h1 className="mb-5 text-[34px] font-extrabold leading-[1.2] text-[#111]">회원가입</h1>
        <div className="flex flex-col gap-4">
          <Field
            id="email"
            label="이메일"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={form.email}
            disabled={emailChecking}
            errorMessage={touched.email && !isEmailValid ? "이메일 형식을 확인해 주세요." : undefined}
            onChange={handleChangeField("email")}
            duplicateButton={{
              label: emailChecking ? "확인 중" : "중복 확인",
              disabled: !isEmailValid || emailChecking || isSubmitting,
              onClick: () => void handleCheckDuplicate("email"),
            }}
          />
          <Field
            id="nickname"
            label="닉네임"
            autoComplete="nickname"
            placeholder="2~12자"
            value={form.nickname}
            disabled={nicknameChecking}
            errorMessage={touched.nickname && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : undefined}
            onChange={handleChangeField("nickname")}
            duplicateButton={{
              label: nicknameChecking ? "확인 중" : "중복 확인",
              disabled: !isNicknameValid || nicknameChecking || isSubmitting,
              onClick: () => void handleCheckDuplicate("nickname"),
            }}
          />
          <Field
            id="password"
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            value={form.password}
            hint="영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요"
            errorMessage={touched.password && !isPasswordValid ? "비밀번호를 다시 한 번 확인해주세요." : undefined}
            onChange={handleChangeField("password")}
          />
          <Field
            id="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            errorMessage={touched.passwordConfirm && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : undefined}
            onChange={handleChangeField("passwordConfirm")}
          />
        </div>
        <button
          className="mt-5 h-12 w-full rounded-md bg-[#2563eb] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#2563eb]/45"
          type="submit"
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        <p className="mt-4 text-center text-[11px] text-[#727b8c]">
          이미 계정이 있나요?{" "}
          <Link className="font-bold text-[#2563eb]" to="/login">로그인</Link>
        </p>
      </form>
    </main>
  );
}
