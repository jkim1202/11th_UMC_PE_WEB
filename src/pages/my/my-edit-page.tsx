import { useEffect, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { mockProfile } from "../../data/mock-profile";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass =
  "h-12 w-full rounded-md border border-[#dfe3e8] bg-white px-3.5 text-sm text-[#111] outline-none placeholder:text-[#9aa1ab] focus:border-[#2563eb] read-only:bg-[#f5f6f8] read-only:text-[#727b8c]";

export default function MyEditPage() {
  const [nickname, setNickname] = useState(mockProfile.nickname);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 미리보기 URL이 바뀌거나 언마운트될 때 이전 URL 해제
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const nicknameLength = nickname.trim().length;
  const isNicknameValid = nicknameLength >= 2 && nicknameLength <= 12;
  const isNicknameChanged = nickname.trim() !== mockProfile.nickname;
  const canCheckNickname = isNicknameValid && isNicknameChanged;
  const canSave = isNicknameValid && (isNicknameChanged || previewUrl !== null);
  const imageSrc = previewUrl ?? mockProfile.profileImageUrl;

  function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 선택할 수 있어요.");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleCheckNickname() {
    if (!canCheckNickname) return;
    // 8주차: 닉네임 중복 확인 API 연동
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    // 8주차: 내 정보 수정 API 연동
  }

  function handleWithdraw() {
    if (!confirm("정말 탈퇴할까요?")) return;
    // 8주차: 회원 탈퇴 API 연동
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-57px)] w-[calc(100%-96px)] max-w-[1126px] box-border flex-col py-4 pb-8 max-[640px]:w-[calc(100%-32px)]">
      <form className="flex-1" noValidate onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold leading-[1.3] tracking-[-1px] text-[#191b20]">내 정보 수정</h1>
            <p className="mt-1 text-[11px] text-[#727b8c]">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button className="shrink-0 rounded-md bg-[#2563eb] px-4 py-2 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#2563eb]/45" type="submit" disabled={!canSave}>
            변경사항 저장
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 max-[640px]:grid-cols-1">
          <div className="flex flex-col items-center gap-1.5 pt-4">
            <label className="relative block cursor-pointer rounded-full focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#2563eb]" htmlFor="profile-image">
              <span className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-full bg-[#e8ebef] text-[#111]">
                {imageSrc ? (
                  <img className="h-full w-full object-cover" src={imageSrc} alt="" />
                ) : (
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6z" />
                  </svg>
                )}
              </span>
              <span className="absolute right-0 bottom-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-[#111] text-white">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 20l4-1 11-11-3-3L5 16z" />
                </svg>
              </span>
              <input className="sr-only" id="profile-image" type="file" accept="image/*" aria-label="프로필 이미지 선택" onChange={handleChangeImage} />
            </label>
            <p className="m-0 text-[11px] font-bold text-[#111]">프로필 이미지</p>
            <p className="m-0 text-[9px] text-[#9aa1ab]">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-[#111]" htmlFor="nickname">닉네임</label>
              <div className="relative">
                <input
                  className={`${inputClass} pr-20`}
                  id="nickname"
                  name="nickname"
                  autoComplete="nickname"
                  value={nickname}
                  aria-invalid={!isNicknameValid ? true : undefined}
                  aria-describedby={!isNicknameValid ? "nickname-error" : undefined}
                  onChange={(event) => setNickname(event.target.value)}
                />
                <button
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded px-2 py-2 text-[11px] font-bold text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
                  type="button"
                  aria-label="닉네임 중복 확인"
                  disabled={!canCheckNickname}
                  onClick={handleCheckNickname}
                >
                  중복 확인
                </button>
              </div>
              {!isNicknameValid && <p className="mt-1.5 text-[11px] text-[#e5484d]" id="nickname-error" aria-live="polite">닉네임은 2~12자로 입력해 주세요.</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-[#111]" htmlFor="email">이메일</label>
              <input className={inputClass} id="email" name="email" type="email" value={mockProfile.email} readOnly />
            </div>
          </div>
        </div>
      </form>

      <section className="mt-10 flex items-center justify-between gap-4 rounded-md border border-[#e5484d] bg-[#fdeeee] px-4 py-3.5 max-[640px]:flex-col max-[640px]:items-start" aria-label="회원 탈퇴">
        <div>
          <h2 className="m-0 text-xs font-bold text-[#e5484d]">회원 탈퇴</h2>
          <p className="mt-1 mb-0 text-[10px] text-[#e5484d]">탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
        </div>
        <button className="shrink-0 rounded-md border border-[#e5484d] bg-white px-4 py-2 text-[11px] font-bold text-[#e5484d]" type="button" onClick={handleWithdraw}>
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
