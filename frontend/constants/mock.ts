export type Severity = "Low" | "Medium" | "High";

export type Disease = {
  key: string;
  name: string;
  severity: Severity;
  summary: string;
  treatment: string[];
  prevention: string[];
  featureImpact: { name: string; value: number }[];
};

export const DISEASE_LIBRARY: Disease[] = [
  {
    key: "healthy",
    name: "Healthy Leaf",
    severity: "Low",
    summary: "Leaf looks healthy. Keep monitoring regularly.",
    treatment: [
      "Maintain field hygiene (remove fallen leaves).",
      "Keep balanced fertilization and proper drainage.",
      "Inspect weekly during rainy periods.",
    ],
    prevention: [
      "Avoid overwatering.",
      "Ensure proper spacing and airflow.",
      "Use clean tools during pruning.",
    ],
    featureImpact: [
      { name: "Rainfall", value: 40 },
      { name: "Humidity", value: 35 },
      { name: "Leaf Spots", value: 10 },
      { name: "Temperature", value: 15 },
    ],
  },
  {
    key: "brown_blight",
    name: "Brown Blight",
    severity: "High",
    summary: "Likely brown blight. Act quickly to reduce spread.",
    treatment: [
      "Remove infected leaves and dispose safely.",
      "Improve airflow by pruning overcrowded areas.",
      "Apply recommended fungicide (as advised by an officer).",
    ],
    prevention: [
      "Avoid water staying on leaves for long periods.",
      "Improve drainage in low areas.",
      "Do not reuse contaminated tools without cleaning.",
    ],
    featureImpact: [
      { name: "Rainfall", value: 55 },
      { name: "Humidity", value: 45 },
      { name: "Leaf Spots", value: 75 },
      { name: "Temperature", value: 20 },
    ],
  },
  {
    key: "gray_blight",
    name: "Gray Blight",
    severity: "Medium",
    summary: "Signs suggest gray blight. Control early for best results.",
    treatment: [
      "Remove infected leaves.",
      "Reduce shade and improve ventilation.",
      "Use officer-recommended spray schedule if needed.",
    ],
    prevention: [
      "Keep rows clean and reduce weed cover.",
      "Avoid excessive nitrogen fertilizer.",
      "Inspect more often during monsoon.",
    ],
    featureImpact: [
      { name: "Rainfall", value: 45 },
      { name: "Humidity", value: 50 },
      { name: "Leaf Spots", value: 55 },
      { name: "Temperature", value: 18 },
    ],
  },
];

export type HistoryRecord = {
  id: string;
  date: string;
  diseaseKey: string;
  note: string;
};

export const INITIAL_HISTORY: HistoryRecord[] = [
  { id: "H-1001", date: "2026-01-02", diseaseKey: "brown_blight", note: "Field A - near slope" },
  { id: "H-1002", date: "2026-01-01", diseaseKey: "gray_blight", note: "Field B - after rain" },
  { id: "H-1003", date: "2025-12-30", diseaseKey: "healthy", note: "Home garden sample" },
];

export const ALERTS = [
  { id: "A-01", type: "Critical", text: "High disease risk this week — inspect leaves after rain." },
  { id: "A-02", type: "Info", text: "Optimal plucking window approaching — plan labour ahead." },
  { id: "A-03", type: "Info", text: "Price trend may rise next week — monitor auction updates." },
];
