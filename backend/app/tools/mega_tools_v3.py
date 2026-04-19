"""
mega_tools_v3.py — 55 new ISHU TOOLS handlers
All tools fully functional, no external APIs required.
Author: Ishu Kumar (IIT Patna)
"""

from __future__ import annotations
import re
import math
import json
import hashlib
import random
import string
from typing import Any


# ─── Minimal ExecutionResult (avoids circular import) ─────────────────────────
class ExecutionResult:
    def __init__(self, *, success: bool, output: Any, error: str = ""):
        self.success = success
        self.output = output
        self.error = error

    def to_dict(self) -> dict:
        return {"success": self.success, "output": self.output, "error": self.error}


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1: WRITING & TEXT TOOLS (10 tools)
# ══════════════════════════════════════════════════════════════════════════════

def passive_voice_detector(text: str) -> ExecutionResult:
    """Detect passive voice constructions in text."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    # Common passive voice patterns
    be_verbs = r'\b(am|is|are|was|were|be|been|being)\b'
    # Past participle after be verb
    passive_pattern = re.compile(
        r'\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en|[a-z]+t)\b',
        re.IGNORECASE
    )

    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    passive_sentences = []
    active_count = 0

    for i, sent in enumerate(sentences, 1):
        match = passive_pattern.search(sent)
        if match:
            passive_sentences.append({
                "sentence_num": i,
                "sentence": sent[:120] + ("..." if len(sent) > 120 else ""),
                "trigger": match.group(0)
            })
        else:
            active_count += 1

    pct = round(len(passive_sentences) / max(len(sentences), 1) * 100, 1)
    verdict = "Excellent" if pct < 10 else "Good" if pct < 20 else "High — consider rewriting"

    return ExecutionResult(success=True, output={
        "total_sentences": len(sentences),
        "passive_count": len(passive_sentences),
        "active_count": active_count,
        "passive_percentage": pct,
        "verdict": verdict,
        "passive_sentences": passive_sentences[:20],
        "tip": "Aim for less than 10% passive voice. Rewrite: 'was done by X' → 'X did'."
    })


def cliche_detector(text: str) -> ExecutionResult:
    """Detect overused clichés and suggest alternatives."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    CLICHES = {
        "at the end of the day": "ultimately",
        "think outside the box": "think creatively",
        "it is what it is": "[remove or be specific]",
        "the bottom line": "the key point",
        "going forward": "in future",
        "synergy": "collaboration",
        "move the needle": "make progress",
        "low-hanging fruit": "easiest opportunity",
        "circle back": "return to",
        "touch base": "connect",
        "ballpark figure": "rough estimate",
        "in the pipeline": "planned",
        "paradigm shift": "major change",
        "think big picture": "consider the overall goal",
        "not rocket science": "straightforward",
        "reinvent the wheel": "redo unnecessarily",
        "at this point in time": "now",
        "on the same page": "in agreement",
        "take it to the next level": "improve significantly",
        "between a rock and a hard place": "in a difficult situation",
        "bittersweet": "[be specific about the emotions]",
        "cutting edge": "latest",
        "state of the art": "latest",
        "game changer": "significant improvement",
        "hit the ground running": "start quickly",
        "bite the bullet": "proceed despite difficulty",
        "burning the midnight oil": "working late",
        "easier said than done": "[just say it's difficult]",
        "get the ball rolling": "start",
        "the elephant in the room": "the obvious issue",
        "behind the eight ball": "in a difficult position",
        "let the cat out of the bag": "revealed the secret",
        "more than meets the eye": "there's more to it",
        "add insult to injury": "make it worse",
        "break the mold": "be unconventional",
        "bring to the table": "contribute",
        "cost an arm and a leg": "very expensive",
        "devil is in the details": "details matter",
        "leave no stone unturned": "try everything",
        "the best of both worlds": "[be specific]",
        "tip of the iceberg": "small part of a bigger issue",
        "when push comes to shove": "in critical moments",
    }

    text_lower = text.lower()
    found = []
    for cliche, alternative in CLICHES.items():
        if cliche in text_lower:
            # Find original casing
            pattern = re.compile(re.escape(cliche), re.IGNORECASE)
            match = pattern.search(text)
            if match:
                found.append({
                    "cliche": match.group(0),
                    "better": alternative,
                    "context": text[max(0, match.start()-30):match.end()+30]
                })

    return ExecutionResult(success=True, output={
        "cliches_found": len(found),
        "score": f"{max(0, 100 - len(found) * 5)}/100",
        "verdict": "Clean writing!" if len(found) == 0 else "Has clichés — consider revising",
        "cliches": found,
        "tip": "Replace each cliché with a precise, original phrase."
    })


def sentiment_analyzer(text: str) -> ExecutionResult:
    """Analyze sentiment of text (positive/negative/neutral)."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    POSITIVE = {
        "excellent": 3, "amazing": 3, "outstanding": 3, "superb": 3,
        "wonderful": 2, "great": 2, "good": 2, "nice": 2, "happy": 2,
        "love": 2, "perfect": 3, "fantastic": 3, "brilliant": 3,
        "beautiful": 2, "best": 2, "awesome": 3, "positive": 1,
        "helpful": 2, "useful": 2, "effective": 2, "improve": 1,
        "success": 2, "enjoy": 2, "pleased": 2, "delight": 2,
        "recommend": 2, "valuable": 2, "appreciate": 2, "thank": 1,
        "free": 1, "fast": 1, "easy": 1, "simple": 1, "clean": 1,
    }
    NEGATIVE = {
        "terrible": -3, "awful": -3, "horrible": -3, "disgusting": -3,
        "bad": -2, "poor": -2, "worst": -3, "hate": -3, "useless": -3,
        "broken": -2, "fail": -2, "failure": -2, "failed": -2,
        "wrong": -2, "error": -2, "bug": -1, "slow": -1, "difficult": -1,
        "hard": -1, "frustrating": -2, "annoying": -2, "disappoint": -2,
        "problem": -1, "issue": -1, "ugly": -2, "confusing": -2,
        "waste": -2, "never": -1, "spam": -2, "scam": -3,
        "not": -1, "no": -1, "cannot": -2, "can't": -2, "won't": -1,
    }

    words = re.findall(r'\b[a-z]+\b', text.lower())
    score = 0
    pos_words = []
    neg_words = []

    for word in words:
        if word in POSITIVE:
            score += POSITIVE[word]
            pos_words.append(word)
        elif word in NEGATIVE:
            score += NEGATIVE[word]
            neg_words.append(word)

    # Normalize -100 to 100
    word_count = max(len(words), 1)
    normalized = min(100, max(-100, int(score / word_count * 100)))

    if normalized > 20:
        label = "Positive 😊"
    elif normalized < -20:
        label = "Negative 😞"
    else:
        label = "Neutral 😐"

    return ExecutionResult(success=True, output={
        "sentiment": label,
        "score": normalized,
        "scale": "-100 (very negative) to +100 (very positive)",
        "positive_words_found": list(set(pos_words))[:10],
        "negative_words_found": list(set(neg_words))[:10],
        "word_count": len(words),
        "note": "Lexicon-based analysis. Context and nuance may affect accuracy."
    })


def acronym_generator(phrase: str, count: int = 5) -> ExecutionResult:
    """Generate creative acronym meanings for a given acronym or create acronym from phrase."""
    if not phrase.strip():
        return ExecutionResult(success=False, output=None, error="No phrase provided")

    phrase = phrase.strip()

    # If phrase has spaces, create acronym from it
    if ' ' in phrase:
        words = phrase.split()
        acronym = ''.join(w[0].upper() for w in words if w)
        return ExecutionResult(success=True, output={
            "input": phrase,
            "acronym": acronym,
            "type": "phrase_to_acronym",
            "tip": f"Your acronym is '{acronym}'. Use it as a memorable shorthand."
        })

    # If it's an acronym, expand it creatively
    letters = [c.upper() for c in phrase if c.isalpha()]
    if not letters:
        return ExecutionResult(success=False, output=None, error="No letters found in input")

    word_lists = {
        'A': ['Advanced', 'Automated', 'Adaptive', 'Authentic', 'Agile'],
        'B': ['Based', 'Built', 'Better', 'Bold', 'Bridging'],
        'C': ['Creative', 'Collaborative', 'Cutting-edge', 'Central', 'Clear'],
        'D': ['Dynamic', 'Data-driven', 'Dedicated', 'Digital', 'Diverse'],
        'E': ['Enhanced', 'Efficient', 'Expert', 'Evolving', 'Enterprise'],
        'F': ['Fast', 'Flexible', 'Focused', 'Forward', 'Free'],
        'G': ['Global', 'Growing', 'Genuine', 'Goal-driven', 'Great'],
        'H': ['High-performance', 'Human', 'Helpful', 'Hybrid', 'Holistic'],
        'I': ['Innovative', 'Intelligent', 'Integrated', 'Instant', 'Inclusive'],
        'J': ['Joined', 'Just', 'Journey', 'Joyful', 'Jumpstart'],
        'K': ['Knowledge', 'Key', 'Kinetic', 'Keen', 'Knowledgeable'],
        'L': ['Lean', 'Leading', 'Learning', 'Lightweight', 'Leveraged'],
        'M': ['Modern', 'Modular', 'Mission-driven', 'Multi-platform', 'Maximum'],
        'N': ['Next-gen', 'Novel', 'Network', 'Native', 'Nimble'],
        'O': ['Open', 'Optimized', 'Organized', 'On-demand', 'Omni'],
        'P': ['Powerful', 'Precise', 'Platform', 'Proven', 'Progressive'],
        'Q': ['Quality', 'Quick', 'Quantified', 'Quantum', 'Qualified'],
        'R': ['Reliable', 'Robust', 'Real-time', 'Responsive', 'Rapid'],
        'S': ['Smart', 'Scalable', 'Secure', 'Simple', 'Streamlined'],
        'T': ['Tech', 'Targeted', 'Transparent', 'Trusted', 'Transformative'],
        'U': ['Universal', 'Unified', 'Unique', 'User-first', 'Utility'],
        'V': ['Versatile', 'Validated', 'Vision', 'Value', 'Virtual'],
        'W': ['World-class', 'Web', 'Workflow', 'Winning', 'Wide'],
        'X': ['eXtended', 'eXpert', 'eXponential', 'eXclusive', 'eXact'],
        'Y': ['Your', 'Yield-focused', 'Youthful', 'Yet-scalable', 'Yearly'],
        'Z': ['Zero-latency', 'Zeal', 'Zero-cost', 'Zenith', 'Zones'],
    }

    expansions = []
    for _ in range(min(count, 5)):
        expansion = ' '.join(random.choice(word_lists.get(letter, ['X'])) for letter in letters)
        expansions.append(expansion)

    return ExecutionResult(success=True, output={
        "acronym": phrase.upper(),
        "expansions": list(set(expansions))[:5],
        "letter_count": len(letters)
    })


def text_sorter(text: str, order: str = "asc", sort_by: str = "alpha") -> ExecutionResult:
    """Sort lines of text alphabetically, by length, or by word count."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    lines = [line for line in text.splitlines() if line.strip()]

    if sort_by == "length":
        lines.sort(key=len, reverse=(order == "desc"))
    elif sort_by == "word_count":
        lines.sort(key=lambda l: len(l.split()), reverse=(order == "desc"))
    else:  # alpha
        lines.sort(key=str.lower, reverse=(order == "desc"))

    return ExecutionResult(success=True, output={
        "sorted_text": "\n".join(lines),
        "line_count": len(lines),
        "sort_by": sort_by,
        "order": order,
        "original_lines": text.count('\n') + 1
    })


