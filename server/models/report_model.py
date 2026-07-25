from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class TouristSafety(BaseModel):
    hazard_detected: bool = Field(
        description="True if dangerous fungi, toxic silt, or structural hazards exist near visitor trails"
    )
    message: str = Field(
        description="Clear warning advisory message for agritourism visitors"
    )


class FrameAnalysis(BaseModel):
    timestamp: int
    coordinates: Dict[str, float]
    visual_findings: List[str]
    severity: str


class GemmaCropAnalysis(BaseModel):
    crop: str = Field(description="Name and botanical name of the crop or terrain")
    probable_issue: str = Field(
        description="Specific disease, blight, or condition name"
    )
    confidence: str = Field(description="Confidence percentage e.g. High (94%)")
    severity: str = Field(description="Mild, Moderate, Severe, or High")

    recovery_chance: int = Field(
        description="Estimated percentage chance of crop recovery (0-100)"
    )
    yield_loss_estimate: int = Field(
        description="Estimated percentage yield loss (0-100)"
    )

    likely_causes: List[str] = Field(
        description="Environmental or fungal factors triggering the condition"
    )
    recommended_actions: List[str] = Field(
        description="Immediate step-by-step agricultural remediation steps"
    )
    organic_options: List[str] = Field(
        description="Eco-friendly and organic fungicide or biological sprays"
    )

    chemical_treatments: List[str] = Field(
        description="Chemical treatments or fungicides if organic options fail"
    )

    tourist_safety: TouristSafety
    expert_advice: str = Field(
        description="Threshold rule when to contact senior extension officers"
    )


class GemmaDroneAnalysis(GemmaCropAnalysis):
    field_status: str = Field(
        description="Overall terrain status e.g. Waterlogged but Salvagable"
    )
    toxic_silt_risk: str = Field(description="High, Medium, or Low")
    damaged_percentage: int = Field(
        description="Estimated land damage percentage 0-100"
    )
    individualFrameAnalyses: List[FrameAnalysis]
    reclamation_steps: List[str]
    immediate_safeguards: List[str]
    soil_rebalancing_agent: str


class Coordinates(BaseModel):
    latitude: float
    longitude: float


class ReportResponse(BaseModel):
    id: str
    type: str
    image_url: str
    coordinates: Coordinates
    analysis: Dict[str, Any]
    created_at: str
