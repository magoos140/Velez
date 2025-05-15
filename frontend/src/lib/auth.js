import { PUBLIC_API_BASE_URL } from "$env/static/public";

export async function login(email, password) {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("auth_token", data.token);

    return { ok: true, token: data.token };
  } else {
    return { ok: false, error: data.error || "Error en login" };
  }
}

export function getToken() {
  return (
    localStorage.getItem("auth_token") ??
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1] ??
    null
  );
}

export async function logout() {
  localStorage.removeItem("auth_token");
  return { ok: true };
}

export async function register(email, password, name) {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    
    if (res.ok) {
        return { ok: true };
    } else {
        return { ok: false, error: data.error || "Error en registro" };
    }
}
