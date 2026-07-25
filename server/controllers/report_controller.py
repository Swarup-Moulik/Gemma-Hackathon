from bson import ObjectId
from database import get_reports_collection
from fastapi import HTTPException

TRANSLATIONS_LOOKUP = {
    "hi": {
        "Tomato (Solanum lycopersicum)": "टमाटर (Solanum lycopersicum)",
        "Mixed Plantation / Silt Soil": "मिश्रित वृक्षारोपण / गाद मिट्टी",
        "Early Blight (Alternaria solani)": "अगेती झुलसा (Early Blight)",
        "Post-Disaster Field Contamination": "आपदा पश्चात क्षेत्र संदूषण",
        "Moderate": "मध्यम (Moderate)",
        "Severe": "गंभीर (Severe)",
        "High (90%)": "उच्च (90%)",
        "High (94%)": "उच्च (94%)",
        "Disaster Field Checker": "आपदा क्षेत्र समीक्षक",
        "Plant Health Checker": "पौधा स्वास्थ्य रक्षक",
    },
    "es": {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Mixed Plantation / Silt Soil": "Plantación Mixta / Suelo de Limo",
        "Early Blight (Alternaria solani)": "Tizón Temprano",
        "Post-Disaster Field Contamination": "Contaminación Post-Desastre",
        "Moderate": "Moderado",
        "Severe": "Grave",
    },
    "fr": {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Mixed Plantation / Silt Soil": "Plantation Mixte / Limon de Sol",
        "Early Blight (Alternaria solani)": "Alternariose",
        "Post-Disaster Field Contamination": "Contamination Post-Catastrophe",
        "Moderate": "Modéré",
        "Severe": "Grave",
    },
    "te": {
        "Tomato (Solanum lycopersicum)": "టమోటా (Solanum lycopersicum)",
        "Mixed Plantation / Silt Soil": "మిశ్రమ తోట / ఒండ్రు మట్టి",
        "Early Blight (Alternaria solani)": "అల్టర్నేరియా ఆకుమచ్చ తెగులు",
        "Moderate": "మధ్యస్థం",
        "Severe": "తీవ్రమైన",
    },
}


def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    doc["translations"] = TRANSLATIONS_LOOKUP
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
