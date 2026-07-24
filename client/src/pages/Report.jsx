import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import qrcode from "../utils/qrcode";
import {
  Leaf,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Share2,
  MapPin,
  Trash2,
  Activity,
  Compass,
  Sparkles,
  FlaskConical,
  Mic,
  Volume2,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Report() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("id");
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFrame, setActiveFrame] = useState(null);
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startVoiceAssistant = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Try Chrome or Edge.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang =
      language === "hi"
        ? "hi-IN"
        : language === "te"
          ? "te-IN"
          : language === "es"
            ? "es-ES"
            : language === "fr"
              ? "fr-FR"
              : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setTranscript("Listening...");
    setAssistantReply("");

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      generateVoiceReply(speechToText);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setTranscript("Error capturing speech. Try again.");
    };
  };

  const generateVoiceReply = (query) => {
    if (!analysis) return;
    const q = query.toLowerCase();
    let reply = "";

    const organicSpray =
      analysis.organic_treatments?.[0] ||
      analysis.organic_options?.[0] ||
      "Neem oil";

    if (language === "hi") {
      if (
        q.includes("टमाटर") ||
        q.includes("tomato") ||
        q.includes("समस्या") ||
        q.includes("बीमारी")
      ) {
        reply = `आपके फसल में ${translateKey(analysis.probable_issue)} पाया गया है। इसकी गंभीरता ${translateKey(analysis.severity)} है।`;
      } else if (
        q.includes("बचाव") ||
        q.includes("इलाज") ||
        q.includes("उपचार")
      ) {
        reply = `ऑर्गेनिक उपचार के लिए ${translateKey(organicSpray)} का उपयोग करें। रिकवरी की संभावना ${analysis.recovery_chance || 80} प्रतिशत है।`;
      } else if (q.includes("सुरक्षित") || q.includes("पर्यटक")) {
        reply = analysis.tourist_safety?.hazard_detected
          ? `चेतावनी: ${translateKey(analysis.tourist_safety.message)}`
          : "हाँ, पर्यटकों के लिए रास्ता सुरक्षित है।";
      } else {
        reply = `आपकी मुख्य समस्या ${translateKey(analysis.probable_issue)} है। उपचार के लिए तुरंत कार्रवाई करें।`;
      }
    } else if (language === "es") {
      if (
        q.includes("problema") ||
        q.includes("enfermedad") ||
        q.includes("tomate") ||
        q.includes("planta")
      ) {
        reply = `Se detectó ${translateKey(analysis.probable_issue)}. La gravedad es ${translateKey(analysis.severity)}.`;
      } else if (
        q.includes("recuperar") ||
        q.includes("tratar") ||
        q.includes("tratamiento")
      ) {
        reply = `Para el tratamiento orgánico, utilice ${translateKey(organicSpray)}. La probabilidad de recuperación es del ${analysis.recovery_chance || 80} por ciento.`;
      } else if (q.includes("seguro") || q.includes("turistas")) {
        reply = analysis.tourist_safety?.hazard_detected
          ? `Alerta: ${translateKey(analysis.tourist_safety.message)}`
          : "Sí, el área es segura para los visitantes.";
      } else {
        reply = `El problema principal es ${translateKey(analysis.probable_issue)}. Trate dentro del periodo de urgencia.`;
      }
    } else if (language === "fr") {
      if (
        q.includes("problème") ||
        q.includes("maladie") ||
        q.includes("tomate") ||
        q.includes("plante")
      ) {
        reply = `Nous avons détecté ${translateKey(analysis.probable_issue)}. La sévérité est ${translateKey(analysis.severity)}.`;
      } else if (
        q.includes("traiter") ||
        q.includes("soigner") ||
        q.includes("traitement")
      ) {
        reply = `Pour un traitement biologique, utilisez ${translateKey(organicSpray)}. La chance de récupération est de ${analysis.recovery_chance || 80} pour cent.`;
      } else if (q.includes("sécurisé") || q.includes("touristes")) {
        reply = analysis.tourist_safety?.hazard_detected
          ? `Alerte: ${translateKey(analysis.tourist_safety.message)}`
          : "Oui, la zone est sécurisée pour les visiteurs.";
      } else {
        reply = `Le problème principal est ${translateKey(analysis.probable_issue)}. Suivez les recommandations urgentes.`;
      }
    } else if (language === "te") {
      if (q.includes("టమోటా") || q.includes("సమస్య") || q.includes("తెగులు")) {
        reply = `మీ పంటకు ${translateKey(analysis.probable_issue)} ఉన్నట్లు గుర్తించబడింది. తీవ్రత ${translateKey(analysis.severity)}.`;
      } else if (q.includes("కోలుకోవడం") || q.includes("చికిత్స")) {
        reply = `సేంద్రీయ చికిత్స కోసం ${translateKey(organicSpray)} వాడండి. రికవరీ అవకాశం ${analysis.recovery_chance || 80} శాతం.`;
      } else if (q.includes("సురక్షితం") || q.includes("పర్యాటకులు")) {
        reply = analysis.tourist_safety?.hazard_detected
          ? `హెచ్చరిక: ${translateKey(analysis.tourist_safety.message)}`
          : "అవును, పర్యాటకులకు మార్గం సురక్షితం.";
      } else {
        reply = `ప్రధాన సమస్య ${translateKey(analysis.probable_issue)}. దయచేసి తగిన చర్యలు తీసుకోండి.`;
      }
    } else {
      if (
        q.includes("problem") ||
        q.includes("wrong") ||
        q.includes("issue") ||
        q.includes("tomato") ||
        q.includes("tea") ||
        q.includes("grape")
      ) {
        reply = `Gemma detected ${analysis.probable_issue} on your crop. The severity level is ${analysis.severity}.`;
      } else if (
        q.includes("treat") ||
        q.includes("organic") ||
        q.includes("action") ||
        q.includes("recover") ||
        q.includes("chickpea") ||
        q.includes("mustard")
      ) {
        reply = `For organic treatment, spray ${organicSpray}. The crop survival recovery chance is estimated at ${analysis.recovery_chance || 80} percent.`;
      } else if (
        q.includes("safe") ||
        q.includes("tourist") ||
        q.includes("guest") ||
        q.includes("warning")
      ) {
        reply = analysis.tourist_safety?.hazard_detected
          ? `Caution: ${analysis.tourist_safety.message}`
          : "Yes, this field trail is fully safe for guest tours.";
      } else {
        reply = `The crop is showing signs of ${analysis.probable_issue}. We recommend reviewing the recovery timeline.`;
      }
    }

    setAssistantReply(reply);
    speakVoiceReply(reply);
  };

  const speakVoiceReply = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === "hi"
        ? "hi-IN"
        : language === "te"
          ? "te-IN"
          : language === "es"
            ? "es-ES"
            : language === "fr"
              ? "fr-FR"
              : "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const translateKey = (enText) => {
    if (!enText) return "";

    const translations = {
      hi: {
        "Tomato (Solanum lycopersicum)": "टमाटर (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "चाय बागान (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)":
          "अंगूर / अंगूर का बाग (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "मिश्रित वृक्षारोपण / गाद मट्टी",
        "Early Blight (Alternaria solani)": "अगेती झुलसा (Early Blight)",
        "Blister Blight (Exobasidium vexans)": "फफोला झुलसा (Blister Blight)",
        "Powdery Mildew (Uncinula necator)": "चूर्णिल आसिता (Powdery Mildew)",
        "Post-Disaster Field Contamination": "आपदा पश्चात क्षेत्र संदूषण",
        Mild: "हल्का (Mild)",
        Moderate: "मध्यम (Moderate)",
        Severe: "गंभीर (Severe)",
        High: "उच्च (High)",
        Medium: "मध्यम (Medium)",
        Low: "निम्न (Low)",
        "High (94%)": "उच्च (94%)",
        "High (91%)": "उच्च (91%)",
        "Medium (88%)": "मध्यम (88%)",
        "High (90%)": "उच्च (90%)",
        "Waterlogged but Salvagable": "जलभराव लेकिन बचाने योग्य",
        "Highly Contaminated": "अत्यधिक दूषित",
        "Safe for Immediate Planting": "तुरंत रोपण के लिए सुरक्षित",
        "Disaster Field Checker":
          "आपदा क्षेत्र समीक्षक (Disaster Field Checker)",
        "Plant Health Checker": "पौधा स्वास्थ्य रक्षक (Plant Health Checker)",
        "Day 1-3": "दिन 1-3",
        "Day 4-7": "दिन 4-7",
        "Week 2": "सप्ताह 2",
        "Week 3-4": "सप्ताह 3-4",
        "Treat within 24 hours": "24 घंटों के भीतर उपचार करें",
        "Treat within 48 hours": "48 घंटों के भीतर उपचार करें",
        "Treat within 72 hours": "72 घंटों के भीतर उपचार करें",
        Healthy: "स्वस्थ (Healthy)",
        Recovering: "सुधर रहा है (Recovering)",
        "Moderate Damage": "मध्यम क्षति (Moderate Damage)",
        "Severe Damage": "गंभीर क्षति (Severe Damage)",
        Mustard: "सरसों (Mustard)",
        Chickpea: "चना (Chickpea)",
        Spinach: "पालक (Spinach)",
        Rice: "चावल (Rice)",
        "Neem oil": "नीम का तेल (Neem oil)",
        "Baking soda": "बेकिंग सोडा (Baking soda)",
        "Compost tea": "कम्पोस्ट चाय (Compost tea)",
        Mancozeb: "मैनकोज़ेब (Mancozeb)",
        "Copper oxychloride": "कॉपर ऑक्सीक्लोराइड (Copper oxychloride)",
      },
      es: {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)":
          "Plantación de Té (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)":
          "Uvas / Viñedos (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "Plantación Mixta / Suelo de Limo",
        "Early Blight (Alternaria solani)":
          "Tizón Temprano (Alternaria solani)",
        "Blister Blight (Exobasidium vexans)":
          "Roya de la Ampolla (Exobasidium vexans)",
        "Powdery Mildew (Uncinula necator)":
          "Mildiú Polvoriento (Uncinula necator)",
        "Post-Disaster Field Contamination":
          "Contaminación de Campo Post-Desastre",
        Mild: "Leve",
        Moderate: "Moderado",
        Severe: "Grave",
        High: "Alto",
        Medium: "Medio",
        Low: "Bajo",
        Healthy: "Saludable",
        Recovering: "Recuperando",
        "Moderate Damage": "Daño Moderado",
        "Severe Damage": "Daño Grave",
      },
      fr: {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)":
          "Plantation de Thé (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)":
          "Raisins / Vignobles (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "Plantation Mixte / Limon de Sol",
        "Early Blight (Alternaria solani)": "Alternariose (Alternaria solani)",
        "Blister Blight (Exobasidium vexans)":
          "Maladie des Cloques (Exobasidium vexans)",
        "Powdery Mildew (Uncinula necator)": "Oïdium (Uncinula necator)",
        Mild: "Léger",
        Moderate: "Modéré",
        Severe: "Grave",
        Healthy: "Sain",
        Recovering: "En récupération",
      },
      te: {
        "Tomato (Solanum lycopersicum)": "టమోటా (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "తేయాకు తోట (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)": "ద్రాక్ష తోటలు (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "మిశ్రమ తోట / ఒండ్రు మట్టి",
        "Early Blight (Alternaria solani)":
          "అల్టర్నేరియా ఆకుమచ్చ తెగులు (Early Blight)",
        Mild: "తేలికపాటి (Mild)",
        Moderate: "మధ్యస్థం (Moderate)",
        Severe: "తీవ్రమైన (Severe)",
        Healthy: "ఆరోగ్యకరమైనది",
        Recovering: "కోలుకుంటుంది",
      },
    };

    return translations[language]?.[enText] || enText;
  };

  useEffect(() => {
    if (!reportId) {
      setError("No report ID provided in the query string. Go to Dashboard.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/reports/${reportId}`)
      .then((res) => {
        setReportData(res.data);
        if (
          res.data.type === "drone" &&
          res.data.analysis?.individualFrameAnalyses?.length > 0
        ) {
          setActiveFrame(res.data.analysis.individualFrameAnalyses[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Failed to retrieve crop report. Ensure API server and DB are online.",
        );
        setLoading(false);
      });
  }, [reportId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/reports/${reportId}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the report.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading Gemma 4 Assessment...
        </p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-secondary/50 border border-border p-6 rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
          <h2 className="text-lg font-bold text-foreground">
            Failed to Load Report
          </h2>
          <p className="text-xs text-muted-foreground">
            {error || "Report not found."}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const analysis = reportData.analysis;
  const isDrone = reportData.type === "drone";

  // Determine full URL (support ImageKit CDN vs local relative upload)
  const imageUrl = reportData.image_url?.startsWith("http")
    ? reportData.image_url
    : `${BACKEND_URL}${reportData.image_url}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 text-[11px] text-slate-200 font-semibold px-2.5 py-1.5 rounded-lg border border-white/10 focus:outline-none cursor-pointer"
            >
              <option value="en">English (US)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>

            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Report
            </button>
          </div>
        </div>

        {/* Header Summary Card */}
        <div className="frosted-glass border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {translateKey(
                  isDrone ? "Disaster Field Checker" : "Plant Health Checker",
                )}
              </span>
              <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
                {translateKey(analysis.probable_issue)}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Target: {translateKey(analysis.crop)}
              </p>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                analysis.severity === "Severe"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              Severity: {translateKey(analysis.severity)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Confidence Score:</span>
              <span className="font-semibold text-white">
                {translateKey(analysis.confidence)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Engine:</span>
              <span className="font-semibold text-white">
                Gemma AI 4 Pipeline
              </span>
            </div>
            {reportData.coordinates && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-white">
                  {reportData.coordinates.latitude.toFixed(4)},{" "}
                  {reportData.coordinates.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Details Grid split panel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left panel: Media & Interactive coordinate grids */}
          <div className="md:col-span-2 space-y-6">
            {/* Uploaded Leaf/Terrain image */}
            <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scan Capture
              </h3>
              <div className="rounded-xl overflow-hidden border border-white/5 bg-black/25 aspect-video md:aspect-square flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Telemetry visual"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%231e293b%22/><text y=%22.65em%22 x=%2222%22 font-size=%2240%22>🍃</text></svg>";
                  }}
                />
              </div>
            </div>

            {/* Local Farm Network QR Sync */}
            <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  Local Farm Network QR Sync
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl space-y-3">
                {(() => {
                  try {
                    const qr = qrcode(0, "M");
                    qr.addData(window.location.href);
                    qr.make();
                    const qrDataUrl = qr.createDataURL(4, 8);
                    return (
                      <div className="p-2.5 bg-white rounded-lg flex items-center justify-center border border-white/10 aspect-square max-w-[150px]">
                        <img
                          src={qrDataUrl}
                          alt="Inspection QR Link"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    );
                  } catch (err) {
                    return (
                      <div className="text-xs text-rose-400">
                        Failed to render sync QR.
                      </div>
                    );
                  }
                })()}

                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    Scan Local Access
                  </span>
                  <p className="text-[9px] text-slate-400 font-light leading-relaxed max-w-[180px] mx-auto">
                    Scanning this on the local farm Wi-Fi displays the active
                    diagnostic report.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: AI analysis details */}
          <div className="md:col-span-3 space-y-6">
            {/* Predictive Analytics */}
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Gemma 4 Predictive Analytics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Chance of Recovery</span>
                    <span className="text-emerald-400">
                      {analysis.recovery_chance || 80}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.recovery_chance || 80}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Estimated Yield Loss</span>
                    <span className="text-rose-400">
                      {analysis.yield_loss_estimate || 20}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${analysis.yield_loss_estimate || 20}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organic vs Chemical Treatment Plans */}
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-white/5 pb-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Treatment Plan Options
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2.5 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl">
                  <span className="font-extrabold text-[10px] text-emerald-400 uppercase tracking-wider block">
                    🍀 Organic Options
                  </span>
                  <ul className="space-y-2 text-slate-300 font-light">
                    {(
                      analysis.organic_treatments ||
                      analysis.organic_options || ["Neem oil"]
                    ).map((treatment, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{translateKey(treatment)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5 bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl">
                  <span className="font-extrabold text-[10px] text-amber-400 uppercase tracking-wider block">
                    🧪 Chemical Options
                  </span>
                  <ul className="space-y-2 text-slate-300 font-light">
                    {(
                      analysis.chemical_treatments || [
                        "Mancozeb",
                        "Copper oxychloride",
                      ]
                    ).map((treatment, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-450 shrink-0" />
                        <span>{translateKey(treatment)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommended Immediate Actions */}
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-3 shadow-md">
              <h3 className="text-sm font-semibold text-white">
                Recommended Immediate Actions
              </h3>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                {analysis.recommended_actions?.map((action, idx) => (
                  <li key={idx}>
                    <span className="text-white font-medium">{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <Link
            to="/dashboard"
            className="btn-pill-secondary font-semibold text-xs"
          >
            Go to Timeline History
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-pill-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-950" />
            Export / Print Report
          </button>
        </div>
      </main>
    </div>
  );
}

export default Report;
