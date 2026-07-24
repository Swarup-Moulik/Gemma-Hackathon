import os
import tempfile
from datetime import datetime

from database import get_reports_collection
from fastapi import HTTPException, UploadFile
from imagekitio import ImageKit
from services.gemma_service import run_gemma_crop_analysis, run_gemma_drone_analysis

# Initialize ImageKit client (automatically reads IMAGEKIT_PRIVATE_KEY from environment)
imagekit = ImageKit(private_key=os.getenv("IMAGEKIT_PRIVATE_KEY", ""))


async def handle_field_analysis(
    file: UploadFile, scan_mode: str, latitude: float, longitude: float
):
    if not file:
        raise HTTPException(status_code=400, detail="No image file uploaded.")

    # 1. Read file bytes into memory
    file_bytes = await file.read()
    filename = f"scan-{int(datetime.utcnow().timestamp())}.jpg"

    # 2. Upload image directly to ImageKit CDN via client.files.upload
    try:
        upload_response = imagekit.files.upload(
            file=file_bytes, file_name=filename, folder="/greenpraxis_scans/"
        )
        image_url = upload_response.url
    except Exception as e:
        print(f"ImageKit Upload Warning: {e}. Falling back to local URL.")
        image_url = f"/uploads/{filename}"

    # 3. Create temporary file for PIL processing
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, filename)
    with open(temp_path, "wb") as f:
        f.write(file_bytes)

    # 4. Perform Gemma/Gemini AI Analysis
    try:
        if scan_mode == "drone":
            analysis_data = await run_gemma_drone_analysis(
                temp_path, latitude, longitude
            )
        else:
            analysis_data = await run_gemma_crop_analysis(
                temp_path, latitude, longitude
            )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 5. Persist analysis to MongoDB
    report_doc = {
        "type": scan_mode,
        "image_url": image_url,
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "analysis": analysis_data,
        "created_at": datetime.utcnow().isoformat(),
    }

    collection = get_reports_collection()
    insert_result = await collection.insert_one(report_doc)

    report_doc["id"] = str(insert_result.inserted_id)
    if "_id" in report_doc:
        del report_doc["_id"]

    return report_doc
