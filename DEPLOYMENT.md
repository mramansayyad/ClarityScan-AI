# Deployment Guide - ClarityScan AI

This document provides instructions for deploying ClarityScan AI to various platforms.

## 1. Vercel (Recommended)

Next.js applications are best deployed on Vercel.

### Steps

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your project.
3. Add the following Environment Variable in the Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
4. Click **Deploy**.

## 2. Docker / Cloud Run

You can containerize the application and deploy it to any container platform like Google Cloud Run.

### Prerequisites

- Docker installed locally.

### Build the Docker Image

```bash
docker build -t clarityscan-ai .
```

### Run Locally

```bash
docker run -p 9002:9002 --env GEMINI_API_KEY=your_key_here clarityscan-ai
```

### Deploy to Google Cloud Run

1. Tag the image for Google Container Registry or Artifact Registry.
2. Push the image.
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy clarityscan-ai --image gcr.io/your-project-id/clarityscan-ai --platform managed --set-env-vars GEMINI_API_KEY=your_key_here
   ```

## 3. Netlify / Railway / Render

The project can also be deployed on platforms like Railway or Render using the Dockerfile or as a standard Node.js app.

Ensure you set the `GEMINI_API_KEY` environment variable on any platform you choose.
