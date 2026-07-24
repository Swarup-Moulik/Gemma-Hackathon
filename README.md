# 🌿 Green Praxis — Agricultural Intelligence Platform

> \\\*\\\*Build with Gemma 2026 Hackathon Submission\\\*\\\*  
> "High-fidelity crop diagnostics. Grounded in real-time intelligence."

[!\[React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev) [!\[FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com) [!\[MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)](https://mongodb.com) [!\[Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)](https://python.org)

\---

## Table of Contents

* [Overview](#-overview)
* [System Architecture](#-system-architecture)
* [Core Features](#-core-features)
* [Technical Stack](#-technical-stack)
* [API Reference](#-api-reference)
* [Page Structure](#-page-structure)
* [AI \& ML Components](#-ai--ml-components)
* [Technical Problems \& Solutions](#-technical-problems--solutions)
* [Installation \& Setup](#-installation--setup)
* [Project Structure](#-project-structure)

\---

## 🌱 Overview

**Green Praxis** is a modern, cloud-connected agricultural management platform built for the **Google Build with Gemma 2026 Hackathon**. It bridges the gap between advanced AI reasoning and day-to-day farming operations.

The platform enables:

* 📸 **Instant crop disease detection** via image upload or drone telemetry
* 🧠 **Explainable AI diagnosis** with Gemma reasoning transparency
* 🌊 **Emergency farm rescue** with hazard zone mapping
* 🎙️ **Multilingual voice assistant** for hands-free crop queries
* 📊 **Season-long audit trail** stored in MongoDB
* 📱 **QR code sharing** for instant report distribution

\---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GREEN PRAXIS PLATFORM                       │
│                                                                 │
│  ┌─────────────┐    HTTP/REST    ┌────────────────────────┐    │
│  │  React 18   │ ◄────────────► │   FastAPI Backend      │    │
│  │  Vite 5.x   │                │   (Python 3.11+)       │    │
│  │  TailwindCSS│                │                        │    │
│  └─────────────┘                │  ┌──────────────────┐  │    │
│         │                       │  │  AI Layer        │  │    │
│         │ Routes                │  │  Google Gemma    │  │    │
│         ▼                       │  └──────────────────┘  │    │
│  ┌─────────────┐                │                        │    │
│  │ / Landing   │                │  ┌──────────────────┐  │    │
│  │ /scan       │                │  │  MongoDB Atlas   │  │    │
│  │ /report     │                │  │  db: greenpraxis │  │    │
│  │ /chat       │                │  └──────────────────┘  │    │
│  │ /dashboard  │                │                        │    │
│  └─────────────┘                │  ┌──────────────────┐  │    │
│                                 │  │  Static /uploads │  │    │
│  ┌─────────────┐                │  └──────────────────┘  │    │
│  │ Web Speech  │                └────────────────────────┘    │
│  │ API (Voice) │                                               │
│  └─────────────┘                                               │
│                                                                 │
│  ┌─────────────┐                                               │
│  │  QR Code    │                                               │
│  │  Generator  │                                               │
│  └─────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow: Image Scan → Diagnosis

```
User uploads crop image
         │
         ▼
\\\[React Home.jsx]  FormData POST /api/analyze
         │
         ▼
\\\[FastAPI]
  1. Saves file → /uploads/{filename}
  2. Constructs public URL
  3. Runs Gemma reasoning prompt
  4. Returns structured JSON
         │
         ▼
\\\[React Report.jsx]
  - Recovery ring animation
  - Diagnosis cards
  - Treatment matrix
  - Drone field grid
  - XAI rationale
  - QR code
         │
         ▼
\\\[MongoDB]  Saves to greenpraxis.reports
         │
         ▼
\\\[Dashboard]  Appears as historical card
```

\---

## 🔬 Core Features

### 1\. 🌿 Plant Disease Identifier

The flagship feature. A farmer uploads a crop leaf photo and receives a **structured AI diagnosis**.

**AI Output:**

```json
{
  "disease": "Early Blight",
  "confidence": 0.91,
  "yield\\\_risk": 18,
  "recovery\\\_chance": 72,
  "urgency": "treat\\\_24h"
}
```

Image is uploaded via `multipart/form-data` → FastAPI saves to `/uploads/` → Gemma processes image URL + GPS → Structured JSON returned → Frontend renders as animated progress ring + diagnostic card.

\---

### 2\. 🛸 Drone Multispectral Field Grid

Maps drone telemetry into a **3×3 coordinate grid** (sectors F1–F9), color-coded by severity:

|Color|Hex|Severity|
|-|-|-|
|🟢 Green|`#6E8C5C`|Healthy|
|🟡 Yellow|`#C9A227`|Recovering|
|🟠 Orange|`#C15832`|Moderate|
|🔴 Red|`#A64B2A`|Severe|

Grid is generated from GPS lat/lng inputs, computing relative sector positions dynamically.

\---

### 3\. 🚨 Emergency Farm Rescue Mode

One-click disaster assessment. Calls `POST /api/emergency-rescue` and generates:

```python
"emergency\\\_rescue": {
    "flood\\\_severity": "High",
    "safe\\\_areas": \\\["North field", "Ridge paddock"],
    "danger\\\_areas": \\\["East field", "Irrigation channel"],
    "rescue\\\_actions": \\\[
        "Evacuate livestock immediately",
        "Close tourist entry at Gate B",
        "Inspect irrigation infrastructure"
    ]
}
```

Outputs a print-ready PDF via `window.print()`. Accessible as a global navbar button from any page.

\---
