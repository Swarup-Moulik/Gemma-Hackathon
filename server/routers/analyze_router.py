from typing import Optional

from controllers.analyze_controller import handle_field_analysis
from fastapi import APIRouter, File, Form, UploadFile

router = APIRouter()


@router.post("/analyze")
async def analyze_field(
    file: UploadFile = File(...),
    scanMode: str = Form("crop"),
    latitude: Optional[float] = Form(26.2006),
    longitude: Optional[float] = Form(92.4005),
):
    return await handle_field_analysis(file, scanMode, latitude, longitude)
