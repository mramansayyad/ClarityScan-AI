# System Architecture - ClarityScan AI

This document describes the high-level architecture of ClarityScan AI.

## Overview

ClarityScan AI is a full-stack web application built with Next.js and integrated with Google Genkit for AI capabilities. It is designed to be scalable, secure, and easy to maintain.

## Architecture Diagram (Conceptual)

```text
[ User Browser ]
       │
       ▼
[ Next.js Frontend (React) ]
       │
       ▼
[ Next.js API Routes (Backend) ]
       │
       ▼
[ Google Genkit SDK ]
       │
       ▼
[ Google Gemini 2.5 Flash ]
```

## Core Components

### 1. Frontend (Next.js)

- **App Router**: Used for routing and layouts.
- **Components**: Reusable UI elements (buttons, inputs, cards).
- **Theme**: Managed by `next-themes` with support for light and dark modes.

### 2. Backend (Next.js API Routes)

- Handles requests from the frontend.
- Interacts with Genkit to perform AI tasks.
- Validates input and formats output.

### 3. AI Layer (Genkit & Gemini)

- **Genkit**: Used as the framework for AI workflows.
- **Gemini 2.5 Flash**: The LLM used for text extraction and document understanding.

## Data Flow

1. **Upload**: User uploads a file via the frontend.
2. **Process**: The file is sent to an API route.
3. **Analyze**: The API route calls a Genkit flow.
4. **Extract**: Genkit calls Gemini to extract structured data.
5. **Return**: The structured data is returned to the frontend and displayed to the user.

## Security Considerations

- **Environment Variables**: Sensitive keys (like `GEMINI_API_KEY`) are stored in `.env` and accessed via `process.env`.
- **CORS**: Configured to allow requests only from trusted origins.
- **Input Validation**: All inputs are validated before processing.
