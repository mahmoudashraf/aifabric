const AUTH_ERROR_PARAMS = ["error", "error_code", "error_description", "sb"] as const;

const authErrorParams = (url: URL) => {
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  return {
    query: url.searchParams,
    hash: new URLSearchParams(hash),
  };
};

export const getCourseAuthCallbackIssue = (href: string) => {
  const url = new URL(href);
  const params = authErrorParams(url);
  const description =
    params.query.get("error_description") ?? params.hash.get("error_description");
  const error = params.query.get("error") ?? params.hash.get("error");

  if (!description && !error) return null;

  if (description?.toLowerCase().includes("getting user profile from external provider")) {
    return "GitHub could not provide your profile. This is usually temporary; please retry shortly.";
  }

  if (error === "access_denied") {
    return "GitHub sign-in was cancelled. You can retry when you are ready.";
  }

  return "GitHub sign-in did not complete. Please retry.";
};

export const getCourseAuthCleanUrl = (href: string) => {
  const url = new URL(href);
  const params = authErrorParams(url);

  AUTH_ERROR_PARAMS.forEach((key) => url.searchParams.delete(key));

  const hashContainsAuthError = AUTH_ERROR_PARAMS.some((key) => params.hash.has(key));
  if (hashContainsAuthError) url.hash = "";

  return url.toString();
};
