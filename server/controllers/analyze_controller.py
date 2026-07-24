import os
import shutil
from datetime import datetime

from database import get_reports_collection
from fastapi import HTTPException, UploadFile
from services.gemma_service import run_gemma_crop_analysis, run_gemma_drone_analysis

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def handle_field_analysis(
    file: UploadFile, scan_mode: str, latitude: float, longitude: float
):
    if not file:
        raise HTTPException(status_code=400, detail="No image file uploaded.")

    # 1. Save uploaded image to disk
    file_extension = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"scan-{int(datetime.utcnow().timestamp())}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/{filename}"

    # 2. Run Gemma 4 AI Analysis strictly
    if scan_mode == "drone":
        analysis_data = await run_gemma_drone_analysis(file_path, latitude, longitude)
    else:
        analysis_data = await run_gemma_crop_analysis(file_path, latitude, longitude)

    # 3. Construct MongoDB Document
    report_doc = {
        "type": scan_mode,
        "image_url": image_url,
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "analysis": analysis_data,
        "created_at": datetime.utcnow().isoformat(),
    }

    # 4. Insert into MongoDB
    collection = get_reports_collection()
    insert_result = await collection.insert_one(report_doc)

    report_doc["id"] = str(insert_result.inserted_id)
    if "_id" in report_doc:
        del report_doc["_id"]

    return report_doc
