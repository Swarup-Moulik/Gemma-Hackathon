import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Compass
} from "lucide-react";

function Report() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("id");
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFrame, setActiveFrame] = useState(null);
  const [language, setLanguage] = useState("en");

  const BACKEND_URL = "http://localhost:8000";

  const translateKey = (enText) => {
    if (!enText) return "";
    
    const translations = {
      hi: {
        // Crops
        "Tomato (Solanum lycopersicum)": "टमाटर (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "चाय बागान (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)": "अंगूर / अंगूर का बाग (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "मिश्रित वृक्षारोपण / गाద మట్టి",
        
        // Issues
        "Early Blight (Alternaria solani)": "अगेती झुलसा (Early Blight)",
        "Blister Blight (Exobasidium vexans)": "फफोला झुलसा (Blister Blight)",
        "Powdery Mildew (Uncinula necator)": "चूर्णिल आसिता (Powdery Mildew)",
        "Post-Disaster Field Contamination": "आपदा पश्चात क्षेत्र संदूषण",
        
        // Severity
        "Mild": "हल्का (Mild)",
        "Moderate": "मध्यम (Moderate)",
        "Severe": "गंभीर (Severe)",
        
        // Status & Risk
        "High": "उच्च (High)",
        "Medium": "मध्यम (Medium)",
        "Low": "निम्न (Low)",
        "High (94%)": "उच्च (94%)",
        "High (91%)": "उच्च (91%)",
        "Medium (88%)": "मध्यम (88%)",
        "High (90%)": "उच्च (90%)",
        "Waterlogged but Salvagable": "जलभराव लेकिन बचाने योग्य",
        "Highly Contaminated": "अत्यधिक दूषित",
        "Safe for Immediate Planting": "तुरंत रोपण के लिए सुरक्षित",

        // Sections
        "Disaster Field Checker": "आपदा क्षेत्र समीक्षक (Disaster Field Checker)",
        "Plant Health Checker": "पौधा स्वास्थ्य रक्षक (Plant Health Checker)"
      },
      es: {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "Plantación de Té (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)": "Uvas / Viñedos (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "Plantación Mixta / Suelo de Limo",
        "Early Blight (Alternaria solani)": "Tizón Temprano (Alternaria solani)",
        "Blister Blight (Exobasidium vexans)": "Roya de la Ampolla (Exobasidium vexans)",
        "Powdery Mildew (Uncinula necator)": "Mildiú Polvoriento (Uncinula necator)",
        "Post-Disaster Field Contamination": "Contaminación de Campo Post-Desastre",
        "Mild": "Leve",
        "Moderate": "Moderado",
        "Severe": "Grave",
        "High": "Alto",
        "Medium": "Medio",
        "Low": "Bajo",
        "High (94%)": "Alto (94%)",
        "High (91%)": "Alto (91%)",
        "Medium (88%)": "Medio (88%)",
        "High (90%)": "Alto (90%)",
        "Waterlogged but Salvagable": "Inundado pero Recuperable",
        "Highly Contaminated": "Altamente Contaminado",
        "Safe for Immediate Planting": "Seguro para Siembra Inmediata",
        "Disaster Field Checker": "Verificador de Campo en Desastres",
        "Plant Health Checker": "Verificador de Salud de Plantas"
      },
      fr: {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "Plantation de Thé (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)": "Raisins / Vignobles (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "Plantation Mixte / Limon de Sol",
        "Early Blight (Alternaria solani)": "Alternariose (Alternaria solani)",
        "Blister Blight (Exobasidium vexans)": "Maladie des Cloques (Exobasidium vexans)",
        "Powdery Mildew (Uncinula necator)": "Oïdium (Uncinula necator)",
        "Post-Disaster Field Contamination": "Contamination du Champ Après Sinistre",
        "Mild": "Léger",
        "Moderate": "Modéré",
        "Severe": "Grave",
        "High": "Élevé",
        "Medium": "Moyen",
        "Low": "Faible",
        "High (94%)": "Élevé (94%)",
        "High (91%)": "Élevé (91%)",
        "Medium (88%)": "Moyen (88%)",
        "High (90%)": "Élevé (90%)",
        "Waterlogged but Salvagable": "Gorgé d'eau mais Récupérable",
        "Highly Contaminated": "Hautement Contaminé",
        "Safe for Immediate Planting": "Sûr pour Plantation Immédiate",
        "Disaster Field Checker": "Contrôleur de Champ Post-Catastrophe",
        "Plant Health Checker": "Vérificateur de Santé des Plantes"
      },
      te: {
        "Tomato (Solanum lycopersicum)": "టమోటా (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "తేయాకు తోట (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)": "ద్రాక్ష తోటలు (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "మిశ్రమ తోట / ఒండ్రు మట్టి",
        "Early Blight (Alternaria solani)": "అల్టర్నేరియా ఆకుమచ్చ తెగులు (Early Blight)",
        "Blister Blight (Exobasidium vexans)": "ఆకు బొబ్బ తెగులు (Blister Blight)",
        "Powdery Mildew (Uncinula necator)": "బూడిద తెగులు (Powdery Mildew)",
        "Post-Disaster Field Contamination": "విపత్తు అనంతర పొలం కాలుష్యం",
        "Mild": "తేలికపాటి (Mild)",
        "Moderate": "మధ్యస్థం (Moderate)",
        "Severe": "తీవ్రమైన (Severe)",
        "High": "అధికం (High)",
        "Medium": "మధ్యస్థం (Medium)",
        "Low": "తక్కువ (Low)",
        "High (94%)": "అధికం (94%)",
        "High (91%)": "అధికం (91%)",
        "Medium (88%)": "మధ్యస్థం (88%)",
        "High (90%)": "అధికం (90%)",
        "Waterlogged but Salvagable": "నీటితో నిండినప్పటికీ కాపాడుకోగలరు",
        "Highly Contaminated": "ఎక్కువగా కలుషితమైనది",
        "Safe for Immediate Planting": "వెంటనే నాటడానికి సురక్షితం",
        "Disaster Field Checker": "విపత్తు పొల పరిశీలకుడు (Disaster Field Checker)",
        "Plant Health Checker": "మొక్కల ఆరోగ్య పరీక్షకారి (Plant Health Checker)"
      }
    };

    return translations[language]?.[enText] || enText;
  };

  useEffect(() => {
    if (!reportId) {
      setError("No report ID provided in the query string. Go to Home to scan.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/reports/${reportId}`)
      .then((res) => {
        setReportData(res.data);
        // Default first frame if drone mode
        if (res.data.type === "drone" && res.data.analysis?.individualFrameAnalyses?.length > 0) {
          setActiveFrame(res.data.analysis.individualFrameAnalyses[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to retrieve crop report. Ensure the local FastAPI server and MongoDB are online.");
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
          <h2 className="text-lg font-bold text-foreground">Failed to Load Report</h2>
          <p className="text-xs text-muted-foreground">{error || "Report not found."}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const analysis = reportData.analysis;
  const isDrone = reportData.type === "drone";

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
                {translateKey(isDrone ? "Disaster Field Checker" : "Plant Health Checker")}
              </span>
              <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
                {translateKey(analysis.probable_issue)}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Target: {translateKey(analysis.crop)}
              </p>
            </div>

            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
              analysis.severity === "Severe"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}>
              Severity: {translateKey(analysis.severity)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Confidence Score:</span>
              <span className="font-semibold text-white">{translateKey(analysis.confidence)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Engine:</span>
              <span className="font-semibold text-white">Offline Gemma 4 Pipeline</span>
            </div>
            {reportData.coordinates && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-white">
                  {reportData.coordinates.latitude.toFixed(4)}, {reportData.coordinates.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Drone Overall Metrics Header */}
        {isDrone && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 frosted-glass border border-white/10 rounded-2xl p-5 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Field Suitability</span>
              <span className="font-extrabold text-sm text-white mt-1 block">
                {translateKey(analysis.field_status)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px] mb-1">Toxic Silt Risk</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                analysis.toxic_silt_risk === "High"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}>
                {translateKey(analysis.toxic_silt_risk)} Risk
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Estimated Land Damage</span>
              <span className="font-extrabold text-sm text-white mt-1 block">
                {analysis.damaged_percentage}%
              </span>
            </div>
          </div>
        )}

        {/* Main Details Grid split panel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Left panel: Media & Interactive coordinate grids */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Uploaded Leaf/Terrain image */}
            <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scan Capture</h3>
              <div className="rounded-xl overflow-hidden border border-white/5 bg-black/25 aspect-video md:aspect-square flex items-center justify-center">
                <img
                  src={`${BACKEND_URL}${reportData.image_url}`}
                  alt="Telemetry visual"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%231e293b%22/><text y=%22.65em%22 x=%2222%22 font-size=%2240%22>🍃</text></svg>";
                  }}
                />
              </div>
            </div>

            {/* Drone coordinate grid (only visible in drone scanner mode) */}
            {isDrone && analysis.individualFrameAnalyses && (
              <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-primary" />
                    <span>Multispectral Map Grid</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Offline Grid</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5 max-w-[200px] mx-auto aspect-square p-2 bg-black/20 border border-white/5 rounded-xl">
                  {analysis.individualFrameAnalyses.map((frame, index) => {
                    const colorMap = {
                      Mild: "bg-emerald-500 border-emerald-400 shadow-emerald-500/20",
                      Moderate: "bg-amber-500 border-amber-400 shadow-amber-500/20",
                      Severe: "bg-destructive border-destructive-foreground/20 shadow-destructive/20"
                    };

                    const isSelected = activeFrame?.timestamp === frame.timestamp;

                    return (
                      <button
                        key={index}
                        onClick={() => setActiveFrame(frame)}
                        className={`flex items-center justify-center rounded-lg border-2 ${
                          colorMap[frame.severity] || "bg-muted border-border"
                        } hover:scale-105 transition-transform font-mono text-[10px] font-bold text-background cursor-pointer ${
                          isSelected ? "ring-2 ring-white border-white scale-105" : ""
                        }`}
                      >
                        F{index + 1}
                      </button>
                    );
                  })}
                </div>

                {activeFrame && (
                  <div className="bg-black/25 border border-white/5 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-semibold text-white">Frame Telemetry F{analysis.individualFrameAnalyses.indexOf(activeFrame) + 1}</span>
                      <span className="text-slate-400">t={activeFrame.timestamp}s</span>
                    </div>
                    <p className="text-slate-400 font-mono">
                      GPS: {activeFrame.coordinates.latitude.toFixed(5)}, {activeFrame.coordinates.longitude.toFixed(5)}
                    </p>
                    <div>
                      <span className="font-semibold text-white">Grid Findings:</span>
                      <ul className="list-disc list-inside text-primary mt-1">
                        {activeFrame.visual_findings.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: AI analysis details */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Tourist Safety Card */}
            {analysis.tourist_safety?.hazard_detected ? (
              <div className="bg-rose-500/10 border border-rose-500/15 text-rose-400 rounded-xl p-4 flex items-start gap-3 frosted-glass animate-fadeIn">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Guest & Tourist Safety Hazard Warning
                  </h3>
                  <p className="text-xs mt-0.5 text-rose-300">
                    {analysis.tourist_safety.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 rounded-xl p-4 flex items-start gap-3 frosted-glass animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Guest Zone Secured</h3>
                  <p className="text-xs mt-0.5 text-slate-300">
                    {analysis.tourist_safety?.message || "No guest safety alerts reported."}
                  </p>
                </div>
              </div>
            )}

            {/* Causes and Treatments grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Likely Causes */}
              <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Likely Environmental Causes
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.likely_causes?.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5"></span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organic Options */}
              <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Leaf className="w-4 h-4 text-primary" />
                  Organic Treatment Plan
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.organic_options?.map((option, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
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

            {/* Disaster Field Checker Soil agents (only visible if drone scanned) */}
            {isDrone && analysis.reclamation_steps && (
              <div className="frosted-glass border border-primary/20 rounded-xl p-5 space-y-3 shadow-md">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Disaster Soil Reclamation Roadmap
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-white">Steps Required:</span>
                    <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                      {analysis.reclamation_steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/25 border border-white/5 p-3 rounded-lg">
                      <span className="font-bold text-primary block">Soil Rebalancing Agent:</span>
                      <span className="text-slate-300 text-xs mt-1 block">{analysis.soil_rebalancing_agent}</span>
                    </div>
                    <div className="bg-black/25 border border-white/5 p-3 rounded-lg">
                      <span className="font-bold text-amber-500 block">Immediate Safeguards:</span>
                      <ul className="list-disc list-inside text-[10px] text-slate-400 mt-1 space-y-0.5">
                        {analysis.immediate_safeguards?.map((safeguard, idx) => (
                          <li key={idx}>{safeguard}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expert Threshold Alert */}
            {analysis.expert_advice && (
              <div className="bg-amber-500/5 border border-amber-500/15 frosted-glass rounded-xl p-4 flex gap-2 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-500">Expert Action Threshold Indicator</span>
                  <p className="text-slate-300 mt-1">{analysis.expert_advice}</p>
                </div>
              </div>
            )}

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
