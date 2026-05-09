# 🛡️ ClarityScan AI

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Genkit](https://img.shields.io/badge/Genkit-AI-blue)](https://github.com/firebase/genkit)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)](https://deepmind.google/technologies/gemini/)

**ClarityScan AI** leverages cutting-edge generative AI to read, understand, and extract key information from your documents, turning unstructured text into clean, actionable data.

---

## 🚀 Product Overview

ClarityScan AI is an enterprise-grade document intelligence platform. It solves the problem of manual data entry and document analysis by using advanced AI models to automatically extract structured data from PDFs, images, and text documents.

### Key Features

- **Intelligent Document Parsing**: Extracts text and structure from complex documents.
- **AI-Powered Information Extraction**: Uses Gemini 2.5 Flash to understand context and extract specific fields.
- **Dynamic Theme Support**: 10x UI/UX with smooth light and dark mode transitions.
- **Real-time Processing**: Fast inference and response streaming.
- **Secure by Design**: Enterprise-grade security defaults and secret management.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React, Next-Themes
- **AI/ML**: Google Genkit, Gemini 2.5 Flash
- **DevOps**: Docker, GitHub Actions
- **Language**: TypeScript

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+
- Docker (optional, for containerized running)
- Google AI Studio API Key

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mramansayyad/ClarityScan-AI.git
   cd ClarityScan-AI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser.

### Docker Setup

1. Build the image:

   ```bash
   docker build -t clarityscan-ai .
   ```

2. Run the container:
   ```bash
   docker run -p 9002:9002 --env-file .env clarityscan-ai
   ```

---

## 🏗️ Architecture

ClarityScan AI follows a modular and clean architecture.

```text
src/
├── ai/             # AI initialization and Genkit flows
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
└── lib/            # Utility functions
```

### Data Flow

1. User uploads a document via the UI.
2. The frontend sends the document to the backend API.
3. Genkit processes the document using the Gemini model.
4. Structured data is returned to the user.

---

## 🔐 Security

- **No Hardcoded Secrets**: All keys are managed via environment variables.
- **Ignore Rules**: `.env` and sensitive files are blocked by `.gitignore`.
- **Secret Scanning**: CI pipelines include automated secret scanning.

---

## 🚀 Deployment

### Vercel

Click the button below to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmramansayyad%2FClarityScan-AI)

### Docker/Cloud Run

This project is containerized and ready for Google Cloud Run or any Docker-compatible hosting.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under a Proprietary License. All rights reserved by mramansayyad. See the [LICENSE](LICENSE) file for details.
