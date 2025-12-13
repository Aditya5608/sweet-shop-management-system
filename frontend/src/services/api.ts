const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string | null
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}