def reading_time_calculator(text: str, wpm: int = 238) -> ExecutionResult:
    """Calculate reading time for a piece of text."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    words = len(text.split())
    chars = len(text)
    sentences = len(re.findall(r'[.!?]+', text))
    paragraphs = len([p for p in text.split('\n\n') if p.strip()])

    minutes = words / wpm
    seconds = int(minutes * 60)

    if seconds < 60:
        time_str = f"{seconds} seconds"
    elif seconds < 3600:
        m = seconds // 60
        s = seconds % 60
        time_str = f"{m} min {s} sec" if s else f"{m} minutes"
    else:
        h = seconds // 3600
        m = (seconds % 3600) // 60
        time_str = f"{h} hour {m} min" if m else f"{h} hours"

    return ExecutionResult(success=True, output={
        "reading_time": time_str,
        "word_count": words,
        "character_count": chars,
        "sentence_count": sentences,
        "paragraph_count": paragraphs,
        "reading_level_wpm": wpm,
        "note": f"Based on average reading speed of {wpm} WPM. Slow reading: ~150 WPM, Fast: ~350 WPM."
    })


def remove_blank_lines(text: str) -> ExecutionResult:
    """Remove all blank lines from text."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    lines = text.splitlines()
    original_count = len(lines)
    non_blank = [l for l in lines if l.strip()]
    removed = original_count - len(non_blank)

    return ExecutionResult(success=True, output={
        "result": "\n".join(non_blank),
        "original_lines": original_count,
        "lines_after": len(non_blank),
        "blank_lines_removed": removed
    })


def longest_shortest_word(text: str) -> ExecutionResult:
    """Find the longest and shortest words in text."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    words = re.findall(r'\b[a-zA-Z]+\b', text)
    if not words:
        return ExecutionResult(success=False, output=None, error="No words found")

    by_length = sorted(set(words), key=len)
    freq = {}
    for w in words:
        freq[w.lower()] = freq.get(w.lower(), 0) + 1

    top_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)

    return ExecutionResult(success=True, output={
        "longest_word": by_length[-1],
        "longest_length": len(by_length[-1]),
        "shortest_word": by_length[0],
        "shortest_length": len(by_length[0]),
        "top_5_longest": by_length[-5:][::-1],
        "top_5_shortest": by_length[:5],
        "most_frequent": [{"word": w, "count": c} for w, c in top_words[:10]],
        "total_words": len(words),
        "unique_words": len(set(w.lower() for w in words))
    })


def vowel_consonant_counter(text: str) -> ExecutionResult:
    """Count vowels, consonants, and other characters."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    VOWELS = set('aeiouAEIOU')
    CONSONANTS = set('bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ')

    vowels = sum(1 for c in text if c in VOWELS)
    consonants = sum(1 for c in text if c in CONSONANTS)
    spaces = text.count(' ')
    digits = sum(1 for c in text if c.isdigit())
    special = len(text) - vowels - consonants - spaces - digits

    return ExecutionResult(success=True, output={
        "vowels": vowels,
        "consonants": consonants,
        "spaces": spaces,
        "digits": digits,
        "special_characters": special,
        "total_characters": len(text),
        "vowel_pct": round(vowels / max(len(text), 1) * 100, 1),
        "consonant_pct": round(consonants / max(len(text), 1) * 100, 1),
        "vowel_consonant_ratio": round(vowels / max(consonants, 1), 2)
    })


