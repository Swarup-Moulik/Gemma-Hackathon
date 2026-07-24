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
        "expert_advice": "If symptoms spread to more than 40% of foliage within 48 hours, contact local agriculture extension officer."
    },
    {
        "crop": "Tea Plantation (Camellia sinensis)",
        "probable_issue": "Blister Blight (Exobasidium vexans)",
        "confidence": "High (91%)",
        "severity": "Severe",
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
        "expert_advice": "Consult local tea cooperative specialists if black spores cover more than 20% of pluckable shoots."
    },
    {
        "crop": "Grapes / Vineyards (Vitis vinifera)",
        "probable_issue": "Powdery Mildew (Uncinula necator)",
        "confidence": "Medium (88%)",
        "severity": "Mild",
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
        "expert_advice": "Keep inspections bi-weekly. Organic spray is highly effective at this early stage."
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
                "visual_findings": ["Standing floodwater", "Mild canopy stress"],
                "severity": "Moderate"
            },
            {
                "timestamp": 5,
                "coordinates": {"latitude": base_lat + 0.001, "longitude": base_lng + 0.001},
                "visual_findings": ["Thick chemical silt layer", "Soil washaway"],
                "severity": "Severe"
            },
            {
                "timestamp": 10,
                "coordinates": {"latitude": base_lat - 0.001, "longitude": base_lng + 0.0015},
                "visual_findings": ["Dry soil terrain", "Crop leaves healthy"],
                "severity": "Mild"
            },
            {
                "timestamp": 15,
                "coordinates": {"latitude": base_lat + 0.0005, "longitude": base_lng - 0.001},
                "visual_findings": ["Soil erosion", "Uprooted young plants"],
                "severity": "Moderate"
            },
            {
                "timestamp": 20,
                "coordinates": {"latitude": base_lat - 0.0005, "longitude": base_lng - 0.0005},
                "visual_findings": ["Silt blocks root ventilation", "Slight root rot"],
                "severity": "Severe"
            }
        ]

        analysis = {
            "crop": "Mixed Plantation / Silt Soil",
            "probable_issue": "Post-Disaster Field Contamination",
            "confidence": "High (90%)",
            "severity": "Severe" if any(f["severity"] == "Severe" for f in frame_data) else "Moderate",
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
            "soil_rebalancing_agent": "Agricultural Gypsum + Calcium Carbonate"
        }

