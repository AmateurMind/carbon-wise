# Carbon Compass

Carbon Compass is a personal climate-coaching app that helps people understand their footprint, focus on their biggest emission source, and follow a realistic reduction plan.

## Live Demo

[https://carbon-compass-746853930624.us-central1.run.app](https://carbon-compass-746853930624.us-central1.run.app)

## Core Idea

Carbon Compass is designed around a simple flow:

- `Measure`: estimate annual emissions across transport, home energy, diet, and consumption
- `Prioritise`: surface the biggest emissions category first
- `Cut`: generate a practical action plan with projected annual savings
- `Track`: review saved snapshots over time

## Main Features

- Annual carbon calculation with per-category breakdown
- Benchmark comparison against global average and Paris-aligned targets
- Personalised reduction plan with estimated savings
- Snapshot history view with charts and saved insights
- Accessible UI patterns and input validation on both frontend and backend

## Stack

- `Frontend`: React 18, TypeScript, Vite, Tailwind CSS, Zustand, Zod, Recharts
- `Backend`: FastAPI, Python 3.11, Pydantic v2, slowapi
- `Deployment`: Docker, Cloud Run, Cloud Build

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
python -m pytest -q
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm test
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` to the backend.

## Environment

Copy `.env.example` to `.env` and update the values you need.

Useful flags:

- `VITE_API_BASE_URL`: optional API origin for split frontend/backend hosting
- `USE_GEMINI`: enable Gemini-powered insight generation
- `USE_FIRESTORE`: enable persistent history storage
- `USE_BIGQUERY`: enable analytics logging
- `USE_PUBSUB`: enable async event publishing

## Deployment

The current app is deployed as a single Cloud Run service:

```bash
gcloud run deploy carbon-compass \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="PROJECT_ID=election-495012,REGION=us-central1,ENVIRONMENT=production,LOG_LEVEL=INFO,USE_GEMINI=false,USE_FIRESTORE=false,USE_BIGQUERY=false,USE_PUBSUB=false"
```

## Demo Mode

The live deployment currently runs with cloud integrations disabled for stability:

- `USE_GEMINI=false`
- `USE_FIRESTORE=false`
- `USE_BIGQUERY=false`
- `USE_PUBSUB=false`

That keeps the demo reliable without additional resource setup.

## Privacy and Security

- No direct personal identity information is collected
- Backend applies security headers and rate limiting
- Frontend and backend both validate inputs
- Anonymous device IDs are used for history retrieval

## Project Structure

```text
carbon-platform/
├── backend/
│   ├── app/
│   │   ├── carbon/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── tests/
├── docs/
└── Dockerfile
```
