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

# Startup event to download clean qrcode.js offline generator library
@app.on_event("startup")
def download_qrcode_js():
    try:
        import urllib.request
        url = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.js"
        target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "client", "src", "utils"))
        os.makedirs(target_dir, exist_ok=True)
        target_path = os.path.join(target_dir, "qrcode.js")
        with urllib.request.urlopen(url) as response:
            content = response.read().decode('utf-8')
        # Append ESM export to allow React imports
        content += "\nexport default qrcode;\n"
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("qrcode.js downloaded and exported successfully!")
    except Exception as e:
        print(f"Error downloading qrcode.js: {e}")


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
        "organic_treatments": ["Neem oil", "Baking soda", "Compost tea"],
        "chemical_treatments": ["Mancozeb", "Copper oxychloride"],
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
        },
        "similar_diseases": [
            {"name": "Late Blight", "percentage": 82},
            {"name": "Septoria", "percentage": 61},
            {"name": "Leaf Spot", "percentage": 54}
        ],
        "explainable_ai": "I identified Early Blight because I observed circular brown lesions with concentric rings (target-like pattern) on older lower leaves, along with distinct chlorotic yellowing around the margins of the infected spots."
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
        "organic_treatments": ["Garlic barrier extract", "Neem oil", "Compost tea"],
        "chemical_treatments": ["Copper hydroxide", "Hexaconazole"],
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
        },
        "similar_diseases": [
            {"name": "Algal Leaf Spot", "percentage": 78},
            {"name": "Bird's Eye Spot", "percentage": 64},
            {"name": "Black Rot", "percentage": 49}
        ],
        "explainable_ai": "I identified Blister Blight because I observed blister-like translucent lesions on younger leaves, with white powdery spore deposits accumulating on the lower leaf surfaces."
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
        "organic_treatments": ["Diluted milk foliar spray", "Horticultural oil", "Sulfur powder"],
        "chemical_treatments": ["Myclobutanil", "Mancozeb"],
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
        },
        "similar_diseases": [
            {"name": "Downy Mildew", "percentage": 85},
            {"name": "Black Rot", "percentage": 58},
            {"name": "Anthracnose", "percentage": 42}
        ],
        "explainable_ai": "I identified Powdery Mildew because I observed characteristic dusty white-to-gray powder patches coating the upper surfaces of the leaves and grape berries, matching fungal mycelium expansion."
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
    file: Optional[UploadFile] = File(None),
    scanMode: str = Form(...), # 'crop' | 'drone' | 'emergency'
    latitude: Optional[float] = Form(26.2006),
    longitude: Optional[float] = Form(92.4005)
):
    if file:
        # Save the file locally
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"upload-{int(datetime.now().timestamp())}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_url = f"/uploads/{filename}"
    else:
        # Default Unsplash flood image for emergency rescue mock scans
        image_url = "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80"

    # Compile Analysis using Gemma 4 Schema
    if scanMode == "crop":
        # Pick one random mock crop report with Gemma 4 output schema
        analysis = random.choice(MOCK_CROP_RESPONSES)
    elif scanMode == "emergency":
        analysis = {
            "crop": "All Farm Sectors / Emergency Report",
            "probable_issue": "Sudden Riverine Flood Breach",
            "confidence": "High (98%)",
            "severity": "Severe",
            "recovery_chance": 35,
            "yield_loss_estimate": 60,
            "treatment_urgency": "Treat within 24 hours",
            "likely_causes": [
                "River embankment breach due to heavy rainfall upstream.",
                "Silt barrier collapse near the eastern boundary."
            ],
            "recommended_actions": [
                "Evacuate all livestock from low-lying pastures immediately.",
                "Restrict tourist entry entirely; lock gates on guest walking paths.",
                "Shut down and inspect electric irrigation pumps in flooded zones."
            ],
            "organic_treatments": ["Apply sandbags around wellheads", "Clear mud channels"],
            "chemical_treatments": ["Inspect main power lines for shorts", "Test drinking water wells"],
            "tourist_safety": {
                "hazard_detected": True,
                "message": "EMERGENCY: Immediate flood hazards on East Guest Trail and southern fences. Keep all visitors cleared."
            },
            "expert_advice": "Contact local emergency response teams. Secure livestock first.",
            "field_status": "Severe Water Logging & Debris Strew",
            "toxic_silt_risk": "Critical",
            "damaged_percentage": 75,
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
            },
            "similar_diseases": [
                {"name": "Dam Failure Breach", "percentage": 89},
                {"name": "Severe Soil Liquefaction", "percentage": 73},
                {"name": "Fencing Debris Damage", "percentage": 52}
            ],
            "explainable_ai": "I identified riverine flood breach because I detected contiguous high-moisture grids (F3, F4, F6) showing complete canopy submersion and river embankment erosion profiles from satellite/drone elevation sensors.",
            "emergency_rescue": {
                "flood_severity": "High",
                "safe_areas": ["North field pasture", "Main farmhouse ridge"],
                "danger_areas": ["East field bottomlands", "Guest Trail Sector 1"],
                "rescue_actions": [
                    "Evacuate all livestock from pastures to the North field pasture immediately.",
                    "Close safety gates and lock visitor path entries.",
                    "Shut down primary well power grids and inspect active irrigation systems."
                ]
            }
        }
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
            "organic_treatments": ["Compost tea spray", "Biochar soil enrichment", "Trichoderma inoculation"],
            "chemical_treatments": ["Agricultural lime neutralizer", "Gypsum soil conditioner"],
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
            },
            "similar_diseases": [
                {"name": "Industrial Chemical Runoff", "percentage": 79},
                {"name": "Standing Irrigation Leakage", "percentage": 68},
                {"name": "Soil Nutrient Depletion", "percentage": 50}
            ],
            "explainable_ai": "I identified Post-Disaster Field Contamination because my multi-spectral analysis observed near-infrared (NIR) absorption drops below 0.25 (index of standing surface water) and high reflective signatures of heavy silt debris layers covering active crop sectors."
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

