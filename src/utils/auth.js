import Cookies from "js-cookie";

const TOKEN_COOKIE = "token";

export function decodeTokenPayload(token) {
  const [, encodedPayload] = token.split(".");

  if (!encodedPayload) {
    return null;
  }

  const base64Payload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
  const decodedPayload = atob(base64Payload);

  return JSON.parse(decodedPayload);
}

export function getAuthToken() {
  return Cookies.get(TOKEN_COOKIE);
}

export function getTokenPayload(token = getAuthToken()) {
  if (!token) {
    return null;
  }

  try {
    return decodeTokenPayload(token);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  const payload = getTokenPayload(token);

  return typeof payload?.exp === "number" && payload.exp > Date.now() / 1000;
}

export function clearAuthToken() {
  Cookies.remove(TOKEN_COOKIE);
}
