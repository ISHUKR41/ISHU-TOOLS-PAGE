"""
ISHU TOOLS — Worldwide Utility Tools (v1)
Handlers for globally-useful tools: writing aids, developer generators,
productivity planners, finance calculators, and more.
All pure-Python — no external APIs required.
"""
from __future__ import annotations

import csv
import html
import io
import json
import math
import random
import re
import textwrap
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from .handlers import ExecutionResult

# ── shared helpers ────────────────────────────────────────────────────────────

def _j(data: dict, message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)

def _txt(text: str, message: str = "Done", filename: str = "output.txt") -> ExecutionResult:
    out = Path("/tmp") / f"ishu_{filename}"
    out.write_text(text, encoding="utf-8")
    return ExecutionResult(kind="file", output_path=out, filename=filename, message=message)

def _get(payload: dict, *keys: str, default: str = "") -> str:
    for k in keys:
        v = payload.get(k)
        if v is not None:
            return str(v).strip()
    return default

# ═════════════════════════════════════════════════════════════════════════════
# 1.  PARAPHRASER
# ═════════════════════════════════════════════════════════════════════════════

_SYNONYMS: dict[str, list[str]] = {
    "good": ["great", "excellent", "fine", "superb", "outstanding"],
    "bad": ["poor", "inferior", "subpar", "inadequate", "deficient"],
    "big": ["large", "enormous", "substantial", "considerable", "sizable"],
    "small": ["tiny", "compact", "minor", "diminutive", "modest"],
    "fast": ["rapid", "swift", "quick", "speedy", "brisk"],
    "slow": ["gradual", "sluggish", "unhurried", "leisurely", "measured"],
    "important": ["crucial", "significant", "essential", "vital", "key"],
    "use": ["utilize", "employ", "apply", "leverage", "harness"],
    "show": ["demonstrate", "illustrate", "reveal", "display", "exhibit"],
    "get": ["obtain", "acquire", "gain", "receive", "secure"],
    "make": ["create", "produce", "generate", "build", "craft"],
    "help": ["assist", "support", "aid", "facilitate", "enable"],
    "need": ["require", "demand", "necessitate", "call for", "warrant"],
    "think": ["believe", "consider", "regard", "perceive", "deem"],
    "see": ["observe", "notice", "recognize", "perceive", "detect"],
    "say": ["state", "mention", "indicate", "express", "convey"],
    "very": ["extremely", "highly", "remarkably", "particularly", "substantially"],
    "many": ["numerous", "multiple", "various", "several", "a range of"],
    "also": ["furthermore", "additionally", "moreover", "likewise", "besides"],
    "but": ["however", "nevertheless", "yet", "nonetheless", "although"],
    "so": ["therefore", "consequently", "thus", "hence", "accordingly"],
    "because": ["since", "as", "given that", "owing to", "due to"],
    "start": ["begin", "initiate", "commence", "launch", "undertake"],
    "end": ["conclude", "finish", "complete", "finalize", "accomplish"],
    "change": ["modify", "alter", "adjust", "revise", "transform"],
    "find": ["discover", "identify", "locate", "determine", "establish"],
    "keep": ["maintain", "retain", "preserve", "sustain", "uphold"],
    "give": ["provide", "offer", "supply", "deliver", "present"],
    "take": ["acquire", "capture", "seize", "adopt", "embrace"],
    "work": ["function", "operate", "perform", "execute", "proceed"],
    "new": ["novel", "innovative", "modern", "fresh", "contemporary"],
    "old": ["existing", "traditional", "established", "prior", "previous"],
    "simple": ["straightforward", "basic", "elementary", "uncomplicated", "clear"],
    "complex": ["sophisticated", "intricate", "multifaceted", "elaborate", "involved"],
    "different": ["distinct", "varied", "alternative", "unique", "diverse"],
    "same": ["identical", "equivalent", "consistent", "uniform", "analogous"],
    "high": ["elevated", "substantial", "significant", "considerable", "notable"],
    "low": ["minimal", "limited", "reduced", "modest", "slight"],
    "often": ["frequently", "regularly", "commonly", "typically", "routinely"],
    "always": ["consistently", "continuously", "invariably", "perpetually", "constantly"],
    "never": ["at no point", "not at all", "under no circumstances", "not ever"],
    "able": ["capable", "equipped", "positioned", "suited", "prepared"],
    "easy": ["straightforward", "effortless", "manageable", "accessible", "user-friendly"],
    "hard": ["challenging", "demanding", "difficult", "rigorous", "arduous"],
    "clear": ["transparent", "evident", "apparent", "obvious", "unambiguous"],
    "strong": ["robust", "powerful", "solid", "formidable", "capable"],
    "main": ["primary", "central", "core", "principal", "fundamental"],
    "real": ["genuine", "authentic", "actual", "true", "legitimate"],
    "great": ["outstanding", "remarkable", "impressive", "exceptional", "superior"],
    "just": ["simply", "merely", "solely", "only", "purely"],
}

def handle_paraphraser(files, payload, output_dir) -> ExecutionResult:
    text = _get(payload, "text", "input")
    if not text:
        return _j({"error": "No text"}, "Please paste text to paraphrase.")

    mode = _get(payload, "mode", default="standard").lower()
    words = text.split()
    result_words = []
    replaced = 0
    word_limit = 2500

    if len(words) > word_limit:
        return _j({"error": f"Text too long. Limit is {word_limit} words."}, "Text too long.")

    for word in words:
        clean = re.sub(r"[^a-zA-Z]", "", word).lower()
        suffix = re.sub(r"[a-zA-Z]", "", word)
        syns = _SYNONYMS.get(clean)
        swap_chance = 0.6 if mode == "aggressive" else (0.35 if mode == "standard" else 0.15)
        if syns and random.random() < swap_chance:
            chosen = random.choice(syns)
            if word[0].isupper():
                chosen = chosen[0].upper() + chosen[1:]
            result_words.append(chosen + suffix)
            replaced += 1
        else:
            result_words.append(word)

    paraphrased = " ".join(result_words)
    original_wc = len(words)
    return _j({
        "original": text,
        "paraphrased": paraphrased,
        "words_replaced": replaced,
        "total_words": original_wc,
        "replacement_rate": f"{(replaced/max(1,original_wc))*100:.1f}%",
        "mode": mode,
    }, f"Paraphrased successfully — {replaced} words replaced.")


