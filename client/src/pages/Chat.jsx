import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am Gemma, your offline agricultural assistant. How can I help you improve your crop yields today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickQuestions = {
    en: [
      "What is powdery mildew?",
      "When should I irrigate?",
      "Why are leaves curling?",
      "How does gypsum help soil?"
    ],
    hi: [
      "पाउडरी मिल्ड्यू क्या है?",
      "मुझे सिंचाई कब करनी चाहिए?",
      "पत्तियां क्यों मुड़ रही हैं?",
      "जिप्सम मिट्टी की मदद कैसे करता है?"
    ],
    es: [
      "¿Qué es el mildiú polvoriento?",
      "¿Cuándo debo regar?",
      "¿Por qué se enrollan las hojas?",
      "¿Cómo ayuda el yeso al suelo?"
    ],
    fr: [
      "Qu'est-ce que l'oïdium ?",
      "Quand dois-je irriguer ?",
      "Pourquoi les feuilles s'enroulent-elles ?",
      "Comment le gypse aide-t-il le sol ?"
    ],
    te: [
      "బూడిద తెగులు అంటే ఏమిటి?",
      "నేను ఎప్పుడు నీరు పెట్టాలి?",
      "ఆకులు ఎందుకు ముడుచుకుపోతున్నాయి?",
      "జిప్సమ్ నేలకు ఎలా సహాయపడుతుంది?"
    ]
  };

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    // Add user message
    const userMsg = {
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/chat", {
        query: queryText,
        language: language
      });
      
      const botMsg = {
        sender: "bot",
        text: response.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Offline Chat failed:", err);
      const errorMsg = {
        sender: "bot",
        text: "Offline engine error. Please ensure your local FastAPI server is running.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-8 flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/scan" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
              Gemma Agricultural Advisor
            </h1>
            <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              Offline Knowledge Engine Active
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-primary"
        >
          <option value="en">English (US)</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="es">Español (Spanish)</option>
          <option value="fr">Français (French)</option>
          <option value="te">తెలుగు (Telugu)</option>
        </select>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-slate-950/40 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-between space-y-4 shadow-2xl overflow-hidden min-h-[450px]">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[480px] pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-slate-900 border-white/5 text-emerald-400"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

