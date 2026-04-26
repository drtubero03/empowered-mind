# empowered-mind-mailer

Tiny Flask service that accepts the Empowered Mind apply-form POST and forwards it to Drtubero03@gmail.com via Resend.

**Live:** https://empowered-mind-mailer-<hash>.a.run.app/apply

Deployed on Cloud Run in the `periwink-prod` GCP project. Resend API key is mounted from Secret Manager (`periwink-resend-api-key`).

## Endpoints

- `GET /` — health check
- `OPTIONS /apply` — CORS preflight
- `POST /apply` — JSON body, see `apply.html` form for the keys it sends

## Environment

| Var | Source |
|---|---|
| `RESEND_API_KEY` | Secret Manager (`periwink-resend-api-key:latest`) |
| `TO_EMAIL` | (optional) defaults to `Drtubero03@gmail.com` |
| `FROM_EMAIL` | (optional) defaults to `Empowered Mind <noreply@cannacrypted.com>` |

## CORS

Locked to:
- `https://zelidav.github.io`
- `https://doctor.tubero.com` (planned)
- `http://localhost:8000` / `http://127.0.0.1:8000` (local testing)

## Deploy

From this directory:

```sh
gcloud run deploy empowered-mind-mailer \
  --source . \
  --project periwink-prod \
  --region us-east1 \
  --allow-unauthenticated \
  --set-secrets RESEND_API_KEY=periwink-resend-api-key:latest \
  --memory 256Mi --cpu 1 --max-instances 3
```

Use `gcloud builds submit --pack image=...` if buildpacks are preferred — the included `Procfile` and `requirements.txt` are buildpack-compatible.
