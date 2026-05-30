# VesakCard.io

Production-grade open-source Vesak card creator for Sri Lankan users. The UI uses Sinhala-script wording with familiar English product words where they are natural, plus animated Vesak lanterns, lotus visuals, Buddha imagery, Buddhist symbols, share links, and Open Graph previews.

## Structure

```text
backend/   Spring Boot 3 + Java 21 API
frontend/  Next.js 14 App Router UI
```

Shared local infrastructure stays at the repository root:

```text
docker-compose.yml  PostgreSQL + Redis for local dev
.env.example        Combined environment variable reference
```

## Local Setup

1. Start PostgreSQL and Redis:

```bash
docker compose up -d
```

2. Run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

3. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend health: http://localhost:8080/actuator/health

## AI Wish Fallback

The wish endpoint tries providers in this order by default:

```text
gemini -> anthropic -> local
```

Set `GEMINI_API_KEY` if you want to use Google Gemini. Set `ANTHROPIC_API_KEY` if you want Claude. If no AI key is configured, the backend still returns a local Sinhala Vesak wish, so the app remains usable for demos and local development.
