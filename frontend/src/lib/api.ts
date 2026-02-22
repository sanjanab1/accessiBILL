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

export async function extractText(imageBlob: Blob) {
  const formData = new FormData();
  formData.append("file", imageBlob, "snapshot.jpg");

  const response = await fetch(`${BASE_URL}/ocr`, {
    method: "POST",
    body: formData,  // no Content-Type header — browser sets it with boundary automatically
  });

  if (!response.ok) throw new Error("OCR failed");
  return response.json();
}