def keyword_density_checker(text: str, keywords: str = "") -> ExecutionResult:
    """Calculate keyword density for SEO analysis."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    words = re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())
    total_words = len(words)

    if not total_words:
        return ExecutionResult(success=False, output=None, error="No words found")

    # Count all word frequencies
    freq = {}
    for word in words:
        freq[word] = freq.get(word, 0) + 1

    # Calculate density
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
                  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
                  'should', 'may', 'might', 'shall', 'can', 'this', 'that', 'these', 'those'}

    keyword_density = [
        {"keyword": word, "count": count, "density": round(count / total_words * 100, 2)}
        for word, count in sorted(freq.items(), key=lambda x: x[1], reverse=True)
        if word not in stop_words and count > 1
    ]

    # Specific keyword analysis
    specific = []
    if keywords:
        for kw in re.split(r'[,\n]', keywords):
            kw = kw.strip().lower()
            if kw:
                cnt = text.lower().count(kw)
                specific.append({
                    "keyword": kw,
                    "count": cnt,
                    "density": round(cnt / max(total_words, 1) * 100, 2),
                    "status": "Good (1-3%)" if 1 <= cnt / max(total_words, 1) * 100 <= 3 else
                              "Low (<1%)" if cnt / max(total_words, 1) * 100 < 1 else "High (>3% = may be keyword stuffing)"
                })

    return ExecutionResult(success=True, output={
        "total_words": total_words,
        "top_keywords": keyword_density[:20],
        "specific_keywords": specific,
        "seo_tip": "Ideal keyword density is 1-3%. Higher may be flagged as keyword stuffing."
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2: MATH & SCIENCE TOOLS (10 tools)
# ══════════════════════════════════════════════════════════════════════════════

def prime_factorization(n: int) -> ExecutionResult:
    """Find prime factorization of a number."""
    if n < 2:
        return ExecutionResult(success=False, output=None, error="Enter a number ≥ 2")
    if n > 10**12:
        return ExecutionResult(success=False, output=None, error="Number too large (max 10^12)")

    original = n
    factors = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        factors[n] = factors.get(n, 0) + 1

    factor_list = []
    expression_parts = []
    for p, exp in sorted(factors.items()):
        factor_list.append({"prime": p, "exponent": exp})
        if exp == 1:
            expression_parts.append(str(p))
        else:
            expression_parts.append(f"{p}^{exp}")

    is_prime = len(factors) == 1 and list(factors.values())[0] == 1

    return ExecutionResult(success=True, output={
        "number": original,
        "is_prime": is_prime,
        "prime_factors": factor_list,
        "expression": " × ".join(expression_parts),
        "number_of_prime_factors": len(factors),
        "all_factors_list": sorted(factors.keys())
    })


def quadratic_solver(a: float, b: float, c: float) -> ExecutionResult:
    """Solve quadratic equation ax² + bx + c = 0."""
    if a == 0:
        if b == 0:
            return ExecutionResult(success=False, output=None, error="Not an equation (a=0, b=0)")
        return ExecutionResult(success=True, output={
            "type": "Linear equation",
            "solution": f"x = {-c/b:.4f}",
            "equation": f"{b}x + {c} = 0"
        })

    discriminant = b**2 - 4*a*c
    equation_str = f"{a}x² + {b}x + {c} = 0"

    if discriminant > 0:
        x1 = (-b + math.sqrt(discriminant)) / (2*a)
        x2 = (-b - math.sqrt(discriminant)) / (2*a)
        roots = {"x1": round(x1, 6), "x2": round(x2, 6)}
        nature = "Two real distinct roots"
    elif discriminant == 0:
        x = -b / (2*a)
        roots = {"x1": round(x, 6), "x2": round(x, 6)}
        nature = "One real repeated root"
    else:
        real_part = -b / (2*a)
        imag_part = math.sqrt(-discriminant) / (2*a)
        roots = {
            "x1": f"{round(real_part, 4)} + {round(imag_part, 4)}i",
            "x2": f"{round(real_part, 4)} - {round(imag_part, 4)}i"
        }
        nature = "Two complex conjugate roots"

    return ExecutionResult(success=True, output={
        "equation": equation_str,
        "a": a, "b": b, "c": c,
        "discriminant": round(discriminant, 6),
        "nature": nature,
        "roots": roots,
        "vertex": {"x": round(-b/(2*a), 4), "y": round(c - b**2/(4*a), 4)},
        "formula": "x = (-b ± √(b²-4ac)) / 2a"
    })


def z_score_calculator(value: float, mean: float, std_dev: float) -> ExecutionResult:
    """Calculate Z-score and percentile rank."""
    if std_dev <= 0:
        return ExecutionResult(success=False, output=None, error="Standard deviation must be positive")

    z = (value - mean) / std_dev

    # Approximate CDF using error function
    def norm_cdf(z_val: float) -> float:
        return 0.5 * (1 + math.erf(z_val / math.sqrt(2)))

    percentile = norm_cdf(z) * 100

    interpretation = (
        "Extremely high" if z > 3 else
        "Very high" if z > 2 else
        "Above average" if z > 1 else
        "Slightly above average" if z > 0.5 else
        "Average" if abs(z) <= 0.5 else
        "Slightly below average" if z > -1 else
        "Below average" if z > -2 else
        "Very low" if z > -3 else
        "Extremely low"
    )

    return ExecutionResult(success=True, output={
        "z_score": round(z, 4),
        "percentile": round(percentile, 2),
        "interpretation": interpretation,
        "value": value,
        "mean": mean,
        "std_dev": std_dev,
        "formula": "Z = (X - μ) / σ",
        "meaning": f"This value is {abs(round(z, 2))} standard deviations {'above' if z >= 0 else 'below'} the mean"
    })


def confidence_interval_calculator(
    sample_mean: float, std_dev: float, sample_size: int, confidence_pct: float = 95
) -> ExecutionResult:
    """Calculate confidence interval for a sample mean."""
    if sample_size < 2:
        return ExecutionResult(success=False, output=None, error="Sample size must be ≥ 2")
    if std_dev < 0:
        return ExecutionResult(success=False, output=None, error="Standard deviation cannot be negative")

    # Z-values for common confidence levels
    z_values = {90: 1.645, 95: 1.96, 99: 2.576, 99.9: 3.291}
    z = z_values.get(confidence_pct, 1.96)

    standard_error = std_dev / math.sqrt(sample_size)
    margin_of_error = z * standard_error

    lower = sample_mean - margin_of_error
    upper = sample_mean + margin_of_error

    return ExecutionResult(success=True, output={
        "confidence_level": f"{confidence_pct}%",
        "sample_mean": sample_mean,
        "margin_of_error": round(margin_of_error, 4),
        "lower_bound": round(lower, 4),
        "upper_bound": round(upper, 4),
        "interval": f"({round(lower, 4)}, {round(upper, 4)})",
        "standard_error": round(standard_error, 4),
        "z_value": z,
        "sample_size": sample_size,
        "interpretation": f"We are {confidence_pct}% confident the true population mean lies between {round(lower, 2)} and {round(upper, 2)}"
    })


def sample_size_calculator(
    confidence_pct: float = 95, margin_error_pct: float = 5, population_pct: float = 50
) -> ExecutionResult:
    """Calculate minimum sample size for a survey or study."""
    z_values = {90: 1.645, 95: 1.96, 99: 2.576}
    z = z_values.get(confidence_pct, 1.96)

    p = population_pct / 100
    e = margin_error_pct / 100

    # Cochran's formula
    n0 = (z**2 * p * (1-p)) / (e**2)

    return ExecutionResult(success=True, output={
        "required_sample_size": math.ceil(n0),
        "confidence_level": f"{confidence_pct}%",
        "margin_of_error": f"±{margin_error_pct}%",
        "population_proportion": f"{population_pct}%",
        "formula": "n = (Z² × p × (1-p)) / e²",
        "note": "For finite populations, apply finite correction: n_adj = n0 / (1 + (n0-1)/N)"
    })


def truth_table_generator(expression: str) -> ExecutionResult:
    """Generate truth table for a boolean expression."""
    if not expression.strip():
        return ExecutionResult(success=False, output=None, error="No expression provided")

    # Extract variables (single uppercase letters or words like p, q, r, A, B)
    vars_found = sorted(set(re.findall(r'\b[A-Za-z]\b', expression)))

    if not vars_found or len(vars_found) > 4:
        return ExecutionResult(success=False, output=None,
            error="Use 1-4 variables (single letters like A, B, P, Q)")

    # Normalize expression
    expr = expression.replace('AND', 'and').replace('OR', 'or').replace('NOT', 'not')
    expr = expr.replace('∧', ' and ').replace('∨', ' or ').replace('¬', ' not ')
    expr = expr.replace('&&', ' and ').replace('||', ' or ')

    n = len(vars_found)
    rows = []

    for i in range(2**n):
        values = {}
        for j, var in enumerate(vars_found):
            values[var] = bool((i >> (n - 1 - j)) & 1)

        try:
            result = eval(expr, {"__builtins__": {}}, values)
            rows.append({
                "inputs": {var: values[var] for var in vars_found},
                "result": bool(result)
            })
        except Exception:
            return ExecutionResult(success=False, output=None,
                error="Invalid expression. Use 'and', 'or', 'not' operators.")

    true_count = sum(1 for r in rows if r["result"])

    return ExecutionResult(success=True, output={
        "expression": expression,
        "variables": vars_found,
        "truth_table": rows,
        "tautology": true_count == len(rows),
        "contradiction": true_count == 0,
        "contingency": 0 < true_count < len(rows),
        "true_rows": true_count,
        "total_rows": len(rows)
    })


def number_to_words(number: float, currency: str = "none") -> ExecutionResult:
    """Convert numbers to words (supports up to trillions, Indian system)."""
    try:
        n = int(number)
    except (ValueError, OverflowError):
        return ExecutionResult(success=False, output=None, error="Invalid number")

    if n > 10**15 or n < -10**15:
        return ExecutionResult(success=False, output=None, error="Number too large")

    ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
            'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
            'seventeen', 'eighteen', 'nineteen']
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

    def say(n: int) -> str:
        if n < 20:
            return ones[n]
        elif n < 100:
            return tens[n // 10] + (' ' + ones[n % 10] if n % 10 else '')
        elif n < 1000:
            return ones[n // 100] + ' hundred' + (' ' + say(n % 100) if n % 100 else '')
        elif n < 100000:
            return say(n // 1000) + ' thousand' + (' ' + say(n % 1000) if n % 1000 else '')
        elif n < 10000000:
            return say(n // 100000) + ' lakh' + (' ' + say(n % 100000) if n % 100000 else '')
        elif n < 1000000000:
            return say(n // 10000000) + ' crore' + (' ' + say(n % 10000000) if n % 10000000 else '')
        else:
            return say(n // 1000000000) + ' arab' + (' ' + say(n % 1000000000) if n % 1000000000 else '')

    if n == 0:
        words = "zero"
    elif n < 0:
        words = "minus " + say(-n)
    else:
        words = say(n)

    words = words.strip()
    if currency == "inr":
        words = words.title() + " Rupees Only"
    elif currency == "usd":
        words = words.title() + " Dollars Only"

    return ExecutionResult(success=True, output={
        "number": n,
        "words": words,
        "words_title": words.title() if currency == "none" else words,
        "system": "Indian numbering system (lakh, crore)"
    })


def percentage_calculator_advanced(
    calc_type: str = "percent_of",
    value1: float = 0,
    value2: float = 0
) -> ExecutionResult:
    """Advanced percentage calculations: percent of, change, reverse."""
    results = {}

    if calc_type == "percent_of":
        # What is X% of Y?
        result = (value1 / 100) * value2
        results = {
            "question": f"What is {value1}% of {value2}?",
            "answer": round(result, 4),
            "formula": f"{value1}/100 × {value2} = {round(result, 4)}"
        }
    elif calc_type == "what_percent":
        # X is what percent of Y?
        if value2 == 0:
            return ExecutionResult(success=False, output=None, error="Base value cannot be zero")
        result = (value1 / value2) * 100
        results = {
            "question": f"{value1} is what percent of {value2}?",
            "answer": round(result, 4),
            "answer_str": f"{round(result, 2)}%",
            "formula": f"({value1}/{value2}) × 100 = {round(result, 2)}%"
        }
    elif calc_type == "percent_change":
        # Percent change from X to Y
        if value1 == 0:
            return ExecutionResult(success=False, output=None, error="Original value cannot be zero")
        change = ((value2 - value1) / abs(value1)) * 100
        results = {
            "question": f"Percent change from {value1} to {value2}?",
            "answer": round(change, 4),
            "answer_str": f"{'+' if change >= 0 else ''}{round(change, 2)}%",
            "type": "increase" if change > 0 else "decrease" if change < 0 else "no change",
            "formula": f"(({value2}-{value1})/{abs(value1)}) × 100 = {round(change, 2)}%"
        }
    elif calc_type == "reverse":
        # X is Y% of what number?
        if value2 == 0:
            return ExecutionResult(success=False, output=None, error="Percentage cannot be zero")
        result = value1 / (value2 / 100)
        results = {
            "question": f"{value1} is {value2}% of what number?",
            "answer": round(result, 4),
            "formula": f"{value1} ÷ ({value2}/100) = {round(result, 4)}"
        }
    else:
        # Show all calculations
        if value2 != 0:
            results = {
                "percent_of": round((value1/100) * value2, 4),
                "what_percent": round((value1/value2)*100, 2),
                "percent_change": round(((value2-value1)/abs(value1))*100, 2) if value1 != 0 else None,
                "inputs": {"value1": value1, "value2": value2}
            }

    return ExecutionResult(success=True, output=results)


def css_specificity_calculator(selector: str) -> ExecutionResult:
    """Calculate CSS specificity score for a selector."""
    if not selector.strip():
        return ExecutionResult(success=False, output=None, error="No CSS selector provided")

    selector = selector.strip()

    # Remove pseudo-elements and pseudo-classes for counting (but count them)
    inline_styles = 0  # Would be 1000 if inline style
    ids = len(re.findall(r'#[a-zA-Z_-][a-zA-Z0-9_-]*', selector))
    classes_attrs_pseudoclasses = len(re.findall(
        r'\.[a-zA-Z_-][a-zA-Z0-9_-]*|\[[^\]]+\]|:(?!:)[a-zA-Z-]+',
        selector
    ))
    elements_pseudoelements = len(re.findall(
        r'(?<![.#\[])(?<!\w)[a-zA-Z][a-zA-Z0-9-]*(?!\()|::(?:before|after|first-line|first-letter|selection)',
        selector
    ))

    # Specificity as (a, b, c)
    a = inline_styles
    b = ids
    c = classes_attrs_pseudoclasses
    d = elements_pseudoelements

    score = a * 1000 + b * 100 + c * 10 + d

    return ExecutionResult(success=True, output={
        "selector": selector,
        "specificity": f"({a},{b},{c},{d})",
        "score": score,
        "breakdown": {
            "inline_styles_a": a,
            "id_selectors_b": b,
            "classes_attributes_pseudo_c": c,
            "elements_pseudo_elements_d": d
        },
        "hierarchy": "Inline > ID > Class/Attr/Pseudo-class > Element",
        "tip": "Higher specificity wins. !important overrides all."
    })


def html_entity_encoder(text: str, mode: str = "encode") -> ExecutionResult:
    """Encode or decode HTML entities."""
    if not text.strip():
        return ExecutionResult(success=False, output=None, error="No text provided")

    ENCODE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '©': '&copy;',
        '®': '&reg;',
        '™': '&trade;',
        '€': '&euro;',
        '£': '&pound;',
        '¥': '&yen;',
        '₹': '&#8377;',
        '…': '&hellip;',
        '—': '&mdash;',
        '–': '&ndash;',
        '→': '&rarr;',
        '←': '&larr;',
        '↑': '&uarr;',
        '↓': '&darr;',
    }
    DECODE_MAP = {v: k for k, v in ENCODE_MAP.items()}

    if mode == "encode":
        result = text
        for char, entity in sorted(ENCODE_MAP.items(), key=lambda x: -len(x[0])):
            result = result.replace(char, entity)
    else:
        result = text
        for entity, char in sorted(DECODE_MAP.items(), key=lambda x: -len(x[0])):
            result = result.replace(entity, char)

    return ExecutionResult(success=True, output={
        "original": text,
        "result": result,
        "mode": mode,
        "changes": sum(1 for a, b in zip(text, result) if a != b)
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3: HEALTH & FITNESS TOOLS (8 tools)
# ══════════════════════════════════════════════════════════════════════════════

def waist_hip_ratio(waist_cm: float, hip_cm: float, gender: str = "male") -> ExecutionResult:
    """Calculate waist-to-hip ratio and health risk assessment."""
    if waist_cm <= 0 or hip_cm <= 0:
        return ExecutionResult(success=False, output=None, error="Measurements must be positive")

    whr = waist_cm / hip_cm

    if gender.lower() in ("male", "m"):
        if whr < 0.90:
            risk = "Low"
            shape = "Pear"
        elif whr < 1.00:
            risk = "Moderate"
            shape = "Apple"
        else:
            risk = "High"
            shape = "Apple (obese)"
    else:  # female
        if whr < 0.80:
            risk = "Low"
            shape = "Pear"
        elif whr < 0.85:
            risk = "Moderate"
            shape = "Apple"
        else:
            risk = "High"
            shape = "Apple (obese)"

    return ExecutionResult(success=True, output={
        "whr": round(whr, 3),
        "waist_cm": waist_cm,
        "hip_cm": hip_cm,
        "gender": gender,
        "health_risk": risk,
        "body_shape": shape,
        "ideal_whr": "< 0.90 (male) / < 0.80 (female)",
        "interpretation": f"Your WHR of {round(whr, 2)} indicates {risk.lower()} health risk",
        "note": "WHR is an indicator of abdominal obesity and cardiovascular risk."
    })


def alcohol_units_calculator(
    drink_type: str = "beer",
    volume_ml: float = 500,
    abv_pct: float = 5.0
) -> ExecutionResult:
    """Calculate alcohol units and safe consumption guidance."""
    # 1 unit = 10ml pure alcohol (UK standard)
    units = (volume_ml * abv_pct / 100) / 10

    drink_defaults = {
        "beer": {"abv": 4.5, "volume": 500, "name": "Pint of beer"},
        "wine": {"abv": 12.5, "volume": 175, "name": "Glass of wine"},
        "spirits": {"abv": 40, "volume": 25, "name": "Single spirit shot"},
        "cider": {"abv": 5, "volume": 500, "name": "Pint of cider"},
        "champagne": {"abv": 12, "volume": 125, "name": "Glass of champagne"},
        "custom": {"abv": abv_pct, "volume": volume_ml, "name": "Custom drink"},
    }

    drink_info = drink_defaults.get(drink_type.lower(), drink_defaults["custom"])

    # Health guidelines (UK NHS): 14 units/week for men and women
    weekly_limit = 14
    pct_weekly = round(units / weekly_limit * 100, 1)

    # Metabolism: about 1 unit per hour for average adult
    sober_hours = round(units, 1)

    return ExecutionResult(success=True, output={
        "drink": drink_type,
        "volume_ml": volume_ml,
        "abv_pct": abv_pct,
        "alcohol_units": round(units, 2),
        "alcohol_grams": round(units * 8, 1),  # 1 unit = 8g (WHO standard)
        "percent_of_weekly_limit": pct_weekly,
        "hours_to_sober": sober_hours,
        "weekly_limit": f"{weekly_limit} units",
        "guidance": "Drink responsibly. Drive only when completely sober.",
        "note": "Formula: Volume(ml) × ABV(%) / 1000 = Units"
    })


def tdee_calculator(
    weight_kg: float, height_cm: float, age: int,
    gender: str = "male", activity_level: str = "moderate"
) -> ExecutionResult:
    """Calculate Total Daily Energy Expenditure (TDEE)."""
    if weight_kg <= 0 or height_cm <= 0 or age <= 0:
        return ExecutionResult(success=False, output=None, error="All values must be positive")

    # Mifflin-St Jeor BMR equation
    if gender.lower() in ("male", "m"):
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161

    activity_multipliers = {
        "sedentary": 1.2,       # Little or no exercise
        "light": 1.375,          # Light exercise 1-3 days/week
        "moderate": 1.55,        # Moderate exercise 3-5 days/week
        "active": 1.725,         # Hard exercise 6-7 days/week
        "very_active": 1.9       # Very hard exercise, physical job
    }

    multiplier = activity_multipliers.get(activity_level.lower(), 1.55)
    tdee = bmr * multiplier

    return ExecutionResult(success=True, output={
        "bmr_calories": round(bmr),
        "tdee_calories": round(tdee),
        "activity_level": activity_level,
        "gender": gender,
        "weight_kg": weight_kg,
        "height_cm": height_cm,
        "age": age,
        "goals": {
            "lose_weight_0.5kg_week": round(tdee - 500),
            "lose_weight_1kg_week": round(tdee - 1000),
            "maintain": round(tdee),
            "gain_muscle_0.5kg_week": round(tdee + 250),
            "gain_weight_0.5kg_week": round(tdee + 500),
        },
        "note": "1 kg fat ≈ 7700 calories. Deficit of 500 cal/day → ~0.5 kg loss/week"
    })


def intermittent_fasting_calculator(
    eating_start: str = "12:00",
    protocol: str = "16:8"
) -> ExecutionResult:
    """Calculate intermittent fasting windows."""
    protocols = {
        "16:8": {"fast": 16, "eat": 8, "desc": "Most popular. Fast 16 hours, eat within 8-hour window"},
        "18:6": {"fast": 18, "eat": 6, "desc": "Moderate. Fast 18 hours, eat within 6-hour window"},
        "20:4": {"fast": 20, "eat": 4, "desc": "Aggressive. Fast 20 hours, eat within 4-hour window"},
        "omad": {"fast": 23, "eat": 1, "desc": "One Meal A Day. Most intense, 23-hour fast"},
        "5:2": {"fast": None, "eat": None, "desc": "5 normal eating days, 2 fasting days (500 kcal)"},
    }

    info = protocols.get(protocol, protocols["16:8"])

    if info["fast"] is None:
        return ExecutionResult(success=True, output={
            "protocol": protocol,
            "description": info["desc"],
            "schedule": "Mon-Fri: Normal eating. Sat-Sun (or any 2 days): Max 500-600 calories",
            "benefits": ["Weight loss", "Metabolic health", "Insulin sensitivity"]
        })

    # Calculate windows based on eating start time
    try:
        start_hour, start_min = map(int, eating_start.split(":"))
    except ValueError:
        return ExecutionResult(success=False, output=None, error="Use format HH:MM (e.g., 12:00)")

    eating_start_mins = start_hour * 60 + start_min
    eating_end_mins = eating_start_mins + info["eat"] * 60
    fast_end_mins = eating_start_mins  # Fast ends when eating begins

    def mins_to_time(m: int) -> str:
        m = m % (24 * 60)
        h = m // 60
        mn = m % 60
        return f"{h:02d}:{mn:02d}"

    eating_end = mins_to_time(eating_end_mins)
    fast_start = eating_end
    fast_end = eating_start

    return ExecutionResult(success=True, output={
        "protocol": protocol,
        "description": info["desc"],
        "eating_window": f"{eating_start} to {eating_end} ({info['eat']} hours)",
        "fasting_window": f"{fast_start} to {fast_end} ({info['fast']} hours)",
        "recommended_meals": "1-2 meals or 2-3 depending on window size",
        "benefits": ["Fat loss", "Autophagy activation", "Insulin sensitivity", "Mental clarity"],
        "tips": [
            "Drink water, black coffee, or plain tea during fasting",
            "Break fast with protein + vegetables",
            "Avoid processed foods in eating window"
        ],
        "note": "Consult a doctor before starting IF if you have any medical conditions."
    })


def blood_pressure_analyzer(systolic: int, diastolic: int, age: int = 35) -> ExecutionResult:
    """Analyze blood pressure readings and provide health guidance."""
    if systolic < 70 or systolic > 250 or diastolic < 40 or diastolic > 150:
        return ExecutionResult(success=False, output=None, error="Invalid blood pressure values")

    # American Heart Association categories
    if systolic < 120 and diastolic < 80:
        category = "Normal"
        action = "Maintain healthy lifestyle"
        color = "green"
    elif systolic < 130 and diastolic < 80:
        category = "Elevated"
        action = "Lifestyle changes recommended"
        color = "yellow"
    elif systolic < 140 or diastolic < 90:
        category = "High Blood Pressure Stage 1"
        action = "Consult a doctor. Lifestyle + possible medication"
        color = "orange"
    elif systolic < 180 and diastolic < 120:
        category = "High Blood Pressure Stage 2"
        action = "See a doctor soon. Medication likely needed"
        color = "red"
    else:
        category = "Hypertensive Crisis"
        action = "SEEK EMERGENCY MEDICAL CARE IMMEDIATELY"
        color = "darkred"

    pulse_pressure = systolic - diastolic
    map_value = diastolic + (pulse_pressure / 3)

    return ExecutionResult(success=True, output={
        "reading": f"{systolic}/{diastolic} mmHg",
        "category": category,
        "action": action,
        "pulse_pressure": pulse_pressure,
        "mean_arterial_pressure": round(map_value, 1),
        "normal_range": "120/80 mmHg or lower",
        "lifestyle_tips": [
            "Reduce sodium intake (< 2300mg/day)",
            "Regular aerobic exercise (150 min/week)",
            "Maintain healthy weight",
            "Limit alcohol",
            "Quit smoking",
            "Manage stress"
        ],
        "disclaimer": "This is educational only. For medical advice, consult a healthcare professional."
    })


def running_pace_calculator(
    distance_km: float = 5,
    time_minutes: float = 25,
    goal: str = "pace"
) -> ExecutionResult:
    """Calculate running pace, speed, and race time predictions."""
    if distance_km <= 0 or time_minutes <= 0:
        return ExecutionResult(success=False, output=None, error="Values must be positive")

    pace_min_per_km = time_minutes / distance_km
    speed_kmh = distance_km / (time_minutes / 60)

    pace_min = int(pace_min_per_km)
    pace_sec = int((pace_min_per_km - pace_min) * 60)

    # Predict race times using Riegel formula (T2 = T1 × (D2/D1)^1.06)
    def predict_time(target_km: float) -> str:
        t = time_minutes * (target_km / distance_km) ** 1.06
        h = int(t // 60)
        m = int(t % 60)
        s = int((t - int(t)) * 60)
        if h > 0:
            return f"{h}h {m:02d}m {s:02d}s"
        return f"{m}m {s:02d}s"

    return ExecutionResult(success=True, output={
        "your_pace": f"{pace_min}:{pace_sec:02d} min/km",
        "speed_kmh": round(speed_kmh, 2),
        "speed_mph": round(speed_kmh * 0.621371, 2),
        "distance_km": distance_km,
        "time": f"{int(time_minutes)}m {int((time_minutes % 1) * 60)}s",
        "race_predictions": {
            "1km": predict_time(1),
            "5km": predict_time(5),
            "10km": predict_time(10),
            "21.1km_half_marathon": predict_time(21.1),
            "42.2km_full_marathon": predict_time(42.2),
        },
        "calories_burned": round(distance_km * 65 * 0.9),  # ~65 cal/km for 70kg person
        "pace_zones": {
            "easy": f"{int(pace_min_per_km * 1.2)}:{int(((pace_min_per_km * 1.2) % 1) * 60):02d} min/km",
            "tempo": f"{int(pace_min_per_km * 0.95)}:{int(((pace_min_per_km * 0.95) % 1) * 60):02d} min/km",
            "interval": f"{int(pace_min_per_km * 0.90)}:{int(((pace_min_per_km * 0.90) % 1) * 60):02d} min/km",
        }
    })


def protein_intake_calculator(
    weight_kg: float, goal: str = "maintain",
    activity_level: str = "moderate", age: int = 25
) -> ExecutionResult:
    """Calculate daily protein intake requirements."""
    if weight_kg <= 0:
        return ExecutionResult(success=False, output=None, error="Weight must be positive")

    # Protein recommendations (g per kg body weight)
    protein_per_kg = {
        "sedentary": {"lose": 1.4, "maintain": 0.8, "gain": 1.2},
        "moderate": {"lose": 1.6, "maintain": 1.2, "gain": 1.6},
        "active": {"lose": 1.8, "maintain": 1.4, "gain": 2.0},
        "athlete": {"lose": 2.0, "maintain": 1.6, "gain": 2.2},
    }

    multiplier = protein_per_kg.get(activity_level, protein_per_kg["moderate"]).get(goal, 1.2)
    daily_protein = weight_kg * multiplier

    # Adjust for age
    if age > 65:
        daily_protein *= 1.2  # Older adults need more protein

    protein_cals = daily_protein * 4  # 4 kcal per gram of protein

    food_sources = [
        {"food": "Chicken breast (100g)", "protein_g": 31},
        {"food": "Eggs (1 large)", "protein_g": 6},
        {"food": "Dal/Lentils (100g cooked)", "protein_g": 9},
        {"food": "Paneer (100g)", "protein_g": 18},
        {"food": "Greek yogurt (200g)", "protein_g": 20},
        {"food": "Whey protein (1 scoop 30g)", "protein_g": 24},
        {"food": "Soya chunks (50g dry)", "protein_g": 26},
        {"food": "Tofu (100g)", "protein_g": 8},
        {"food": "Rajma/Kidney beans (100g cooked)", "protein_g": 9},
        {"food": "Almonds (30g)", "protein_g": 6},
    ]

    return ExecutionResult(success=True, output={
        "daily_protein_g": round(daily_protein),
        "per_kg_multiplier": multiplier,
        "calories_from_protein": round(protein_cals),
        "goal": goal,
        "activity_level": activity_level,
        "weight_kg": weight_kg,
        "meals_guide": {
            "breakfast": round(daily_protein * 0.25),
            "lunch": round(daily_protein * 0.35),
            "dinner": round(daily_protein * 0.30),
            "snacks": round(daily_protein * 0.10),
        },
        "protein_rich_foods": food_sources,
        "note": "Spread protein intake across 3-4 meals for better absorption (max ~40g per meal)."
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4: FINANCE & BUSINESS TOOLS (8 tools)
# ══════════════════════════════════════════════════════════════════════════════

def break_even_calculator(
    fixed_costs: float, variable_cost_per_unit: float,
    selling_price_per_unit: float
) -> ExecutionResult:
    """Calculate break-even point for a business."""
    if selling_price_per_unit <= variable_cost_per_unit:
        return ExecutionResult(success=False, output=None,
            error="Selling price must be greater than variable cost per unit")
    if fixed_costs < 0 or variable_cost_per_unit < 0:
        return ExecutionResult(success=False, output=None, error="Costs cannot be negative")

    contribution_margin = selling_price_per_unit - variable_cost_per_unit
    cm_ratio = contribution_margin / selling_price_per_unit

    bep_units = fixed_costs / contribution_margin
    bep_revenue = fixed_costs / cm_ratio

    return ExecutionResult(success=True, output={
        "break_even_units": math.ceil(bep_units),
        "break_even_revenue": round(bep_revenue, 2),
        "contribution_margin_per_unit": round(contribution_margin, 2),
        "contribution_margin_ratio_pct": round(cm_ratio * 100, 2),
        "fixed_costs": fixed_costs,
        "variable_cost_per_unit": variable_cost_per_unit,
        "selling_price_per_unit": selling_price_per_unit,
        "profit_at_2x_break_even": round((bep_units * 2 * selling_price_per_unit) -
                                          (fixed_costs + bep_units * 2 * variable_cost_per_unit), 2),
        "formula": "BEP Units = Fixed Costs ÷ (Price - Variable Cost)"
    })


def debt_to_income_ratio(monthly_income: float, monthly_debt_payments: float) -> ExecutionResult:
    """Calculate debt-to-income ratio for loan eligibility."""
    if monthly_income <= 0:
        return ExecutionResult(success=False, output=None, error="Income must be positive")

    dti = (monthly_debt_payments / monthly_income) * 100

    if dti < 20:
        status = "Excellent"
        advice = "You have very low debt. Excellent financial health."
    elif dti < 30:
        status = "Good"
        advice = "Good DTI. Most lenders will approve loans."
    elif dti < 43:
        status = "Acceptable"
        advice = "Acceptable for most mortgage approvals. Reduce debt if possible."
    elif dti < 50:
        status = "Poor"
        advice = "High DTI. Most lenders will be cautious. Work on reducing debt."
    else:
        status = "Very Poor"
        advice = "Very high DTI. Loan approval unlikely. Urgent debt reduction needed."

    max_additional_emi = monthly_income * 0.40 - monthly_debt_payments

    return ExecutionResult(success=True, output={
        "dti_percentage": round(dti, 2),
        "status": status,
        "monthly_income": monthly_income,
        "monthly_debt_payments": monthly_debt_payments,
        "advice": advice,
        "max_additional_emi_you_can_take": round(max_additional_emi, 2),
        "lender_limit": "Most banks prefer DTI < 40-45%",
        "formula": "DTI = (Total Monthly Debt Payments / Gross Monthly Income) × 100"
    })


def fixed_deposit_calculator(
    principal: float, annual_rate: float, tenure_months: int,
    compound_freq: str = "quarterly"
) -> ExecutionResult:
    """Calculate Fixed Deposit maturity amount."""
    if principal <= 0 or annual_rate <= 0 or tenure_months <= 0:
        return ExecutionResult(success=False, output=None, error="All values must be positive")

    freq_map = {"monthly": 12, "quarterly": 4, "half_yearly": 2, "yearly": 1, "simple": 0}
    n = freq_map.get(compound_freq.lower(), 4)

    r = annual_rate / 100
    t = tenure_months / 12

    if n == 0:  # Simple interest
        interest = principal * r * t
        maturity = principal + interest
    else:
        maturity = principal * (1 + r/n) ** (n * t)
        interest = maturity - principal

    # TDS (Tax Deduction at Source): 10% if interest > ₹40,000/year
    tds_applicable = interest > 40000
    tds = interest * 0.10 if tds_applicable else 0

    return ExecutionResult(success=True, output={
        "principal": round(principal, 2),
        "interest_earned": round(interest, 2),
        "maturity_amount": round(maturity, 2),
        "effective_yield_pct": round((interest / principal) * 100, 2),
        "annual_rate_pct": annual_rate,
        "tenure_months": tenure_months,
        "tenure_years": round(t, 2),
        "compounding": compound_freq,
        "tds_applicable": tds_applicable,
        "tds_amount": round(tds, 2),
        "post_tds_maturity": round(maturity - tds, 2),
        "note": "TDS of 10% applies when annual interest > ₹40,000 (India). Submit Form 15G/H to avoid."
    })


def sip_calculator(
    monthly_amount: float, annual_return_pct: float,
    tenure_years: int, step_up_pct: float = 0
) -> ExecutionResult:
    """Calculate SIP (Systematic Investment Plan) returns with optional step-up."""
    if monthly_amount <= 0 or annual_return_pct <= 0 or tenure_years <= 0:
        return ExecutionResult(success=False, output=None, error="All values must be positive")

    monthly_rate = annual_return_pct / 12 / 100
    total_months = tenure_years * 12

    if step_up_pct == 0:
        # Standard SIP formula
        n = total_months
        fv = monthly_amount * (((1 + monthly_rate) ** n - 1) / monthly_rate) * (1 + monthly_rate)
        total_invested = monthly_amount * n
    else:
        # Step-up SIP (annual increase)
        fv = 0
        total_invested = 0
        current_sip = monthly_amount
        for year in range(tenure_years):
            months_left = (tenure_years - year) * 12
            fv += current_sip * (((1 + monthly_rate) ** 12 - 1) / monthly_rate) * (1 + monthly_rate) * (1 + monthly_rate) ** (months_left - 12)
            total_invested += current_sip * 12
            current_sip *= (1 + step_up_pct / 100)

    wealth_gained = fv - total_invested

    return ExecutionResult(success=True, output={
        "monthly_sip": monthly_amount,
        "total_invested": round(total_invested),
        "estimated_returns": round(wealth_gained),
        "total_value": round(fv),
        "return_multiple": round(fv / total_invested, 2),
        "annual_return_pct": annual_return_pct,
        "tenure_years": tenure_years,
        "step_up_pct": step_up_pct,
        "note": "Mutual fund returns are market-linked and not guaranteed. Past performance ≠ future results."
    })


def roi_calculator(
    initial_investment: float, final_value: float,
    time_years: float = 1
) -> ExecutionResult:
    """Calculate Return on Investment (ROI) and CAGR."""
    if initial_investment <= 0:
        return ExecutionResult(success=False, output=None, error="Investment must be positive")

    net_profit = final_value - initial_investment
    roi = (net_profit / initial_investment) * 100

    # CAGR for multi-year investments
    if time_years > 0:
        cagr = ((final_value / initial_investment) ** (1 / time_years) - 1) * 100
    else:
        cagr = roi

    return ExecutionResult(success=True, output={
        "initial_investment": round(initial_investment, 2),
        "final_value": round(final_value, 2),
        "net_profit": round(net_profit, 2),
        "roi_pct": round(roi, 2),
        "cagr_pct": round(cagr, 2),
        "time_years": time_years,
        "verdict": "Profit" if net_profit > 0 else "Loss" if net_profit < 0 else "Break Even",
        "formula": "ROI = (Final Value - Initial Investment) / Initial Investment × 100"
    })


def compound_interest_detailed(
    principal: float, annual_rate: float, time_years: float,
    n_per_year: int = 12, monthly_addition: float = 0
) -> ExecutionResult:
    """Detailed compound interest with optional monthly contributions."""
    if principal < 0 or annual_rate <= 0 or time_years <= 0:
        return ExecutionResult(success=False, output=None, error="Invalid inputs")

    r = annual_rate / 100
    n = n_per_year

    # Compound interest on principal
    ci_principal = principal * (1 + r/n) ** (n * time_years)

    # Future value of monthly contributions (ordinary annuity)
    if monthly_addition > 0:
        monthly_rate = r / 12
        months = time_years * 12
        ci_contributions = monthly_addition * (((1 + monthly_rate) ** months - 1) / monthly_rate)
    else:
        ci_contributions = 0

    total_fv = ci_principal + ci_contributions
    total_contributions = principal + monthly_addition * time_years * 12
    total_interest = total_fv - total_contributions

    return ExecutionResult(success=True, output={
        "principal": round(principal, 2),
        "annual_rate_pct": annual_rate,
        "time_years": time_years,
        "monthly_addition": monthly_addition,
        "total_invested": round(total_contributions, 2),
        "interest_earned": round(total_interest, 2),
        "final_amount": round(total_fv, 2),
        "effective_annual_rate": round((((1 + r/n)**n) - 1) * 100, 4),
        "doubling_time_years": round(72 / annual_rate, 1),
        "note": "Rule of 72: Years to double = 72 / Annual Rate (%)"
    })


def currency_converter_formula(amount: float, from_currency: str = "USD", to_currency: str = "INR") -> ExecutionResult:
    """Currency conversion using approximate rates (educational purposes)."""
    # Approximate rates as of 2026 (not real-time)
    rates_to_usd = {
        "USD": 1.0, "INR": 0.012, "EUR": 1.08, "GBP": 1.27, "JPY": 0.0065,
        "AUD": 0.65, "CAD": 0.73, "CHF": 1.12, "CNY": 0.138, "SGD": 0.74,
        "AED": 0.272, "SAR": 0.267, "MYR": 0.213, "THB": 0.027, "BDT": 0.0091,
        "PKR": 0.0036, "LKR": 0.003, "NPR": 0.0075, "IDR": 0.000064, "PHP": 0.017,
    }

    from_c = from_currency.upper()
    to_c = to_currency.upper()

    if from_c not in rates_to_usd or to_c not in rates_to_usd:
        available = ", ".join(rates_to_usd.keys())
        return ExecutionResult(success=False, output=None,
            error=f"Unsupported currency. Available: {available}")

    # Convert via USD
    amount_usd = amount * rates_to_usd[from_c]
    converted = amount_usd / rates_to_usd[to_c]

    return ExecutionResult(success=True, output={
        "original": f"{amount} {from_c}",
        "converted": round(converted, 4),
        "converted_display": f"{round(converted, 2)} {to_c}",
        "rate": f"1 {from_c} = {round(1 / rates_to_usd[to_c] * rates_to_usd[from_c], 4)} {to_c}",
        "note": "Approximate educational rates. For live rates use xe.com or your bank."
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 5: DEVELOPER & TECHNICAL TOOLS (9 tools)
# ══════════════════════════════════════════════════════════════════════════════

def http_status_code_lookup(code: int = 0, search: str = "") -> ExecutionResult:
    """Look up HTTP status codes and their meanings."""
    STATUS_CODES = {
        100: {"name": "Continue", "meaning": "Request received, continue sending"},
        101: {"name": "Switching Protocols", "meaning": "Server agrees to switch protocol"},
        200: {"name": "OK", "meaning": "Request succeeded. Standard response for GET/POST"},
        201: {"name": "Created", "meaning": "Request succeeded and a new resource was created (POST/PUT)"},
        202: {"name": "Accepted", "meaning": "Request accepted but not yet processed"},
        204: {"name": "No Content", "meaning": "Request succeeded but no response body (DELETE)"},
        206: {"name": "Partial Content", "meaning": "Partial GET request fulfilled (Range requests)"},
        301: {"name": "Moved Permanently", "meaning": "Resource permanently moved to new URL"},
        302: {"name": "Found (Temporary Redirect)", "meaning": "Resource temporarily at different URL"},
        304: {"name": "Not Modified", "meaning": "Cached version still valid (If-None-Match)"},
        307: {"name": "Temporary Redirect", "meaning": "Request must repeat at different URL, same method"},
        308: {"name": "Permanent Redirect", "meaning": "Permanent redirect, same method as original"},
        400: {"name": "Bad Request", "meaning": "Server cannot understand request (malformed syntax)"},
        401: {"name": "Unauthorized", "meaning": "Authentication required. Not logged in or token expired"},
        403: {"name": "Forbidden", "meaning": "Server refuses. Authenticated but no permission"},
        404: {"name": "Not Found", "meaning": "Resource doesn't exist at this URL"},
        405: {"name": "Method Not Allowed", "meaning": "HTTP method not supported for this endpoint"},
        408: {"name": "Request Timeout", "meaning": "Server timed out waiting for request"},
        409: {"name": "Conflict", "meaning": "Request conflicts with current state (duplicate key)"},
        410: {"name": "Gone", "meaning": "Resource permanently deleted (unlike 404)"},
        413: {"name": "Payload Too Large", "meaning": "Request body exceeds server limit"},
        415: {"name": "Unsupported Media Type", "meaning": "Request body content type not supported"},
        422: {"name": "Unprocessable Entity", "meaning": "Validation error (FastAPI/Django REST)"},
        429: {"name": "Too Many Requests", "meaning": "Rate limit exceeded"},
        500: {"name": "Internal Server Error", "meaning": "Generic server error — check logs"},
        501: {"name": "Not Implemented", "meaning": "Server doesn't support the requested method"},
        502: {"name": "Bad Gateway", "meaning": "Invalid response from upstream server (nginx proxy)"},
        503: {"name": "Service Unavailable", "meaning": "Server overloaded or under maintenance"},
        504: {"name": "Gateway Timeout", "meaning": "Upstream server didn't respond in time"},
        505: {"name": "HTTP Version Not Supported", "meaning": "Server doesn't support HTTP version"},
    }

    if code and code in STATUS_CODES:
        info = STATUS_CODES[code]
        category = (
            "1xx Informational" if 100 <= code < 200 else
            "2xx Success" if 200 <= code < 300 else
            "3xx Redirection" if 300 <= code < 400 else
            "4xx Client Error" if 400 <= code < 500 else
            "5xx Server Error"
        )
        return ExecutionResult(success=True, output={
            "code": code,
            "name": info["name"],
            "category": category,
            "meaning": info["meaning"],
        })

    if search:
        results = [
            {"code": c, "name": v["name"], "meaning": v["meaning"]}
            for c, v in STATUS_CODES.items()
            if search.lower() in v["name"].lower() or search.lower() in v["meaning"].lower()
        ]
        return ExecutionResult(success=True, output={
            "query": search,
            "results": results,
            "count": len(results)
        })

    # Return all grouped
    groups = {"1xx": [], "2xx": [], "3xx": [], "4xx": [], "5xx": []}
    for c, v in STATUS_CODES.items():
        prefix = f"{str(c)[0]}xx"
        groups[prefix].append({"code": c, "name": v["name"]})

    return ExecutionResult(success=True, output={
        "all_codes": groups,
        "total": len(STATUS_CODES)
    })


def yaml_json_converter(content: str, direction: str = "yaml_to_json") -> ExecutionResult:
    """Convert between YAML and JSON formats."""
    if not content.strip():
        return ExecutionResult(success=False, output=None, error="No content provided")

    try:
        import yaml
        if direction == "yaml_to_json":
            data = yaml.safe_load(content)
            result = json.dumps(data, indent=2, ensure_ascii=False)
            return ExecutionResult(success=True, output={
                "result": result,
                "format": "JSON",
                "original_format": "YAML"
            })
        else:  # json_to_yaml
            data = json.loads(content)
            result = yaml.dump(data, default_flow_style=False, allow_unicode=True)
            return ExecutionResult(success=True, output={
                "result": result,
                "format": "YAML",
                "original_format": "JSON"
            })
    except ImportError:
        # Fallback: simple JSON handling only
        try:
            data = json.loads(content)
            result = json.dumps(data, indent=2)
            return ExecutionResult(success=True, output={
                "result": result,
                "format": "Formatted JSON",
                "note": "PyYAML not available. JSON formatting only."
            })
        except json.JSONDecodeError as e:
            return ExecutionResult(success=False, output=None, error=f"Invalid input: {e}")
    except Exception as e:
        return ExecutionResult(success=False, output=None, error=str(e))


def og_tag_generator(
    title: str, description: str, url: str = "",
    image_url: str = "", site_name: str = "ISHU TOOLS", og_type: str = "website"
) -> ExecutionResult:
    """Generate Open Graph and Twitter Card meta tags."""
    if not title.strip() or not description.strip():
        return ExecutionResult(success=False, output=None, error="Title and description required")

    og_tags = f"""<!-- Open Graph / Facebook -->
