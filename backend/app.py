from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import os
import requests

# Load .env file if present
from pathlib import Path
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    for line in env_path.read_text().strip().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())
from data import TIMER_CONFIG, BREAK_RECOMMENDATIONS, MOTIVATIONAL_MESSAGES, AMBIENT_SOUNDS

app = Flask(__name__)
CORS(app)

VALID_LEVELS = ["low", "medium", "high"]

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are a caring and supportive AI study companion inside an Exam Stress Relief app.
Your role is to help students manage exam stress, provide study tips, and offer emotional support.
Keep responses short (2-3 sentences max), warm, and actionable.
Never give medical advice. If someone seems in crisis, suggest they talk to a counselor or trusted adult.
Focus on: study techniques, time management, stress reduction, motivation, and positive mindset."""


@app.route("/api/stress-levels")
def get_stress_levels():
    return jsonify(VALID_LEVELS)


@app.route("/api/recommendation/<level>")
def get_recommendation(level):
    if level not in VALID_LEVELS:
        return jsonify({"error": "Invalid stress level"}), 400
    rec = random.choice(BREAK_RECOMMENDATIONS[level])
    msg = random.choice(MOTIVATIONAL_MESSAGES[level])
    timer = TIMER_CONFIG[level]
    return jsonify({
        "stress_level": level,
        "break_recommendation": rec,
        "timer_config": timer,
        "motivational_message": msg,
    })


@app.route("/api/messages/<level>")
def get_message(level):
    if level not in VALID_LEVELS:
        return jsonify({"error": "Invalid stress level"}), 400
    return jsonify({"message": random.choice(MOTIVATIONAL_MESSAGES[level])})


@app.route("/api/sounds")
def get_sounds():
    return jsonify(AMBIENT_SOUNDS)


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Build conversation for Gemini
    contents = [{"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
                {"role": "model", "parts": [{"text": "I understand. I am a supportive study companion ready to help students with exam stress, study tips, and emotional support. How can I help you today?"}]}]

    for msg in history[-10:]:  # Keep last 10 messages for context
        role = "user" if msg["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})

    contents.append({"role": "user", "parts": [{"text": user_message}]})

    try:
        response = requests.post(
            GEMINI_URL,
            json={"contents": contents},
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        result = response.json()
        ai_text = result["candidates"][0]["content"]["parts"][0]["text"]
        return jsonify({"reply": ai_text})
    except Exception as e:
        return jsonify({"reply": "I'm having trouble connecting right now. Remember: you're doing great, and it's okay to take breaks when you need them!"}), 200


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
