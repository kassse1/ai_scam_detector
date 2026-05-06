from pydantic import BaseModel, Field
from typing import Literal


class Message(BaseModel):
    text: str = Field(..., min_length=1)


class Feedback(BaseModel):
    text: str = Field(..., min_length=1)
    correct_label: Literal["SCAM", "SAFE"]


class BatchAnalyzeRequest(BaseModel):
    messages: list[str]
    save_to_history: bool = True


class AnalyzeResponse(BaseModel):
    text: str
    scam_prediction: str
    scam_probability: float
    confidence: float
    risk_level: str
    scam_category: str

    classical_ml_score: float
    transformer_score: float
    hybrid_score: float

    important_keywords: list[str]
    suspicious_keywords: list[str]
    explanation_text: str

    ai_prediction: str
    ai_raw_label: str
    ai_probability: float
    model_used: str


class BatchAnalyzeResponse(BaseModel):
    count: int
    results: list[AnalyzeResponse]


class ModelInfoResponse(BaseModel):
    project_name: str
    backend_framework: str
    classical_model: str
    transformer_model: str
    ai_detector: str
    hybrid_formula: str
    supported_features: list[str]