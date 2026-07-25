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

const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BACKEND_URL = RAW_URL.replace(/\/+$/, "");

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

  // Dynamic language configuration matrix
  const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English (US)", locale: "en-US" },
    { code: "hi", label: "हिंदी (Hindi)", locale: "hi-IN" },
    { code: "es", label: "Español (Spanish)", locale: "es-ES" },
    { code: "fr", label: "Français (French)", locale: "fr-FR" },
    { code: "te", label: "తెలుగు (Telugu)", locale: "te-IN" },
  ];

  const getLocale = (langCode) =>
    SUPPORTED_LANGUAGES.find((item) => item.code === langCode)?.locale ||
    "en-US";

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
    recognition.lang = getLocale(language);
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

    const organicSpray =
      analysis.organic_treatments?.[0] ||
      analysis.organic_options?.[0] ||
      "Recommended organic spray";

    const recoveryPercent = analysis.recovery_chance ?? (isDrone ? 60 : 80);
    const issueName = translateKey(analysis.probable_issue);
    const severityLevel = translateKey(analysis.severity);

    let reply = "";

    switch (language) {
      case "hi":
        reply = `आपकी समस्या ${issueName} है (गंभीरता: ${severityLevel})। जैविक उपचार: ${translateKey(organicSpray)}। रिकवरी दर: ${recoveryPercent}%।`;
        break;
      case "es":
        reply = `Problema: ${issueName}. Severidad: ${severityLevel}. Tratamiento orgánico: ${translateKey(organicSpray)}. Recuperación: ${recoveryPercent}%.`;
        break;
      case "fr":
        reply = `Problème: ${issueName}. Sévérité: ${severityLevel}. Traitement biologique: ${translateKey(organicSpray)}. Récupération: ${recoveryPercent}%.`;
        break;
      case "te":
        reply = `సమస్య: ${issueName}. తీవ్రత: ${severityLevel}. సేంద్రీయ చికిత్స: ${translateKey(organicSpray)}. రికవరీ: ${recoveryPercent}%.`;
        break;
      default:
        reply = `Detected ${analysis.probable_issue} with ${analysis.severity} severity. Primary organic treatment: ${organicSpray}. Recovery estimation: ${recoveryPercent}%.`;
        break;
    }

    setAssistantReply(reply);
    speakVoiceReply(reply);
  };

  const speakVoiceReply = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLocale(language);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const translateKey = (enText) => {
    if (!enText) return "";
    return reportData?.translations?.[language]?.[enText] || enText;
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
          Loading Diagnostic Assessment...
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

  const analysis = reportData.analysis || {};
  const isDrone = reportData.type === "drone";

  // Calculate dynamic fallbacks for legacy DB records
  const recoveryChance = analysis.recovery_chance ?? (isDrone ? 60 : 80);
  const yieldLossEstimate = analysis.yield_loss_estimate ?? (isDrone ? 40 : 20);

  const chemicalOptions =
    analysis.chemical_treatments && analysis.chemical_treatments.length > 0
      ? analysis.chemical_treatments
      : isDrone
        ? [
            "Gypsum / Calcium Sulfate soil conditioner",
            "Agricultural Lime for pH neutralization",
          ]
        : ["Mancozeb 75 WP at 2g/liter of water", "Copper Oxychloride 50 WP"];

  const organicOptions =
    (analysis.organic_treatments || analysis.organic_options) &&
    (analysis.organic_treatments || analysis.organic_options).length > 0
      ? analysis.organic_treatments || analysis.organic_options
      : ["Neem oil spray", "Bio-fungicide compost tea solution"];

  const imageUrl = reportData.image_url?.startsWith("http")
    ? reportData.image_url
    : `${BACKEND_URL}${reportData.image_url}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Navigation bar */}
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
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
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
                  reportData.title ||
                    (isDrone
                      ? "Disaster Field Checker"
                      : "Plant Health Checker"),
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
                analysis.severity === "Severe" || analysis.severity === "High"
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
                {analysis.engine_name || "Diagnostic Pipeline"}
              </span>
            </div>
            {reportData.coordinates && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-white">
                  {reportData.coordinates.latitude?.toFixed(4)},{" "}
                  {reportData.coordinates.longitude?.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Media and Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scan Capture
              </h3>
              <div className="rounded-xl overflow-hidden border border-white/5 bg-black/25 aspect-video md:aspect-square flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Scan result"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Dynamic QR Generator */}
            <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  Local Network QR Sync
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl space-y-3">
                {(() => {
                  try {
                    const qr = qrcode(0, "M");
                    qr.addData(window.location.href);
                    qr.make();
                    return (
                      <div className="p-2.5 bg-white rounded-lg flex items-center justify-center border border-white/10 aspect-square max-w-[150px]">
                        <img
                          src={qr.createDataURL(4, 8)}
                          alt="Sync QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    );
                  } catch (err) {
                    return (
                      <div className="text-xs text-rose-400">
                        QR rendering error.
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Dynamic AI Analytics & Action Plan */}
          <div className="md:col-span-3 space-y-6">
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Predictive Analytics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Chance of Recovery</span>
                    <span className="text-emerald-400">{recoveryChance}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${recoveryChance}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Estimated Yield Loss</span>
                    <span className="text-rose-400">{yieldLossEstimate}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${yieldLossEstimate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Treatment Options */}
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
                    {organicOptions.map((treatment, idx) => (
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
                    {chemicalOptions.map((treatment, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
                    <span className="text-white font-medium">
                      {translateKey(action)}
                    </span>
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