<meta property="og:type" content="{og_type}" />
<meta property="og:url" content="{url}" />
<meta property="og:title" content="{title[:95]}" />
<meta property="og:description" content="{description[:200]}" />
<meta property="og:site_name" content="{site_name}" />"""

    if image_url:
        og_tags += f"""
<meta property="og:image" content="{image_url}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />"""

    twitter_tags = f"""
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title[:70]}" />
<meta name="twitter:description" content="{description[:200]}" />"""

    if image_url:
        twitter_tags += f"""
<meta name="twitter:image" content="{image_url}" />"""

    full_tags = og_tags + "\n" + twitter_tags

    return ExecutionResult(success=True, output={
        "tags": full_tags,
        "og_title_length": len(title),
        "og_description_length": len(description),
        "title_status": "OK" if len(title) <= 95 else "Too long (max 95 chars)",
        "desc_status": "OK" if len(description) <= 200 else "Too long (max 200 chars)",
        "checklist": {
            "has_title": bool(title),
            "has_description": bool(description),
            "has_url": bool(url),
            "has_image": bool(image_url),
            "has_site_name": bool(site_name),
        }
    })


def robots_txt_generator(
    allow_all: bool = True,
    disallow_paths: list = None,
    sitemap_url: str = "",
    crawl_delay: int = 0
) -> ExecutionResult:
    """Generate robots.txt for a website."""
    if disallow_paths is None:
        disallow_paths = []

    lines = ["User-agent: *"]

    if allow_all and not disallow_paths:
        lines.append("Allow: /")
    else:
        if allow_all:
            lines.append("Allow: /")
        for path in disallow_paths:
            if not path.startswith("/"):
                path = "/" + path
            lines.append(f"Disallow: {path}")

    if crawl_delay > 0:
        lines.append(f"Crawl-delay: {crawl_delay}")

    if sitemap_url:
        lines.append(f"\nSitemap: {sitemap_url}")

    robots_txt = "\n".join(lines)

    return ExecutionResult(success=True, output={
        "robots_txt": robots_txt,
        "placement": "Place this file at: https://yourdomain.com/robots.txt",
        "allow_all": allow_all,
        "disallowed_paths": disallow_paths,
        "validation_url": "https://www.google.com/webmasters/tools/robots-testing-tool"
    })


