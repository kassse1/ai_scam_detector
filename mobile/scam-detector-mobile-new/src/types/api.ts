export type TabName = "analyze" | "dashboard" | "history";

export type AnalyzeResult = {
  text: string;
  scam_prediction: "SCAM" | "SAFE";
  scam_probability: number;
  confidence: number;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  scam_category: string;

  classical_ml_score: number;
  transformer_score: number;
  hybrid_score: number;

  important_keywords: string[];
  suspicious_keywords: string[];
  explanation_text: string;

  ai_prediction: string;
  ai_raw_label: string;
  ai_probability: number;
  model_used: string;
};

export type Stats = {
  total_checks: number;
  scam_count: number;
  safe_count: number;
  high_risk_count: number;
  categories: Record<string, number>;
  top_keywords: [string, number][];
};