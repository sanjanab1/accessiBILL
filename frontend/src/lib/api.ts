//const BASE_URL = import.meta.env.VITE_API_URL;

const BASE_URL =  "http://localhost:8000";
export async function analyzePolicy(data: Record<string, unknown>) {
  const response = await fetch(`${BASE_URL}/personalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("API failed");
  }

  return response.json();
}