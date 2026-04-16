TIMER_CONFIG = {
    "low": {"study_minutes": 45, "break_minutes": 5},
    "medium": {"study_minutes": 30, "break_minutes": 10},
    "high": {"study_minutes": 20, "break_minutes": 15},
}

BREAK_RECOMMENDATIONS = {
    "low": [
        {
            "activity": "Quick Stretch",
            "description": "Stand up and stretch your arms, legs, and back for 5 minutes.",
        },
        {
            "activity": "Drink Water",
            "description": "Hydrate yourself. Take a short walk to the kitchen and back.",
        },
        {
            "activity": "Eye Rest",
            "description": "Close your eyes for 2 minutes and gently massage your temples.",
        },
    ],
    "medium": [
        {
            "activity": "Deep Breathing",
            "description": "Try 4-7-8 breathing: inhale 4 seconds, hold 7 seconds, exhale 8 seconds. Repeat 4 times.",
        },
        {
            "activity": "Listen to Music",
            "description": "Play a calm instrumental track for 10 minutes to reset your mind.",
        },
        {
            "activity": "Short Walk",
            "description": "Walk around your room or corridor for 10 minutes. Move your body.",
        },
        {
            "activity": "Journaling",
            "description": "Write down 3 things you have learned so far. It helps reinforce memory.",
        },
    ],
    "high": [
        {
            "activity": "Guided Meditation",
            "description": "Close your eyes and focus on slow, deep breathing for 15 minutes. Let go of tension.",
        },
        {
            "activity": "Progressive Muscle Relaxation",
            "description": "Tense and release each muscle group from your toes to your head. Takes about 10 minutes.",
        },
        {
            "activity": "Talk to Someone",
            "description": "Call a friend or family member for a few minutes. Sharing your feelings helps reduce anxiety.",
        },
        {
            "activity": "Mindful Break",
            "description": "Step away from your desk. Sit quietly, notice 5 things you can see, 4 you can hear, 3 you can touch.",
        },
    ],
}

MOTIVATIONAL_MESSAGES = {
    "low": [
        "You are doing great! Keep up the steady pace.",
        "Consistency is key. You are on the right track!",
        "Small steps every day lead to big results.",
        "Trust the process. You are making progress!",
        "Stay focused, stay calm. You have got this.",
    ],
    "medium": [
        "Take it one topic at a time. You have got this!",
        "Believe in yourself. You have prepared well.",
        "Progress, not perfection. Keep going!",
        "Every hour of study is an investment in your future.",
        "You are closer to your goal than you think.",
    ],
    "high": [
        "It is okay to feel stressed. Take a deep breath.",
        "You are stronger than you think. One step at a time.",
        "This feeling is temporary. Your effort will pay off.",
        "Be kind to yourself. You are doing your best.",
        "Remember: exams test knowledge, not your worth as a person.",
        "Breathe in calm, breathe out stress. You can do this.",
    ],
}

AMBIENT_SOUNDS = [
    {"id": "rain", "name": "Rain", "icon": "cloud-rain"},
    {"id": "lofi", "name": "Lo-Fi", "icon": "music"},
    {"id": "nature", "name": "Nature", "icon": "leaf"},
    {"id": "silence", "name": "Silence", "icon": "volume-x"},
]