# ═════════════════════════════════════════════════════════════════════════════
# 2.  ESSAY OUTLINE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_essay_outline_generator(files, payload, output_dir) -> ExecutionResult:
    topic = _get(payload, "topic", "text")
    essay_type = _get(payload, "type", default="argumentative").lower()
    num_body = min(max(int(payload.get("body_paragraphs", 3)), 2), 6)

    if not topic:
        return _j({"error": "No topic"}, "Please enter an essay topic.")

    intros = {
        "argumentative": f"Hook: Start with a striking statistic or fact about {topic}.\nBackground: Provide context on {topic}.\nThesis: State your position clearly.",
        "expository": f"Hook: Open with an interesting question about {topic}.\nBackground: Define key terms and scope.\nThesis: Outline the main points to be explored.",
        "narrative": f"Hook: Begin with a vivid scene related to {topic}.\nContext: Establish the time, place, and narrator.\nThesis: Hint at the central theme.",
        "descriptive": f"Hook: Use sensory language to introduce {topic}.\nContext: Set the scene and mood.\nThesis: Convey the dominant impression.",
        "compare-contrast": f"Hook: Present an intriguing parallel or contrast about {topic}.\nBackground: Introduce both subjects.\nThesis: State the purpose of the comparison.",
    }
    intro = intros.get(essay_type, intros["argumentative"])

    body_points = [
        f"Point {i+1}: [State your {i+1}{'st' if i==0 else 'nd' if i==1 else 'rd' if i==2 else 'th'} main argument/aspect of {topic}]\n"
        f"  - Evidence: [Provide data, example, or quote]\n"
        f"  - Explanation: [Explain how this supports your thesis]\n"
        f"  - Transition: [Link to the next point]"
        for i in range(num_body)
    ]

    conclusion = (
        f"Restate Thesis: Rephrase your thesis in light of the evidence presented.\n"
        f"Summary: Briefly recap the {num_body} key points made.\n"
        f"Closing: End with a call to action, prediction, or thought-provoking statement about {topic}."
    )

    outline = (
        f"ESSAY OUTLINE — {topic.upper()}\n"
        f"Type: {essay_type.title()}\n"
        f"{'='*60}\n\n"
        f"I. INTRODUCTION\n{intro}\n\n"
        + "\n\n".join(f"{'II. BODY PARAGRAPH' if i==0 else 'II' + 'I'*i + '.'} BODY PARAGRAPH {i+1}\n{bp}" for i, bp in enumerate(body_points))
        + f"\n\n{'IV.' if num_body <= 2 else 'V.' if num_body == 3 else 'VI.' if num_body == 4 else 'VII.' if num_body == 5 else 'VIII.'} CONCLUSION\n{conclusion}\n\n"
        f"{'='*60}\n"
        f"Estimated length: {num_body * 150 + 250}–{num_body * 200 + 400} words\n"
        f"Generated by ISHU TOOLS — ishutools.fun"
    )

    return _j({
        "topic": topic,
        "type": essay_type,
        "outline": outline,
        "sections": num_body + 2,
    }, f"Essay outline for '{topic}' generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 3.  FLASHCARD GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_flashcard_generator(files, payload, output_dir) -> ExecutionResult:
    text = _get(payload, "text", "input")
    num = min(max(int(payload.get("count", 10)), 3), 30)
    if not text:
        return _j({"error": "No text"}, "Please paste text to generate flashcards.")

    sentences = [s.strip() for s in re.split(r'[.!?\n]', text) if len(s.strip()) > 25]
    if len(sentences) < 2:
        return _j({"error": "Not enough content"}, "Please provide more detailed text (at least 2-3 sentences).")

    cards = []
    used = set()
    random.shuffle(sentences)

    for sentence in sentences[:num]:
        words = sentence.split()
        if len(words) < 5:
            continue

        # Pick a key noun or term to blank out
        candidates = [w for w in words if len(w) > 4 and w.isalpha() and w.lower() not in
                      {"which", "where", "their", "there", "these", "those", "about", "would", "could", "should", "might", "since", "often", "every", "other"}]
        if not candidates:
            continue
        key = random.choice(candidates)
        if key.lower() in used:
            continue
        used.add(key.lower())
        blanked = sentence.replace(key, "_" * len(key), 1)
        cards.append({"question": f"Fill in the blank: {blanked}", "answer": key, "context": sentence})

    if not cards:
        return _j({"error": "Could not extract enough terms"}, "Text may be too simple. Try adding more details.")

    output_lines = [f"FLASHCARDS ({len(cards)} cards) — Generated by ISHU TOOLS\n{'='*55}"]
    for i, c in enumerate(cards, 1):
        output_lines.append(f"\nCard {i}:\nQ: {c['question']}\nA: {c['answer']}")

    return _j({
        "cards": cards,
        "count": len(cards),
        "text_output": "\n".join(output_lines),
    }, f"Generated {len(cards)} flashcards.")


# ═════════════════════════════════════════════════════════════════════════════
# 4.  EMAIL TEMPLATE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

_EMAIL_TEMPLATES: dict[str, dict] = {
    "follow-up": {
        "subject": "Following Up on Our Recent Conversation",
        "body": (
            "Dear {recipient},\n\n"
            "I hope this email finds you well. I wanted to follow up on our recent conversation "
            "regarding {topic}.\n\n"
            "I'm still very interested in {goal} and would love to know if you've had a chance "
            "to consider our discussion.\n\n"
            "Please let me know if you need any additional information or if there's a good time "
            "for us to connect.\n\n"
            "Thank you for your time and consideration.\n\n"
            "Best regards,\n{sender}"
        ),
    },
    "job-application": {
        "subject": "Application for {topic} Position",
        "body": (
            "Dear Hiring Manager,\n\n"
            "I am writing to express my strong interest in the {topic} position at your company. "
            "With my background in {goal}, I believe I would be a valuable addition to your team.\n\n"
            "I have attached my resume for your review. I am confident that my skills and experience "
            "align well with the requirements of this role.\n\n"
            "I would welcome the opportunity to discuss how I can contribute to your organization. "
            "I am available for an interview at your convenience.\n\n"
            "Thank you for considering my application.\n\n"
            "Sincerely,\n{sender}"
        ),
    },
    "apology": {
        "subject": "Sincere Apology Regarding {topic}",
        "body": (
            "Dear {recipient},\n\n"
            "I am writing to sincerely apologize for {topic}. I fully understand how this situation "
            "has affected you, and I take complete responsibility for my actions.\n\n"
            "My goal is {goal}, and I am committed to ensuring this does not happen again. "
            "I have taken steps to address the root cause of this issue.\n\n"
            "I value our relationship greatly and hope you will accept my apology. "
            "Please let me know how I can make this right.\n\n"
            "With sincere apologies,\n{sender}"
        ),
    },
    "thank-you": {
        "subject": "Thank You for {topic}",
        "body": (
            "Dear {recipient},\n\n"
            "I wanted to take a moment to express my sincere gratitude for {topic}. "
            "Your support has been truly invaluable.\n\n"
            "{goal}\n\n"
            "I look forward to continuing our collaboration and hope to have the opportunity "
            "to return the favor in the future.\n\n"
            "With warm regards,\n{sender}"
        ),
    },
    "meeting-request": {
        "subject": "Meeting Request: {topic}",
        "body": (
            "Dear {recipient},\n\n"
            "I hope you are doing well. I would like to request a meeting to discuss {topic}.\n\n"
            "My goal for this meeting is to {goal}. I believe a 30-45 minute discussion "
            "would be sufficient to cover the key points.\n\n"
            "Please let me know your availability for the coming week, and I will be happy "
            "to schedule a time that works best for you.\n\n"
            "Thank you for your time. I look forward to hearing from you.\n\n"
            "Best regards,\n{sender}"
        ),
    },
    "proposal": {
        "subject": "Proposal for {topic}",
        "body": (
            "Dear {recipient},\n\n"
            "I am pleased to present this proposal for {topic}.\n\n"
            "OVERVIEW\n{goal}\n\n"
            "SCOPE OF WORK\n• Research and analysis\n• Planning and strategy\n• Implementation\n• Review and delivery\n\n"
            "TIMELINE\nWe estimate this project will take 4-6 weeks from approval to completion.\n\n"
            "NEXT STEPS\nI would love to discuss this proposal in detail. Please let me know "
            "if you'd like to schedule a call.\n\n"
            "Best regards,\n{sender}"
        ),
    },
    "complaint": {
        "subject": "Formal Complaint Regarding {topic}",
        "body": (
            "Dear {recipient},\n\n"
            "I am writing to formally bring to your attention an issue regarding {topic}.\n\n"
            "ISSUE DESCRIPTION\n{goal}\n\n"
            "IMPACT\nThis situation has caused significant inconvenience and I would appreciate "
            "your prompt attention to this matter.\n\n"
            "REQUESTED RESOLUTION\nI kindly request that you investigate this matter and "
            "provide a resolution within 5 business days.\n\n"
            "Please contact me at your earliest convenience to discuss this further.\n\n"
            "Sincerely,\n{sender}"
        ),
    },
}

def handle_email_template_generator(files, payload, output_dir) -> ExecutionResult:
    email_type = _get(payload, "type", default="follow-up").lower().replace(" ", "-")
    recipient = _get(payload, "recipient", default="[Recipient Name]")
    sender = _get(payload, "sender", default="[Your Name]")
    topic = _get(payload, "topic", default="[Main Topic]")
    goal = _get(payload, "goal", default="[Your goal / specific detail]")

    tpl = _EMAIL_TEMPLATES.get(email_type, _EMAIL_TEMPLATES["follow-up"])
    subject = tpl["subject"].format(recipient=recipient, sender=sender, topic=topic, goal=goal)
    body = tpl["body"].format(recipient=recipient, sender=sender, topic=topic, goal=goal)

    full_email = f"SUBJECT: {subject}\n\n{body}"
    return _j({
        "subject": subject,
        "body": body,
        "full_email": full_email,
        "type": email_type,
    }, f"Email template ({email_type}) generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 5.  COVER LETTER GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_cover_letter_generator(files, payload, output_dir) -> ExecutionResult:
    name = _get(payload, "name", default="[Your Name]")
    job_title = _get(payload, "job_title", "position", default="Software Engineer")
    company = _get(payload, "company", default="[Company Name]")
    experience = _get(payload, "experience", default="3 years")
    skills = _get(payload, "skills", default="problem-solving, teamwork, communication")
    achievement = _get(payload, "achievement", default="delivered projects on time and increased team productivity by 20%")

    letter = f"""Dear Hiring Manager,

I am excited to apply for the {job_title} position at {company}. With {experience} of experience and a strong background in {skills}, I am confident I can make a meaningful contribution to your team.

Throughout my career, I have consistently {achievement}. My approach combines technical expertise with strong collaboration skills, allowing me to work effectively both independently and as part of a team.

What excites me most about the {job_title} role at {company} is the opportunity to work in a dynamic environment where I can apply my skills to drive meaningful results. I am particularly drawn to your company's mission and the innovative work you are doing in this space.

I would welcome the opportunity to discuss how my background aligns with the needs of your team. I am available for an interview at your earliest convenience and look forward to the possibility of contributing to {company}'s continued success.

Thank you for your time and consideration.

Sincerely,
{name}"""

    return _j({
        "cover_letter": letter,
        "name": name,
        "job_title": job_title,
        "company": company,
        "word_count": len(letter.split()),
    }, f"Cover letter for {job_title} at {company} generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 6.  HASHTAG GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

_HASHTAG_POOLS: dict[str, list[str]] = {
    "general": ["#viral", "#trending", "#fyp", "#explore", "#content", "#creator", "#share", "#follow", "#like", "#instagood"],
    "tech": ["#technology", "#coding", "#developer", "#programming", "#tech", "#innovation", "#software", "#AI", "#machinelearning", "#startup"],
    "business": ["#entrepreneur", "#startup", "#business", "#marketing", "#success", "#motivation", "#leadership", "#growth", "#networking", "#b2b"],
    "education": ["#education", "#learning", "#study", "#student", "#college", "#university", "#knowledge", "#skills", "#growth", "#career"],
    "health": ["#health", "#fitness", "#wellness", "#gym", "#workout", "#nutrition", "#mindfulness", "#selfcare", "#healthy", "#lifestyle"],
    "food": ["#food", "#foodie", "#recipe", "#cooking", "#eat", "#yummy", "#delicious", "#foodphotography", "#homemade", "#foodblogger"],
    "travel": ["#travel", "#wanderlust", "#adventure", "#explore", "#vacation", "#trip", "#tourism", "#travelgram", "#traveler", "#worldtravel"],
    "fashion": ["#fashion", "#style", "#ootd", "#outfit", "#clothing", "#trend", "#streetwear", "#fashionista", "#luxury", "#design"],
    "photography": ["#photography", "#photo", "#camera", "#photographer", "#photooftheday", "#portrait", "#landscape", "#art", "#creative", "#visualart"],
    "india": ["#india", "#indianstudent", "#iit", "#nit", "#upsc", "#ssc", "#jeemains", "#neet", "#government", "#exam"],
}

def handle_hashtag_generator(files, payload, output_dir) -> ExecutionResult:
    topic = _get(payload, "topic", "text", default="general")
    platform = _get(payload, "platform", default="instagram").lower()
    count = min(max(int(payload.get("count", 20)), 5), 30)

    topic_lower = topic.lower()
    selected_pool = _HASHTAG_POOLS.get("general", []).copy()
    for key, tags in _HASHTAG_POOLS.items():
        if key in topic_lower or any(kw in topic_lower for kw in key.split()):
            selected_pool.extend(tags)

    topic_words = [w.strip(".,!?") for w in topic.split() if len(w) > 3]
    custom = [f"#{w.lower()}" for w in topic_words]
    all_tags = list(dict.fromkeys(custom + selected_pool))
    random.shuffle(all_tags)
    chosen = all_tags[:count]

    platform_tips = {
        "instagram": "Tip: Instagram allows 30 hashtags. Use 10-15 for best reach.",
        "twitter": "Tip: Twitter recommends 1-2 hashtags per tweet for max engagement.",
        "linkedin": "Tip: LinkedIn works best with 3-5 niche hashtags.",
        "tiktok": "Tip: TikTok: Mix viral tags (#fyp, #viral) with niche ones.",
        "youtube": "Tip: YouTube allows 3 hashtags in the title and 15 in description.",
    }

    return _j({
        "hashtags": chosen,
        "hashtag_string": " ".join(chosen),
        "count": len(chosen),
        "platform": platform,
        "tip": platform_tips.get(platform, "Use a mix of popular and niche hashtags."),
    }, f"Generated {len(chosen)} hashtags for '{topic}'.")


# ═════════════════════════════════════════════════════════════════════════════
# 7.  SQL FORMATTER
# ═════════════════════════════════════════════════════════════════════════════

_SQL_KEYWORDS = [
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
    "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "AND", "OR", "NOT", "IN",
    "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "ORDER BY", "GROUP BY",
    "HAVING", "LIMIT", "OFFSET", "DISTINCT", "AS", "UNION", "UNION ALL",
    "EXCEPT", "INTERSECT", "INSERT INTO", "VALUES", "UPDATE", "SET",
    "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "TRUNCATE TABLE",
    "CREATE INDEX", "DROP INDEX", "CREATE VIEW", "DROP VIEW", "WITH", "CASE",
    "WHEN", "THEN", "ELSE", "END", "EXISTS", "ALL", "ANY",
]

def handle_sql_formatter(files, payload, output_dir) -> ExecutionResult:
    sql = _get(payload, "sql", "text", "input")
    indent = int(payload.get("indent", 4))
    if not sql:
        return _j({"error": "No SQL"}, "Please paste a SQL query.")
    if len(sql) > 50000:
        return _j({"error": "SQL too long (max 50,000 chars)."})

    # Normalize whitespace
    result = re.sub(r'\s+', ' ', sql.strip())

    # Capitalize keywords
    for kw in sorted(_SQL_KEYWORDS, key=len, reverse=True):
        result = re.sub(rf'\b{re.escape(kw)}\b', kw, result, flags=re.IGNORECASE)

    # Add newlines before major clauses
    for kw in ["SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
               "OUTER JOIN", "FULL JOIN", "ON", "ORDER BY", "GROUP BY", "HAVING",
               "LIMIT", "OFFSET", "UNION", "UNION ALL", "EXCEPT", "INTERSECT",
               "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "WITH"]:
        result = re.sub(rf'\b{re.escape(kw)}\b', f'\n{kw}', result)

    # Indent AND / OR
    result = re.sub(r'\b(AND|OR)\b', rf'\n{" " * indent}\1', result)

    # Clean up
    lines = [line.strip() for line in result.split('\n') if line.strip()]
    formatted = '\n'.join(lines)

    return _j({
        "formatted": formatted,
        "original_length": len(sql),
        "formatted_length": len(formatted),
        "lines": len(lines),
    }, "SQL formatted successfully.")


# ═════════════════════════════════════════════════════════════════════════════
# 8.  LICENSE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

_LICENSES: dict[str, str] = {
    "mit": "MIT License\n\nCopyright (c) {year} {author}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
    "apache-2.0": "Apache License\nVersion 2.0, January 2004\nhttp://www.apache.org/licenses/\n\nCopyright {year} {author}\n\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.",
    "gpl-3.0": "GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C) {year} {author}\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with this program.  If not, see <https://www.gnu.org/licenses/>.",
    "bsd-2": "BSD 2-Clause License\n\nCopyright (c) {year}, {author}\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED.",
    "mit-0": "MIT No Attribution License\n\nCopyright (c) {year} {author}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
    "unlicense": "This is free and unencumbered software released into the public domain.\n\nAnyone is free to copy, modify, publish, use, compile, sell, or\ndistribute this software, either in source code form or as a compiled\nbinary, for any purpose, commercial or non-commercial, and by any means.\n\nFor more information, please refer to <http://unlicense.org/>",
    "cc0": "Creative Commons Zero v1.0 Universal\n\nStatement of Purpose\n\nThe laws of most jurisdictions throughout the world automatically confer\nexclusive Copyright and Related Rights (defined below) upon the creator\nand subsequent owner(s) of an original work of authorship and/or a database.\n\nCopyright (C) {year} {author}\n\nTo the extent possible under law, the author(s) have dedicated all copyright\nand related and neighboring rights to this work to the public domain worldwide.\nThis work is distributed without any warranty.\n\nYou should have received a copy of the CC0 Public Domain Dedication along\nwith this work. If not, see http://creativecommons.org/publicdomain/zero/1.0/",
}

def handle_license_generator(files, payload, output_dir) -> ExecutionResult:
    license_type = _get(payload, "license", "type", default="mit").lower()
    author = _get(payload, "author", "name", default="[Author Name]")
    year = _get(payload, "year", default=str(datetime.now().year))

    template = _LICENSES.get(license_type, _LICENSES["mit"])
    text = template.format(year=year, author=author)

    return _j({
        "license": text,
        "type": license_type.upper(),
        "author": author,
        "year": year,
    }, f"{license_type.upper()} license generated for {author}.")


# ═════════════════════════════════════════════════════════════════════════════
# 9.  README GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_readme_generator(files, payload, output_dir) -> ExecutionResult:
    name = _get(payload, "name", "project", default="MyProject")
    description = _get(payload, "description", default=f"A brief description of {name}.")
    tech_stack = _get(payload, "tech_stack", "stack", default="Python, React, Node.js")
    features = _get(payload, "features", default="Feature 1\nFeature 2\nFeature 3")
    license_type = _get(payload, "license", default="MIT")
    author = _get(payload, "author", default="[Author]")
    github = _get(payload, "github", default="https://github.com/username/repo")

    feature_list = "\n".join(f"- {f.strip()}" for f in features.split("\n") if f.strip())
    stack_list = "\n".join(f"- {t.strip()}" for t in tech_stack.split(",") if t.strip())

    readme = f"""# {name}

> {description}

[![License: {license_type}](https://img.shields.io/badge/License-{license_type}-blue.svg)]({github})

---

## Features

{feature_list}

---

## Tech Stack

{stack_list}

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18+) or Python (3.10+)
- Git

### Installation

```bash
# Clone the repository
git clone {github}
cd {name.lower().replace(' ', '-')}

# Install dependencies
npm install   # or: pip install -r requirements.txt

# Start the development server
npm run dev   # or: python run.py
```

---

## Usage

1. Clone the repo and install dependencies (see above)
2. Configure environment variables (copy `.env.example` to `.env`)
3. Run the development server
4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the {license_type} License. See `LICENSE` for more information.

---

## Author

**{author}** — [{github}]({github})

---

*Generated by [ISHU TOOLS](https://ishutools.fun) — Free Online Tools*
"""

    return _j({
        "readme": readme,
        "project": name,
        "word_count": len(readme.split()),
    }, f"README.md for {name} generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 10.  GITHUB ACTIONS GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_github_actions_generator(files, payload, output_dir) -> ExecutionResult:
    workflow_type = _get(payload, "type", "workflow", default="node-ci").lower()
    branch = _get(payload, "branch", default="main")
    node_version = _get(payload, "node_version", default="20")
    python_version = _get(payload, "python_version", default="3.11")

    workflows = {
        "node-ci": f"""name: Node.js CI

on:
  push:
    branches: [ {branch} ]
  pull_request:
    branches: [ {branch} ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [{node_version}.x]

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{{{ matrix.node-version }}}}
      uses: actions/setup-node@v4
      with:
        node-version: ${{{{ matrix.node-version }}}}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test --if-present
""",
        "python-ci": f"""name: Python CI

on:
  push:
    branches: [ {branch} ]
  pull_request:
    branches: [ {branch} ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    - name: Set up Python {python_version}
      uses: actions/setup-python@v5
      with:
        python-version: '{python_version}'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install flake8 pytest
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
    - name: Lint with flake8
      run: flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
    - name: Test with pytest
      run: pytest
""",
        "deploy-vercel": f"""name: Deploy to Vercel

on:
  push:
    branches: [ {branch} ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{{{ secrets.VERCEL_TOKEN }}}}
        vercel-org-id: ${{{{ secrets.VERCEL_ORG_ID }}}}
        vercel-project-id: ${{{{ secrets.VERCEL_PROJECT_ID }}}}
        vercel-args: '--prod'
""",
        "docker-build": f"""name: Docker Build and Push

on:
  push:
    branches: [ {branch} ]
  release:
    types: [published]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    - name: Login to DockerHub
      uses: docker/login-action@v3
      with:
        username: ${{{{ secrets.DOCKERHUB_USERNAME }}}}
        password: ${{{{ secrets.DOCKERHUB_TOKEN }}}}
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: user/app:latest
""",
        "release-please": f"""name: Release Please

on:
  push:
    branches: [ {branch} ]

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
""",
    }

    yaml_content = workflows.get(workflow_type, workflows["node-ci"])

    return _j({
        "workflow_yaml": yaml_content,
        "type": workflow_type,
        "filename": f".github/workflows/{workflow_type}.yml",
        "branch": branch,
    }, f"GitHub Actions workflow '{workflow_type}' generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 11.  NGINX CONFIG GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_nginx_config_generator(files, payload, output_dir) -> ExecutionResult:
    domain = _get(payload, "domain", default="example.com")
    port = _get(payload, "port", default="3000")
    config_type = _get(payload, "type", default="reverse-proxy").lower()
    ssl = payload.get("ssl", True)
    root = _get(payload, "root", default="/var/www/html")

    if config_type == "static-site":
        config = f"""server {{
    listen 80;
    listen [::]:80;
    server_name {domain} www.{domain};

    root {root};
    index index.html index.htm;

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}

    access_log /var/log/nginx/{domain}.access.log;
    error_log /var/log/nginx/{domain}.error.log;
}}"""
    else:  # reverse-proxy
        config = f"""upstream app {{
    server 127.0.0.1:{port};
    keepalive 64;
}}

server {{
    listen 80;
    listen [::]:80;
    server_name {domain} www.{domain};

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}}

server {{
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name {domain} www.{domain};

    # SSL Configuration (update paths after running certbot)
    ssl_certificate /etc/letsencrypt/live/{domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{domain}/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy settings
    location / {{
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }}

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml;

    access_log /var/log/nginx/{domain}.access.log;
    error_log /var/log/nginx/{domain}.error.log;
}}"""

    return _j({
        "config": config,
        "domain": domain,
        "type": config_type,
        "filename": f"/etc/nginx/sites-available/{domain}",
    }, f"Nginx config for {domain} generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 12.  DOCKERFILE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

_DOCKERFILES: dict[str, str] = {
    "node": """# syntax=docker/dockerfile:1
FROM node:{version}-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build (if applicable)
RUN npm run build --if-present

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "index.js"]
""",
    "python-fastapi": """# syntax=docker/dockerfile:1
FROM python:{version}-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "react": """# syntax=docker/dockerfile:1
# Stage 1: Build
FROM node:{version}-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
""",
    "python-django": """# syntax=docker/dockerfile:1
FROM python:{version}-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \\
    postgresql-client \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
""",
    "go": """# syntax=docker/dockerfile:1
FROM golang:{version}-alpine AS builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final minimal image
FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
""",
}

def handle_dockerfile_generator(files, payload, output_dir) -> ExecutionResult:
    stack = _get(payload, "stack", "type", default="node").lower()
    version = _get(payload, "version", default="20" if "node" in stack else "3.11")

    template = _DOCKERFILES.get(stack, _DOCKERFILES["node"])
    content = template.format(version=version)

    return _j({
        "dockerfile": content,
        "stack": stack,
        "version": version,
        "filename": "Dockerfile",
    }, f"Dockerfile for {stack} ({version}) generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 13.  STUDY SCHEDULE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_study_schedule_generator(files, payload, output_dir) -> ExecutionResult:
    subjects = _get(payload, "subjects", "text", default="Math, Physics, Chemistry, English")
    hours_per_day = min(max(float(payload.get("hours", 6)), 1), 16)
    days = min(max(int(payload.get("days", 7)), 1), 30)
    exam_date = _get(payload, "exam_date", default="")
    goal = _get(payload, "goal", default="Exam preparation")

    subject_list = [s.strip() for s in subjects.split(",") if s.strip()]
    if not subject_list:
        subject_list = ["Subject 1", "Subject 2", "Subject 3"]

    n = len(subject_list)
    time_per_subject = hours_per_day / n
    study_techniques = [
        "Active recall (test yourself after each topic)",
        "Spaced repetition (review at increasing intervals)",
        "Pomodoro technique (25 min study + 5 min break)",
        "Interleaving (mix topics within a session)",
        "Elaborative interrogation (ask 'why?' after each concept)",
    ]

    schedule_lines = [
        f"STUDY SCHEDULE — {goal}",
        f"Duration: {days} days | {hours_per_day} hrs/day | {n} subjects",
        "=" * 60,
        "",
    ]

    start = datetime.now()
    for day in range(1, min(days + 1, 15)):
        date_str = (start + timedelta(days=day - 1)).strftime("%A, %d %b")
        schedule_lines.append(f"DAY {day} — {date_str}")
        schedule_lines.append("-" * 40)
        start_time = 6  # 6 AM
        for i, subj in enumerate(subject_list):
            end_time = start_time + time_per_subject
            h_s = int(start_time)
            m_s = int((start_time - h_s) * 60)
            h_e = int(end_time)
            m_e = int((end_time - h_e) * 60)
            schedule_lines.append(
                f"  {h_s:02d}:{m_s:02d} – {h_e:02d}:{m_e:02d} │ {subj} "
                f"({time_per_subject:.1f} hrs) │ Technique: {study_techniques[i % len(study_techniques)][:35]}"
            )
            start_time = end_time + 0.25  # 15 min break
        schedule_lines.append(f"  Evening: Revision + {study_techniques[day % len(study_techniques)]}")
        schedule_lines.append("")

    if days > 14:
        schedule_lines.append(f"  ... (Pattern repeats for remaining {days - 14} days)")
        schedule_lines.append("")

    schedule_lines.extend([
        "=" * 60,
        "STUDY TIPS:",
        "• Start with your weakest subject when energy is highest",
        "• Take a 10-min break every 45-60 minutes",
        "• Review yesterday's material for 10 min before new content",
        "• Sleep 7-8 hours — memory consolidates during sleep",
        "• Stay hydrated and exercise 20-30 min daily",
        "",
        f"Total study hours: {hours_per_day * days:.1f} hrs across {days} days",
        f"Generated by ISHU TOOLS — ishutools.fun",
    ])

    output = "\n".join(schedule_lines)
    return _j({
        "schedule": output,
        "subjects": subject_list,
        "hours_per_day": hours_per_day,
        "days": days,
        "total_hours": hours_per_day * days,
    }, f"Study schedule for {days} days generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 14.  SOCIAL MEDIA BIO GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_social_bio_generator(files, payload, output_dir) -> ExecutionResult:
    name = _get(payload, "name", default="Your Name")
    role = _get(payload, "role", "profession", default="Developer")
    interests = _get(payload, "interests", default="coding, travel, music")
    location = _get(payload, "location", default="India")
    platform = _get(payload, "platform", default="instagram").lower()
    cta = _get(payload, "cta", default="DM for collaborations")
    website = _get(payload, "website", default="")

    interest_list = [i.strip() for i in interests.split(",")[:3]]
    interest_str = " | ".join(interest_list)
    emoji_map = {
        "developer": "👨‍💻", "designer": "🎨", "writer": "✍️", "teacher": "👨‍🏫",
        "entrepreneur": "🚀", "student": "📚", "photographer": "📷",
        "engineer": "⚙️", "marketer": "📈", "doctor": "🩺",
    }
    emoji = next((v for k, v in emoji_map.items() if k in role.lower()), "🌟")

    limits = {"instagram": 150, "twitter": 160, "linkedin": 220, "tiktok": 80, "youtube": 1000}
    char_limit = limits.get(platform, 150)

    bios = [
        f"{emoji} {role} | {interest_str}\n📍 {location}\n{cta}{' | ' + website if website else ''}",
        f"{name} • {role}\n{' '.join(f'#{i.replace(' ','').lower()}' for i in interest_list)}\n📍 {location} {emoji}\n{cta}",
        f"Hi! I'm {name} {emoji}\n{role} passionate about {interest_list[0] if interest_list else 'learning'}\nBased in {location}\n{cta}{' ↓' if website else ''}",
    ]

    return _j({
        "bios": bios,
        "best": bios[0],
        "platform": platform,
        "character_limit": char_limit,
        "bio_lengths": [len(b) for b in bios],
    }, f"Social media bios for {platform} generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 15.  INVOICE TEXT GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_invoice_generator(files, payload, output_dir) -> ExecutionResult:
    your_name = _get(payload, "your_name", default="Your Business Name")
    client_name = _get(payload, "client_name", default="Client Name")
    invoice_num = _get(payload, "invoice_num", default=f"INV-{datetime.now().strftime('%Y%m%d')}-001")
    items_raw = _get(payload, "items", default="Web Development,50,20\nDesign Work,75,10")
    currency = _get(payload, "currency", default="INR")
    tax_rate = float(payload.get("tax_rate", 18))
    due_days = int(payload.get("due_days", 15))
    notes = _get(payload, "notes", default="Thank you for your business!")

    today = datetime.now()
    due_date = today + timedelta(days=due_days)

    lines = []
    subtotal = 0
    line_items = []
    for row in items_raw.strip().split("\n"):
        parts = [p.strip() for p in row.split(",")]
        if len(parts) >= 3:
            desc, rate, qty = parts[0], float(parts[1]), float(parts[2])
            total = rate * qty
            subtotal += total
            line_items.append({"description": desc, "rate": rate, "quantity": qty, "total": total})
            lines.append(f"  {desc:<35} {qty:>8.1f}  ×  {currency} {rate:>10.2f}  =  {currency} {total:>12.2f}")

    tax_amount = subtotal * tax_rate / 100
    grand_total = subtotal + tax_amount

    invoice_text = f"""
{'='*72}
                         INVOICE
{'='*72}

  From:  {your_name}
  To:    {client_name}

  Invoice No: {invoice_num}
  Date:       {today.strftime('%d %B %Y')}
  Due Date:   {due_date.strftime('%d %B %Y')}

{'─'*72}
  DESCRIPTION                           QTY       RATE            AMOUNT
{'─'*72}
{chr(10).join(lines)}
{'─'*72}

                               Subtotal:   {currency} {subtotal:>12.2f}
                               GST/Tax ({tax_rate:.0f}%): {currency} {tax_amount:>12.2f}
                               TOTAL DUE:  {currency} {grand_total:>12.2f}

{'─'*72}
  Notes: {notes}
  Payment due within {due_days} days of invoice date.
{'='*72}
  Generated by ISHU TOOLS — ishutools.fun
{'='*72}"""

    return _j({
        "invoice": invoice_text.strip(),
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "grand_total": grand_total,
        "line_items": line_items,
        "invoice_number": invoice_num,
        "currency": currency,
    }, f"Invoice {invoice_num} for {grand_total:.2f} {currency} generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 16.  EXPENSE SPLITTER
# ═════════════════════════════════════════════════════════════════════════════

def handle_expense_splitter(files, payload, output_dir) -> ExecutionResult:
    people_raw = _get(payload, "people", default="Alice,Bob,Charlie")
    total = float(payload.get("total", 0))
    expenses_raw = _get(payload, "expenses", "text", default="")
    currency = _get(payload, "currency", default="INR")

    people = [p.strip() for p in people_raw.split(",") if p.strip()]
    if not people:
        return _j({"error": "No people listed"}, "Please list people names.")
    if not total and not expenses_raw:
        return _j({"error": "No amount"}, "Please enter a total amount or list of expenses.")

    # Parse individual expenses
    expense_list = []
    parsed_total = 0.0
    if expenses_raw:
        for line in expenses_raw.strip().split("\n"):
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 2:
                try:
                    desc = parts[0]
                    amt = float(parts[1])
                    paid_by = parts[2] if len(parts) > 2 else people[0]
                    expense_list.append({"description": desc, "amount": amt, "paid_by": paid_by})
                    parsed_total += amt
                except ValueError:
                    pass
        if parsed_total > 0:
            total = parsed_total

    if total <= 0:
        return _j({"error": "Total must be greater than zero"}, "Please enter a valid total.")

    per_person = total / len(people)
    balances: dict[str, float] = {p: -per_person for p in people}

    for exp in expense_list:
        paid_by = exp["paid_by"]
        if paid_by in balances:
            balances[paid_by] += exp["amount"]

    # Simplified settlement
    settlements = []
    debtors = [(p, -b) for p, b in balances.items() if b < -0.01]
    creditors = [(p, b) for p, b in balances.items() if b > 0.01]

    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor, debt = debtors[i]
        creditor, credit = creditors[j]
        settle = min(debt, credit)
        settlements.append({"from": debtor, "to": creditor, "amount": round(settle, 2)})
        debtors[i] = (debtor, debt - settle)
        creditors[j] = (creditor, credit - settle)
        if debtors[i][1] < 0.01:
            i += 1
        if creditors[j][1] < 0.01:
            j += 1

    summary_lines = [
        f"EXPENSE SPLIT — {len(people)} people",
        f"Total: {currency} {total:.2f} | Per person: {currency} {per_person:.2f}",
        "─" * 45,
    ]
    for exp in expense_list:
        summary_lines.append(f"  {exp['description']}: {currency} {exp['amount']:.2f} (paid by {exp['paid_by']})")
    if expense_list:
        summary_lines.append("─" * 45)
    summary_lines.append("SETTLEMENTS:")
    for s in settlements:
        summary_lines.append(f"  {s['from']} → {s['to']}: {currency} {s['amount']:.2f}")
    if not settlements:
        summary_lines.append("  Everyone owes the same amount — no transfers needed!")
    summary_lines.append(f"\nGenerated by ISHU TOOLS — ishutools.fun")

    return _j({
        "total": total,
        "per_person": round(per_person, 2),
        "people": people,
        "settlements": settlements,
        "balances": {p: round(b, 2) for p, b in balances.items()},
        "expenses": expense_list,
        "summary": "\n".join(summary_lines),
        "currency": currency,
    }, f"Expense split for {len(people)} people — {currency} {per_person:.2f} each.")


# ═════════════════════════════════════════════════════════════════════════════
# 17.  BLOG OUTLINE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_blog_outline_generator(files, payload, output_dir) -> ExecutionResult:
    topic = _get(payload, "topic", "text", default="")
    audience = _get(payload, "audience", default="beginners")
    word_target = min(max(int(payload.get("word_count", 1500)), 500), 5000)
    sections = min(max(int(payload.get("sections", 5)), 3), 10)

    if not topic:
        return _j({"error": "No topic"}, "Please enter a blog topic.")

    outline_parts = [
        f"BLOG POST OUTLINE — {topic.upper()}",
        f"Target audience: {audience} | Word count: ~{word_target} words",
        "=" * 60,
        "",
        "I. HEADLINE IDEAS (choose one):",
        f"  • The Ultimate Guide to {topic} in {datetime.now().year}",
        f"  • How to Master {topic}: A Step-by-Step Guide for {audience.title()}",
        f"  • {topic}: Everything You Need to Know",
        f"  • {topic} Explained Simply — No Jargon",
        f"  • Top Tips for {topic} That Actually Work",
        "",
        "II. META DESCRIPTION (155 chars max):",
        f"  A comprehensive guide to {topic} for {audience}. Learn the key concepts,",
        f"  best practices, and practical tips to get started today.",
        "",
        "III. INTRODUCTION (~150 words):",
        f"  Hook: Start with a surprising statistic or question about {topic}",
        f"  Problem: Explain the common challenge readers face with {topic}",
        f"  Promise: Tell readers what they'll learn in this post",
        f"  Thesis: Briefly state your main argument or approach",
        "",
    ]

    section_words = (word_target - 300) // sections
    section_types = [
        ("What is", "Define and explain the basics"),
        ("Why", "Cover importance and benefits"),
        ("How to", "Step-by-step instructions"),
        ("Common mistakes to avoid", "Pitfalls and how to avoid them"),
        ("Best practices", "Tips from experts"),
        ("Examples", "Real-world case studies"),
        ("Tools and resources", "Recommended tools"),
        ("FAQ", "Answer common questions"),
        ("Case study", "Detailed example walkthrough"),
        ("Summary", "Key takeaways"),
    ]

    for i in range(min(sections, len(section_types))):
        stype, sdesc = section_types[i]
        outline_parts.extend([
            f"{'I' * (i+4) if i < 3 else chr(86 + i)}. {stype.upper()} {topic.upper() if i < 2 else ''} (~{section_words} words)",
            f"  Purpose: {sdesc}",
            f"  • Sub-point 1: [Specific aspect of {topic}]",
            f"  • Sub-point 2: [Another key point]",
            f"  • Sub-point 3: [Supporting evidence or example]",
            "",
        ])

    outline_parts.extend([
        "CONCLUSION (~100 words):",
        "  • Summarize the main points covered",
        "  • Reinforce the key takeaway",
        "  • Call to action: [subscribe / share / comment / try X]",
        "",
        "SEO KEYWORDS TO INCLUDE:",
        f"  Primary: {topic.lower()}",
        f"  Secondary: {topic.lower()} guide, how to {topic.lower()}, {topic.lower()} tips",
        f"  LSI: {topic.lower()} for beginners, {topic.lower()} tutorial, best {topic.lower()}",
        "",
        f"Generated by ISHU TOOLS — ishutools.fun",
    ])

    return _j({
        "outline": "\n".join(outline_parts),
        "topic": topic,
        "sections": sections,
        "word_target": word_target,
    }, f"Blog outline for '{topic}' generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 18.  SLOGAN / TAGLINE GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

_SLOGAN_PATTERNS = [
    "The {adj} way to {verb} your {noun}.",
    "{verb} better. {verb} faster. {verb} smarter.",
    "Your {noun}, your way.",
    "Making {noun} {adj}.",
    "Where {noun} meets {adj2}.",
    "Built for {audience}. Loved by all.",
    "Beyond {noun}.",
    "The future of {noun}.",
    "{noun} that just works.",
    "Simple tools, {adj} results.",
    "Trusted by thousands. Built for you.",
    "Do more with less {noun}.",
    "Less {noun}. More {verb}.",
    "{verb} without limits.",
    "The {adj} {noun} solution.",
]

def handle_slogan_generator(files, payload, output_dir) -> ExecutionResult:
    brand = _get(payload, "brand", "name", default="Your Brand")
    product = _get(payload, "product", "text", default="tool")
    audience = _get(payload, "audience", default="everyone")
    tone = _get(payload, "tone", default="professional").lower()

    adj_map = {
        "professional": ["smart", "powerful", "reliable", "efficient", "trusted"],
        "fun": ["awesome", "amazing", "brilliant", "delightful", "exciting"],
        "simple": ["easy", "simple", "clean", "clear", "fast"],
        "bold": ["bold", "revolutionary", "unstoppable", "fearless", "dynamic"],
    }
    verb_map = {
        "professional": ["optimize", "transform", "elevate", "enhance", "streamline"],
        "fun": ["supercharge", "boost", "power up", "level up", "amplify"],
        "simple": ["simplify", "improve", "manage", "organize", "handle"],
        "bold": ["disrupt", "redefine", "reimagine", "reshape", "revolutionize"],
    }
    adjs = adj_map.get(tone, adj_map["professional"])
    verbs = verb_map.get(tone, verb_map["professional"])

    slogans = []
    for pattern in _SLOGAN_PATTERNS[:8]:
        try:
            slogan = pattern.format(
                adj=random.choice(adjs),
                adj2=random.choice(adjs),
                verb=random.choice(verbs).title(),
                noun=product,
                audience=audience,
            )
            slogans.append(f"{brand} — {slogan}")
        except Exception:
            continue

    return _j({
        "slogans": slogans,
        "brand": brand,
        "best": slogans[0] if slogans else f"{brand} — Simply {adjs[0].title()}.",
        "tone": tone,
    }, f"Generated {len(slogans)} slogans for {brand}.")


# ═════════════════════════════════════════════════════════════════════════════
# 19.  MEETING AGENDA GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_meeting_agenda_generator(files, payload, output_dir) -> ExecutionResult:
    title = _get(payload, "title", "topic", default="Team Meeting")
    attendees = _get(payload, "attendees", default="Team Lead, Developer, Designer, QA")
    duration = int(payload.get("duration", 60))
    agenda_items_raw = _get(payload, "items", "text", default="Updates\nBlockers\nNext steps\nQ&A")
    date = _get(payload, "date", default=datetime.now().strftime("%A, %d %B %Y"))
    time_str = _get(payload, "time", default="10:00 AM")

    items = [i.strip() for i in agenda_items_raw.split("\n") if i.strip()]
    if not items:
        items = ["Introduction", "Main discussion", "Action items", "Q&A"]

    per_item = max(duration // len(items), 5)

    agenda_lines = [
        f"MEETING AGENDA",
        f"{'='*55}",
        f"Title:     {title}",
        f"Date:      {date}",
        f"Time:      {time_str}",
        f"Duration:  {duration} minutes",
        f"Attendees: {attendees}",
        f"{'─'*55}",
        "",
        "AGENDA:",
        "",
    ]
    current_min = 0
    for i, item in enumerate(items):
        mins = per_item if i < len(items) - 1 else duration - current_min
        agenda_lines.append(f"  [{current_min:02d} min] {item} ({mins} min)")
        current_min += mins

    agenda_lines.extend([
        "",
        "─" * 55,
        "PRE-MEETING CHECKLIST:",
        "  □ Confirm attendees and send calendar invite",
        "  □ Share agenda 24 hours in advance",
        "  □ Prepare materials / slides",
        "  □ Test AV / video conferencing setup",
        "",
        "MEETING GROUND RULES:",
        "  • Start and end on time",
        "  • One speaker at a time",
        "  • Phones on silent",
        "  • Stay on topic — parking lot for off-topic items",
        "",
        f"Generated by ISHU TOOLS — ishutools.fun",
    ])

    return _j({
        "agenda": "\n".join(agenda_lines),
        "title": title,
        "duration": duration,
        "items": items,
        "attendees": attendees,
    }, f"Meeting agenda for '{title}' ({duration} min) generated.")


# ═════════════════════════════════════════════════════════════════════════════
# 20.  RESUME BULLET POINT GENERATOR
# ═════════════════════════════════════════════════════════════════════════════

_STRONG_VERBS = [
    "Developed", "Designed", "Implemented", "Led", "Managed", "Built",
    "Created", "Launched", "Optimized", "Reduced", "Increased", "Improved",
    "Delivered", "Coordinated", "Collaborated", "Architected", "Deployed",
    "Automated", "Streamlined", "Analyzed", "Conducted", "Established",
    "Executed", "Facilitated", "Generated", "Integrated", "Mentored",
    "Negotiated", "Presented", "Produced", "Resolved", "Spearheaded",
]

def handle_resume_bullet_generator(files, payload, output_dir) -> ExecutionResult:
    task = _get(payload, "task", "text", default="")
    result = _get(payload, "result", default="")
    metric = _get(payload, "metric", default="")
    role = _get(payload, "role", default="Software Engineer")
    count = min(max(int(payload.get("count", 5)), 3), 10)

    if not task:
        return _j({"error": "No task description"}, "Please describe what you did in the role.")

    bullets = []
    verbs_to_use = random.sample(_STRONG_VERBS, min(count, len(_STRONG_VERBS)))

    for i in range(count):
        verb = verbs_to_use[i % len(verbs_to_use)]
        if metric and result:
            bullet = f"{verb} {task}, resulting in {result} ({metric} improvement)"
        elif result:
            bullet = f"{verb} {task}, leading to {result}"
        elif metric:
            bullet = f"{verb} {task}, achieving {metric} improvement"
        else:
            bullet = f"{verb} {task} as {role}, improving team productivity and delivery quality"
        bullets.append(bullet)

    return _j({
        "bullets": bullets,
        "count": len(bullets),
        "role": role,
        "tip": "Use the STAR format: Situation, Task, Action, Result. Always quantify impact.",
    }, f"Generated {len(bullets)} resume bullet points.")


# ═════════════════════════════════════════════════════════════════════════════
# 21.  WORLD MEETING TIME FINDER
# ═════════════════════════════════════════════════════════════════════════════

_TZ_OFFSETS: dict[str, float] = {
    "UTC": 0, "GMT": 0,
    "India": 5.5, "IST": 5.5, "New Delhi": 5.5, "Mumbai": 5.5, "Bangalore": 5.5,
    "London": 0, "UK": 0,
    "New York": -5, "EST": -5, "EDT": -4, "ET": -5, "US East": -5,
    "Los Angeles": -8, "PST": -8, "PDT": -7, "PT": -8, "US West": -8,
    "Chicago": -6, "CST": -6,
    "Tokyo": 9, "Japan": 9, "JST": 9,
    "Beijing": 8, "Shanghai": 8, "China": 8, "CST Asia": 8,
    "Singapore": 8, "SGT": 8,
    "Dubai": 4, "UAE": 4,
    "Sydney": 11, "AEDT": 11, "Australia": 11,
    "Paris": 1, "CET": 1, "Germany": 1, "Berlin": 1,
    "Moscow": 3, "Russia": 3,
    "São Paulo": -3, "Brazil": -3,
    "Toronto": -5, "Canada East": -5,
    "Vancouver": -8, "Canada West": -8,
    "Seoul": 9, "Korea": 9,
    "Bangkok": 7, "Thailand": 7,
    "Jakarta": 7, "Indonesia": 7,
    "Karachi": 5, "Pakistan": 5,
    "Dhaka": 6, "Bangladesh": 6,
    "Nairobi": 3, "Kenya": 3,
    "Lagos": 1, "Nigeria": 1,
    "Cairo": 2, "Egypt": 2,
}

def handle_world_meeting_planner(files, payload, output_dir) -> ExecutionResult:
    zones_raw = _get(payload, "zones", "text", default="India,London,New York")
    meeting_hour = int(payload.get("hour", 10))
    base_zone = _get(payload, "base", default="UTC")

    zones = [z.strip() for z in zones_raw.split(",") if z.strip()][:8]
    base_offset = _TZ_OFFSETS.get(base_zone, 0)

    results = []
    for zone in zones:
        offset = _TZ_OFFSETS.get(zone)
        if offset is None:
            # Try case-insensitive lookup
            for k, v in _TZ_OFFSETS.items():
                if k.lower() == zone.lower():
                    offset = v
                    break
        if offset is None:
            results.append({"zone": zone, "time": "Unknown timezone", "offset": None})
            continue
        # Half-hour timezones (e.g. India +5:30) are supported via fractional offsets.
        local_total = (meeting_hour + (offset - base_offset)) % 24
        local_hour = int(local_total) % 24
        local_minute = int(round((local_total - int(local_total)) * 60)) % 60
        am_pm = "AM" if local_hour < 12 else "PM"
        display_hour = local_hour if local_hour <= 12 else local_hour - 12
        if display_hour == 0:
            display_hour = 12
        business = "✅ Business hours" if 8 <= local_hour <= 18 else ("🌙 Evening" if local_hour > 18 else "🌅 Early morning")
        results.append({
            "zone": zone,
            "time": f"{display_hour:02d}:{local_minute:02d} {am_pm}",
            "hour_24": local_hour,
            "minute": local_minute,
            "status": business,
            "utc_offset": f"UTC{'+' if offset >= 0 else ''}{offset:.1f}".replace('.0', ''),
        })

    output_lines = [
        f"WORLD MEETING PLANNER",
        f"Base time: {int(meeting_hour):02d}:00 {base_zone}",
        "=" * 50,
    ]
    for r in results:
        if r.get("time") != "Unknown timezone":
            output_lines.append(f"  {r['zone']:<20} {r['time']:<12} {r.get('status','')}")
        else:
            output_lines.append(f"  {r['zone']:<20} Unknown timezone")

    # Suggest best time slots
    good_slots = []
    for test_hour in range(8, 20):
        all_good = True
        for zone in zones:
            offset = _TZ_OFFSETS.get(zone, base_offset)
            local = int((test_hour + (offset - base_offset)) % 24)
            if not (8 <= local <= 18):
                all_good = False
                break
        if all_good:
            good_slots.append(f"{int(test_hour):02d}:00 {base_zone}")

    if good_slots:
        output_lines.extend(["", f"✅ GOOD MEETING TIMES ({base_zone}): {', '.join(good_slots[:5])}"])
    else:
        output_lines.extend(["", "⚠️ No single time works for all zones. Consider rotating meeting times."])

    return _j({
        "times": results,
        "good_slots": good_slots[:5],
        "summary": "\n".join(output_lines),
        "base_zone": base_zone,
        "meeting_hour": meeting_hour,
    }, f"Meeting times calculated for {len(zones)} timezones.")


# ═════════════════════════════════════════════════════════════════════════════
# 22.  TIP CALCULATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_tip_calculator(files, payload, output_dir) -> ExecutionResult:
    bill = float(
        payload.get("bill_amount") or payload.get("bill") or
        payload.get("amount") or payload.get("value") or 0
    )
    tip_percent = float(payload.get("tip_percent") or payload.get("tip_pct") or 15)
    split = max(int(
        payload.get("num_people") or payload.get("people") or
        payload.get("split") or 1
    ), 1)
    currency = _get(payload, "currency", default="INR")

    if bill <= 0:
        return _j({"error": "Bill amount required"}, "Please enter a bill amount.")

    tip_amount = bill * tip_percent / 100
    total = bill + tip_amount
    per_person = total / split

    return _j({
        "bill": bill,
        "tip_percent": tip_percent,
        "tip_amount": round(tip_amount, 2),
        "total": round(total, 2),
        "per_person": round(per_person, 2),
        "split": split,
        "currency": currency,
        "summary": (
            f"Bill: {currency} {bill:.2f} | Tip ({tip_percent:.0f}%): {currency} {tip_amount:.2f} | "
            f"Total: {currency} {total:.2f} | Per person ({split}): {currency} {per_person:.2f}"
        ),
    }, f"Total: {currency} {total:.2f} | Per person: {currency} {per_person:.2f}")


# ═════════════════════════════════════════════════════════════════════════════
# 23.  NUMBER TO WORDS
# ═════════════════════════════════════════════════════════════════════════════

_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
         "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
         "seventeen", "eighteen", "nineteen"]
_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

def _n2w(n: int) -> str:
    if n < 0:
        return "negative " + _n2w(-n)
    if n == 0:
        return "zero"
    if n < 20:
        return _ONES[n]
    if n < 100:
        return _TENS[n // 10] + ("" if n % 10 == 0 else "-" + _ONES[n % 10])
    if n < 1000:
        rest = n % 100
        return _ONES[n // 100] + " hundred" + ("" if rest == 0 else " and " + _n2w(rest))
    if n < 100000:
        rest = n % 1000
        return _n2w(n // 1000) + " thousand" + ("" if rest == 0 else " " + _n2w(rest))
    if n < 10000000:
        rest = n % 100000
        return _n2w(n // 100000) + " lakh" + ("" if rest == 0 else " " + _n2w(rest))
    if n < 1000000000:
        rest = n % 10000000
        return _n2w(n // 10000000) + " crore" + ("" if rest == 0 else " " + _n2w(rest))
    return str(n)

def handle_number_to_words(files, payload, output_dir) -> ExecutionResult:
    raw = _get(payload, "number", "text", "input")
    if not raw:
        return _j({"error": "No number"}, "Please enter a number.")
    try:
        n = int(float(raw.replace(",", "")))
    except ValueError:
        return _j({"error": "Invalid number"}, "Please enter a valid integer.")
    if abs(n) > 9_99_99_99_999:
        return _j({"error": "Number too large"}, "Number must be less than 10 billion.")
    words = _n2w(abs(n))
    if n < 0:
        words = "negative " + words

    ordinal_map = {"one": "first", "two": "second", "three": "third", "four": "fourth",
                   "five": "fifth", "six": "sixth", "seven": "seventh", "eight": "eighth",
                   "nine": "ninth", "ten": "tenth"}
    last_word = words.strip().split()[-1]
    ordinal = words[:-len(last_word)] + ordinal_map.get(last_word, last_word + "th")

    return _j({
        "number": n,
        "words": words.capitalize(),
        "ordinal": ordinal.capitalize(),
        "indian_format": f"{n:,}",
        "scientific": f"{n:.2e}",
    }, f"{n:,} in words: {words.capitalize()}")


# ═════════════════════════════════════════════════════════════════════════════
# 24.  STRING CASE CONVERTER (all styles)
# ═════════════════════════════════════════════════════════════════════════════

def handle_string_case_converter(files, payload, output_dir) -> ExecutionResult:
    text = _get(payload, "text", "input")
    if not text:
        return _j({"error": "No text"}, "Please enter text to convert.")
    if len(text) > 10000:
        return _j({"error": "Text too long"}, "Max 10,000 characters.")

    words = re.findall(r'[a-zA-Z0-9]+', text)
    if not words:
        return _j({"error": "No words found"}, "No convertible words found in input.")

    camel = words[0].lower() + "".join(w.capitalize() for w in words[1:])
    pascal = "".join(w.capitalize() for w in words)
    snake = "_".join(w.lower() for w in words)
    screaming = "_".join(w.upper() for w in words)
    kebab = "-".join(w.lower() for w in words)
    train = "-".join(w.capitalize() for w in words)
    dot = ".".join(w.lower() for w in words)
    path = "/".join(w.lower() for w in words)
    flat = "".join(w.lower() for w in words)
    upper_flat = "".join(w.upper() for w in words)
    title = " ".join(w.capitalize() for w in words)
    sentence = words[0].capitalize() + " " + " ".join(w.lower() for w in words[1:]) if len(words) > 1 else words[0].capitalize()
    upper = text.upper()
    lower = text.lower()
    alternating = "".join(c.upper() if i % 2 == 0 else c.lower() for i, c in enumerate(text))

    return _j({
        "original": text,
        "camelCase": camel,
        "PascalCase": pascal,
        "snake_case": snake,
        "SCREAMING_SNAKE_CASE": screaming,
        "kebab-case": kebab,
        "Train-Case": train,
        "dot.case": dot,
        "path/case": path,
        "flatcase": flat,
        "UPPERFLATCASE": upper_flat,
        "Title Case": title,
        "Sentence case": sentence,
        "UPPER CASE": upper,
        "lower case": lower,
        "aLtErNaTiNg": alternating,
    }, f"Converted to {len([1 for _ in range(16)])} case styles.")


# ═════════════════════════════════════════════════════════════════════════════
# 25.  COMPOUND INTEREST CALCULATOR
# ═════════════════════════════════════════════════════════════════════════════

def handle_compound_interest_calculator(files, payload, output_dir) -> ExecutionResult:
    principal = float(payload.get("principal", 0))
    rate = float(payload.get("rate", 10))
    years = float(payload.get("years", 10))
    frequency = int(payload.get("frequency", 12))  # compounding per year
    monthly_contribution = float(payload.get("monthly_contribution", 0))
    currency = _get(payload, "currency", default="INR")

    if principal < 0:
        return _j({"error": "Principal must be positive"}, "Enter a valid principal amount.")

    r = rate / 100 / frequency
    n = int(years * frequency)

    # Compound interest on principal
    amount = principal * ((1 + r) ** n)

    # Future value of monthly contributions (annuity formula)
    if monthly_contribution > 0 and r > 0:
        contrib_freq = monthly_contribution * (12 / frequency)
        amount += contrib_freq * (((1 + r) ** n - 1) / r)

    interest_earned = amount - principal - (monthly_contribution * 12 * years)
    total_invested = principal + monthly_contribution * 12 * years

    freq_labels = {1: "annually", 2: "semi-annually", 4: "quarterly", 12: "monthly", 52: "weekly", 365: "daily"}
    freq_label = freq_labels.get(frequency, f"{frequency}x/year")

    yearly_breakdown = []
    for y in range(1, min(int(years) + 1, 31)):
        n_y = int(y * frequency)
        a = principal * ((1 + r) ** n_y)
        if monthly_contribution > 0 and r > 0:
            contrib_freq = monthly_contribution * (12 / frequency)
            a += contrib_freq * (((1 + r) ** n_y - 1) / r)
        invested = principal + monthly_contribution * 12 * y
        yearly_breakdown.append({
            "year": y,
            "balance": round(a, 2),
            "invested": round(invested, 2),
            "interest": round(a - invested, 2),
        })

    return _j({
        "principal": principal,
        "rate": rate,
        "years": years,
        "compounding": freq_label,
        "monthly_contribution": monthly_contribution,
        "final_amount": round(amount, 2),
        "total_invested": round(total_invested, 2),
        "interest_earned": round(max(0, interest_earned), 2),
        "roi_percent": round(((amount / max(1, total_invested)) - 1) * 100, 2),
        "currency": currency,
        "yearly_breakdown": yearly_breakdown,
        "summary": (
            f"Principal: {currency} {principal:,.2f} | Rate: {rate}% | "
            f"Years: {years} | Final amount: {currency} {amount:,.2f} | "
            f"Interest earned: {currency} {max(0, interest_earned):,.2f}"
        ),
    }, f"Final amount: {currency} {amount:,.2f} after {years} years at {rate}%.")


# ═════════════════════════════════════════════════════════════════════════════
# 26.  HIGH-DEMAND STUDENT / DEVELOPER / SEO TOOLS
# ═════════════════════════════════════════════════════════════════════════════

def _payload_bool(payload: dict, key: str, default: bool = False) -> bool:
    value = payload.get(key, default)
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "y", "on"}


def _payload_float(payload: dict, key: str, default: float = 0.0) -> float:
    try:
        return float(str(payload.get(key, default)).replace(",", "").strip())
    except (TypeError, ValueError):
        return default


def _payload_int(payload: dict, key: str, default: int = 0) -> int:
    try:
        return int(float(str(payload.get(key, default)).replace(",", "").strip()))
    except (TypeError, ValueError):
        return default


def _input_text(payload: dict, *keys: str, default: str = "") -> str:
    return _get(payload, *keys, "text", "input", default=default)


def _slug_header(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "_", value.strip().lower()).strip("_")
    return cleaned or "column"


def handle_user_agent_parser(files, payload, output_dir) -> ExecutionResult:
    ua = _input_text(payload, "user_agent", "ua")
    if not ua:
        return _j({"error": "No user agent supplied"}, "Paste a browser user-agent string.")

    browser_rules = [
        ("Microsoft Edge", r"Edg/([\d.]+)"),
        ("Opera", r"OPR/([\d.]+)|Opera/([\d.]+)"),
        ("Chrome", r"Chrome/([\d.]+)"),
        ("Firefox", r"Firefox/([\d.]+)"),
        ("Safari", r"Version/([\d.]+).*Safari"),
    ]
    browser = "Unknown"
    browser_version = ""
    for name, pattern in browser_rules:
        match = re.search(pattern, ua)
        if match:
            browser = name
            browser_version = next((g for g in match.groups() if g), "")
            break

    os_rules = [
        ("Windows", r"Windows NT ([\d.]+)"),
        ("macOS", r"Mac OS X ([\d_]+)"),
        ("Android", r"Android ([\d.]+)"),
        ("iOS", r"(?:iPhone|iPad).*OS ([\d_]+)"),
        ("Linux", r"Linux"),
    ]
    os_name = "Unknown"
    os_version = ""
    for name, pattern in os_rules:
        match = re.search(pattern, ua)
        if match:
            os_name = name
            os_version = match.group(1).replace("_", ".") if match.groups() else ""
            break

    device = "Mobile" if re.search(r"Mobile|Android|iPhone|iPod", ua, re.I) else "Tablet" if re.search(r"iPad|Tablet", ua, re.I) else "Desktop"
    is_bot = bool(re.search(r"bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp", ua, re.I))

    return _j({
        "browser": browser,
        "browser_version": browser_version,
        "os": os_name,
        "os_version": os_version,
        "device_type": device,
        "is_bot": is_bot,
        "engine": "Blink/WebKit" if browser in {"Chrome", "Microsoft Edge", "Opera", "Safari"} else "Gecko" if browser == "Firefox" else "Unknown",
        "raw_user_agent": ua,
    }, f"Detected {browser} on {os_name} ({device}).")


def handle_csv_cleaner(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "csv", "data")
    if not text:
        return _j({"error": "No CSV supplied"}, "Paste CSV data to clean.")

    delimiter_option = _get(payload, "delimiter", default="auto").lower()
    delimiter_map = {"comma": ",", "semicolon": ";", "tab": "\t", "pipe": "|"}
    delimiter = delimiter_map.get(delimiter_option)
    if delimiter is None:
        try:
            delimiter = csv.Sniffer().sniff(text[:2048]).delimiter
        except csv.Error:
            delimiter = ","

    trim_cells = _payload_bool(payload, "trim_cells", True)
    remove_empty = _payload_bool(payload, "remove_empty_rows", True)
    dedupe_rows = _payload_bool(payload, "dedupe_rows", False)
    normalize_headers = _payload_bool(payload, "normalize_headers", False)

    rows = list(csv.reader(io.StringIO(text), delimiter=delimiter))
    original_rows = len(rows)
    if trim_cells:
        rows = [[cell.strip() for cell in row] for row in rows]
    if remove_empty:
        rows = [row for row in rows if any(cell.strip() for cell in row)]
    if normalize_headers and rows:
        rows[0] = [_slug_header(cell) for cell in rows[0]]
    if dedupe_rows:
        seen = set()
        unique_rows = []
        for row in rows:
            key = tuple(row)
            if key not in seen:
                seen.add(key)
                unique_rows.append(row)
        rows = unique_rows

    out = io.StringIO()
    writer = csv.writer(out, lineterminator="\n")
    writer.writerows(rows)
    cleaned = out.getvalue()
    columns = max((len(row) for row in rows), default=0)

    return _j({
        "cleaned_csv": cleaned,
        "rows": len(rows),
        "columns": columns,
        "removed_rows": max(0, original_rows - len(rows)),
        "delimiter": "\\t" if delimiter == "\t" else delimiter,
        "preview": rows[:10],
    }, f"Cleaned CSV: {len(rows)} rows, {columns} columns.")


def handle_regex_replace(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "text")
    pattern = _get(payload, "pattern", "regex")
    replacement = _get(payload, "replacement", "replace", default="")
    flags_raw = _get(payload, "flags", default="")
    if not pattern:
        return _j({"error": "Regex pattern required"}, "Enter a regex pattern.")

    flags = 0
    if "i" in flags_raw.lower():
        flags |= re.IGNORECASE
    if "m" in flags_raw.lower():
        flags |= re.MULTILINE
    if "s" in flags_raw.lower():
        flags |= re.DOTALL

    try:
        compiled = re.compile(pattern, flags)
    except re.error as exc:
        return _j({"error": str(exc), "pattern": pattern}, f"Invalid regex: {exc}")

    matches = [m.group(0) for m in compiled.finditer(text)]
    output, count = compiled.subn(replacement, text)
    return _j({
        "output": output,
        "matches": matches[:50],
        "match_count": len(matches),
        "replace_count": count,
        "pattern": pattern,
        "flags": flags_raw,
    }, f"Replaced {count} match{'es' if count != 1 else ''}.")


_GRADE_POINTS = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0,
    "O": 10.0, "S": 10.0, "E": 9.0,
}


def _grade_for_percent(percent: float) -> str:
    if percent >= 90:
        return "A+"
    if percent >= 80:
        return "A"
    if percent >= 70:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 50:
        return "D"
    return "F"


def handle_weighted_gpa_calculator(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "courses", default="Math,A,4\nPhysics,B+,3\nEnglish,A-,2")
    scale = _payload_float(payload, "scale", 4.0)
    rows = []
    total_points = 0.0
    total_credits = 0.0

    for line in [ln.strip() for ln in text.splitlines() if ln.strip()]:
        parts = [p.strip() for p in re.split(r"[,|]", line) if p.strip()]
        if len(parts) == 2:
            name = f"Course {len(rows) + 1}"
            grade, credits_raw = parts
        elif len(parts) >= 3:
            name, grade, credits_raw = parts[:3]
        else:
            continue

        try:
            credits = float(credits_raw)
        except ValueError:
            credits = 1.0
        grade_key = grade.upper()
        if grade_key in _GRADE_POINTS:
            points = _GRADE_POINTS[grade_key]
            if points > scale:
                points = points / 10 * scale
        else:
            try:
                points = float(grade)
            except ValueError:
                points = 0.0
        points = max(0.0, min(scale, points))
        total_points += points * credits
        total_credits += credits
        rows.append({"course": name, "grade": grade, "credits": credits, "points": round(points, 3)})

    if total_credits <= 0:
        return _j({"error": "No valid courses"}, "Enter courses like: Math,A,4")

    gpa = total_points / total_credits
    return _j({
        "gpa": round(gpa, 3),
        "scale": scale,
        "total_credits": round(total_credits, 2),
        "courses": rows,
        "formula": "sum(grade_points * credits) / sum(credits)",
    }, f"Weighted GPA: {gpa:.3f} / {scale:g}.")


def handle_grade_average_calculator(files, payload, output_dir) -> ExecutionResult:
    scores_text = _input_text(payload, "scores", "marks", default="78, 85, 91, 66")
    max_marks = _payload_float(payload, "max_marks", 100.0) or 100.0
    scores = []
    for token in re.split(r"[\s,;|]+", scores_text):
        if not token.strip():
            continue
        try:
            scores.append(float(token))
        except ValueError:
            pass
    if not scores:
        return _j({"error": "No valid scores"}, "Enter marks separated by commas or lines.")

    total = sum(scores)
    percent = total / (len(scores) * max_marks) * 100
    return _j({
        "scores": scores,
        "count": len(scores),
        "total_obtained": round(total, 2),
        "total_possible": round(len(scores) * max_marks, 2),
        "average_marks": round(total / len(scores), 2),
        "percentage": round(percent, 2),
        "grade": _grade_for_percent(percent),
        "highest": max(scores),
        "lowest": min(scores),
    }, f"Average: {percent:.2f}% ({_grade_for_percent(percent)}).")


def handle_syllabus_study_planner(files, payload, output_dir) -> ExecutionResult:
    topics_text = _input_text(payload, "topics", "syllabus", default="Algebra, hard\nPhysics numericals, medium\nEnglish grammar, easy")
    days = max(1, min(_payload_int(payload, "days", 7), 120))
    daily_hours = max(0.5, min(_payload_float(payload, "daily_hours", 2.0), 16.0))
    difficulty_weight = {"easy": 1.0, "medium": 1.5, "hard": 2.0}

    topics = []
    for line in [ln.strip() for ln in topics_text.splitlines() if ln.strip()]:
        parts = [p.strip() for p in re.split(r"[,|]", line) if p.strip()]
        name = parts[0]
        diff = parts[1].lower() if len(parts) > 1 else "medium"
        weight = difficulty_weight.get(diff, 1.5)
        topics.append({"topic": name, "difficulty": diff if diff in difficulty_weight else "medium", "weight": weight})
    if not topics:
        return _j({"error": "No topics"}, "Enter at least one syllabus topic.")

    total_weight = sum(t["weight"] for t in topics)
    total_hours = days * daily_hours
    for topic in topics:
        topic["estimated_hours"] = round(total_hours * topic["weight"] / total_weight, 2)

    plan = []
    topic_index = 0
    for day in range(1, days + 1):
        remaining = daily_hours
        sessions = []
        guard = 0
        while remaining > 0.05 and guard < len(topics) * 2:
            topic = topics[topic_index % len(topics)]
            block = min(remaining, max(0.5, daily_hours / 2))
            sessions.append({"topic": topic["topic"], "hours": round(block, 2)})
            remaining -= block
            topic_index += 1
            guard += 1
        plan.append({"day": day, "total_hours": daily_hours, "sessions": sessions})

    return _j({
        "days": days,
        "daily_hours": daily_hours,
        "total_study_hours": round(total_hours, 2),
        "topics": topics,
        "plan": plan,
        "revision_tip": "Keep the final day lighter for revision and past-paper practice.",
    }, f"Created a {days}-day study plan with {total_hours:.1f} total hours.")


_TRACKING_PARAMS = {
    "fbclid", "gclid", "dclid", "msclkid", "mc_cid", "mc_eid", "igshid",
    "ref", "ref_src", "spm", "si", "feature", "cmpid",
}


def _clean_tracking_url(url: str, keep_fragment: bool = False) -> str:
    parsed = urlparse(url if re.match(r"^[a-z][a-z0-9+.-]*://", url, re.I) else "https://" + url)
    kept = []
    for key, value in parse_qsl(parsed.query, keep_blank_values=True):
        lower_key = key.lower()
        if lower_key.startswith("utm_") or lower_key in _TRACKING_PARAMS:
            continue
        kept.append((key, value))
    return urlunparse((parsed.scheme, parsed.netloc.lower(), parsed.path or "/", parsed.params, urlencode(kept, doseq=True), parsed.fragment if keep_fragment else ""))


def handle_citation_url_cleaner(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "url", "urls")
    keep_fragment = _payload_bool(payload, "keep_fragment", False)
    urls = re.findall(r"https?://[^\s<>\"]+|(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s<>\"]*", text)
    if not urls:
        return _j({"error": "No URLs found"}, "Paste one or more URLs to clean.")
    cleaned = [_clean_tracking_url(url.rstrip(".,)"), keep_fragment) for url in urls[:100]]
    return _j({
        "cleaned_urls": cleaned,
        "count": len(cleaned),
        "removed_tracking_parameters": sorted(_TRACKING_PARAMS | {"utm_*"}),
    }, f"Cleaned {len(cleaned)} URL{'s' if len(cleaned) != 1 else ''}.")


def handle_url_query_parser(files, payload, output_dir) -> ExecutionResult:
    raw_url = _input_text(payload, "url")
    if not raw_url:
        return _j({"error": "URL required"}, "Paste a URL to parse.")
    parsed = urlparse(raw_url if re.match(r"^[a-z][a-z0-9+.-]*://", raw_url, re.I) else "https://" + raw_url)
    params = parse_qsl(parsed.query, keep_blank_values=True)
    param_map: dict[str, list[str]] = {}
    for key, value in params:
        param_map.setdefault(key, []).append(value)
    sorted_query = urlencode(sorted(params), doseq=True)
    rebuilt = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, sorted_query, parsed.fragment))
    return _j({
        "scheme": parsed.scheme,
        "domain": parsed.netloc,
        "path": parsed.path or "/",
        "query_parameters": param_map,
        "parameter_count": len(params),
        "fragment": parsed.fragment,
        "sorted_url": rebuilt,
    }, f"Parsed {len(params)} query parameter{'s' if len(params) != 1 else ''}.")


def handle_timestamp_converter(files, payload, output_dir) -> ExecutionResult:
    value = _input_text(payload, "timestamp", "date", "datetime", default=str(int(datetime.now(tz=timezone.utc).timestamp())))
    offset_minutes = _payload_int(payload, "offset_minutes", 330)

    try:
        numeric = float(value)
        if numeric > 10_000_000_000:
            numeric = numeric / 1000
        dt_utc = datetime.fromtimestamp(numeric, tz=timezone.utc)
    except ValueError:
        try:
            dt_utc = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if dt_utc.tzinfo is None:
                dt_utc = dt_utc.replace(tzinfo=timezone.utc)
            dt_utc = dt_utc.astimezone(timezone.utc)
        except ValueError:
            return _j({"error": "Invalid timestamp or date"}, "Enter Unix timestamp or ISO date.")

    local_tz = timezone(timedelta(minutes=offset_minutes))
    dt_local = dt_utc.astimezone(local_tz)
    return _j({
        "unix_seconds": int(dt_utc.timestamp()),
        "unix_milliseconds": int(dt_utc.timestamp() * 1000),
        "utc_iso": dt_utc.isoformat().replace("+00:00", "Z"),
        "local_iso": dt_local.isoformat(),
        "local_offset_minutes": offset_minutes,
        "rfc_2822": dt_utc.strftime("%a, %d %b %Y %H:%M:%S GMT"),
    }, f"Timestamp converted: {dt_utc.isoformat().replace('+00:00', 'Z')}.")


def handle_markdown_table_generator(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "table", "csv", "data", default="Name,Score\nIshu,95\nTools,100")
    has_header = _payload_bool(payload, "has_header", True)
    delimiter_option = _get(payload, "delimiter", default="auto").lower()
    delimiter = {"comma": ",", "tab": "\t", "pipe": "|", "semicolon": ";"}.get(delimiter_option)
    if delimiter is None:
        try:
            delimiter = csv.Sniffer().sniff(text[:1024]).delimiter
        except csv.Error:
            delimiter = "," if "," in text else "\t" if "\t" in text else "|"
    rows = [[cell.strip() for cell in row] for row in csv.reader(io.StringIO(text), delimiter=delimiter) if row]
    if not rows:
        return _j({"error": "No rows"}, "Paste CSV or table data.")
    max_cols = max(len(row) for row in rows)
    rows = [row + [""] * (max_cols - len(row)) for row in rows]
    if has_header:
        header, body = rows[0], rows[1:]
    else:
        header = [f"Column {i + 1}" for i in range(max_cols)]
        body = rows

    def esc_cell(cell: str) -> str:
        return cell.replace("|", "\\|").replace("\n", " ")

    lines = [
        "| " + " | ".join(esc_cell(c) for c in header) + " |",
        "| " + " | ".join("---" for _ in header) + " |",
    ]
    lines.extend("| " + " | ".join(esc_cell(c) for c in row) + " |" for row in body)
    markdown = "\n".join(lines)
    return _j({
        "markdown": markdown,
        "rows": len(body),
        "columns": max_cols,
        "preview": lines[:8],
    }, f"Generated Markdown table with {len(body)} rows and {max_cols} columns.")


def handle_email_extractor(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "text")
    emails = re.findall(r"(?i)\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b", text)
    unique = list(dict.fromkeys(email.lower() for email in emails))
    domains: dict[str, int] = {}
    for email in unique:
        domain = email.split("@", 1)[1]
        domains[domain] = domains.get(domain, 0) + 1
    return _j({
        "emails": unique,
        "count": len(unique),
        "domains": domains,
        "csv": "\n".join(unique),
    }, f"Extracted {len(unique)} unique email address{'es' if len(unique) != 1 else ''}.")


def handle_phone_number_extractor(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "text")
    candidates = re.findall(r"(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,5}\)?[\s-]?){2,5}\d{2,5}", text)
    phones = []
    for item in candidates:
        digits = re.sub(r"\D", "", item)
        if 7 <= len(digits) <= 15:
            normalized = "+" + digits if item.strip().startswith("+") else digits
            phones.append({"raw": item.strip(), "digits": digits, "normalized": normalized})
    unique = []
    seen = set()
    for phone in phones:
        if phone["normalized"] not in seen:
            seen.add(phone["normalized"])
            unique.append(phone)
    return _j({
        "phones": unique,
        "count": len(unique),
        "plain_list": "\n".join(phone["normalized"] for phone in unique),
    }, f"Extracted {len(unique)} phone number{'s' if len(unique) != 1 else ''}.")


_KEYWORD_STOPWORDS = {
    "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",
    "you", "your", "have", "has", "had", "not", "but", "all", "can", "will",
    "use", "using", "into", "online", "free", "tool", "tools", "our", "their",
}


def handle_keyword_density_checker(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "text", "content")
    min_length = max(1, _payload_int(payload, "min_length", 3))
    top_n = max(5, min(_payload_int(payload, "top_n", 20), 100))
    words = [w.lower() for w in re.findall(r"[a-zA-Z][a-zA-Z0-9'-]*", text)]
    filtered = [w for w in words if len(w) >= min_length and w not in _KEYWORD_STOPWORDS]
    counts: dict[str, int] = {}
    for word in filtered:
        counts[word] = counts.get(word, 0) + 1
    total = len(filtered) or 1
    keywords = [
        {"keyword": word, "count": count, "density_percent": round(count / total * 100, 2)}
        for word, count in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:top_n]
    ]
    return _j({
        "word_count": len(words),
        "analyzed_word_count": len(filtered),
        "unique_keywords": len(counts),
        "keywords": keywords,
    }, f"Analyzed {len(words)} words and found {len(counts)} unique keywords.")


def handle_robots_txt_generator(files, payload, output_dir) -> ExecutionResult:
    site_url = _get(payload, "site_url", "url", default="https://example.com").rstrip("/")
    sitemap_url = _get(payload, "sitemap_url", default=f"{site_url}/sitemap.xml")
    disallow_raw = _get(payload, "disallow", default="/api/\n/admin/")
    allow_raw = _get(payload, "allow", default="/")
    crawl_delay = _get(payload, "crawl_delay", default="")

    lines = ["User-agent: *"]
    for path in [p.strip() for p in re.split(r"[\n,]+", allow_raw) if p.strip()]:
        lines.append(f"Allow: {path}")
    for path in [p.strip() for p in re.split(r"[\n,]+", disallow_raw) if p.strip()]:
        lines.append(f"Disallow: {path}")
    if crawl_delay:
        lines.append(f"Crawl-delay: {crawl_delay}")
    lines.append(f"Sitemap: {sitemap_url}")
    robots = "\n".join(lines) + "\n"
    return _j({
        "robots_txt": robots,
        "site_url": site_url,
        "sitemap_url": sitemap_url,
    }, "robots.txt generated successfully.")


def handle_meta_description_generator(files, payload, output_dir) -> ExecutionResult:
    topic = _get(payload, "topic", "title", "text", default="Free online tools").strip()
    audience = _get(payload, "audience", default="students and professionals")
    keyword_text = _get(payload, "keywords", default=topic)
    max_length = max(120, min(_payload_int(payload, "max_length", 155), 180))
    keywords = [k.strip() for k in re.split(r"[,|\n]+", keyword_text) if k.strip()][:6]
    primary = keywords[0] if keywords else topic

    raw_options = [
        f"{topic} for {audience}. Use {primary} online free with fast results, no signup, mobile support, and clean professional output.",
        f"Try {topic} on ISHU TOOLS. Free {primary} for {audience}, built for speed, accuracy, privacy, and easy daily use.",
        f"Free {topic} online for {audience}. Get instant results, SEO-friendly output, no watermark, no signup, and reliable processing.",
    ]
    descriptions = [option[:max_length].rstrip(" ,.-") for option in raw_options]
    titles = [
        f"{topic} Online Free | ISHU TOOLS",
        f"Free {primary} Tool for {audience.title()}",
        f"{topic} - Fast, Free, No Signup",
    ]
    return _j({
        "titles": titles,
        "descriptions": descriptions,
        "keywords": keywords,
        "max_length": max_length,
        "lengths": [len(desc) for desc in descriptions],
    }, f"Generated {len(descriptions)} SEO meta descriptions.")


# ═════════════════════════════════════════════════════════════════════════════
# 27.  PRODUCTION UTILITY BATCH 2
# ═════════════════════════════════════════════════════════════════════════════

def _detect_delimiter(text: str, requested: str = "auto") -> str:
    delimiter = {"comma": ",", "tab": "\t", "pipe": "|", "semicolon": ";"}.get(requested.lower())
    if delimiter:
        return delimiter
    try:
        return csv.Sniffer().sniff(text[:2048]).delimiter
    except csv.Error:
        if "\t" in text:
            return "\t"
        if "|" in text:
            return "|"
        if ";" in text:
            return ";"
        return ","


def _parse_table_rows(text: str, delimiter: str = "auto") -> list[list[str]]:
    delim = _detect_delimiter(text, delimiter)
    return [[cell.strip() for cell in row] for row in csv.reader(io.StringIO(text), delimiter=delim) if row]


def handle_utm_builder(files, payload, output_dir) -> ExecutionResult:
    raw_url = _get(payload, "url", "site_url", default="https://ishutools.fun").strip()
    parsed = urlparse(raw_url if re.match(r"^[a-z][a-z0-9+.-]*://", raw_url, re.I) else "https://" + raw_url)
    existing = dict(parse_qsl(parsed.query, keep_blank_values=True))

    utm_values = {
        "utm_source": _get(payload, "source", "utm_source", default="newsletter"),
        "utm_medium": _get(payload, "medium", "utm_medium", default="email"),
        "utm_campaign": _get(payload, "campaign", "utm_campaign", default="spring_launch"),
        "utm_term": _get(payload, "term", "utm_term", default=""),
        "utm_content": _get(payload, "content", "utm_content", default=""),
    }
    for key, value in utm_values.items():
        if value:
            existing[key] = value
    tagged_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path or "/", parsed.params, urlencode(existing, doseq=True), parsed.fragment))
    return _j({
        "tagged_url": tagged_url,
        "utm_parameters": {key: value for key, value in utm_values.items() if value},
        "base_url": urlunparse((parsed.scheme, parsed.netloc, parsed.path or "/", "", "", "")),
    }, "UTM campaign URL generated successfully.")


def handle_html_table_generator(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "data", "csv", "table", default="Name,Score\nIshu,95\nTools,100")
    rows = _parse_table_rows(text, _get(payload, "delimiter", default="auto"))
    if not rows:
        return _j({"error": "No table rows"}, "Paste CSV or table data.")
    has_header = _payload_bool(payload, "has_header", True)
    table_class = re.sub(r"[^a-zA-Z0-9_-]+", "-", _get(payload, "class_name", default="ishu-table")).strip("-") or "ishu-table"
    max_cols = max(len(row) for row in rows)
    rows = [row + [""] * (max_cols - len(row)) for row in rows]
    header = rows[0] if has_header else []
    body = rows[1:] if has_header else rows
    indent = "  "
    lines = [f'<table class="{html.escape(table_class, quote=True)}">']
    if header:
        lines.extend([indent + "<thead>", indent * 2 + "<tr>"])
        lines.extend(indent * 3 + f"<th>{html.escape(cell)}</th>" for cell in header)
        lines.extend([indent * 2 + "</tr>", indent + "</thead>"])
    lines.extend([indent + "<tbody>"])
    for row in body:
        lines.append(indent * 2 + "<tr>")
        lines.extend(indent * 3 + f"<td>{html.escape(cell)}</td>" for cell in row)
        lines.append(indent * 2 + "</tr>")
    lines.extend([indent + "</tbody>", "</table>"])
    table_html = "\n".join(lines)
    return _j({
        "html": table_html,
        "rows": len(body),
        "columns": max_cols,
        "class_name": table_class,
    }, f"Generated HTML table with {len(body)} rows and {max_cols} columns.")


def _infer_json_schema(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        properties = {str(key): _infer_json_schema(val) for key, val in value.items()}
        return {"type": "object", "properties": properties, "required": list(properties.keys())}
    if isinstance(value, list):
        if not value:
            return {"type": "array", "items": {}}
        item_schemas = [_infer_json_schema(item) for item in value[:25]]
        unique_types = list(dict.fromkeys(json.dumps(schema, sort_keys=True) for schema in item_schemas))
        if len(unique_types) == 1:
            items = item_schemas[0]
        else:
            items = {"anyOf": [json.loads(schema) for schema in unique_types[:8]]}
        return {"type": "array", "items": items}
    if isinstance(value, bool):
        return {"type": "boolean"}
    if isinstance(value, int) and not isinstance(value, bool):
        return {"type": "integer"}
    if isinstance(value, float):
        return {"type": "number"}
    if value is None:
        return {"type": "null"}
    return {"type": "string"}


def handle_json_schema_generator(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "json", "data", default='{"name":"Ishu","score":95,"tags":["tools","student"]}')
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        return _j({"error": str(exc), "line": exc.lineno, "column": exc.colno}, f"Invalid JSON: {exc.msg}")
    schema = {"$schema": "https://json-schema.org/draft/2020-12/schema", **_infer_json_schema(parsed)}
    return _j({
        "schema": schema,
        "schema_json": json.dumps(schema, indent=2, ensure_ascii=False),
    }, "JSON Schema generated successfully.")


def handle_css_clamp_generator(files, payload, output_dir) -> ExecutionResult:
    min_px = _payload_float(payload, "min_px", 16)
    max_px = _payload_float(payload, "max_px", 32)
    min_vw = _payload_float(payload, "min_viewport", 360)
    max_vw = _payload_float(payload, "max_viewport", 1440)
    base_px = _payload_float(payload, "base_px", 16) or 16
    unit = _get(payload, "unit", default="rem").lower()
    if max_vw <= min_vw or max_px < min_px:
        return _j({"error": "Invalid size or viewport range"}, "Max viewport must be larger and max size must be >= min size.")
    slope = (max_px - min_px) / (max_vw - min_vw) * 100
    intercept = min_px - (slope * min_vw / 100)
    if unit == "px":
        clamp = f"clamp({min_px:.2f}px, {intercept:.4f}px + {slope:.4f}vw, {max_px:.2f}px)"
    else:
        clamp = f"clamp({min_px / base_px:.4f}rem, {intercept / base_px:.4f}rem + {slope:.4f}vw, {max_px / base_px:.4f}rem)"
    return _j({
        "clamp": clamp,
        "css": f"font-size: {clamp};",
        "slope_vw": round(slope, 6),
        "intercept_px": round(intercept, 6),
        "range": {"min_px": min_px, "max_px": max_px, "min_viewport": min_vw, "max_viewport": max_vw},
    }, "CSS clamp() value generated successfully.")


def handle_slug_bulk_generator(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "text", "titles", default="Hello World\nISHU Tools Page")
    separator = _get(payload, "separator", default="-")[:3] or "-"
    max_length = max(10, min(_payload_int(payload, "max_length", 80), 200))
    preserve_numbers = _payload_bool(payload, "preserve_numbers", True)
    slugs = []
    for line in [ln.strip() for ln in text.splitlines() if ln.strip()]:
        pattern = r"[^a-z0-9]+" if preserve_numbers else r"[^a-z]+"
        slug = re.sub(pattern, separator, line.lower()).strip(separator)
        slug = re.sub(re.escape(separator) + r"{2,}", separator, slug)[:max_length].strip(separator)
        slugs.append({"input": line, "slug": slug})
    return _j({
        "slugs": slugs,
        "plain_list": "\n".join(item["slug"] for item in slugs),
        "count": len(slugs),
    }, f"Generated {len(slugs)} slug{'s' if len(slugs) != 1 else ''}.")


def handle_table_to_csv_converter(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "table", "text", default="| Name | Score |\n| --- | --- |\n| Ishu | 95 |")
    rows = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if re.fullmatch(r"\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?", stripped):
            continue
        if "|" in stripped:
            parts = [part.strip() for part in stripped.strip("|").split("|")]
        elif "\t" in stripped:
            parts = [part.strip() for part in stripped.split("\t")]
        else:
            parts = [part.strip() for part in re.split(r"\s{2,}", stripped) if part.strip()]
        if parts:
            rows.append(parts)
    out = io.StringIO()
    csv.writer(out, lineterminator="\n").writerows(rows)
    return _j({
        "csv": out.getvalue(),
        "rows": len(rows),
        "columns": max((len(row) for row in rows), default=0),
        "preview": rows[:10],
    }, f"Converted table to CSV with {len(rows)} rows.")


def handle_csv_column_extractor(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "csv", "data", default="Name,Score,City\nIshu,95,Patna\nTools,100,Web")
    columns_raw = _get(payload, "columns", default="Name")
    has_header = _payload_bool(payload, "has_header", True)
    rows = _parse_table_rows(text, _get(payload, "delimiter", default="auto"))
    if not rows:
        return _j({"error": "No CSV rows"}, "Paste CSV data.")
    header = rows[0] if has_header else [str(i + 1) for i in range(max(len(row) for row in rows))]
    body = rows[1:] if has_header else rows
    selected_indices = []
    for token in [part.strip() for part in re.split(r"[,|]", columns_raw) if part.strip()]:
        if token.isdigit():
            idx = int(token) - 1
        else:
            lowered = [h.lower() for h in header]
            idx = lowered.index(token.lower()) if token.lower() in lowered else -1
        if 0 <= idx < len(header) and idx not in selected_indices:
            selected_indices.append(idx)
    if not selected_indices:
        return _j({"error": "No matching columns", "available_columns": header}, "Choose valid column names or 1-based indexes.")
    extracted = [[row[i] if i < len(row) else "" for i in selected_indices] for row in body]
    out = io.StringIO()
    writer = csv.writer(out, lineterminator="\n")
    writer.writerow([header[i] for i in selected_indices])
    writer.writerows(extracted)
    return _j({
        "csv": out.getvalue(),
        "columns": [header[i] for i in selected_indices],
        "rows": len(extracted),
        "preview": extracted[:10],
    }, f"Extracted {len(selected_indices)} column{'s' if len(selected_indices) != 1 else ''}.")


def handle_css_specificity_calculator(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "selectors", "selector", default="#app .card button:hover")
    results = []
    for selector in [ln.strip() for ln in re.split(r"[\n,]+", text) if ln.strip()]:
        cleaned = re.sub(r":not\(([^)]*)\)", r"\1", selector)
        ids = len(re.findall(r"#[a-zA-Z_][\w-]*", cleaned))
        classes = len(re.findall(r"\.[a-zA-Z_][\w-]*|\[[^\]]+\]|:(?!:)[a-zA-Z-]+(?:\([^)]*\))?", cleaned))
        elements = len(re.findall(r"(^|[\s>+~])([a-zA-Z][\w-]*|\*)", cleaned))
        pseudo_elements = len(re.findall(r"::[a-zA-Z-]+", cleaned))
        specificity = (ids, classes, max(0, elements + pseudo_elements))
        score = ids * 100 + classes * 10 + specificity[2]
        results.append({"selector": selector, "specificity": specificity, "score": score})
    return _j({
        "results": results,
        "strongest": max(results, key=lambda item: item["score"]) if results else None,
    }, f"Calculated specificity for {len(results)} selector{'s' if len(results) != 1 else ''}.")


_HTTP_STATUS_TEXT = {
    100: "Continue", 101: "Switching Protocols", 102: "Processing",
    200: "OK", 201: "Created", 202: "Accepted", 204: "No Content", 206: "Partial Content",
    301: "Moved Permanently", 302: "Found", 304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect",
    400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 408: "Request Timeout", 409: "Conflict", 410: "Gone", 413: "Payload Too Large", 415: "Unsupported Media Type", 422: "Unprocessable Entity", 429: "Too Many Requests",
    500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout",
}


def handle_http_status_code_lookup(files, payload, output_dir) -> ExecutionResult:
    code = _payload_int(payload, "code", 200)
    phrase = _HTTP_STATUS_TEXT.get(code, "Unknown Status Code")
    category = "Informational" if code < 200 else "Success" if code < 300 else "Redirect" if code < 400 else "Client Error" if code < 500 else "Server Error" if code < 600 else "Unknown"
    return _j({
        "code": code,
        "phrase": phrase,
        "category": category,
        "is_error": code >= 400,
        "common_fix": "Check request URL, method, headers, authentication, and server logs." if code >= 400 else "No fix needed for normal success/redirect statuses.",
    }, f"HTTP {code}: {phrase}.")


_MIME_TYPES = {
    "html": "text/html", "css": "text/css", "js": "text/javascript", "json": "application/json",
    "xml": "application/xml", "pdf": "application/pdf", "txt": "text/plain", "csv": "text/csv",
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp", "gif": "image/gif", "svg": "image/svg+xml",
    "mp3": "audio/mpeg", "wav": "audio/wav", "mp4": "video/mp4", "webm": "video/webm",
    "zip": "application/zip", "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}


def handle_mime_type_lookup(files, payload, output_dir) -> ExecutionResult:
    value = _get(payload, "extension", "filename", "text", default="pdf").strip().lower()
    ext = value.rsplit(".", 1)[-1].lstrip(".")
    mime = _MIME_TYPES.get(ext, "application/octet-stream")
    return _j({
        "extension": ext,
        "mime_type": mime,
        "category": mime.split("/", 1)[0],
        "known": ext in _MIME_TYPES,
    }, f".{ext} uses MIME type {mime}.")


def handle_loan_comparison_calculator(files, payload, output_dir) -> ExecutionResult:
    principal = max(0.0, _payload_float(payload, "principal", 500000))
    years = max(0.1, _payload_float(payload, "years", 5))
    rates = [float(token) for token in re.findall(r"\d+(?:\.\d+)?", _get(payload, "rates", default="8.5, 10, 12"))][:8]
    tenure_months = int(years * 12)
    options = []
    for rate in rates:
        monthly_rate = rate / 100 / 12
        if monthly_rate == 0:
            emi = principal / tenure_months
        else:
            emi = principal * monthly_rate * ((1 + monthly_rate) ** tenure_months) / (((1 + monthly_rate) ** tenure_months) - 1)
        total = emi * tenure_months
        options.append({"rate": rate, "emi": round(emi, 2), "total_payment": round(total, 2), "total_interest": round(total - principal, 2)})
    best = min(options, key=lambda item: item["total_payment"]) if options else None
    return _j({
        "principal": principal,
        "years": years,
        "options": options,
        "best_option": best,
    }, f"Compared {len(options)} loan options. Best rate: {best['rate']}%." if best else "No loan options to compare.")


def handle_break_even_calculator(files, payload, output_dir) -> ExecutionResult:
    fixed_cost = _payload_float(payload, "fixed_cost", 100000)
    price = _payload_float(payload, "price_per_unit", 500)
    variable = _payload_float(payload, "variable_cost_per_unit", 250)
    contribution = price - variable
    if contribution <= 0:
        return _j({"error": "Contribution margin must be positive"}, "Price per unit must be greater than variable cost.")
    units = fixed_cost / contribution
    revenue = units * price
    return _j({
        "break_even_units": math.ceil(units),
        "break_even_revenue": round(revenue, 2),
        "contribution_margin": round(contribution, 2),
        "contribution_margin_percent": round(contribution / price * 100, 2) if price else 0,
    }, f"Break-even point: {math.ceil(units)} units.")


def handle_profit_margin_calculator(files, payload, output_dir) -> ExecutionResult:
    cost = _payload_float(payload, "cost", 100)
    selling_price = _payload_float(payload, "selling_price", 150)
    profit = selling_price - cost
    margin = profit / selling_price * 100 if selling_price else 0
    markup = profit / cost * 100 if cost else 0
    return _j({
        "cost": cost,
        "selling_price": selling_price,
        "profit": round(profit, 2),
        "margin_percent": round(margin, 2),
        "markup_percent": round(markup, 2),
        "status": "profit" if profit >= 0 else "loss",
    }, f"Profit margin: {margin:.2f}% ({'profit' if profit >= 0 else 'loss'}).")


def handle_gst_reverse_calculator(files, payload, output_dir) -> ExecutionResult:
    inclusive_amount = _payload_float(payload, "inclusive_amount", 1180)
    gst_rate = _payload_float(payload, "gst_rate", 18)
    base = inclusive_amount / (1 + gst_rate / 100)
    gst = inclusive_amount - base
    return _j({
        "inclusive_amount": round(inclusive_amount, 2),
        "base_amount": round(base, 2),
        "gst_rate": gst_rate,
        "gst_amount": round(gst, 2),
        "cgst": round(gst / 2, 2),
        "sgst": round(gst / 2, 2),
    }, f"Base amount: {base:.2f}, GST: {gst:.2f}.")


def handle_discount_stack_calculator(files, payload, output_dir) -> ExecutionResult:
    price = _payload_float(payload, "price", 1000)
    discounts = [float(token) for token in re.findall(r"\d+(?:\.\d+)?", _get(payload, "discounts", default="10,5"))][:10]
    current = price
    steps = []
    for discount in discounts:
        reduction = current * discount / 100
        current -= reduction
        steps.append({"discount_percent": discount, "saved": round(reduction, 2), "price_after": round(current, 2)})
    total_saved = price - current
    return _j({
        "original_price": price,
        "final_price": round(current, 2),
        "total_saved": round(total_saved, 2),
        "effective_discount_percent": round(total_saved / price * 100, 2) if price else 0,
        "steps": steps,
    }, f"Final price: {current:.2f} after stacked discounts.")


def handle_study_break_planner(files, payload, output_dir) -> ExecutionResult:
    total_minutes = max(15, _payload_int(payload, "total_minutes", 180))
    focus_minutes = max(10, _payload_int(payload, "focus_minutes", 50))
    break_minutes = max(5, _payload_int(payload, "break_minutes", 10))
    start_time = _get(payload, "start_time", default="09:00")
    try:
        current = datetime.strptime(start_time, "%H:%M")
    except ValueError:
        current = datetime.strptime("09:00", "%H:%M")
    elapsed = 0
    schedule = []
    while elapsed < total_minutes:
        focus = min(focus_minutes, total_minutes - elapsed)
        end_focus = current + timedelta(minutes=focus)
        schedule.append({"type": "focus", "start": current.strftime("%H:%M"), "end": end_focus.strftime("%H:%M"), "minutes": focus})
        current = end_focus
        elapsed += focus
        if elapsed >= total_minutes:
            break
        rest = min(break_minutes, total_minutes - elapsed)
        end_break = current + timedelta(minutes=rest)
        schedule.append({"type": "break", "start": current.strftime("%H:%M"), "end": end_break.strftime("%H:%M"), "minutes": rest})
        current = end_break
        elapsed += rest
    return _j({
        "schedule": schedule,
        "total_minutes": total_minutes,
        "focus_blocks": sum(1 for item in schedule if item["type"] == "focus"),
        "end_time": current.strftime("%H:%M"),
    }, f"Created study schedule ending at {current.strftime('%H:%M')}.")


def handle_water_reminder_schedule(files, payload, output_dir) -> ExecutionResult:
    wake_time = _get(payload, "wake_time", default="07:00")
    sleep_time = _get(payload, "sleep_time", default="22:30")
    glasses = max(1, min(_payload_int(payload, "glasses", 8), 30))
    try:
        start = datetime.strptime(wake_time, "%H:%M")
        end = datetime.strptime(sleep_time, "%H:%M")
    except ValueError:
        start = datetime.strptime("07:00", "%H:%M")
        end = datetime.strptime("22:30", "%H:%M")
    if end <= start:
        end += timedelta(days=1)
    interval = (end - start) / max(1, glasses - 1)
    times = [(start + interval * i).strftime("%H:%M") for i in range(glasses)]
    return _j({
        "reminders": times,
        "glasses": glasses,
        "interval_minutes": round(interval.total_seconds() / 60, 1),
    }, f"Generated {glasses} water reminders.")


def handle_workout_plan_generator(files, payload, output_dir) -> ExecutionResult:
    goal = _get(payload, "goal", default="fitness").lower()
    days = max(1, min(_payload_int(payload, "days_per_week", 4), 7))
    level = _get(payload, "level", default="beginner").lower()
    pools = {
        "strength": ["Squats", "Push-ups", "Rows", "Lunges", "Plank", "Hip hinge"],
        "weight_loss": ["Brisk walk", "Bodyweight circuit", "Mountain climbers", "Step-ups", "Jumping jacks", "Core finisher"],
        "fitness": ["Mobility warm-up", "Squats", "Push-ups", "Glute bridge", "Plank", "Easy cardio"],
    }
    exercises = pools.get(goal, pools["fitness"])
    rounds = 2 if level == "beginner" else 3 if level == "intermediate" else 4
    plan = []
    for day in range(1, days + 1):
        chosen = [exercises[(day + i) % len(exercises)] for i in range(4)]
        plan.append({"day": day, "focus": goal.replace("_", " ").title(), "rounds": rounds, "exercises": chosen, "rest": "60-90 seconds"})
    return _j({
        "goal": goal,
        "level": level,
        "days_per_week": days,
        "plan": plan,
        "note": "Warm up before exercise and adjust intensity to your fitness level.",
    }, f"Generated {days}-day workout plan.")


def handle_meal_plan_generator(files, payload, output_dir) -> ExecutionResult:
    calories = max(800, _payload_int(payload, "calories", 2000))
    meals = max(2, min(_payload_int(payload, "meals", 4), 6))
    diet = _get(payload, "diet", default="balanced").lower()
    protein_ratio = 0.25 if diet != "high protein" else 0.35
    fat_ratio = 0.25
    carb_ratio = 1 - protein_ratio - fat_ratio
    meal_names = ["Breakfast", "Lunch", "Snack", "Dinner", "Evening Snack", "Post-workout"]
    per_meal = calories / meals
    plan = []
    for index in range(meals):
        plan.append({
            "meal": meal_names[index],
            "calories": round(per_meal),
            "protein_g": round(per_meal * protein_ratio / 4),
            "carbs_g": round(per_meal * carb_ratio / 4),
            "fat_g": round(per_meal * fat_ratio / 9),
        })
    return _j({
        "daily_calories": calories,
        "diet": diet,
        "meals": plan,
        "macro_split": {"protein_percent": round(protein_ratio * 100), "carbs_percent": round(carb_ratio * 100), "fat_percent": round(fat_ratio * 100)},
    }, f"Generated {meals}-meal plan for {calories} calories.")


def handle_name_initials_generator(files, payload, output_dir) -> ExecutionResult:
    names = [line.strip() for line in _input_text(payload, "names", "text", default="Ishu Kumar\nIndian Student Hub").splitlines() if line.strip()]
    results = []
    for name in names:
        parts = re.findall(r"[A-Za-z0-9]+", name)
        initials = "".join(part[0].upper() for part in parts)
        monogram = initials[:3]
        results.append({"name": name, "initials": initials, "monogram": monogram, "short_name": " ".join(part.capitalize() for part in parts[:2])})
    return _j({
        "results": results,
        "plain_list": "\n".join(item["initials"] for item in results),
    }, f"Generated initials for {len(results)} name{'s' if len(results) != 1 else ''}.")


def handle_acronym_generator(files, payload, output_dir) -> ExecutionResult:
    phrase = _input_text(payload, "phrase", "text", default="Indian Student Hub University Tools")
    words = [w for w in re.findall(r"[A-Za-z0-9]+", phrase) if w.lower() not in {"and", "of", "the", "for", "to", "in"}]
    acronym = "".join(word[0].upper() for word in words)
    variants = [acronym, ".".join(acronym) + ".", acronym.lower(), "-".join(word.lower() for word in words)]
    return _j({
        "phrase": phrase,
        "acronym": acronym,
        "variants": variants,
        "words_used": words,
    }, f"Acronym generated: {acronym}.")


def handle_username_generator(files, payload, output_dir) -> ExecutionResult:
    name = _get(payload, "name", "text", default="Ishu Kumar")
    keyword = _get(payload, "keyword", default="tools")
    count = max(5, min(_payload_int(payload, "count", 12), 50))
    base = re.sub(r"[^a-z0-9]+", "", name.lower()) or "user"
    key = re.sub(r"[^a-z0-9]+", "", keyword.lower())
    random.seed(f"{base}:{key}:{count}")
    variants = []
    patterns = [
        f"{base}{key}", f"{base}_{key}", f"{key}_{base}", f"{base}.official",
        f"the{base}", f"{base}hq", f"{base}{random.randint(10, 9999)}",
    ]
    while len(variants) < count:
        candidate = random.choice(patterns)
        if candidate not in variants:
            variants.append(candidate)
        patterns.append(f"{base}{random.randint(100, 99999)}")
    return _j({
        "usernames": variants,
        "count": len(variants),
        "base": base,
    }, f"Generated {len(variants)} username ideas.")


# ═════════════════════════════════════════════════════════════════════════════
# 28.  PRODUCTION UTILITY BATCH 3
# ═════════════════════════════════════════════════════════════════════════════

def _duration_seconds(payload: dict) -> float:
    duration = _get(payload, "duration", "time", default="")
    if duration:
        parts = [float(part) for part in re.findall(r"\d+(?:\.\d+)?", duration)]
        if ":" in duration and parts:
            total = 0.0
            for part in parts:
                total = total * 60 + part
            return total
        if parts:
            return parts[0]
    return (
        _payload_float(payload, "hours", 0) * 3600
        + _payload_float(payload, "minutes", 0) * 60
        + _payload_float(payload, "seconds", 0)
    )


def _format_duration(total_seconds: float) -> str:
    total = max(0, int(round(total_seconds)))
    hours, rem = divmod(total, 3600)
    minutes, seconds = divmod(rem, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def _extract_youtube_id(url_or_id: str) -> str | None:
    text = url_or_id.strip()
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", text):
        return text
    parsed = urlparse(text if re.match(r"^[a-z][a-z0-9+.-]*://", text, re.I) else "https://" + text)
    query = dict(parse_qsl(parsed.query))
    if "v" in query and re.fullmatch(r"[A-Za-z0-9_-]{11}", query["v"]):
        return query["v"]
    patterns = [
        r"youtu\.be/([A-Za-z0-9_-]{11})",
        r"/embed/([A-Za-z0-9_-]{11})",
        r"/shorts/([A-Za-z0-9_-]{11})",
        r"/live/([A-Za-z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, parsed.geturl())
        if match:
            return match.group(1)
    return None


def handle_youtube_thumbnail_url_generator(files, payload, output_dir) -> ExecutionResult:
    video_id = _extract_youtube_id(_input_text(payload, "url", "video_id", "youtube_url"))
    if not video_id:
        return _j({"error": "Invalid YouTube URL or ID"}, "Enter a valid YouTube URL or 11-character video ID.")
    base = f"https://img.youtube.com/vi/{video_id}"
    thumbnails = {
        "default": f"{base}/default.jpg",
        "medium": f"{base}/mqdefault.jpg",
        "high": f"{base}/hqdefault.jpg",
        "standard": f"{base}/sddefault.jpg",
        "max_resolution": f"{base}/maxresdefault.jpg",
    }
    return _j({
        "video_id": video_id,
        "thumbnails": thumbnails,
        "best_guess": thumbnails["max_resolution"],
    }, "YouTube thumbnail URLs generated.")


def handle_youtube_embed_code_generator(files, payload, output_dir) -> ExecutionResult:
    video_id = _extract_youtube_id(_input_text(payload, "url", "video_id", "youtube_url"))
    if not video_id:
        return _j({"error": "Invalid YouTube URL or ID"}, "Enter a valid YouTube URL or 11-character video ID.")
    start = max(0, _payload_int(payload, "start_seconds", 0))
    autoplay = _payload_bool(payload, "autoplay", False)
    responsive = _payload_bool(payload, "responsive", True)
    params = []
    if start:
        params.append(("start", str(start)))
    if autoplay:
        params.append(("autoplay", "1"))
    src = f"https://www.youtube.com/embed/{video_id}"
    if params:
        src += "?" + urlencode(params)
    iframe = (
        f'<iframe width="560" height="315" src="{src}" title="YouTube video player" '
        'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
        "allowfullscreen></iframe>"
    )
    code = (
        '<div style="position:relative;width:100%;aspect-ratio:16/9;">\n'
        f'  <iframe src="{src}" title="YouTube video player" frameborder="0" allowfullscreen '
        'style="position:absolute;inset:0;width:100%;height:100%;"></iframe>\n'
        "</div>"
        if responsive else iframe
    )
    return _j({"video_id": video_id, "embed_url": src, "embed_code": code, "responsive": responsive}, "YouTube embed code generated.")


def handle_video_aspect_ratio_calculator(files, payload, output_dir) -> ExecutionResult:
    width = max(1, _payload_int(payload, "width", 1920))
    height = max(1, _payload_int(payload, "height", 1080))
    divisor = math.gcd(width, height)
    ratio_w, ratio_h = width // divisor, height // divisor
    ratio_decimal = width / height
    common = {
        "16:9": 16 / 9,
        "9:16": 9 / 16,
        "4:3": 4 / 3,
        "1:1": 1,
        "21:9": 21 / 9,
    }
    closest = min(common.items(), key=lambda item: abs(item[1] - ratio_decimal))[0]
    return _j({
        "width": width,
        "height": height,
        "ratio": f"{ratio_w}:{ratio_h}",
        "decimal": round(ratio_decimal, 6),
        "orientation": "landscape" if width > height else "portrait" if height > width else "square",
        "closest_common_ratio": closest,
    }, f"Aspect ratio: {ratio_w}:{ratio_h}.")


def handle_video_bitrate_calculator(files, payload, output_dir) -> ExecutionResult:
    size_mb = max(0.0, _payload_float(payload, "size_mb", 100))
    duration = max(1.0, _duration_seconds(payload) or 60)
    audio_kbps = max(0.0, _payload_float(payload, "audio_kbps", 128))
    total_kbps = size_mb * 8192 / duration
    video_kbps = max(0.0, total_kbps - audio_kbps)
    return _j({
        "file_size_mb": size_mb,
        "duration_seconds": round(duration, 3),
        "duration": _format_duration(duration),
        "total_bitrate_kbps": round(total_kbps, 2),
        "video_bitrate_kbps": round(video_kbps, 2),
        "audio_bitrate_kbps": audio_kbps,
    }, f"Estimated total bitrate: {total_kbps:.2f} kbps.")


def handle_video_file_size_estimator(files, payload, output_dir) -> ExecutionResult:
    duration = max(1.0, _duration_seconds(payload) or 60)
    video_kbps = max(0.0, _payload_float(payload, "video_kbps", 2500))
    audio_kbps = max(0.0, _payload_float(payload, "audio_kbps", 128))
    total_kbps = video_kbps + audio_kbps
    size_mb = total_kbps * duration / 8192
    return _j({
        "duration_seconds": round(duration, 3),
        "duration": _format_duration(duration),
        "video_kbps": video_kbps,
        "audio_kbps": audio_kbps,
        "total_kbps": total_kbps,
        "estimated_size_mb": round(size_mb, 2),
        "estimated_size_gb": round(size_mb / 1024, 3),
    }, f"Estimated video size: {size_mb:.2f} MB.")


def handle_video_duration_calculator(files, payload, output_dir) -> ExecutionResult:
    duration = max(0.0, _duration_seconds(payload))
    fps = max(0.001, _payload_float(payload, "fps", 30))
    return _j({
        "total_seconds": round(duration, 3),
        "total_minutes": round(duration / 60, 3),
        "total_hours": round(duration / 3600, 3),
        "hh_mm_ss": _format_duration(duration),
        "frames": int(round(duration * fps)),
        "fps": fps,
    }, f"Duration: {_format_duration(duration)}.")


def handle_serp_snippet_preview(files, payload, output_dir) -> ExecutionResult:
    title = _get(payload, "title", default="ISHU TOOLS - Free Online Tools")
    description = _get(payload, "description", default="Use free online tools for students, developers, finance, SEO, images, PDF and more.")
    url = _get(payload, "url", default="https://ishutools.fun/tools")
    title_limit = 60
    desc_limit = 160
    display_title = title if len(title) <= title_limit else title[: title_limit - 1].rstrip() + "…"
    display_description = description if len(description) <= desc_limit else description[: desc_limit - 1].rstrip() + "…"
    return _j({
        "display_title": display_title,
        "display_url": url,
        "display_description": display_description,
        "title_length": len(title),
        "description_length": len(description),
        "title_ok": len(title) <= title_limit,
        "description_ok": len(description) <= desc_limit,
    }, "SERP snippet preview generated.")


def handle_keyword_cluster_generator(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "keywords", "text", default="pdf merge\nmerge pdf online\ncompress pdf\nimage compressor")
    keywords = [line.strip().lower() for line in re.split(r"[\n,]+", raw) if line.strip()]
    clusters: dict[str, list[str]] = {}
    for keyword in keywords:
        tokens = [re.sub(r"s$", "", token) for token in re.findall(r"[a-z0-9]+", keyword) if token not in _KEYWORD_STOPWORDS]
        key = tokens[0] if tokens else "misc"
        if "pdf" in tokens:
            key = "pdf"
        elif "image" in tokens or "photo" in tokens:
            key = "image"
        elif "calculator" in tokens:
            key = "calculator"
        clusters.setdefault(key, []).append(keyword)
    rows = [{"cluster": key, "keywords": values, "count": len(values)} for key, values in sorted(clusters.items())]
    return _j({"clusters": rows, "cluster_count": len(rows), "keyword_count": len(keywords)}, f"Clustered {len(keywords)} keywords into {len(rows)} groups.")


_HEADLINE_POWER_WORDS = {"free", "best", "easy", "proven", "ultimate", "fast", "new", "complete", "simple", "secret", "powerful"}


def handle_headline_analyzer(files, payload, output_dir) -> ExecutionResult:
    headline = _input_text(payload, "headline", "title", "text", default="Best Free Online Tools for Students")
    words = re.findall(r"[A-Za-z0-9']+", headline)
    power = [word for word in words if word.lower() in _HEADLINE_POWER_WORDS]
    length_score = 35 if 6 <= len(words) <= 12 else 25 if 4 <= len(words) <= 15 else 15
    power_score = min(25, len(power) * 8)
    clarity_score = 25 if any(word.lower() in {"tool", "tools", "calculator", "guide", "generator"} for word in words) else 15
    case_score = 15 if headline[:1].isupper() else 8
    score = min(100, length_score + power_score + clarity_score + case_score)
    return _j({
        "headline": headline,
        "score": score,
        "word_count": len(words),
        "character_count": len(headline),
        "power_words": power,
        "tips": [
            "Keep headlines around 6-12 words for clarity.",
            "Use one specific benefit or outcome.",
            "Add a strong word only if it stays truthful.",
        ],
    }, f"Headline score: {score}/100.")


def _json_path_tokens(path: str) -> list[Any]:
    path = path.strip()
    if path.startswith("$"):
        path = path[1:]
    path = path.lstrip(".")
    tokens: list[Any] = []
    for part in re.finditer(r"([A-Za-z_][\w-]*)|\[(\d+)\]", path):
        if part.group(1) is not None:
            tokens.append(part.group(1))
        else:
            tokens.append(int(part.group(2)))
    return tokens


def handle_json_path_extractor(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "json", "data", default='{"user":{"name":"Ishu","scores":[95,100]}}')
    path = _get(payload, "path", default="user.name")
    try:
        current: Any = json.loads(raw)
    except json.JSONDecodeError as exc:
        return _j({"error": str(exc), "line": exc.lineno, "column": exc.colno}, f"Invalid JSON: {exc.msg}")
    try:
        for token in _json_path_tokens(path):
            current = current[token]
    except (KeyError, IndexError, TypeError) as exc:
        return _j({"error": f"Path not found: {path}", "details": str(exc)}, "JSON path not found.")
    return _j({"path": path, "value": current, "value_json": json.dumps(current, indent=2, ensure_ascii=False)}, "JSON path extracted successfully.")


def handle_uuid_validator(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "uuid", "text")
    try:
        parsed = uuid.UUID(raw)
    except (ValueError, AttributeError):
        return _j({"valid": False, "input": raw}, "Invalid UUID.")
    return _j({"valid": True, "uuid": str(parsed), "version": parsed.version, "variant": parsed.variant}, f"Valid UUID v{parsed.version}.")


_ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def _encode_ulid(value: int, length: int) -> str:
    chars = []
    for _ in range(length):
        chars.append(_ULID_ALPHABET[value & 31])
        value >>= 5
    return "".join(reversed(chars))


def handle_ulid_generator(files, payload, output_dir) -> ExecutionResult:
    count = max(1, min(_payload_int(payload, "count", 5), 50))
    timestamp_ms = _payload_int(payload, "timestamp_ms", int(time.time() * 1000))
    ulids = []
    for _ in range(count):
        random_part = random.getrandbits(80)
        ulids.append(_encode_ulid(timestamp_ms, 10) + _encode_ulid(random_part, 16))
    return _j({"ulids": ulids, "count": count, "timestamp_ms": timestamp_ms}, f"Generated {count} ULID{'s' if count != 1 else ''}.")


def handle_ics_calendar_generator(files, payload, output_dir) -> ExecutionResult:
    title = _get(payload, "title", default="ISHU TOOLS Event")
    start_raw = _get(payload, "start", default="2026-01-01 10:00")
    end_raw = _get(payload, "end", default="")
    duration_minutes = max(1, _payload_int(payload, "duration_minutes", 60))
    location = _get(payload, "location", default="")
    description = _get(payload, "description", default="")
    try:
        start = datetime.fromisoformat(start_raw.replace("Z", "+00:00"))
    except ValueError:
        start = datetime.strptime(start_raw, "%Y-%m-%d %H:%M")
    if start.tzinfo is None:
        start = start.replace(tzinfo=timezone.utc)
    if end_raw:
        try:
            end = datetime.fromisoformat(end_raw.replace("Z", "+00:00"))
        except ValueError:
            end = start + timedelta(minutes=duration_minutes)
    else:
        end = start + timedelta(minutes=duration_minutes)
    if end.tzinfo is None:
        end = end.replace(tzinfo=start.tzinfo)
    uid = f"{uuid.uuid4()}@ishutools.fun"
    def dtstamp(dt: datetime) -> str:
        return dt.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    ics = "\n".join([
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ISHU TOOLS//Calendar Generator//EN",
        "BEGIN:VEVENT", f"UID:{uid}", f"DTSTAMP:{dtstamp(datetime.now(timezone.utc))}",
        f"DTSTART:{dtstamp(start)}", f"DTEND:{dtstamp(end)}", f"SUMMARY:{title}",
        f"LOCATION:{location}", f"DESCRIPTION:{description}", "END:VEVENT", "END:VCALENDAR", ""
    ])
    return _j({"ics": ics, "uid": uid, "start_utc": dtstamp(start), "end_utc": dtstamp(end)}, "ICS calendar event generated.")


def handle_vcard_generator(files, payload, output_dir) -> ExecutionResult:
    name = _get(payload, "name", default="Ishu Kumar")
    email = _get(payload, "email", default="hello@example.com")
    phone = _get(payload, "phone", default="")
    org = _get(payload, "organization", "org", default="")
    title = _get(payload, "title", default="")
    url = _get(payload, "url", default="")
    parts = name.split()
    family = parts[-1] if len(parts) > 1 else ""
    given = " ".join(parts[:-1]) if family else name
    vcard = "\n".join([
        "BEGIN:VCARD", "VERSION:3.0", f"N:{family};{given};;;", f"FN:{name}",
        f"ORG:{org}", f"TITLE:{title}", f"EMAIL:{email}", f"TEL:{phone}", f"URL:{url}", "END:VCARD", ""
    ])
    return _j({"vcard": vcard, "name": name, "email": email, "phone": phone}, "vCard contact generated.")


def handle_salary_to_hourly_calculator(files, payload, output_dir) -> ExecutionResult:
    annual = _payload_float(payload, "annual_salary", 600000)
    hours_per_week = max(1, _payload_float(payload, "hours_per_week", 40))
    weeks_per_year = max(1, _payload_float(payload, "weeks_per_year", 52))
    hourly = annual / (hours_per_week * weeks_per_year)
    return _j({"annual_salary": annual, "hourly_rate": round(hourly, 2), "monthly_salary": round(annual / 12, 2), "weekly_salary": round(annual / weeks_per_year, 2)}, f"Hourly rate: {hourly:.2f}.")


def handle_hourly_to_salary_calculator(files, payload, output_dir) -> ExecutionResult:
    hourly = _payload_float(payload, "hourly_rate", 500)
    hours_per_week = max(1, _payload_float(payload, "hours_per_week", 40))
    weeks_per_year = max(1, _payload_float(payload, "weeks_per_year", 52))
    annual = hourly * hours_per_week * weeks_per_year
    return _j({"hourly_rate": hourly, "annual_salary": round(annual, 2), "monthly_salary": round(annual / 12, 2), "weekly_salary": round(hourly * hours_per_week, 2)}, f"Annual salary: {annual:.2f}.")


def handle_debt_payoff_planner(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "debts", default="Card,50000,24,5000\nLoan,200000,12,8000")
    extra = max(0.0, _payload_float(payload, "extra_payment", 2000))
    strategy = _get(payload, "strategy", default="avalanche").lower()
    debts = []
    for line in [ln.strip() for ln in raw.splitlines() if ln.strip()]:
        parts = [p.strip() for p in line.split(",")]
        if len(parts) < 4:
            continue
        try:
            debts.append({"name": parts[0], "balance": float(parts[1]), "rate": float(parts[2]), "minimum": float(parts[3])})
        except ValueError:
            continue
    if not debts:
        return _j({"error": "No valid debts"}, "Enter debts as: name,balance,annual_rate,minimum_payment")
    month = 0
    total_interest = 0.0
    payoff_order = []
    while any(debt["balance"] > 0.01 for debt in debts) and month < 600:
        active = [debt for debt in debts if debt["balance"] > 0.01]
        target = max(active, key=lambda debt: debt["rate"]) if strategy == "avalanche" else min(active, key=lambda debt: debt["balance"])
        for debt in active:
            interest = debt["balance"] * debt["rate"] / 100 / 12
            total_interest += interest
            payment = min(debt["balance"] + interest, debt["minimum"] + (extra if debt is target else 0))
            debt["balance"] = max(0.0, debt["balance"] + interest - payment)
            if debt["balance"] <= 0.01 and debt["name"] not in payoff_order:
                payoff_order.append(debt["name"])
        month += 1
    return _j({"months": month, "years": round(month / 12, 2), "total_interest": round(total_interest, 2), "payoff_order": payoff_order, "strategy": strategy}, f"Debt-free estimate: {month} months.")


def handle_goal_progress_calculator(files, payload, output_dir) -> ExecutionResult:
    current = _payload_float(payload, "current", 40)
    target = _payload_float(payload, "target", 100)
    start = _payload_float(payload, "start", 0)
    daily_rate = _payload_float(payload, "daily_rate", 0)
    total_span = target - start
    progress = (current - start) / total_span * 100 if total_span else 100
    remaining = target - current
    eta_days = math.ceil(remaining / daily_rate) if daily_rate > 0 and remaining > 0 else 0
    return _j({"progress_percent": round(max(0, min(100, progress)), 2), "remaining": round(remaining, 2), "eta_days": eta_days, "current": current, "target": target}, f"Progress: {progress:.2f}%.")


def handle_habit_streak_calculator(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "dates", default="2026-04-20\n2026-04-21\n2026-04-22")
    today_raw = _get(payload, "today", default=datetime.now().date().isoformat())
    dates = sorted({datetime.fromisoformat(d.strip()).date() for d in re.findall(r"\d{4}-\d{2}-\d{2}", raw)})
    today = datetime.fromisoformat(today_raw).date()
    date_set = set(dates)
    current = 0
    cursor = today
    while cursor in date_set:
        current += 1
        cursor -= timedelta(days=1)
    longest = 0
    running = 0
    last = None
    for day in dates:
        running = running + 1 if last and (day - last).days == 1 else 1
        longest = max(longest, running)
        last = day
    return _j({"current_streak": current, "longest_streak": longest, "completed_days": len(dates), "today": today.isoformat()}, f"Current streak: {current} day{'s' if current != 1 else ''}.")


def handle_exam_timetable_generator(files, payload, output_dir) -> ExecutionResult:
    subjects = [s.strip() for s in re.split(r"[\n,]+", _input_text(payload, "subjects", default="Math,Physics,English")) if s.strip()]
    days = max(1, min(_payload_int(payload, "days", 7), 90))
    hours = max(0.5, _payload_float(payload, "daily_hours", 3))
    plan = []
    for day in range(1, days + 1):
        subject = subjects[(day - 1) % len(subjects)] if subjects else "Revision"
        secondary = subjects[day % len(subjects)] if len(subjects) > 1 else "Practice"
        plan.append({"day": day, "primary_subject": subject, "secondary_subject": secondary, "hours": hours, "task": "Concept review + practice questions"})
    return _j({"days": days, "daily_hours": hours, "subjects": subjects, "plan": plan}, f"Generated {days}-day exam timetable.")


def handle_flashcard_csv_generator(files, payload, output_dir) -> ExecutionResult:
    raw = _input_text(payload, "notes", "text", default="HTML: HyperText Markup Language\nCSS: Cascading Style Sheets")
    rows = [["Front", "Back"]]
    for line in [ln.strip() for ln in raw.splitlines() if ln.strip()]:
        if ":" in line:
            front, back = line.split(":", 1)
        elif "-" in line:
            front, back = line.split("-", 1)
        else:
            words = line.split()
            front, back = " ".join(words[: min(5, len(words))]), line
        rows.append([front.strip(), back.strip()])
    out = io.StringIO()
    csv.writer(out, lineterminator="\n").writerows(rows)
    return _j({"csv": out.getvalue(), "card_count": max(0, len(rows) - 1), "preview": rows[:8]}, f"Generated {max(0, len(rows)-1)} flashcards.")


def handle_notes_to_quiz_generator(files, payload, output_dir) -> ExecutionResult:
    text = _input_text(payload, "notes", "text", default="Photosynthesis converts light energy into chemical energy. HTML means HyperText Markup Language.")
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 20][:20]
    questions = []
    for sentence in sentences:
        words = [w for w in re.findall(r"[A-Za-z][A-Za-z0-9-]*", sentence) if len(w) > 5]
        answer = max(words, key=len) if words else sentence.split()[0]
        question = sentence.replace(answer, "_____", 1)
        questions.append({"question": question, "answer": answer, "source": sentence})
    return _j({"questions": questions, "count": len(questions)}, f"Generated {len(questions)} quiz questions.")


def handle_simple_rubric_generator(files, payload, output_dir) -> ExecutionResult:
    assignment = _get(payload, "assignment", default="Essay")
    criteria = [c.strip() for c in re.split(r"[\n,]+", _get(payload, "criteria", default="Content,Organization,Grammar,References")) if c.strip()]
    points = max(1, _payload_int(payload, "points_each", 10))
    rows = []
    for criterion in criteria:
        rows.append({
            "criterion": criterion,
            "excellent": f"{points} pts - clear, complete, accurate",
            "good": f"{round(points * 0.75, 1)} pts - mostly complete",
            "needs_work": f"{round(points * 0.5, 1)} pts - incomplete or unclear",
        })
    return _j({"assignment": assignment, "total_points": points * len(criteria), "rubric": rows}, f"Rubric generated for {assignment}.")


# ═════════════════════════════════════════════════════════════════════════════
# HANDLER MAP
# ═════════════════════════════════════════════════════════════════════════════

WORLDWIDE_HANDLERS: dict = {
    "paraphraser": handle_paraphraser,
    "essay-outline-generator": handle_essay_outline_generator,
    "essay-outline": handle_essay_outline_generator,
    "flashcard-generator": handle_flashcard_generator,
    "flashcards-from-text": handle_flashcard_generator,
    "email-template-generator": handle_email_template_generator,
    "email-generator": handle_email_template_generator,
    "cover-letter-generator": handle_cover_letter_generator,
    "cover-letter": handle_cover_letter_generator,
    "hashtag-generator": handle_hashtag_generator,
    "hashtags": handle_hashtag_generator,
    "sql-formatter": handle_sql_formatter,
    "sql-beautifier": handle_sql_formatter,
    "format-sql": handle_sql_formatter,
    "license-generator": handle_license_generator,
    "open-source-license": handle_license_generator,
    "readme-generator": handle_readme_generator,
    "readme-md-generator": handle_readme_generator,
    "github-actions-generator": handle_github_actions_generator,
    "github-workflow-generator": handle_github_actions_generator,
    "ci-cd-generator": handle_github_actions_generator,
    "nginx-config-generator": handle_nginx_config_generator,
    "nginx-generator": handle_nginx_config_generator,
    "dockerfile-generator": handle_dockerfile_generator,
    "docker-generator": handle_dockerfile_generator,
    "study-schedule-generator": handle_study_schedule_generator,
    "study-planner": handle_study_schedule_generator,
    "study-timetable": handle_study_schedule_generator,
    "social-bio-generator": handle_social_bio_generator,
    "profile-bio-generator": handle_social_bio_generator,
    "instagram-bio-generator": handle_social_bio_generator,
    "invoice-generator": handle_invoice_generator,
    "invoice-maker": handle_invoice_generator,
    "expense-splitter": handle_expense_splitter,
    "bill-splitter": handle_expense_splitter,
    "split-expenses": handle_expense_splitter,
    "blog-outline-generator": handle_blog_outline_generator,
    "blog-post-outline": handle_blog_outline_generator,
    "content-outline-generator": handle_blog_outline_generator,
    "slogan-generator": handle_slogan_generator,
    "tagline-generator": handle_slogan_generator,
    "brand-slogan-generator": handle_slogan_generator,
    "meeting-agenda-generator": handle_meeting_agenda_generator,
    "agenda-generator": handle_meeting_agenda_generator,
    "resume-bullet-generator": handle_resume_bullet_generator,
    "resume-bullet-point-generator": handle_resume_bullet_generator,
    "world-meeting-planner": handle_world_meeting_planner,
    "timezone-meeting-planner": handle_world_meeting_planner,
    "meeting-time-finder": handle_world_meeting_planner,
    "tip-calculator": handle_tip_calculator,
    "restaurant-tip-calculator": handle_tip_calculator,
    "number-to-words": handle_number_to_words,
    "number-words-converter": handle_number_to_words,
    "string-case-converter": handle_string_case_converter,
    "case-converter-advanced": handle_string_case_converter,
    "all-case-converter": handle_string_case_converter,
    "compound-interest-calculator": handle_compound_interest_calculator,
    "compound-interest": handle_compound_interest_calculator,
    "investment-calculator": handle_compound_interest_calculator,
    "user-agent-parser": handle_user_agent_parser,
    "browser-user-agent-parser": handle_user_agent_parser,
    "csv-cleaner": handle_csv_cleaner,
    "clean-csv": handle_csv_cleaner,
    "regex-replace": handle_regex_replace,
    "regex-find-replace": handle_regex_replace,
    "weighted-gpa-calculator": handle_weighted_gpa_calculator,
    "gpa-weighted-calculator": handle_weighted_gpa_calculator,
    "grade-average-calculator": handle_grade_average_calculator,
    "marks-average-calculator": handle_grade_average_calculator,
    "syllabus-study-planner": handle_syllabus_study_planner,
    "study-plan-from-syllabus": handle_syllabus_study_planner,
    "citation-url-cleaner": handle_citation_url_cleaner,
    "clean-citation-url": handle_citation_url_cleaner,
    "url-query-parser": handle_url_query_parser,
    "query-string-parser": handle_url_query_parser,
    "timestamp-converter": handle_timestamp_converter,
    "unix-timestamp-converter": handle_timestamp_converter,
    "markdown-table-generator": handle_markdown_table_generator,
    "csv-to-markdown-table": handle_markdown_table_generator,
    "email-extractor": handle_email_extractor,
    "extract-emails": handle_email_extractor,
    "phone-number-extractor": handle_phone_number_extractor,
    "extract-phone-numbers": handle_phone_number_extractor,
    "keyword-density-checker": handle_keyword_density_checker,
    "keyword-density": handle_keyword_density_checker,
    "robots-txt-generator": handle_robots_txt_generator,
    "robots-generator": handle_robots_txt_generator,
    "meta-description-generator": handle_meta_description_generator,
    "seo-meta-generator": handle_meta_description_generator,
    "utm-builder": handle_utm_builder,
    "html-table-generator": handle_html_table_generator,
    "json-schema-generator": handle_json_schema_generator,
    "css-clamp-generator": handle_css_clamp_generator,
    "slug-bulk-generator": handle_slug_bulk_generator,
    "table-to-csv-converter": handle_table_to_csv_converter,
    "csv-column-extractor": handle_csv_column_extractor,
    "css-specificity-calculator": handle_css_specificity_calculator,
    "http-status-code-lookup": handle_http_status_code_lookup,
    "mime-type-lookup": handle_mime_type_lookup,
    "loan-comparison-calculator": handle_loan_comparison_calculator,
    "break-even-calculator": handle_break_even_calculator,
    "profit-margin-calculator": handle_profit_margin_calculator,
    "gst-reverse-calculator": handle_gst_reverse_calculator,
    "discount-stack-calculator": handle_discount_stack_calculator,
    "study-break-planner": handle_study_break_planner,
    "water-reminder-schedule": handle_water_reminder_schedule,
    "workout-plan-generator": handle_workout_plan_generator,
    "meal-plan-generator": handle_meal_plan_generator,
    "name-initials-generator": handle_name_initials_generator,
    "acronym-generator": handle_acronym_generator,
    "username-generator": handle_username_generator,
    "youtube-thumbnail-url-generator": handle_youtube_thumbnail_url_generator,
    "youtube-embed-code-generator": handle_youtube_embed_code_generator,
    "video-aspect-ratio-calculator": handle_video_aspect_ratio_calculator,
    "video-bitrate-calculator": handle_video_bitrate_calculator,
    "video-file-size-estimator": handle_video_file_size_estimator,
    "video-duration-calculator": handle_video_duration_calculator,
    "serp-snippet-preview": handle_serp_snippet_preview,
    "keyword-cluster-generator": handle_keyword_cluster_generator,
    "headline-analyzer": handle_headline_analyzer,
    "json-path-extractor": handle_json_path_extractor,
    "uuid-validator": handle_uuid_validator,
    "ulid-generator": handle_ulid_generator,
    "ics-calendar-generator": handle_ics_calendar_generator,
    "vcard-generator": handle_vcard_generator,
    "salary-to-hourly-calculator": handle_salary_to_hourly_calculator,
    "hourly-to-salary-calculator": handle_hourly_to_salary_calculator,
    "debt-payoff-planner": handle_debt_payoff_planner,
    "goal-progress-calculator": handle_goal_progress_calculator,
    "habit-streak-calculator": handle_habit_streak_calculator,
    "exam-timetable-generator": handle_exam_timetable_generator,
    "flashcard-csv-generator": handle_flashcard_csv_generator,
    "notes-to-quiz-generator": handle_notes_to_quiz_generator,
    "simple-rubric-generator": handle_simple_rubric_generator,
}

