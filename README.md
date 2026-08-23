# OCTalyze

> **See Beyond the Scan.**

**OCTalyze** is an explainable AI-powered retinal screening platform that analyzes Optical Coherence Tomography (OCT) scans using a single deep learning model — **Attention U-Net**.

The platform combines AI-based retinal classification, Grad-CAM visual explanations, clinical urgency triage, scan history, and automated reporting into a unified web application.

---

## 🩺 Overview

Optical Coherence Tomography (OCT) provides detailed cross-sectional images of the retina and is widely used for detecting retinal abnormalities. However, manually reviewing large numbers of scans can be time-consuming.

**OCTalyze** assists this workflow by automatically analyzing OCT B-scans and providing:

* 🤖 AI-powered retinal classification
* 🔍 Explainable predictions using Grad-CAM
* 🚨 Automated clinical priority classification
* 📊 Confidence scores for predictions
* 📄 Clinical screening report generation
* 🗂️ Scan history and patient records
* 🐳 Docker-based deployment

OCTalyze is designed as a **clinical decision-support and screening tool**, not as an autonomous diagnostic system.

---

## 🧠 AI Model

OCTalyze uses **one primary AI model: Attention U-Net**.

### Attention U-Net

Attention U-Net is a U-Net-based deep learning architecture that uses attention mechanisms to focus on relevant regions of the input image.

For OCTalyze, the model analyzes OCT B-scans and classifies them into four categories:

| Class      | Description                          | Priority           |
| ---------- | ------------------------------------ | ------------------ |
| **CNV**    | Choroidal Neovascularization         | 🔴 High Priority   |
| **DME**    | Diabetic Macular Edema               | 🔴 High Priority   |
| **DRUSEN** | Retinal deposits associated with AMD | 🟡 Clinical Review |
| **NORMAL** | Healthy retinal appearance           | 🟢 Low Risk        |

### Model Performance

| Metric        | Attention U-Net |
| ------------- | --------------: |
| Test Accuracy |       **90.4%** |
| Test Loss     |      **0.2980** |
| Input         |      OCT B-scan |
| Classes       |               4 |

The model generates class probabilities using softmax, allowing OCTalyze to display the prediction confidence for each retinal condition.

---

## 🔍 Explainable AI with Grad-CAM

OCTalyze doesn't simply provide a prediction — it also shows **where the model is focusing**.

After inference, Grad-CAM generates an attention heatmap highlighting image regions that contributed to the model's prediction.

Users can view:

1. **Original OCT Scan**
2. **Grad-CAM Heatmap**
3. **Blended Explanation Overlay**

This provides a visual explanation of the AI prediction and helps users understand which retinal regions influenced the result.

> Grad-CAM visualizations are intended for interpretability and should not be considered evidence of a medical diagnosis.

---

## 🚨 Clinical Priority Triage

OCTalyze converts AI predictions into an easy-to-understand priority level.

### 🔴 HIGH PRIORITY

Used for:

* CNV
* DME

These findings may require prompt evaluation by an eye-care professional.

### 🟡 CLINICAL REVIEW

Used for:

* DRUSEN

The scan should receive appropriate clinical evaluation and follow-up.

### 🟢 LOW RISK

Used for:

* NORMAL

Routine screening and clinical follow-up may be appropriate based on professional assessment.

**Priority levels are decision-support indicators and do not replace professional clinical judgment.**

---

## ✨ Key Features

### 1. AI-Powered OCT Analysis

Upload an OCT B-scan and receive a prediction from the **Attention U-Net** model.

### 2. Four-Class Classification

OCTalyze identifies:

* CNV
* DME
* DRUSEN
* NORMAL

### 3. Confidence Scores

The system provides probability scores for all four classes, making the prediction output more transparent.

### 4. Grad-CAM Visualization

Visualize the regions that influenced the model's prediction through interactive heatmaps and overlays.

### 5. Clinical Priority

Automatically assigns:

* `HIGH PRIORITY`
* `CLINICAL REVIEW`
* `LOW RISK`

based on the detected condition.

### 6. Scan History

Store and retrieve previously analyzed scans and their prediction results.

### 7. Clinical Reports

Generate structured reports containing:

* Patient and scan information
* AI prediction
* Confidence scores
* Grad-CAM visualization
* Clinical priority
* Relevant recommendations
* Medical disclaimer

### 8. Sample Scans

The repository includes sample OCT scans for testing the application with different classes.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────────┐
                    │       Clinician          │
                    │      Web Browser         │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Next.js Frontend     │
                    │       React + UI          │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Spring Boot API      │
                    │    Authentication        │
                    │   Scan & Report APIs     │
                    └────────────┬─────────────┘
                                 │
                         Image / Prediction
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    FastAPI AI Service    │
                    │                          │
                    │      Attention U-Net     │
                    │            │             │
                    │            ▼             │
                    │        Prediction        │
                    │            │             │
                    │            ▼             │
                    │         Grad-CAM         │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Prediction +        │
                    │   Explanation + Priority │
                    └──────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer                | Technology                 | Purpose                                |