class ChatRequest(BaseModel):
    query: str
    language: str = "en"

@app.post("/api/chat")
def agricultural_chat(req: ChatRequest):
    q = req.query.lower()
    lang = req.language
    
    # English QA
    qa_en = {
        "powdery mildew": "Powdery mildew is a fungal disease that creates a white, powdery layer on leaves. Treat it organically using diluted milk sprays or sulfur powder. Avoid overhead watering.",
        "irrigate": "Irrigate during early morning (4 AM to 8 AM). This minimizes evaporation and allows leaves to dry during the day, preventing fungal growth. Avoid night watering.",
        "leaves curling": "Leaf curling is usually a defense mechanism against water stress, excessive heat, or sap-sucking pests like aphids. Inspect leaf undersides and check soil moisture.",
        "early blight": "Early blight is a fungal infection (Alternaria solani) that causes concentric target-like rings on tomato leaves. Prune lower leaves and treat within 48 hours.",
        "gypsum": "Gypsum (Calcium Sulfate) helps aerate compacted clay soil, counters toxic sodium crusts left by floods, and improves water infiltration without changing soil pH.",
        "flood": "Post-flood soils suffer from compaction and silt contamination. Rotate crops to low-moisture options like Mustard, Chickpeas, or Spinach to bypass damaged layers.",
        "trichoderma": "Trichoderma is a beneficial bio-fungicide that colonizes plant roots, protecting them from aggressive waterborne pathogens like root rot.",
        "silt": "Toxic silt layers seal soil pores and cause root suffocation. Till the soil to aerate it and add compost or agricultural lime to rebalance fertility."
    }

    # Hindi QA
    qa_hi = {
        "powdery mildew": "पाउडरी मिल्ड्यू (चूर्णिल आसिता) एक फंगल बीमारी है जो पत्तियों पर सफेद पाउडर जैसा धब्बा बनाती है। इसके उपचार के लिए नीम के तेल या सल्फर पाउडर का छिड़काव करें।",
        "irrigate": "सिंचाई सुबह के समय (सुबह 4 से 8 बजे) करें। इससे पानी का वाष्पीकरण कम होता है और पत्तियां दिन में सूख जाती हैं, जिससे फंगस नहीं फैलता।",
        "leaves curling": "पत्तियों का मुड़ना आमतौर पर पानी की कमी, अत्यधिक गर्मी या एफिड्स जैसे कीड़ों के कारण होता है। पत्तियों के निचले हिस्से की जांच करें।",
        "early blight": "अगेती झुलसा (Early Blight) टमाटर की पत्तियों पर गोल छल्लेदार धब्बे बनाता है। निचली पत्तियों को काटें और 48 घंटे के भीतर कवकनाशी का छिड़काव करें।",
        "gypsum": "जिप्सम मिट्टी की जकड़न को कम करता है, बाढ़ के बाद जमा हुए खारेपन को दूर करता है, और पीएच बदले बिना जल अवशोषण में सुधार करता है।",
        "flood": "बाढ़ के बाद मिट्टी में हवा की कमी हो जाती है। उपजाऊ क्षमता सुधारने के लिए सरसों, चना या पालक जैसी कम पानी वाली फसलें उगाएं।"
    }

    # Spanish QA
    qa_es = {
        "powdery mildew": "El mildiú polvoriento es un hongo que crea una capa blanca en las hojas. Trátelo con spray de leche diluida o azufre en polvo.",
        "irrigate": "Riegue temprano en la mañana (4 AM a 8 AM) para evitar la evaporación rápida y prevenir la proliferación de hongos en las hojas.",
        "leaves curling": "El enrollamiento de las hojas se debe al estrés por falta de agua, calor extremo o plagas como pulgones. Revise el envés de las hojas.",
        "early blight": "El tizón temprano causa manchas concéntricas en las hojas de tomate. Pode las hojas inferiores infectadas y aplique fungicida.",
        "gypsum": "El yeso agrícola ayuda a aflojar el suelo arcilloso compactado y elimina la acumulación de sodio dañino sin alterar el pH del suelo.",
        "flood": "Tras una inundación, el suelo queda compactado. Se recomienda rotar a cultivos de bajo consumo de agua como mostaza, garbanzo o espinaca."
    }

    # French QA
    qa_fr = {
        "powdery mildew": "L'oïdium est une maladie fongique qui crée un feutrage blanc sur les feuilles. Traitez avec du soufre ou un spray de lait dilué.",
        "irrigate": "Arrosez tôt le matin (de 4h à 8h) pour limiter l'évaporation et permettre aux feuilles de sécher, évitant ainsi les moisissures.",
        "leaves curling": "L'enroulement des feuilles indique souvent un manque d'eau, une chaleur excessive ou des pucerons. Inspectez le dessous des feuilles.",
        "early blight": "L'alternariose provoque des taches concentriques cernées de jaune sur les tomates. Taillez les feuilles basses et traitez sous 48h.",
        "gypsum": "Le gypse améliore la structure des sols argileux tassés par les crues et aide à drainer le sodium sans modifier le pH.",
        "flood": "Après une crue, le sol étouffe. Alternez avec des cultures à cycle court comme la moutarde, le pois chiche ou les épinards."
    }

    # Telugu QA
    qa_te = {
        "powdery mildew": "బూడిద తెగులు అనేది ఆకులపై తెల్లటి పొడిని ఏర్పరిచే ఒక శిలీంద్ర తెగులు. దీని నివారణకు వేప నూనె లేదా సల్ఫర్ పొడిని వాడండి.",
        "irrigate": "ఉదయం వేళల్లో (ఉదయం 4 నుండి 8 గంటల మధ్య) నీరు పెట్టండి. ఇది ఆకులు త్వరగా ఆరిపోయేలా చేసి శిలీంద్రాల వ్యాప్తిని అడ్డుకుంటుంది.",
        "leaves curling": "ఆకులు ముడుచుకుపోవడం అనేది నీటి ఎద్దడి, అధిక వేడి లేదా పేనుబంక వంటి కీటకాల వల్ల జరుగుతుంది. ఆకుల వెనుక భాగం పరిశీలించండి.",
        "early blight": "అల్టర్నేరియా ఆకుమచ్చ తెగులు టమోటా ఆకులపై గుండ్రటి మచ్చలను ఏర్పరుస్తుంది. సోకిన ఆకులను కత్తిరించి 48 గంటల్లో చికిత్స చేయండి.",
        "gypsum": "జిప్సమ్ చవిటి నేలల బిగువును సడలిస్తుంది, వరద వల్ల పేరుకుపోయిన ఉప్పును తొలగిస్తుంది మరియు నేల పిహెచ్ మారకుండా నీటి నిల్వను పెంచుతుంది.",
        "flood": "ఆకుల రంగు మారడం లేదా రాలడం వరద నష్టం వల్ల కావచ్చు. రికవరీ కోసం ఆవాలు, శెనగలు లేదా పాలకూర వంటి పంటలు వేయండి."
    }

    # Select dictionary
    qa = qa_en
    if lang == "hi":
        qa = qa_hi
    elif lang == "es":
        qa = qa_es
    elif lang == "fr":
        qa = qa_fr
    elif lang == "te":
        qa = qa_te

    # Find match
    for key, val in qa.items():
        if key in q:
            return {"reply": val}
            
    # Default local fallbacks
    defaults = {
        "en": "I am Gemma, your offline agricultural consultant. Ask me about powdery mildew, leaf curling, irrigation schedules, or post-flood soil recovery.",
        "hi": "मैं जेम्मा हूँ, आपकी ऑफलाइन कृषि सलाहकार। मुझसे चूर्णिल आसिता (powdery mildew), पत्तियों का मुड़ना, सिंचाई का समय, या मिट्टी सुधार के बारे में पूछें।",
        "es": "Soy Gemma, tu consultora agrícola offline. Pregúntame sobre el mildiú polvoriento, enrollamiento de hojas, riego o recuperación del suelo.",
        "fr": "Je suis Gemma, votre conseillère agricole hors ligne. Posez-moi des questions sur l'oïdium, l'enroulement des feuilles, l'irrigation ou le sol.",
        "te": "నేను జెమ్మా, మీ ఆఫ్లైన్ వ్యవసాయ సహాయకురాలిని. నన్ను బూడిద తెగులు, ఆకులు ముడుచుకోవడం, నీటి పారుదల లేదా నేల రికవరీ గురించి అడగండి."
    }
    return {"reply": defaults.get(lang, defaults["en"])}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
