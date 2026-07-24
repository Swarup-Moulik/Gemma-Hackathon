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
  Volume2
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
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startVoiceAssistant = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : language === "te" ? "te-IN" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US";
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

    // Determine the response depending on language and analysis keywords
    if (language === "hi") {
      if (q.includes("टमाटर") || q.includes("tomato") || q.includes("समस्या") || q.includes("बीमारी")) {
        reply = `आपके फसल में ${translateKey(analysis.probable_issue)} पाया गया है। इसकी गंभीरता ${translateKey(analysis.severity)} है।`;
      } else if (q.includes("बचाव") || q.includes("इलाज") || q.includes("उपचार")) {
        reply = `ऑर्गेनिक उपचार के लिए ${translateKey(analysis.organic_treatments?.[0] || "नीम तेल")} का उपयोग करें। रिकवरी की संभावना ${analysis.recovery_chance || 80} प्रतिशत है।`;
      } else if (q.includes("सुरक्षित") || q.includes("पर्यटक")) {
        reply = analysis.tourist_safety?.hazard_detected 
          ? `चेतावनी: ${translateKey(analysis.tourist_safety.message)}` 
          : "हाँ, पर्यटकों के लिए रास्ता सुरक्षित है।";
      } else {
        reply = `आपकी मुख्य समस्या ${translateKey(analysis.probable_issue)} है। उपचार के लिए तुरंत कार्रवाई करें।`;
      }
    } else if (language === "es") {
      if (q.includes("problema") || q.includes("enfermedad") || q.includes("tomate") || q.includes("planta")) {
        reply = `Se detectó ${translateKey(analysis.probable_issue)}. La gravedad es ${translateKey(analysis.severity)}.`;
      } else if (q.includes("recuperar") || q.includes("tratar") || q.includes("tratamiento")) {
        reply = `Para el tratamiento orgánico, utilice ${translateKey(analysis.organic_treatments?.[0] || "Aceite de neem")}. La probabilidad de recuperación es del ${analysis.recovery_chance || 80} por ciento.`;
      } else if (q.includes("seguro") || q.includes("turistas")) {
        reply = analysis.tourist_safety?.hazard_detected 
          ? `Alerta: ${translateKey(analysis.tourist_safety.message)}` 
          : "Sí, el área es segura para los visitantes.";
      } else {
        reply = `El problema principal es ${translateKey(analysis.probable_issue)}. Trate dentro del periodo de urgencia.`;
      }
    } else if (language === "fr") {
      if (q.includes("problème") || q.includes("maladie") || q.includes("tomate") || q.includes("plante")) {
        reply = `Nous avons détecté ${translateKey(analysis.probable_issue)}. La sévérité est ${translateKey(analysis.severity)}.`;
      } else if (q.includes("traiter") || q.includes("soigner") || q.includes("traitement")) {
        reply = `Pour un traitement biologique, utilisez ${translateKey(analysis.organic_treatments?.[0] || "Huile de neem")}. La chance de récupération est de ${analysis.recovery_chance || 80} pour cent.`;
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
        reply = `సేంద్రీయ చికిత్స కోసం ${translateKey(analysis.organic_treatments?.[0] || "వేప నూనె")} వాడండి. రికవరీ అవకాశం ${analysis.recovery_chance || 80} శాతం.`;
      } else if (q.includes("సురక్షితం") || q.includes("పర్యాటకులు")) {
        reply = analysis.tourist_safety?.hazard_detected 
          ? `హెచ్చరిక: ${translateKey(analysis.tourist_safety.message)}` 
          : "అవును, పర్యాటకులకు మార్గం సురక్షితం.";
      } else {
        reply = `ప్రధాన समस्या ${translateKey(analysis.probable_issue)}. దయచేసి తగిన చర్యలు తీసుకోండి.`;
      }
    } else {
      // Default to English
      if (q.includes("problem") || q.includes("wrong") || q.includes("issue") || q.includes("tomato") || q.includes("tea") || q.includes("grape")) {
        reply = `Gemma detected ${analysis.probable_issue} on your crop. The severity level is ${analysis.severity}.`;
      } else if (q.includes("treat") || q.includes("organic") || q.includes("action") || q.includes("recover") || q.includes("chickpea") || q.includes("mustard")) {
        reply = `For organic treatment, spray ${analysis.organic_treatments?.[0] || "Neem oil"}. The crop survival recovery chance is estimated at ${analysis.recovery_chance || 80} percent.`;
      } else if (q.includes("safe") || q.includes("tourist") || q.includes("guest") || q.includes("warning")) {
        reply = analysis.tourist_safety?.hazard_detected 
          ? `Caution: ${analysis.tourist_safety.message}` 
          : "Yes, this field trail is fully safe for guest tours.";
      } else {
        reply = `The crop is showing signs of ${analysis.probable_issue}. We recommend reviewing the 30-day recovery timeline.`;
      }
    }

    setAssistantReply(reply);
    speakVoiceReply(reply);
  };

  const speakVoiceReply = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "te" ? "te-IN" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US";
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

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
        "Plant Health Checker": "पौधा स्वास्थ्य रक्षक (Plant Health Checker)",

        // Timeline periods
        "Day 1-3": "दिन 1-3",
        "Day 4-7": "दिन 4-7",
        "Week 2": "सप्ताह 2",
        "Week 3-4": "सप्ताह 3-4",

        // Urgency
        "Treat within 24 hours": "24 घंटों के भीतर उपचार करें",
        "Treat within 48 hours": "48 घंटों के भीतर उपचार करें",
        "Treat within 72 hours": "72 घंटों के भीतर उपचार करें",

        // Grid States
        "Healthy": "स्वस्थ (Healthy)",
        "Recovering": "सुधर रहा है (Recovering)",
        "Moderate Damage": "मध्यम क्षति (Moderate Damage)",
        "Severe Damage": "गंभीर क्षति (Severe Damage)",

        // Suggested crops
        "Mustard": "सरसों (Mustard)",
        "Chickpea": "चना (Chickpea)",
        "Spinach": "पालक (Spinach)",
        "Rice": "चावल (Rice)",

        // Treatments
        "Neem oil": "नीम का तेल (Neem oil)",
        "Baking soda": "बेकिंग सोडा (Baking soda)",
        "Compost tea": "कम्पोस्ट चाय (Compost tea)",
        "Mancozeb": "मैनकोज़ेब (Mancozeb)",
        "Copper oxychloride": "कॉपर ऑक्सीक्लोराइड (Copper oxychloride)",

        // Emergency Zones
        "North field pasture": "उत्तरी खेत चारागाह",
        "Main farmhouse ridge": "मुख्य फार्महाउस रिज",
        "East field bottomlands": "पूर्वी खेत निचला इलाका",
        "Guest Trail Sector 1": "अतिथि पथ क्षेत्र 1",

        // Similar Diseases
        "Late Blight": "पछैती झुलसा (Late Blight)",
        "Septoria": "सेप्टोरिया (Septoria)",
        "Leaf Spot": "पत्ती धब्बा (Leaf Spot)",

        // Explainable AI
        "I identified Early Blight because I observed circular brown lesions with concentric rings (target-like pattern) on older lower leaves, along with distinct chlorotic yellowing around the margins of the infected spots.": "मैंने अगेती झुलसा (Early Blight) की पहचान इसलिए की क्योंकि मैंने पुरानी निचली पत्तियों पर संकेंद्रीय छल्लों (लक्ष्य-समान पैटर्न) के साथ गोल भूरे रंग के घाव देखे, साथ ही संक्रमित स्थानों के किनारों के आसपास स्पष्ट पीलापन देखा।"
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
        "Plant Health Checker": "Verificador de Salud de Plantas",

        // Timeline periods
        "Day 1-3": "Día 1-3",
        "Day 4-7": "Día 4-7",
        "Week 2": "Semana 2",
        "Week 3-4": "Semana 3-4",

        // Urgency
        "Treat within 24 hours": "Tratar dentro de las 24 horas",
        "Treat within 48 hours": "Tratar dentro de las 48 horas",
        "Treat within 72 hours": "Tratar dentro de las 72 horas",

        // Grid States
        "Healthy": "Saludable",
        "Recovering": "Recuperando",
        "Moderate Damage": "Daño Moderado",
        "Severe Damage": "Daño Grave",

        // Suggested crops
        "Mustard": "Mostaza",
        "Chickpea": "Garbanzo",
        "Spinach": "Espinaca",
        "Rice": "Arroz",

        // Treatments
        "Neem oil": "Aceite de neem",
        "Baking soda": "Bicarbonato de sodio",
        "Compost tea": "Té de compost",
        "Mancozeb": "Mancozeb",
        "Copper oxychloride": "Oxicloruro de cobre",

        // Emergency Zones
        "North field pasture": "Pastizal del campo norte",
        "Main farmhouse ridge": "Cresta de la granja principal",
        "East field bottomlands": "Tierras bajas del campo este",
        "Guest Trail Sector 1": "Sendero de invitados Sector 1",

        // Similar Diseases
        "Late Blight": "Tizón Tardío",
        "Septoria": "Septoria",
        "Leaf Spot": "Mancha Foliar",

        // Explainable AI
        "I identified Early Blight because I observed circular brown lesions with concentric rings (target-like pattern) on older lower leaves, along with distinct chlorotic yellowing around the margins of the infected spots.": "Identifiqué el tizón temprano porque observé lesiones marrones circulares con anillos concéntricos en las hojas inferiores más viejas, junto con un color amarillento distintivo alrededor de los bordes."
      },
      fr: {
        "Tomato (Solanum lycopersicum)": "Tomate (Solanum lycopersicum)",
        "Tea Plantation (Camellia sinensis)": "Plantation de Thé (Camellia sinensis)",
        "Grapes / Vineyards (Vitis vinifera)": "Raisins / Vignobles (Vitis vinifera)",
        "Mixed Plantation / Silt Soil": "Plantation Mixte / Limon de Sol",
        "Early Blight (Alternaria solani)": "Alternariose (Alternaria solani)",
        "Blister Blight (Exobasidium vexans)": "Maladie des Cloques (Exobasidium vexans)",
        "Powdery Mildew (Uncinula necator)": "Oïdium (Uncinula necator)",
        "Post-Disaster Field Contamination": "Contaminación du Champ Après Sinistre",
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
        "Plant Health Checker": "Vérificateur de Santé des Plantes",

        // Timeline periods
        "Day 1-3": "Jour 1-3",
        "Day 4-7": "Jour 4-7",
        "Week 2": "Semaine 2",
        "Week 3-4": "Semaine 3-4",

        // Urgency
        "Treat within 24 hours": "Traiter sous 24 heures",
        "Treat within 48 hours": "Traiter sous 48 heures",
        "Treat within 72 hours": "Traiter sous 72 heures",

        // Grid States
        "Healthy": "Sain",
        "Recovering": "En récupération",
        "Moderate Damage": "Dégâts Modérés",
        "Severe Damage": "Dégâts Graves",

        // Suggested crops
        "Mustard": "Moutarde",
        "Chickpea": "Pois chiche",
        "Spinach": "Épinard",
        "Rice": "Riz",

        // Treatments
        "Neem oil": "Huile de neem",
        "Baking soda": "Bicarbonate de soude",
        "Compost tea": "Thé de compost",
        "Mancozeb": "Mancozèbe",
        "Copper oxychloride": "Oxychlorure de cuivre",

        // Emergency Zones
        "North field pasture": "Pâturage du champ nord",
        "Main farmhouse ridge": "Crête de la granja principale",
        "East field bottomlands": "Basses terres du champ est",
        "Guest Trail Sector 1": "Sentier des invités Secteur 1",

        // Similar Diseases
        "Late Blight": "Mildiou Tardif",
        "Septoria": "Septoriose",
        "Leaf Spot": "Tache Foliaire",

        // Explainable AI
        "I identified Early Blight because I observed circular brown lesions with concentric rings (target-like pattern) on older lower leaves, along with distinct chlorotic yellowing around the margins of the infected spots.": "J'ai identifié l'alternariose parce que j'ai observé des lésions brunes circulaires avec des anneaux concentriques sur les feuilles inférieures plus anciennes, ainsi qu'un jaunissement distinct sur les bordures."
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
        "Plant Health Checker": "మొక్కల ఆరోగ్య పరీక్షకారి (Plant Health Checker)",

        // Timeline periods
        "Day 1-3": "1-3 రోజులు",
        "Day 4-7": "4-7 రోజులు",
        "Week 2": "2వ వారం",
        "Week 3-4": "3-4 వారాలు",

        // Urgency
        "Treat within 24 hours": "24 గంటలలోపు చికిత్స చేయండి",
        "Treat within 48 hours": "48 గంటలలోపు చికిత్స చేయండి",
        "Treat within 72 hours": "72 గంటలలోపు చికిత్స చేయండి",

        // Grid States
        "Healthy": "ఆరోగ్యకరమైనది",
        "Recovering": "కోలుకుంటుంది",
        "Moderate Damage": "మధ్యస్థ నష్టం",
        "Severe Damage": "తీవ్రమైన నష్టం",

        // Suggested crops
        "Mustard": "ఆవాలు",
        "Chickpea": "శెనగలు",
        "Spinach": "పాలకూర",
        "Rice": "వరి (Rice)",

        // Treatments
        "Neem oil": "వేప నూనె",
        "Baking soda": "వంట సోడా",
        "Compost tea": "కంపోస్ట్ టీ",
        "Mancozeb": "మాంకోజెబ్",
        "Copper oxychloride": "కాపర్ ఆక్సిక్లోరైడ్",

        // Emergency Zones
        "North field pasture": "ఉత్తర మైదాన గడ్డి భూమి",
        "Main farmhouse ridge": "ప్రధాన నివాస మైదానం",
        "East field bottomlands": "తూర్పు మైదాన లోతట్టు ప్రాంతం",
        "Guest Trail Sector 1": "అతిథి నడక మార్గం సెక్టార్ 1",

        // Similar Diseases
        "Late Blight": "లేట్ బ్లైట్ తెగులు",
        "Septoria": "సెప్టోరియా",
        "Leaf Spot": "ఆకుమచ్చ తెగులు",

        // Explainable AI
        "I identified Early Blight because I observed circular brown lesions with concentric rings (target-like pattern) on older lower leaves, along with distinct chlorotic yellowing around the margins of the infected spots.": "పాత ఆకులపై గుండ్రటి గోధుమ రంగు మచ్చలను గుర్తించినందువల్ల మరియు సోకిన ప్రాంతాల చుట్టూ పసుపు రంగును గమనించినందువల్ల నేను అల్టర్నేరియా ఆకుమచ్చ తెగులుగా గుర్తించాను."
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

        {/* Emergency Farm Rescue dashboard card (High Impact ⭐⭐⭐⭐⭐) */}
        {analysis.emergency_rescue && (
          <div className="bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl p-6 space-y-4 frosted-glass animate-pulse shadow-lg mb-6">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
                🚨 Gemma 4 Emergency Farm Rescue Dashboard
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-slate-950 uppercase tracking-widest">
                Critical Alert
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              {/* Flood Severity */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">
                  Flood Severity Level
                </span>
                <span className="text-xl font-extrabold text-white block uppercase tracking-widest text-rose-500">
                  {translateKey(analysis.emergency_rescue.flood_severity)}
                </span>
              </div>

              {/* Safe Zones */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                  🟩 Secured Safe Areas
                </span>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.emergency_rescue.safe_areas.map((area, idx) => (
                    <li key={idx} className="font-semibold text-white">
                      {translateKey(area)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Danger Zones */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">
                  🟥 Danger Sectors
                </span>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.emergency_rescue.danger_areas.map((area, idx) => (
                    <li key={idx} className="font-semibold text-rose-300">
                      {translateKey(area)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Rescue Actions */}
            <div className="bg-black/35 border border-rose-500/10 p-4 rounded-xl space-y-3">
              <span className="text-[10px] text-rose-400 font-black block uppercase tracking-widest">
                Required Farm Operations
              </span>
              <ul className="space-y-2 text-xs font-light">
                {analysis.emergency_rescue.rescue_actions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                    <span className="font-medium text-white">{translateKey(act)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* AI Explainability block (High Impact ⭐⭐⭐⭐⭐) */}
        {analysis.explainable_ai && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 text-xs text-slate-300 frosted-glass flex items-start gap-3 animate-fadeIn shadow-md">
            <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                🧠 Gemma 4 Explainable AI Reasoning (Model Confidence: {analysis.confidence})
              </span>
              <p className="italic font-light leading-relaxed text-white">
                "{translateKey(analysis.explainable_ai)}"
              </p>
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

            {/* Local Farm Network QR Sync (High Impact ⭐⭐⭐⭐⭐) */}
            <div className="frosted-glass border border-white/10 p-4 rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  Local Farm Network QR Sync
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase">
                  Offline Sync
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl space-y-3">
                {/* Render local QR Code */}
                {(() => {
                  try {
                    const qr = qrcode(0, 'M');
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
                    console.error("QR drawing error:", err);
                    return <div className="text-xs text-rose-400">Failed to render offline QR.</div>;
                  }
                })()}

                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    Scan Local Access
                  </span>
                  <p className="text-[9px] text-slate-400 font-light leading-relaxed max-w-[180px] mx-auto">
                    Scanning this on the local farm Wi-Fi displays the active diagnostic report, 30-day recovery plans, and safety maps.
                  </p>
                </div>
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
                      "Healthy": "bg-emerald-500 border-emerald-400 shadow-emerald-500/20 text-emerald-950",
                      "Recovering": "bg-yellow-500 border-yellow-400 shadow-yellow-500/20 text-yellow-950",
                      "Moderate Damage": "bg-amber-500 border-amber-400 shadow-amber-500/20 text-amber-950",
                      "Severe Damage": "bg-rose-500 border-rose-400 shadow-rose-500/20 text-rose-950"
                    };

                    const isSelected = activeFrame?.timestamp === frame.timestamp;

                    return (
                      <button
                        key={index}
                        onClick={() => setActiveFrame(frame)}
                        className={`flex items-center justify-center rounded-lg border-2 ${
                          colorMap[frame.severity] || "bg-muted border-border text-slate-400"
                        } hover:scale-105 transition-transform font-mono text-[10px] font-bold cursor-pointer ${
                          isSelected ? "ring-2 ring-white border-white scale-105" : ""
                        }`}
                      >
                        F{index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Map Grid Color-Coded Legend */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pt-3 border-t border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-white/5"></span>
                    <span>{translateKey("Healthy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-yellow-500 border border-white/5"></span>
                    <span>{translateKey("Recovering")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 border border-white/5"></span>
                    <span>{translateKey("Moderate Damage")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500 border border-white/5"></span>
                    <span>{translateKey("Severe Damage")}</span>
                  </div>
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
            
            {/* Crop Survival Probability (Predictive Analytics) */}
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Gemma 4 Predictive Analytics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Chance of Recovery */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Chance of Recovery</span>
                    <span className="text-emerald-400">{analysis.recovery_chance || 80}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (analysis.recovery_chance || 80) > 75 
                          ? "bg-emerald-500" 
                          : (analysis.recovery_chance || 80) > 40 
                            ? "bg-amber-500" 
                            : "bg-destructive"
                      }`}
                      style={{ width: `${analysis.recovery_chance || 80}%` }}
                    ></div>
                  </div>
                </div>

                {/* Estimated Yield Loss */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Estimated Yield Loss</span>
                    <span className="text-rose-400">{analysis.yield_loss_estimate || 20}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.yield_loss_estimate || 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Treatment Urgency Badge */}
              <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">Treatment Urgency:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                  analysis.treatment_urgency?.includes("24")
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}>
                  {translateKey(analysis.treatment_urgency) || "Treat within 48 hours"}
                </span>
              </div>
            </div>

            {/* AI Voice Assistant (Offline) (High Impact ⭐⭐⭐⭐⭐) */}
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                Gemma 4 Voice Assistant (Offline)
              </h3>

              <div className="flex items-center gap-4">
                <button
                  onClick={startVoiceAssistant}
                  className={`p-4 rounded-full border cursor-pointer transition-all flex items-center justify-center shrink-0 ${
                    isListening
                      ? "bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse scale-105"
                      : isSpeaking
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-bounce"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                  title="Ask Gemma verbally"
                >
                  <Mic className="w-6 h-6" />
                </button>

                <div className="text-xs space-y-1 overflow-hidden">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    {isListening ? "Listening to your voice..." : isSpeaking ? "Speaking..." : "Offline Voice Assistant"}
                  </span>
                  <p className="font-semibold text-white truncate max-w-[200px]">
                    {transcript || (language === "hi" ? "पूछने के लिए माइक दबाएं" : language === "te" ? "మాట్లాడటానికి మైక్ క్లిక్ చేయండి" : language === "es" ? "Presiona para hablar" : language === "fr" ? "Cliquez pour parler" : "Click to speak")}
                  </p>
                </div>
              </div>

              {/* Speech Replies Output */}
              {assistantReply && (
                <div className="bg-black/25 border border-white/5 p-3 rounded-lg flex items-start gap-2.5 text-xs text-slate-300 animate-fadeIn">
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-light">{assistantReply}</p>
                </div>
              )}

              {/* Sample Hints */}
              <div className="bg-white/5 border border-white/5 p-3 rounded-lg space-y-1.5 text-[10px]">
                <span className="text-slate-400 font-bold block uppercase tracking-wider">Try asking:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-1 font-mono">
                  {language === "hi" ? (
                    <>
                      <li>"फसल में क्या बीमारी है?"</li>
                      <li>"इलाज कैसे करें?"</li>
                      <li>"क्या पर्यटकों के लिए सुरक्षित है?"</li>
                    </>
                  ) : language === "te" ? (
                    <>
                      <li>"టమోటా పంటకు ఏ సమస్య ఉంది?"</li>
                      <li>"చికిత్స ఏమిటి?"</li>
                      <li>"పర్యాటకులకు సురక్షితమేనా?"</li>
                    </>
                  ) : language === "es" ? (
                    <>
                      <li>"¿Qué tiene mi tomate?"</li>
                      <li>"¿Cómo lo trato?"</li>
                      <li>"¿Es seguro para turistas?"</li>
                    </>
                  ) : language === "fr" ? (
                    <>
                      <li>"Quel est le problème avec ma tomate ?"</li>
                      <li>"Comment la soigner ?"</li>
                      <li>"Est-ce sécurisé pour les touristes ?"</li>
                    </>
                  ) : (
                    <>
                      <li>"What is wrong with my crop?"</li>
                      <li>"How do I recover this?"</li>
                      <li>"Is this path safe for tourists?"</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Looks Similar To (Diagnostic Comparisons) (High Impact ⭐⭐⭐⭐⭐) */}
            {analysis.similar_diseases && (
              <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Gemma 4 Diagnostic Comparisons
                </h3>

                <div className="text-xs space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Diagnosis:</span>
                    <span className="font-extrabold text-white">{translateKey(analysis.probable_issue)}</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                      Looks Similar To:
                    </span>

                    <div className="space-y-3">
                      {analysis.similar_diseases.map((disease, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">{translateKey(disease.name)}</span>
                            <span className="text-slate-450">{disease.percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="bg-emerald-500/60 h-full rounded-full transition-all duration-500"
                              style={{ width: `${disease.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {/* Likely Environmental Causes */}
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

            {/* Organic vs Chemical Treatment Plans */}
            <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-white/5 pb-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Gemma 4 Treatment Plan Options
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Organic Column */}
                <div className="space-y-2.5 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl">
                  <span className="font-extrabold text-[10px] text-emerald-400 uppercase tracking-wider block">
                    🍀 Organic Options
                  </span>
                  <ul className="space-y-2 text-slate-300 font-light">
                    {analysis.organic_treatments?.map((treatment, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{translateKey(treatment)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Column */}
                <div className="space-y-2.5 bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl">
                  <span className="font-extrabold text-[10px] text-amber-400 uppercase tracking-wider block">
                    🧪 Chemical Options
                  </span>
                  <ul className="space-y-2 text-slate-300 font-light">
                    {analysis.chemical_treatments?.map((treatment, idx) => (
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

            {/* AI Crop Recovery Planner (High Impact ⭐⭐⭐⭐⭐) */}
            {analysis.crop_recovery_planner && (
              <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Gemma 4 AI Crop Recovery Planner (30-Day Roadmap)
                </h3>
                
                <div className="relative pl-4 border-l border-white/15 ml-2 space-y-4">
                  {analysis.crop_recovery_planner.map((phase, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Node Dot */}
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                      
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/5 border border-white/10 text-emerald-300 uppercase">
                          {translateKey(phase.period)}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-light">
                          {translateKey(phase.action)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Crop Recommendation (High Impact ⭐⭐⭐⭐⭐) */}
            {analysis.crop_recommendation && (
              <div className="frosted-glass border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  Gemma 4 Alternative Crop Rotations
                </h3>

                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-xs flex items-center justify-between">
                  <span className="text-rose-300 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Avoid Replanting:
                  </span>
                  <span className="font-bold text-white uppercase font-mono">
                    {translateKey(analysis.crop_recommendation.avoid_crop)}
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    Recommended Alternatives
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {analysis.crop_recommendation.suggested_crops.map((crop, idx) => (
                      <div key={idx} className="bg-black/20 border border-white/5 rounded-xl p-3 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-300 uppercase mb-1">
                            {translateKey(crop.name)}
                          </span>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                            {translateKey(crop.reason)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
