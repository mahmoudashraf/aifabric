const USER_KEY = "ai-fabric-shopping-demo-user-id";
const SESSION_KEY = "ai-fabric-shopping-demo-session-id";

function randomId(prefix: string) {
  const cryptoId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${cryptoId}`;
}

function readOrCreate(key: string, prefix: string) {
  if (typeof window === "undefined") {
    return randomId(prefix);
  }
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }
  const created = randomId(prefix);
  window.localStorage.setItem(key, created);
  return created;
}

export function getShoppingDemoIdentity() {
  return {
    userId: readOrCreate(USER_KEY, "shopping-demo-user"),
    sessionId: readOrCreate(SESSION_KEY, "shopping-demo-session"),
  };
}

export function resetShoppingDemoIdentity() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(SESSION_KEY);
  }
  return getShoppingDemoIdentity();
}