def meta_tag_generator_advanced(
    title: str, description: str, keywords: str = "",
    author: str = "Ishu Kumar", robots: str = "index, follow",
    canonical_url: str = "", language: str = "en"
) -> ExecutionResult:
    """Generate comprehensive HTML meta tags for SEO."""
    if not title.strip() or not description.strip():
        return ExecutionResult(success=False, output=None, error="Title and description required")

    title_len = len(title)
    desc_len = len(description)

    tags = f"""<!-- Primary Meta Tags -->
<title>{title[:60]}</title>
<meta name="title" content="{title[:60]}" />
<meta name="description" content="{description[:160]}" />"""

    if keywords:
        tags += f"""
<meta name="keywords" content="{keywords}" />"""

    tags += f"""
<meta name="author" content="{author}" />
<meta name="robots" content="{robots}" />
<meta name="language" content="{language}" />
<meta name="revisit-after" content="7 days" />
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />"""

    if canonical_url:
        tags += f"""
<link rel="canonical" href="{canonical_url}" />"""

    return ExecutionResult(success=True, output={
        "meta_tags": tags,
        "title_length": title_len,
        "description_length": desc_len,
        "title_status": "✅ Good" if 30 <= title_len <= 60 else "⚠️ Ideal: 30-60 chars",
        "desc_status": "✅ Good" if 120 <= desc_len <= 160 else "⚠️ Ideal: 120-160 chars",
        "seo_score": min(100, max(0, 100 - abs(title_len - 50) - abs(desc_len - 140))),
    })


