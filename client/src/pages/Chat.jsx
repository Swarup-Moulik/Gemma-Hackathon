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

