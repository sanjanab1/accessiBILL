//const BASE_URL = import.meta.env.VITE_API_URL;

const BASE_URL =  "http://localhost:8000";
export async function analyzePolicy(billSummary: string) {
  const response = await fetch(`${BASE_URL}/personalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      bill_summary: billSummary,
      user_context: "teacher in rural area with kids"
    }),
  });
  if (!response.ok) throw new Error("Personalize failed");
  return response.json(); // { personalized_impact: "...", impact_tags: {...} }
}

export async function getPlotData(state: string, bill_summary: string) {
  const response = await fetch(`${BASE_URL}/plot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, bill_summary }),
  });

  if (!response.ok) {
    throw new Error("API failed");
  }

  return response.json();
}

export async function extractText(file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);  // ← use actual filename
  const response = await fetch(`${BASE_URL}/ocr`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("OCR failed");
  return response.json();
}