def htaccess_generator(
    force_https: bool = True, force_www: bool = False, remove_www: bool = True,
    enable_gzip: bool = True, browser_caching: bool = True,
    custom_404: str = "/404.html"
) -> ExecutionResult:
    """Generate .htaccess configuration for Apache servers."""
    lines = ["# .htaccess generated by ISHU TOOLS", "# Place in your web root directory", ""]
    lines.append("Options -Indexes")
    lines.append("ServerSignature Off")
    lines.append("")

    if force_https:
        lines.extend([
            "# Force HTTPS",
            "RewriteEngine On",
            "RewriteCond %{HTTPS} off",
            'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
            ""
        ])

    if remove_www and not force_www:
        lines.extend([
            "# Remove www",
            "RewriteEngine On",
            'RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]',
            'RewriteRule ^(.*)$ https://%1/$1 [R=301,L]',
            ""
        ])
    elif force_www:
        lines.extend([
            "# Force www",
            "RewriteEngine On",
            'RewriteCond %{HTTP_HOST} !^www\\. [NC]',
            'RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]',
            ""
        ])

    if enable_gzip:
        lines.extend([
            "# Enable Gzip Compression",
            "<IfModule mod_deflate.c>",
            "  AddOutputFilterByType DEFLATE text/html text/css application/javascript",
            "  AddOutputFilterByType DEFLATE application/json image/svg+xml text/plain",
            "  AddOutputFilterByType DEFLATE application/xml text/xml application/x-javascript",
            "</IfModule>",
            ""
        ])

    if browser_caching:
        lines.extend([
            "# Browser Caching",
            "<IfModule mod_expires.c>",
            "  ExpiresActive On",
            "  ExpiresByType image/jpeg 'access plus 1 year'",
            "  ExpiresByType image/png 'access plus 1 year'",
            "  ExpiresByType image/webp 'access plus 1 year'",
            "  ExpiresByType text/css 'access plus 1 month'",
            "  ExpiresByType application/javascript 'access plus 1 month'",
            "  ExpiresByType text/html 'access plus 1 day'",
            "</IfModule>",
            ""
        ])

    if custom_404:
        lines.extend([
            "# Custom Error Pages",
            f"ErrorDocument 404 {custom_404}",
            "ErrorDocument 500 /500.html",
            ""
        ])

    htaccess = "\n".join(lines)

    return ExecutionResult(success=True, output={
        "htaccess": htaccess,
        "placement": "Save as '.htaccess' in your web root",
        "options_enabled": {
            "force_https": force_https,
            "www_handling": "remove_www" if remove_www else "force_www" if force_www else "none",
            "gzip": enable_gzip,
            "browser_caching": browser_caching,
        }
    })


