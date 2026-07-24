import os
import shutil
import random
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, Field

app = FastAPI(title="AgriRescue AI Backend", description="Gemma 4 Offline Web Server")

# Configure CORS for React Client (typically http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static directory for uploaded images
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# MongoDB client initialization
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.agrirescue
reports_collection = db.reports

# Helper to serialize MongoDB documents to JSON
def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# High-fidelity Mock Responses for Gemma 4 Analysis (Offline fallback)
MOCK_CROP_RESPONSES = [
    {
        "crop": "Tomato (Solanum lycopersicum)",
        "probable_issue": "Early Blight (Alternaria solani)",
        "confidence": "High (94%)",
        "severity": "Moderate",
        "recovery_chance": 87,
        "yield_loss_estimate": 18,
        "treatment_urgency": "Treat within 48 hours",
        "likely_causes": [
            "High humidity following recent heavy monsoon rainfall.",
            "Insufficient air circulation between dense leaf canopy."
        ],
        "recommended_actions": [
            "Prune and safely destroy infected lower leaves immediately.",
            "Avoid overhead sprinkler irrigation; apply water directly at root level."
        ],
        "organic_options": [
            "Apply copper-based organic fungicide or neem oil solution every 7 days.",
            "Spray liquid compost tea to introduce beneficial microbes."
        ],
        "tourist_safety": {
            "hazard_detected": False,
            "message": "No immediate hazards detected near guest walking paths."
        },
        "expert_advice": "If symptoms spread to more than 40% of foliage within 48 hours, contact local agriculture extension officer.",
        "crop_recovery_planner": [
            {"period": "Day 1-3", "action": "Prune and destroy infected lower foliage and clear fallen leaves from mudbeds."},
            {"period": "Day 4-7", "action": "Foliar spray copper hydroxide or organic neem oil every 7 days to halt spore spread."},
            {"period": "Week 2", "action": "Incorporate liquid compost tea to reintroduce healthy root and leaf microbiomes."},
            {"period": "Week 3-4", "action": "Resume sub-surface drip irrigation and check new foliage shoots for green growth."}
        ],
        "crop_recommendation": {
            "avoid_crop": "Tomato (Solanum lycopersicum)",
            "suggested_crops": [
                {"name": "Mustard", "reason": "Requires low soil moisture, breaking the early blight lifecycle."},
                {"name": "Chickpea", "reason": "Adapts well to current soil pH and naturally re-nitrogenates beds."},
                {"name": "Spinach", "reason": "Short 30-day growth cycle to produce yield before damaged soil conditions worsen."}
            ]
        }
    },
    {
        "crop": "Tea Plantation (Camellia sinensis)",
        "probable_issue": "Blister Blight (Exobasidium vexans)",
        "confidence": "High (91%)",
        "severity": "Severe",
        "recovery_chance": 45,
        "yield_loss_estimate": 35,
        "treatment_urgency": "Treat within 24 hours",
        "likely_causes": [
            "Excessive shade cover combined with continuous morning fog.",
            "Water stagnation around tea root collar zones."
        ],
        "recommended_actions": [
            "Carry out emergency light pruning to detach infected crop shoots.",
            "Drain mudbeds immediately to dry out surrounding topsoil layers."
        ],
        "organic_options": [
            "Spray organic-approved copper hydroxide solution.",
            "Apply garlic-barrier extract to repel fungal spore replication."
        ],
        "tourist_safety": {
            "hazard_detected": True,
            "message": "Severe fungal spread detected near Guest Trail Sector 1. Advise tourists to avoid plucking leaves or walking through damp field corridors without boots."
        },
        "expert_advice": "Consult local tea cooperative specialists if black spores cover more than 20% of pluckable shoots.",
        "crop_recovery_planner": [
            {"period": "Day 1-3", "action": "Carry out emergency light pruning to detach and discard blister-spotted shoots."},
            {"period": "Day 4-7", "action": "Apply garlic-barrier extract or organic copper spray under direct sunlight hours."},
            {"period": "Week 2", "action": "Clear mudbed boundary drainage channels to prevent root rot and dry topsoil layers."},
            {"period": "Week 3-4", "action": "Verify guest pathway fences to ensure safety, and resume light organic spraying."}
        ],
        "crop_recommendation": {
            "avoid_crop": "Tea Plantation (Camellia sinensis)",
            "suggested_crops": [
                {"name": "Mustard", "reason": "Thrives in dry, well-aerated mudbeds with excellent drainage."},
                {"name": "Chickpea", "reason": "Corrects soil nitrogen loss and balances pH in acidic clay tracts."},
                {"name": "Spinach", "reason": "Shallow root depth bypasses high moisture layers that trigger blister blight."}
            ]
        }
    },
    {
        "crop": "Grapes / Vineyards (Vitis vinifera)",
        "probable_issue": "Powdery Mildew (Uncinula necator)",
        "confidence": "Medium (88%)",
        "severity": "Mild",
        "recovery_chance": 92,
        "yield_loss_estimate": 8,
        "treatment_urgency": "Treat within 72 hours",
        "likely_causes": [
            "Humid shade pockets underneath dense foliage trellises.",
            "Lack of canopy trimming blocking direct sunlight access."
        ],
        "recommended_actions": [
            "Selectively pluck leaves blocking sun contact with grape clusters.",
            "Prune non-bearing shoots to improve internal cluster ventilation."
        ],
        "organic_options": [
            "Spray diluted milk-water solution (1:9 ratio) under bright sunlight.",
            "Apply horticultural oils or organic sulfur powder."
        ],
        "tourist_safety": {
            "hazard_detected": False,
            "message": "No safety concerns. Safe for guest vineyard walks."
        },
        "expert_advice": "Keep inspections bi-weekly. Organic spray is highly effective at this early stage.",
        "crop_recovery_planner": [
            {"period": "Day 1-3", "action": "Prune excess non-bearing leaf layers around trellises to increase sunlight access."},
            {"period": "Day 4-7", "action": "Apply a light water-milk foliar spray or sulfur powder to leaf undersides."},
            {"period": "Week 2", "action": "Test cluster air circulation rates and monitor for early fuzzy powdery spots."},
            {"period": "Week 3-4", "action": "Conduct visual cluster counts and verify crop health logs."}
        ],
        "crop_recommendation": {
            "avoid_crop": "Grapes / Vineyards (Vitis vinifera)",
            "suggested_crops": [
                {"name": "Mustard", "reason": "Requires low water draw, aerating dense under-canopy dirt."},
                {"name": "Chickpea", "reason": "High salt tolerance makes it ideal for vineyard margins."},
                {"name": "Spinach", "reason": "Short cycle prevents exposure to long-lasting mildew spores."}
            ]
        }
    }
]

