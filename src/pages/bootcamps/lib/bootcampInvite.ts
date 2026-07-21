export const bootcampInvitationStorageKey = (slug: string) =>
  `ai-fabric-bootcamp-invitation:${slug}`;

const validInvitationCode = (value: string | null) => {
  const code = value?.trim() ?? "";
  return code.length >= 4 && code.length <= 128 ? code : null;
};

export const storeBootcampInvitationCode = (slug: string, code: string) => {
  const validCode = validInvitationCode(code);
  if (!validCode || typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(bootcampInvitationStorageKey(slug), validCode);
  } catch {
    // The code remains editable when browser storage is unavailable.
  }
};

export const readBootcampInvitationCode = (slug: string) => {
  if (typeof window === "undefined") return "";

  try {
    return validInvitationCode(window.sessionStorage.getItem(bootcampInvitationStorageKey(slug))) ?? "";
  } catch {
    return "";
  }
};

export const clearBootcampInvitationCode = (slug: string) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(bootcampInvitationStorageKey(slug));
  } catch {
    // Enrollment is already complete, so storage cleanup is best effort.
  }
};

export const captureBootcampInvitationFromUrl = (href: string, slug: string) => {
  const url = new URL(href);
  const code = validInvitationCode(url.searchParams.get("code"));
  if (code) storeBootcampInvitationCode(slug, code);
  url.searchParams.delete("code");

  return {
    code: code ?? readBootcampInvitationCode(slug),
    cleanPath: `${url.pathname}${url.search}${url.hash}`,
  };
};