def color_format_converter(
    input_color: str, output_format: str = "all"
) -> ExecutionResult:
    """Convert between color formats: HEX, RGB, HSL, HSV."""
    if not input_color.strip():
        return ExecutionResult(success=False, output=None, error="No color provided")

    color = input_color.strip().lower()

    def hex_to_rgb(h: str) -> tuple:
        h = h.lstrip('#')
        if len(h) == 3:
            h = ''.join(c*2 for c in h)
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

    def rgb_to_hex(r: int, g: int, b: int) -> str:
        return f"#{r:02x}{g:02x}{b:02x}".upper()

    def rgb_to_hsl(r: int, g: int, b: int) -> tuple:
        r, g, b = r/255, g/255, b/255
        cmax = max(r, g, b); cmin = min(r, g, b)
        delta = cmax - cmin
        l = (cmax + cmin) / 2
        s = 0 if delta == 0 else delta / (1 - abs(2*l - 1))
        if delta == 0:
            h = 0
        elif cmax == r:
            h = 60 * (((g - b) / delta) % 6)
        elif cmax == g:
            h = 60 * ((b - r) / delta + 2)
        else:
            h = 60 * ((r - g) / delta + 4)
        return round(h), round(s*100), round(l*100)

    # Parse input
    try:
        if color.startswith('#'):
            rgb = hex_to_rgb(color)
        elif color.startswith('rgb'):
            nums = re.findall(r'\d+', color)
            rgb = tuple(int(n) for n in nums[:3])
        elif color.startswith('hsl'):
            nums = re.findall(r'[\d.]+', color)
            h, s, l = float(nums[0]), float(nums[1])/100, float(nums[2])/100
            # HSL to RGB
            c = (1 - abs(2*l - 1)) * s
            x = c * (1 - abs((h/60) % 2 - 1))
            m = l - c/2
            if h < 60: r1,g1,b1 = c,x,0
            elif h < 120: r1,g1,b1 = x,c,0
            elif h < 180: r1,g1,b1 = 0,c,x
            elif h < 240: r1,g1,b1 = 0,x,c
            elif h < 300: r1,g1,b1 = x,0,c
            else: r1,g1,b1 = c,0,x
            rgb = (round((r1+m)*255), round((g1+m)*255), round((b1+m)*255))
        else:
            return ExecutionResult(success=False, output=None,
                error="Support: HEX (#RRGGBB), rgb(R,G,B), hsl(H,S,L)")
    except Exception:
        return ExecutionResult(success=False, output=None, error="Could not parse color")

    r, g, b = rgb
    h, s, l = rgb_to_hsl(r, g, b)
    hex_val = rgb_to_hex(r, g, b)

    luminance = 0.2126*(r/255)**2.2 + 0.7152*(g/255)**2.2 + 0.0722*(b/255)**2.2
    text_on = "white" if luminance < 0.4 else "black"

    return ExecutionResult(success=True, output={
        "hex": hex_val,
        "rgb": f"rgb({r}, {g}, {b})",
        "hsl": f"hsl({h}, {s}%, {l}%)",
        "rgba_50pct": f"rgba({r}, {g}, {b}, 0.5)",
        "r": r, "g": g, "b": b,
        "hue": h, "saturation": s, "lightness": l,
        "luminance": round(luminance, 4),
        "readable_text_color": text_on,
        "css_variable": f"--my-color: {hex_val};",
        "tailwind_arbitrary": f"bg-[{hex_val}]",
    })


