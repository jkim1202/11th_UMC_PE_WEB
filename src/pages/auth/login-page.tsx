import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

const inputClass =
  "h-12 w-full rounded-md border border-[#dfe3e8] bg-white pr-3.5 pl-10 text-sm text-[#111] outline-none placeholder:text-[#9aa1ab] focus:border-[#2563eb]";
const iconClass = "pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9aa1ab]";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim() !== "" && password !== "";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    // 8주차: 로그인 API 연동
  }

  return (
    <main className="flex min-h-[calc(100svh-57px)] items-center justify-center bg-[#f5f6f8] px-4 py-10">
      <form className="w-full max-w-[430px]" noValidate onSubmit={handleSubmit}>
        <h1 className="mb-5 text-[34px] font-extrabold leading-[1.2] text-[#111]">로그인</h1>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#111]" htmlFor="email">이메일</label>
            <div className="relative">
              <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <input className={inputClass} id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#111]" htmlFor="password">비밀번호</label>
            <div className="relative">
              <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input className={inputClass} id="password" name="password" type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </div>
        </div>
        <button
          className="mt-5 h-12 w-full rounded-md bg-[#2563eb] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#2563eb]/45"
          type="submit"
          disabled={!canSubmit}
        >
          로그인
        </button>
        <p className="mt-4 text-center text-[11px] text-[#727b8c]">
          처음이신가요?{" "}
          <Link className="font-bold text-[#2563eb]" to="/signup">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
