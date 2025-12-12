const API_URL = "http://localhost:8000";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string | null
) {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["token"] = token;

  const res = await fetch(API_URL + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}
