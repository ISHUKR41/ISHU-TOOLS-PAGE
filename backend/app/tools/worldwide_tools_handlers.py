"""
ISHU TOOLS — Worldwide Utility Tools (v1)
Handlers for globally-useful tools: writing aids, developer generators,
productivity planners, finance calculators, and more.
All pure-Python — no external APIs required.
"""
from __future__ import annotations

import json
import math
import random
import re
import textwrap
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from .handlers import ExecutionResult

# ── shared helpers ────────────────────────────────────────────────────────────

def _j(data: dict, message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)

def _txt(text: str, message: str = "Done", filename: str = "output.txt") -> ExecutionResult:
    out = Path("/tmp") / f"ishu_{filename}"
    out.write_text(text, encoding="utf-8")
    return ExecutionResult(kind="file", file_path=out, filename=filename, message=message)

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
        f"Generated by ISHU TOOLS — ishutools.com"
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

*Generated by [ISHU TOOLS](https://ishutools.com) — Free Online Tools*
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
        f"Generated by ISHU TOOLS — ishutools.com",
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
  Generated by ISHU TOOLS — ishutools.com
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
    summary_lines.append(f"\nGenerated by ISHU TOOLS — ishutools.com")

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
        f"Generated by ISHU TOOLS — ishutools.com",
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
        f"Generated by ISHU TOOLS — ishutools.com",
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
        local_hour = (meeting_hour + (offset - base_offset)) % 24
        am_pm = "AM" if local_hour < 12 else "PM"
        display_hour = local_hour if local_hour <= 12 else local_hour - 12
        if display_hour == 0:
            display_hour = 12
        business = "✅ Business hours" if 8 <= local_hour <= 18 else ("🌙 Evening" if local_hour > 18 else "🌅 Early morning")
        results.append({
            "zone": zone,
            "time": f"{display_hour:02d}:00 {am_pm}",
            "hour_24": local_hour,
            "status": business,
            "utc_offset": f"UTC{'+' if offset >= 0 else ''}{offset:.1f}".replace('.0', ''),
        })

    output_lines = [
        f"WORLD MEETING PLANNER",
        f"Base time: {meeting_hour:02d}:00 {base_zone}",
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
            local = (test_hour + (offset - base_offset)) % 24
            if not (8 <= local <= 18):
                all_good = False
                break
        if all_good:
            good_slots.append(f"{test_hour:02d}:00 {base_zone}")

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
    bill = float(payload.get("bill", 0))
    tip_percent = float(payload.get("tip_percent", 15))
    split = max(int(payload.get("split", 1)), 1)
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
}
