# System Architecture Document
## Carbon Compass

## Overview

Carbon Compass is a single-service web application made of:

- a React frontend for data entry and visualisation
- a FastAPI backend for calculations, insight generation, and history APIs
- a Docker-based Cloud Run deployment serving both frontend assets and backend routes

## Core Request Flows

### Calculation

1. Browser sends `POST /api/calculate`
2. FastAPI validates the request
3. The carbon engine computes totals and ranked categories
4. JSON results return to the frontend

### Insights

1. Browser sends `POST /api/insights`
2. Backend checks feature flags
3. If advanced AI is enabled, the Gemini path can be used
4. Otherwise, the deterministic rules engine provides the plan
5. The frontend renders the plan and save feedback

### History

1. Frontend sends `POST /api/entries` to save a snapshot
2. Frontend sends `GET /api/entries/{device_id}` to load history
3. History components render the trend line and details table

## Frontend Modules

- `components/Calculator`: form, results, category views
- `components/Insights`: reduction plan UI
- `components/History`: timeline and saved entry details
- `store/carbonStore.ts`: state orchestration
- `api/client.ts`: typed API layer

## Backend Modules

- `carbon/`: pure calculation logic and emission factors
- `routes/`: HTTP endpoints
- `models/`: Pydantic schemas
- `services/`: optional cloud integrations
- `core/`: config, security, and rate limits

## Deployment

- Multi-stage Dockerfile builds the frontend first
- Python runtime serves the API and static assets
- Current live service name: `carbon-compass`
- Current live URL: `https://carbon-compass-746853930624.us-central1.run.app`