def project_name_generator(
    domain: str = "tech", style: str = "modern",
    word_count: int = 2, count: int = 10
) -> ExecutionResult:
    """Generate creative project/startup/app names."""
    prefixes = {
        "tech": ["Nexo", "Velo", "Zeta", "Nova", "Algo", "Byte", "Code", "Dev", "Sys", "Data"],
        "health": ["Vita", "Heal", "Med", "Cure", "Well", "Fit", "Care", "Bio", "Life", "Pure"],
        "finance": ["Fin", "Cash", "Coin", "Fund", "Wealth", "Pay", "Cap", "Bux", "Quid", "Mint"],
        "education": ["Learn", "Edu", "Skill", "Know", "Wise", "Smart", "Study", "Tutl", "Ment", "Grad"],
        "tools": ["Tool", "Forge", "Craft", "Make", "Build", "Lab", "Kit", "Box", "Hub", "Port"],
        "social": ["Link", "Meet", "Vibe", "Flow", "Buzz", "Spark", "Hive", "Bond", "Wave", "Pulse"],
    }
    suffixes = {
        "modern": ["ify", "ly", "io", "ai", "app", "hub", "base", "flow", "labs", "works"],
        "clean": ["", ".", "s", "pro", "co", ".io", "HQ", "Cloud", "API"],
        "bold": ["X", "Pro", "Plus", "Max", "Ultra", "Prime", "Core", "Edge", "Sync", "Spark"],
        "playful": ["oo", "y", "ie", "zy", "go", "hop", "dot", "pop", "jump", "snap"],
    }

    domain_prefixes = prefixes.get(domain.lower(), prefixes["tech"])
    domain_suffixes = suffixes.get(style.lower(), suffixes["modern"])

    names = set()
    attempts = 0
    while len(names) < count and attempts < 200:
        if word_count == 1:
            prefix = random.choice(domain_prefixes)
            suffix = random.choice(domain_suffixes)
            name = prefix + suffix
        else:
            p1 = random.choice(domain_prefixes)
            p2 = random.choice(domain_prefixes)
            name = p1 + p2.lower()
        names.add(name)
        attempts += 1

    return ExecutionResult(success=True, output={
        "names": sorted(names)[:count],
        "domain": domain,
        "style": style,
        "tip": "Check domain availability at namecheap.com or godaddy.com"
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 6: INDIAN-SPECIFIC TOOLS (5 tools)
# ══════════════════════════════════════════════════════════════════════════════

def aadhaar_validator(aadhaar: str) -> ExecutionResult:
    """Validate Aadhaar number format and checksum (Verhoeff algorithm)."""
    # Remove spaces and dashes
    num = re.sub(r'[\s-]', '', aadhaar)

    if not num.isdigit():
        return ExecutionResult(success=False, output=None, error="Aadhaar must contain only digits")

    if len(num) != 12:
        return ExecutionResult(success=False, output=None,
            error=f"Aadhaar must be 12 digits (got {len(num)})")

    if num[0] in '01':
        return ExecutionResult(success=False, output=None,
            error="Aadhaar cannot start with 0 or 1")

    # Verhoeff tables
    d = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
         [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
         [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
         [9,8,7,6,5,4,3,2,1,0]]
    p = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
         [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
         [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]]
    inv = [0,4,3,2,1,5,6,7,8,9]

    c = 0
    digits = [int(x) for x in reversed(num)]
    for i, digit in enumerate(digits):
        c = d[c][p[i % 8][digit]]

    is_valid = c == 0
    masked = num[:4] + " XXXX " + num[8:]

    return ExecutionResult(success=True, output={
        "valid": is_valid,
        "aadhaar_masked": masked,
        "format": "Valid 12-digit format" if len(num) == 12 else "Invalid",
        "checksum": "Valid (Verhoeff)" if is_valid else "Invalid checksum",
        "note": "This validates format only. Use UIDAI portal for actual verification."
    })


def pan_validator(pan: str) -> ExecutionResult:
    """Validate Indian PAN (Permanent Account Number) format."""
    pan = pan.strip().upper()

    if len(pan) != 10:
        return ExecutionResult(success=False, output=None,
            error=f"PAN must be 10 characters (got {len(pan)})")

    pattern = re.compile(r'^[A-Z]{5}[0-9]{4}[A-Z]$')

    if not pattern.match(pan):
        return ExecutionResult(success=False, output=None,
            error="Invalid format. PAN format: AAAAA9999A (5 letters, 4 digits, 1 letter)")

    # PAN decoding
    fourth_char = pan[3]
    types = {
        'P': 'Individual (Person)', 'C': 'Company', 'H': 'HUF (Hindu Undivided Family)',
        'F': 'Firm', 'A': 'AOP (Association of Persons)', 'T': 'Trust',
        'B': 'AOP/BOI', 'L': 'Local Authority', 'J': 'AOP (Juridical Person)', 'G': 'Government'
    }

    entity_type = types.get(fourth_char, "Unknown type")

    return ExecutionResult(success=True, output={
        "valid": True,
        "pan": pan,
        "entity_type": entity_type,
        "type_code": fourth_char,
        "first_letters": pan[:3],
        "masked": pan[:2] + "XXXXXXX" + pan[-1],
        "note": "PAN format is valid. Use Income Tax portal to verify actual PAN."
    })


def indian_phone_validator(phone: str) -> ExecutionResult:
    """Validate and analyze Indian mobile/landline numbers."""
    # Clean input
    num = re.sub(r'[\s\-\(\)\.+]', '', phone)

    # Remove country code if present
    if num.startswith('91') and len(num) == 12:
        num = num[2:]
    elif num.startswith('0') and len(num) == 11:
        num = num[1:]

    if not num.isdigit():
        return ExecutionResult(success=False, output=None, error="Phone number must contain only digits")

    if len(num) != 10:
        return ExecutionResult(success=False, output=None,
            error=f"Indian mobile number must be 10 digits (got {len(num)})")

    first_digit = int(num[0])
    first_two = int(num[:2])

    # Determine type
    if first_digit in (6, 7, 8, 9):
        phone_type = "Mobile"
        # Operator detection (approximate)
        operators = {
            (70, 79): "Vodafone/Vi",
            (80, 85): "Airtel",
            (86, 89): "BSNL/MTNL",
            (90, 92): "Airtel",
            (93, 95): "BSNL",
            (96, 99): "Jio",
            (60, 65): "Jio",
            (66, 69): "Vi/Idea",
        }
        operator = "Unknown"
        for (start, end), op in operators.items():
            if start <= first_two <= end:
                operator = op
                break
    else:
        phone_type = "Landline"
        operator = "BSNL/MTNL or Private"

    return ExecutionResult(success=True, output={
        "valid": True,
        "number": num,
        "formatted": f"+91 {num[:5]} {num[5:]}",
        "international": f"+91{num}",
        "type": phone_type,
        "likely_operator": operator,
        "first_digit": first_digit,
        "note": "Operator detection is approximate. Port numbers may not match."
    })


def ifsc_lookup_basic(ifsc: str) -> ExecutionResult:
    """Basic IFSC code format validation and bank info extraction."""
    ifsc = ifsc.strip().upper()

    if len(ifsc) != 11:
        return ExecutionResult(success=False, output=None,
            error=f"IFSC must be 11 characters (got {len(ifsc)})")

    pattern = re.compile(r'^[A-Z]{4}0[A-Z0-9]{6}$')
    if not pattern.match(ifsc):
        return ExecutionResult(success=False, output=None,
            error="Invalid IFSC format. Format: XXXX0YYYYYY (4 letters, 0, 6 alphanumeric)")

    bank_codes = {
        "SBIN": "State Bank of India (SBI)",
        "HDFC": "HDFC Bank",
        "ICIC": "ICICI Bank",
        "AXIS": "Axis Bank",
        "KKBK": "Kotak Mahindra Bank",
        "PUNB": "Punjab National Bank (PNB)",
        "UBIN": "Union Bank of India",
        "BKID": "Bank of India",
        "CNRB": "Canara Bank",
        "BARB": "Bank of Baroda",
        "IOBA": "Indian Overseas Bank",
        "IDBI": "IDBI Bank",
        "YESB": "Yes Bank",
        "INDB": "IndusInd Bank",
        "FDRL": "Federal Bank",
        "KVBL": "Karur Vysya Bank",
        "TMBL": "Tamilnad Mercantile Bank",
        "DLXB": "Dhanlaxmi Bank",
        "KARB": "Karnataka Bank",
        "SIBL": "South Indian Bank",
        "UTIB": "Axis Bank",
        "RATN": "RBL Bank",
        "AIRP": "Airtel Payments Bank",
        "FINO": "Fino Payments Bank",
        "PAYTM": "Paytm Payments Bank",
    }

    bank_code = ifsc[:4]
    branch_code = ifsc[5:]

    bank_name = bank_codes.get(bank_code, f"Unknown bank ({bank_code})")

    return ExecutionResult(success=True, output={
        "valid": True,
        "ifsc": ifsc,
        "bank_code": bank_code,
        "branch_code": branch_code,
        "bank_name": bank_name,
        "note": "For branch details, use bankifsccode.com or RBI's official IFSC locator."
    })


def gst_validator(gstin: str) -> ExecutionResult:
    """Validate Indian GST Identification Number (GSTIN)."""
    gstin = gstin.strip().upper()

    if len(gstin) != 15:
        return ExecutionResult(success=False, output=None,
            error=f"GSTIN must be 15 characters (got {len(gstin)})")

    pattern = re.compile(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')
    if not pattern.match(gstin):
        return ExecutionResult(success=False, output=None,
            error="Invalid GSTIN format")

    state_codes = {
        "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
        "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana",
        "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh",
        "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
        "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
        "16": "Tripura", "17": "Meghalaya", "18": "Assam",
        "19": "West Bengal", "20": "Jharkhand", "21": "Odisha",
        "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
        "25": "Daman and Diu", "26": "Dadra & Nagar Haveli and Daman & Diu",
        "27": "Maharashtra", "28": "Andhra Pradesh", "29": "Karnataka",
        "30": "Goa", "31": "Lakshadweep", "32": "Kerala",
        "33": "Tamil Nadu", "34": "Puducherry", "35": "Andaman & Nicobar",
        "36": "Telangana", "37": "Andhra Pradesh (new)", "38": "Ladakh",
    }

    state_code = gstin[:2]
    pan = gstin[2:12]
    entity_number = gstin[12]
    check_digit = gstin[14]

    state_name = state_codes.get(state_code, "Unknown State")

    entity_types = {
        'P': 'Individual', 'C': 'Company', 'H': 'HUF', 'F': 'Firm',
        'A': 'AOP', 'T': 'Trust', 'B': 'BOI', 'L': 'Local Authority', 'G': 'Government'
    }
    pan_4th = pan[3] if len(pan) > 3 else '?'
    entity_type = entity_types.get(pan_4th, "Unknown")

    return ExecutionResult(success=True, output={
        "valid": True,
        "gstin": gstin,
        "state_code": state_code,
        "state": state_name,
        "pan_in_gstin": pan,
        "entity_number": entity_number,
        "entity_type": entity_type,
        "masked": gstin[:2] + "XXXXXXXX" + gstin[12:],
        "note": "Format is valid. Verify on GST portal: https://www.gst.gov.in/"
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 7: SOCIAL MEDIA & PRODUCTIVITY TOOLS (5 tools)
# ══════════════════════════════════════════════════════════════════════════════

def hashtag_generator(
    topic: str, platform: str = "instagram", count: int = 30
) -> ExecutionResult:
    """Generate relevant hashtags for social media posts."""
    if not topic.strip():
        return ExecutionResult(success=False, output=None, error="No topic provided")

    # Create base hashtag from topic
    topic_clean = re.sub(r'[^a-zA-Z0-9\s]', '', topic).strip()
    topic_tag = topic_clean.replace(' ', '').lower()
    words = topic_clean.lower().split()

    # Platform-specific hashtag counts
    limits = {"instagram": 30, "twitter": 3, "linkedin": 5, "tiktok": 10, "youtube": 15}
    max_tags = min(count, limits.get(platform.lower(), 30))

    # Generate variations
    tags = set()

    # Primary tags
    tags.add(f"#{topic_tag}")
    for word in words:
        if len(word) > 2:
            tags.add(f"#{word}")

    # Multi-word combos
    if len(words) >= 2:
        tags.add(f"#{''.join(words[:2])}")
        tags.add(f"#{''.join(words)}")

    # Generic popular tags by category
    generic_tags = {
        "tech": ["#technology", "#tech", "#coding", "#programming", "#developer", "#software",
                 "#innovation", "#startup", "#digitaltransformation", "#ai", "#machinelearning"],
        "student": ["#students", "#study", "#studygram", "#college", "#university", "#education",
                    "#learning", "#studymotivation", "#iit", "#engineering", "#examprep"],
        "pdf": ["#pdf", "#pdftool", "#documentmanagement", "#productivity", "#officetool",
                "#pdfconverter", "#pdfcompressor", "#freetool", "#onlinetool"],
        "business": ["#business", "#entrepreneur", "#startup", "#smallbusiness", "#marketing",
                     "#success", "#motivation", "#hustle", "#businessowner", "#growth"],
        "food": ["#food", "#foodie", "#recipe", "#cooking", "#homecooking", "#indianfood",
                 "#healthyfood", "#foodphotography", "#instafood", "#yummy"],
        "fitness": ["#fitness", "#workout", "#gym", "#health", "#fitnessmotivation",
                    "#exercise", "#healthy", "#fit", "#training", "#nutrition"],
        "free": ["#free", "#freetools", "#freeonline", "#freetrial", "#freestuff",
                 "#nocost", "#nosignup", "#ishutools"],
    }

    # Add topic-relevant generic tags
    for category, tags_list in generic_tags.items():
        if any(kw in topic.lower() for kw in [category, category[:4]]):
            tags.update(random.sample(tags_list, min(8, len(tags_list))))

    # Add some generic ones if not enough
    if len(tags) < max_tags:
        common = ["#trending", "#viral", "#explore", "#india", "#instagood", "#love",
                  "#instagram", "#follow", "#like", "#share"]
        for tag in common:
            if len(tags) >= max_tags:
                break
            tags.add(tag)

    tag_list = sorted(list(tags))[:max_tags]

    return ExecutionResult(success=True, output={
        "hashtags": tag_list,
        "count": len(tag_list),
        "platform": platform,
        "copy_text": " ".join(tag_list),
        "tip": {
            "instagram": "Use 20-30 hashtags. Mix popular (>1M) and niche (<100K) for best reach.",
            "twitter": "Use 1-3 hashtags. Quality over quantity on Twitter/X.",
            "linkedin": "Use 3-5 professional hashtags.",
            "tiktok": "Use 5-10 hashtags including trending ones.",
            "youtube": "Use 3-15 tags in description, not comments.",
        }.get(platform.lower(), "Use relevant, specific hashtags.")
    })


def random_team_generator(
    names: str, team_count: int = 2, team_names: str = ""
) -> ExecutionResult:
    """Randomly divide names into teams."""
    if not names.strip():
        return ExecutionResult(success=False, output=None, error="No names provided")

    people = [n.strip() for n in re.split(r'[,\n]', names) if n.strip()]

    if len(people) < team_count:
        return ExecutionResult(success=False, output=None,
            error=f"Need at least {team_count} people for {team_count} teams")

    random.shuffle(people)

    # Assign team names
    team_name_list = [n.strip() for n in team_names.split(',') if n.strip()] if team_names else []
    while len(team_name_list) < team_count:
        team_name_list.append(f"Team {len(team_name_list) + 1}")

    teams = {name: [] for name in team_name_list[:team_count]}

    for i, person in enumerate(people):
        team_idx = i % team_count
        team_name = team_name_list[team_idx]
        teams[team_name].append(person)

    return ExecutionResult(success=True, output={
        "teams": teams,
        "total_people": len(people),
        "team_count": team_count,
        "team_sizes": {name: len(members) for name, members in teams.items()},
        "note": "Teams are randomly assigned on each run."
    })


def lorem_ipsum_advanced(
    paragraph_count: int = 3,
    sentence_count: int = 5,
    style: str = "standard"
) -> ExecutionResult:
    """Generate lorem ipsum or themed placeholder text."""
    LOREM_WORDS = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "labore", "magna", "aliqua",
        "enim", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco",
        "laboris", "nisi", "aliquip", "commodo", "consequat", "duis", "aute", "irure",
        "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla",
        "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "proident", "culpa",
        "officia", "deserunt", "mollit", "anim", "est", "laborum",
    ]

    TECH_WORDS = [
        "interface", "protocol", "bandwidth", "framework", "deploy", "compile", "debug",
        "iterate", "optimize", "refactor", "cache", "endpoint", "API", "database", "server",
        "frontend", "backend", "fullstack", "DevOps", "pipeline", "container", "microservice",
        "scalable", "distributed", "latency", "throughput", "resilient", "encrypted", "token",
    ]

    words = TECH_WORDS if style == "tech" else LOREM_WORDS

    def make_sentence() -> str:
        length = random.randint(8, 18)
        sentence_words = random.choices(words, k=length)
        sentence = ' '.join(sentence_words)
        return sentence[0].upper() + sentence[1:] + '.'

    def make_paragraph(n_sentences: int) -> str:
        return ' '.join(make_sentence() for _ in range(n_sentences))

    paragraphs = [make_paragraph(sentence_count) for _ in range(paragraph_count)]
    full_text = '\n\n'.join(paragraphs)

    return ExecutionResult(success=True, output={
        "text": full_text,
        "paragraphs": paragraphs,
        "paragraph_count": paragraph_count,
        "approximate_words": len(full_text.split()),
        "approximate_chars": len(full_text),
        "style": style,
    })


def youtube_title_generator(
    topic: str, style: str = "tutorial",
    include_year: bool = True, count: int = 10
) -> ExecutionResult:
    """Generate optimized YouTube video title variations."""
    if not topic.strip():
        return ExecutionResult(success=False, output=None, error="No topic provided")

    year = "2026" if include_year else ""
    yr = f" ({year})" if year else ""

    templates = {
        "tutorial": [
            f"How to {topic} — Complete Guide{yr}",
            f"{topic} Tutorial for Beginners{yr}",
            f"Learn {topic} in 10 Minutes{yr}",
            f"Step-by-Step {topic} Guide{yr}",
            f"The ONLY {topic} Tutorial You Need{yr}",
        ],
        "review": [
            f"{topic} Review — Is It Worth It?{yr}",
            f"Honest {topic} Review{yr}",
            f"I Tried {topic} for 30 Days — Here's What Happened",
            f"{topic}: Pros, Cons, and Verdict{yr}",
            f"Everything Wrong With {topic}{yr}",
        ],
        "listicle": [
            f"Top 10 {topic} You Need to Know{yr}",
            f"5 Best {topic} Tools (Free & Paid){yr}",
            f"{topic}: 7 Things Nobody Tells You",
            f"Stop Making These {topic} Mistakes{yr}",
            f"The Ultimate {topic} Checklist{yr}",
        ],
        "comparison": [
            f"{topic}: Which Is Better?{yr}",
            f"I Tested Every {topic} — Here's the Winner{yr}",
            f"{topic} Comparison — The Definitive Guide{yr}",
            f"Best {topic} for Students vs Professionals{yr}",
        ],
        "clickbait": [
            f"This {topic} Changed My Life (Not Clickbait)",
            f"Why Everyone Is Wrong About {topic}",
            f"The Secret About {topic} Nobody Talks About",
            f"I Made a Huge Mistake With {topic}...",
            f"Watch This Before Using {topic}",
        ],
    }

    style_templates = templates.get(style.lower(), templates["tutorial"])
    # Mix styles for variety
    all_templates = [t for t_list in templates.values() for t in t_list]
    random.shuffle(all_templates)

    titles = style_templates + all_templates[:max(0, count - len(style_templates))]
    titles = titles[:count]

    return ExecutionResult(success=True, output={
        "titles": titles,
        "topic": topic,
        "style": style,
        "seo_tip": "Include primary keyword in first 60 characters. Keep under 100 chars total.",
        "viral_formula": "[Curiosity/Number] + [Topic/Keyword] + [Benefit/Outcome]",
        "count": len(titles)
    })
