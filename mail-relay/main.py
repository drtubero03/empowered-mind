"""Empowered Mind mail relay.

Receives a JSON POST from the apply form, forwards it to Drtubero03@gmail.com
via Resend. Lives as a Cloud Run service in `periwink-prod`. Resend API key
mounted as the `RESEND_API_KEY` env var from Secret Manager.

CORS locked to the production GitHub Pages origin (and localhost for testing).
"""

import json
import os
import re
from html import escape as e

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

RESEND_API_KEY = os.environ["RESEND_API_KEY"]
TO_EMAIL = os.environ.get("TO_EMAIL", "Drtubero03@gmail.com")
FROM_EMAIL = os.environ.get(
    "FROM_EMAIL", "Empowered Mind <noreply@cannacrypted.com>"
)

ALLOWED_ORIGINS = {
    "https://drtubero03.github.io",
    "https://doctor.tubero.com",  # planned custom domain
    "http://localhost:8000",
    "http://127.0.0.1:8000",
}

INQUIRY_LABELS = {
    "csrt": "CSRT 12-session program",
    "group": "The Midlife Shift — Spring 2026 group",
    "waitlist": "Waitlist for a future group",
    "ongoing": "Ongoing individual therapy",
    "not-sure": "Not sure yet",
    "other": "Something else",
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def cors_headers(origin: str | None) -> dict[str, str]:
    if origin in ALLOWED_ORIGINS:
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Vary": "Origin",
        }
    return {}


@app.route("/apply", methods=["OPTIONS"])
def apply_preflight():
    return ("", 204, cors_headers(request.headers.get("Origin")))


@app.route("/apply", methods=["POST"])
def apply():
    origin = request.headers.get("Origin")
    headers = cors_headers(origin)

    try:
        data = request.get_json(force=True, silent=False) or {}
    except Exception:
        return (jsonify({"error": "invalid_json"}), 400, headers)

    name = (data.get("name") or "").strip()[:200]
    email_addr = (data.get("email") or "").strip()[:200]
    phone = (data.get("phone") or "").strip()[:60]
    inquiry = (data.get("inquiry") or "").strip()
    source = (data.get("source") or "").strip()[:80]
    message = (data.get("message") or "").strip()[:5000]
    therapy_history = (data.get("therapy_history") or "").strip()[:80]
    availability = data.get("availability") or []
    if isinstance(availability, str):
        availability = [availability]
    availability = [str(x).strip()[:60] for x in availability if x][:8]

    if not name:
        return (jsonify({"error": "name_required"}), 400, headers)
    if not email_addr or not EMAIL_RE.match(email_addr):
        return (jsonify({"error": "valid_email_required"}), 400, headers)

    # Honeypot — if a bot fills any field named `website`, silently drop
    if (data.get("website") or "").strip():
        return (jsonify({"ok": True}), 200, headers)

    inquiry_label = INQUIRY_LABELS.get(inquiry, inquiry or "(not specified)")

    subject = "New application from Empowered Mind site"
    if inquiry == "group":
        subject = "New Midlife Shift group application"
    elif inquiry == "waitlist":
        subject = "Group waitlist signup — Empowered Mind"

    rows: list[tuple[str, str]] = [
        ("Name", name),
        ("Email", email_addr),
    ]
    if phone:
        rows.append(("Phone", phone))
    rows.append(("Reaching out about", inquiry_label))
    if source:
        rows.append(("How they heard", source))
    if therapy_history:
        rows.append(("Therapy history", therapy_history))
    if availability:
        rows.append(("Availability", ", ".join(availability)))

    table_html = "".join(
        f'<tr><td style="padding:6px 14px 6px 0;color:#5A6B6E;'
        f'font-size:13px;letter-spacing:.1em;text-transform:uppercase;'
        f'vertical-align:top;white-space:nowrap;">{e(label)}</td>'
        f'<td style="padding:6px 0;color:#163A40;font-size:15px;">{e(value)}</td></tr>'
        for label, value in rows
    )

    message_block = ""
    if message:
        message_block = (
            '<h3 style="font-family:Georgia,serif;color:#163A40;'
            'font-weight:400;margin:24px 0 8px 0;">What brings them here</h3>'
            f'<p style="white-space:pre-wrap;color:#3a4a4e;line-height:1.6;'
            f'margin:0 0 16px 0;">{e(message)}</p>'
        )

    html = f"""<!doctype html>
<html><body style="margin:0;background:#F6EFE3;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #DCCFB8;border-radius:14px;padding:28px 32px;">
    <p style="margin:0 0 4px 0;color:#2E8B87;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;">Empowered Mind · New application</p>
    <h2 style="font-family:Georgia,serif;color:#163A40;font-weight:400;margin:0 0 18px 0;font-size:24px;">{e(subject)}</h2>
    <table style="width:100%;border-collapse:collapse;">{table_html}</table>
    {message_block}
    <hr style="border:0;height:1px;background:#DCCFB8;margin:24px 0;"/>
    <p style="color:#9C9180;font-size:12px;margin:0;">Sent automatically from the Empowered Mind site. Reply directly to this message to respond to {e(name)}.</p>
  </div>
</body></html>"""

    text_lines = [f"{label}: {value}" for label, value in rows]
    if message:
        text_lines.append("")
        text_lines.append("What brings them here:")
        text_lines.append(message)
    text_body = "\n".join(text_lines)

    payload = {
        "from": FROM_EMAIL,
        "to": [TO_EMAIL],
        "reply_to": email_addr,
        "subject": subject,
        "html": html,
        "text": text_body,
    }

    try:
        r = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps(payload),
            timeout=15,
        )
    except requests.RequestException as exc:
        return (
            jsonify({"error": "resend_request_failed", "detail": str(exc)}),
            502,
            headers,
        )

    if r.status_code >= 300:
        return (
            jsonify(
                {
                    "error": "resend_error",
                    "status": r.status_code,
                    "detail": r.text[:300],
                }
            ),
            502,
            headers,
        )

    return (jsonify({"ok": True, "id": r.json().get("id")}), 200, headers)


@app.route("/", methods=["GET"])
def health():
    return jsonify({"service": "empowered-mind-mailer", "status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
