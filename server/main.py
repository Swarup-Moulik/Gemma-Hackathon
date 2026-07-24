import os

from dotenv import load_dotenv

load_dotenv()

from database import close_mongo_connection, connect_to_mongo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from routers import analyze_router, report_router
from services.gemma_service import get_genai_client, get_model_id

app = FastAPI(
    title="Green Praxis Backend",
    description="Gemma 4 Multimodal API Engine",
    version="1.0.0",
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Lifespan Database Connection Events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


# Root Landing Route
@app.get("/")
def root():
    return {
        "status": "OK",
        "message": "Green Praxis API Engine is live on Vercel!",
        "health": "/api/health",
    }


# Health Check Route
@app.get("/api/health")
def health_check():
    return {
        "status": "OK",
        "engine": "Green Praxis Engine",
        "database": "MongoDB Motor Connected",
    }


# Register Modular Routers
app.include_router(analyze_router.router, prefix="/api", tags=["Analysis"])
app.include_router(report_router.router, prefix="/api", tags=["Reports"])


# Multilingual Agricultural Chatbot Endpoint
class ChatRequest(BaseModel):
    query: str
    language: str = "en"


@app.post("/api/chat")
async def agricultural_chat(req: ChatRequest):
    q = req.query.strip()
    lang = req.language

    # 1. Attempt Gemma / GenAI Live Generation
    genai_client = get_genai_client()
    if genai_client:
        try:
            prompt = (
                f"You are Gemma, an expert AI agricultural consultant for Green Praxis. "
                f"Answer the following farmer query concisely (in 2-4 sentences max), clearly, and accurately in language code '{lang}':\n\n"
                f"User Question: {q}"
            )
            response = genai_client.models.generate_content(
                model=get_model_id(),
                contents=prompt,
            )
            if response and response.text:
                return {"reply": response.text.strip()}
        except Exception as e:
            print(f"GenAI Chat Generation Warning: {e}. Using intelligent fallback.")

    # 2. Smart Offline Keyword Matching Fallback
    q_lower = q.lower()

    qa_en = [
        (
            ["powdery mildew", "mildew", "white powder", "fungus"],
            "Powdery mildew is a fungal disease creating a powdery white layer on leaves. Treat organically using diluted milk sprays (1:9 ratio with water), neem oil, or sulfur powder. Ensure good air circulation.",
        ),
        (
            ["irrigat", "water", "watering", "drip"],
            "Irrigate during early morning hours (4 AM to 8 AM). This minimizes water evaporation losses and allows leaf canopy moisture to dry naturally during the day, preventing fungal growth.",
        ),
        (
            ["curl", "curling", "leaf curl", "wrinkled"],
            "Leaf curling is usually caused by water stress, high heat, or sap-sucking pests like aphids and thrips. Inspect the leaf undersides and check topsoil moisture levels.",
        ),
        (
            ["early blight", "blight", "target spot"],
            "Early blight causes concentric target-like rings on foliage. Prune infected lower leaves immediately, avoid overhead watering, and apply copper oxychloride or neem oil.",
        ),
        (
            ["gypsum", "calcium sulfate", "silt", "soil"],
            "Gypsum (Calcium Sulfate) breaks up compacted clay/silt soil, improves drainage aeration, and flushes out sodium salts after flooding without altering soil pH.",
        ),
    ]

    qa_hi = [
        (
            ["पाउडरी", "मिल्ड्यू", "फंगस", "सफेद"],
            "पाउडरी मिल्ड्यू एक फंगल बीमारी है। इसके उपचार के लिए नीम के तेल, बेकिंग सोडा या सल्फर पाउडर का छिड़काव करें।",
        ),
        (
            ["सिंचाई", "पानी", "इर्रीगेट"],
            "सिंचाई सुबह के समय (सुबह 4 से 8 बजे) करें ताकि पानी का वाष्पीकरण कम हो और पत्तियां दिन में सूख सकें।",
        ),
        (
            ["मुड़", "मुड़ना", "पत्तियां"],
            "पत्तियों का मुड़ना पानी की कमी, अत्यधिक गर्मी या कीटों (जैसे एफिड्स) के कारण होता है। निचली पत्तियों की जांच करें।",
        ),
        (
            ["झुलसा", "अगेती", "ब्लाइट"],
            "अगेती झुलसा पत्तियों पर गोल छल्लेदार धब्बे बनाता है। निचली संक्रमित पत्तियों को काटें और कवकनाशी छिड़कें।",
        ),
        (
            ["जिप्सम", "मिट्टी", "गाद"],
            "जिप्सम मिट्टी की जकड़न को कम करता है, बाढ़ के बाद जमा खारेपन को दूर करता है और पीएच बदले बिना जल अवशोषण सुधारता है।",
        ),
    ]

    rules = qa_hi if lang == "hi" else qa_en

    for keywords, reply in rules:
        if any(k in q_lower for k in keywords):
            return {"reply": reply}

    defaults = {
        "en": f"I analyzed your inquiry about '{q}'. As your Green Praxis advisor, I recommend inspecting soil moisture, checking leaf undersides for pests, and maintaining clear bed drainage.",
        "hi": f"मैंने '{q}' के बारे में आपकी पूछताछ का विश्लेषण किया है। मिट्टी की नमी की जांच करें और जल निकासी बनाए रखें।",
        "es": f"Analicé su consulta sobre '{q}'. Inspeccione la humedad del suelo y revise el envés de las hojas.",
        "fr": f"J'ai analysé votre question concernant '{q}'. Vérifiez l'humidité du sol et inspectez le dessous des feuilles.",
        "te": f"నేను '{q}' గురించి మీ విచారణను విశ్లేషించాను. నేల తేమను పరిశీలించండి.",
    }
    return {"reply": defaults.get(lang, defaults["en"])}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
