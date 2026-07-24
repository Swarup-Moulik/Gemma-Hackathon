from bson import ObjectId
from database import get_reports_collection
from fastapi import HTTPException


def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


async def get_all_reports_list():
    collection = get_reports_collection()
    cursor = collection.find().sort("created_at", -1)
    reports = []
    async for doc in cursor:
        reports.append(serialize_doc(doc))
    return reports


async def get_report_by_id(report_id: str):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    collection = get_reports_collection()
    doc = await collection.find_one({"_id": ObjectId(report_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")

    return serialize_doc(doc)


async def delete_report_by_id(report_id: str):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    collection = get_reports_collection()
    result = await collection.delete_one({"_id": ObjectId(report_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"status": "success", "message": "Report deleted successfully"}