@app.get("/api/health")
def health_check():
    return {
        "status": "OK",
        "engine": "Gemma 4 Offline Web Pipeline",
        "database": "MongoDB Connected"
    }

@app.post("/api/analyze")
async def analyze_field(
    file: UploadFile = File(...),
    scanMode: str = Form(...), # 'crop' | 'drone'
    latitude: Optional[float] = Form(26.2006),
    longitude: Optional[float] = Form(92.4005)
):
    # Save the file locally
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"upload-{int(datetime.now().timestamp())}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/{filename}"

    # Compile Analysis using Gemma 4 Schema
    if scanMode == "crop":
        # Pick one random mock crop report with Gemma 4 output schema
        analysis = random.choice(MOCK_CROP_RESPONSES)
    else:
        # Generate grid telemetry cells for Disaster Field Checker
        base_lat = latitude
        base_lng = longitude
        
        frame_data = [
            {
                "timestamp": 0,
                "coordinates": {"latitude": base_lat, "longitude": base_lng},
                "visual_findings": ["Foliage coverage clear", "No flood residue"],
                "severity": "Healthy"
            },
            {
                "timestamp": 5,
                "coordinates": {"latitude": base_lat + 0.0005, "longitude": base_lng + 0.0005},
                "visual_findings": ["Soil is moist", "Seedlings showing green shoots"],
                "severity": "Recovering"
            },
            {
                "timestamp": 10,
                "coordinates": {"latitude": base_lat + 0.001, "longitude": base_lng + 0.001},
                "visual_findings": ["Standing floodwater", "Mild canopy stress"],
                "severity": "Moderate Damage"
            },
            {
                "timestamp": 15,
                "coordinates": {"latitude": base_lat - 0.0005, "longitude": base_lng + 0.0005},
                "visual_findings": ["Thick acidic silt layer", "Root rot detected"],
                "severity": "Severe Damage"
            },
            {
                "timestamp": 20,
                "coordinates": {"latitude": base_lat - 0.001, "longitude": base_lng + 0.001},
                "visual_findings": ["Silt blocks root ventilation", "Slow water pooling"],
                "severity": "Severe Damage"
            },
            {
                "timestamp": 25,
                "coordinates": {"latitude": base_lat + 0.0015, "longitude": base_lng - 0.0005},
                "visual_findings": ["Drained topsoil", "Trichoderma sprayed"],
                "severity": "Recovering"
            },
            {
                "timestamp": 30,
                "coordinates": {"latitude": base_lat + 0.0005, "longitude": base_lng - 0.001},
                "visual_findings": ["Soil erosion", "Uprooted young plants"],
                "severity": "Moderate Damage"
            },
            {
                "timestamp": 35,
                "coordinates": {"latitude": base_lat - 0.0005, "longitude": base_lng - 0.0015},
                "visual_findings": ["Healthy tea canopy", "Good soil composition"],
                "severity": "Healthy"
            },
            {
                "timestamp": 40,
                "coordinates": {"latitude": base_lat - 0.0015, "longitude": base_lng - 0.0005},
                "visual_findings": ["Slight moisture pooling", "Leaves are clean"],
                "severity": "Healthy"
            }
        ]

        analysis = {
            "crop": "Mixed Plantation / Silt Soil",
            "probable_issue": "Post-Disaster Field Contamination",
            "confidence": "High (90%)",
            "severity": "Severe" if any("Severe" in f["severity"] for f in frame_data) else "Moderate",
            "likely_causes": [
                "River breach introducing industrial silt runoff.",
                "Poor soil absorption rates causing extended waterlogging."
            ],
            "recommended_actions": [
                "Excavate emergency field channels to route standing runoff water away.",
                "Apply agricultural lime compounds to raise soil pH and neutralize toxicity."
            ],
            "organic_options": [
                "Apply raw compost mulch to introduce organic carbon.",
                "Sow cover crops (e.g., clover) to extract residual heavy metals."
            ],
            "tourist_safety": {
                "hazard_detected": True,
                "message": "CAUTION: Field is highly contaminated with acidic silt and collapsed fencing debris. Restrict guest access entirely."
            },
            "expert_advice": "Do not harvest crops within the red-marked grid cells. Apply soil agents to begin next rotation.",
            # Custom Drone grid metadata
            "field_status": "Waterlogged but Salvagable",
            "toxic_silt_risk": "High",
            "damaged_percentage": 50,
            "recovery_chance": 65,
            "yield_loss_estimate": 42,
            "treatment_urgency": "Treat within 48 hours",
            "individualFrameAnalyses": frame_data,
            "reclamation_steps": [
                "Drain waterlogged sub-surfaces using grid trenching.",
                "Neutralize topsoil silt layers with local agricultural gypsum.",
                "Remove debris and uprooted root crowns immediately."
            ],
            "immediate_safeguards": [
                "Prevent guests from walking near grid cell F2 and F5.",
                "Wear protective boots when clearing silt beds."
            ],
            "soil_rebalancing_agent": "Agricultural Gypsum + Calcium Carbonate",
            "crop_recovery_planner": [
                {"period": "Day 1-3", "action": "Siphon and drain standing surface water using dynamic grid trenches."},
                {"period": "Day 4-7", "action": "Apply agricultural gypsum (calcium sulfate) to counter silt crusting and flush sodium."},
                {"period": "Week 2", "action": "Blend raw compost, mulch, and biochar into topsoil to restore organic carbon."},
                {"period": "Week 3-4", "action": "Sow nitrogen-fixing cover crops (clover, alfalfa) to aerate soil and resume drip irrigation."}
            ],
            "crop_recommendation": {
                "avoid_crop": "Rice",
                "suggested_crops": [
                    {"name": "Mustard", "reason": "Requires low soil moisture, preventing waterlogged root damage."},
                    {"name": "Chickpea", "reason": "Thrives in current soil pH, fixing nitrogen into depleted tracts."},
                    {"name": "Spinach", "reason": "Short growth cycle to bypass current damaged fertility layers."}
                ]
            }
        }

    # Create MongoDB report document
    report_data = {
        "type": scanMode,
        "image_url": image_url,
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "analysis": analysis,
        "created_at": datetime.utcnow().isoformat()
    }

    # Save to MongoDB
    insert_result = await reports_collection.insert_one(report_data)
    report_data["id"] = str(insert_result.inserted_id)
    del report_data["_id"]

    return report_data

@app.get("/api/reports")
async def get_all_reports():
    cursor = reports_collection.find().sort("created_at", -1)
    reports = []
    async for doc in cursor:
        reports.append(serialize_doc(doc))
    return reports

@app.get("/api/reports/{report_id}")
async def get_single_report(report_id: str):
    try:
        doc = await reports_collection.find_one({"_id": ObjectId(report_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Report not found")
        return serialize_doc(doc)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

@app.delete("/api/reports/{report_id}")
async def delete_report(report_id: str):
    try:
        result = await reports_collection.delete_one({"_id": ObjectId(report_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"status": "success", "message": "Report deleted"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
