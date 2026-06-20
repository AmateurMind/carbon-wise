# Judge Evidence - Carbon Compass

Evidence mapping for the current Carbon Compass implementation.

## Code Quality

- Strict TypeScript configuration in `frontend/tsconfig.json`
- Typed FastAPI models across `backend/app/models`
- Separation between routes, services, and pure calculation logic
- Automated frontend and backend test suites

## Security

- Security headers middleware in `backend/app/core/security.py`
- Rate limiting in `backend/app/core/rate_limit.py`
- Input validation on both frontend and backend
- Anonymous device IDs for history retrieval

## Product Fit

- Calculator, reduction plan, and timeline support the full user journey
- Results page highlights top-impact category instead of only totals
- Insights experience reflects a coach-style action flow