| -------------------- | -------------------------- | -------------------------------------- |
| **Frontend**         | Next.js, React, TypeScript | Web application and clinical interface |
| **Styling**          | Tailwind CSS               | Responsive UI                          |
| **Backend**          | Java 21, Spring Boot       | REST API and application services      |
| **Security**         | Spring Security, JWT       | Authentication and authorization       |
| **AI Service**       | Python, FastAPI            | AI inference API                       |
| **AI Framework**     | TensorFlow / Keras         | Attention U-Net model                  |
| **Image Processing** | OpenCV, NumPy              | OCT preprocessing                      |
| **Explainability**   | Grad-CAM                   | Prediction visualization               |
| **Database**         | PostgreSQL / H2            | Scan and user data                     |
| **PDF**              | jsPDF / html2canvas        | Report generation                      |
| **DevOps**           | Docker, Docker Compose     | Containerized deployment               |

---

## 📁 Project Structure

```text
OCTalyze/
│
├── ai-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── inference.py
│   │   ├── gradcam.py
│   │   ├── preprocess.py
│   │   └── class_names.json
│   │
│   ├── models/
│   │   └── attention_unet.keras
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── analyze/
│   │   ├── results/
│   │   ├── history/
│   │   └── reports/
│   │
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── sample-scans/
│   ├── CNV/
│   ├── DME/
│   ├── DRUSEN/
│   └── NORMAL/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🔄 How OCTalyze Works

```text
1. Upload OCT B-scan
          │
          ▼
2. Image Preprocessing
          │
          ▼
3. Attention U-Net Inference
          │
          ▼
4. Four-Class Prediction
          │
          ▼
5. Confidence Calculation
          │
          ▼
6. Grad-CAM Generation
          │
          ▼
7. Clinical Priority Assignment
          │
          ▼
8. Results & Report
```

---

## 🔐 Authentication

OCTalyze uses JWT-based authentication through the Spring Boot backend.

### Authentication APIs

```text
POST /api/auth/register
POST /api/auth/login
```

---

## 👁️ Scan APIs

```text
POST   /api/scans
GET    /api/scans
GET    /api/scans/{id}
DELETE /api/scans/{id}
```

### Upload and Analyze

```text
POST /api/scans
```

This endpoint accepts an OCT scan and initiates the complete workflow:

```text
Upload
  ↓
Preprocessing
  ↓
Attention U-Net
  ↓
Prediction
  ↓
Grad-CAM
  ↓
Priority
  ↓
Result
```

---

## 📄 Report APIs

```text
POST /api/reports/{scanId}
GET  /api/reports
```

Reports can contain the AI prediction, confidence scores, scan information, Grad-CAM visualization, and clinical disclaimer.

---

## 🚀 Quick Start

### Prerequisites

Make sure you have:

* Git
* Docker
* Docker Compose

### Clone the Repository

```bash
git clone https://github.com/GurnoorSingh2006/OCTalyze-AI.git
cd OCTalyze-AI
```

### Run with Docker Compose

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

Stop the application:

```bash
docker compose down
```

---

## 🌐 Local Services

Once the containers are running:

| Service     | Address                      |
| ----------- | ---------------------------- |
| Frontend    | `http://localhost:3000`      |
| Backend API | `http://localhost:8080/api`  |
| AI Service  | `http://localhost:8000/docs` |

---

## 💻 Local Development

### AI Service

```bash
cd OCTalyze/ai-service

pip install -r requirements.txt

python -m uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --reload
```

### Backend

```bash
cd OCTalyze/backend

mvn spring-boot:run
```

### Frontend

```bash
cd OCTalyze/frontend

npm install
npm run dev
```

---

## 🧪 Sample Data

The `sample-scans/` directory contains OCT scans representing the four supported classes:

```text
sample-scans/
├── CNV/
├── DME/
├── DRUSEN/
└── NORMAL/
```

These scans can be used to demonstrate and test the OCTalyze analysis pipeline.

---

## 📊 Project Highlights

* **Single production AI model:** Attention U-Net
* **90.4% reported test accuracy**
* **4-class OCT classification**
* **Grad-CAM explainability**
* **Automated clinical priority**
* **REST API architecture**
* **JWT authentication**
* **Scan history**
* **Automated reporting**
* **Dockerized deployment**
* **Modern Next.js interface**

---

## ⚠️ Medical Disclaimer

> **OCTalyze is an AI-assisted retinal screening and clinical decision-support research tool. It is not intended to provide autonomous medical diagnosis. AI predictions, confidence scores, urgency levels, and Grad-CAM visualizations must be reviewed and clinically validated by a qualified ophthalmologist or appropriate healthcare professional.**

---

## ⭐ Support

If you find **OCTalyze** interesting or useful, consider giving the repository a ⭐ on GitHub.

> **OCTalyze — See Beyond the Scan.**
