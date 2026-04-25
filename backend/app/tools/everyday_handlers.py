"""
Everyday utility tool handlers.
Math, number, text transformation, date/time, and random generator tools.
All pure-Python implementations – no external APIs needed.
"""
from __future__ import annotations

import math
import random
import re
import statistics
import string
import textwrap
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from .handlers import ExecutionResult


def _text_result(data: dict[str, Any], message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)


def _get_text(payload: dict[str, Any]) -> str:
    """Robust text extractor — accepts many common field name variants."""
    for key in ("text", "input", "input_text", "data", "value", "string",
                "content", "query", "message", "body", "raw"):
        val = payload.get(key)
        if val is not None and str(val).strip():
            return str(val).strip()
    return ""


# ============================================================================
# MATH & CALCULATOR TOOLS
# ============================================================================

def handle_percentage_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate percentage, percentage change, percentage of total"""
    value = float(payload.get("value", 0))
    total = float(payload.get("total", 100))
    mode = str(payload.get("mode", "percentage")).lower()

    if mode == "change":
        if total == 0:
            return _text_result({"error": "Old value cannot be zero"}, "Error")
        change = ((value - total) / abs(total)) * 100
        return _text_result({
            "result": f"{change:.4f}%",
            "old_value": total,
            "new_value": value,
            "change_percent": round(change, 4),
            "direction": "increase" if change > 0 else "decrease" if change < 0 else "no change"
        }, f"Percentage change: {change:.2f}%")
    elif mode == "of":
        result = (value / 100) * total
        return _text_result({
            "result": str(round(result, 6)),
            "percentage": value,
            "of_value": total,
            "calculated": round(result, 6),
        }, f"{value}% of {total} = {result:.4f}")
    else:
        if total == 0:
            return _text_result({"error": "Total cannot be zero"}, "Error")
        pct = (value / total) * 100
        return _text_result({
            "result": f"{pct:.4f}%",
            "value": value,
            "total": total,
            "percentage": round(pct, 4),
        }, f"{value} is {pct:.2f}% of {total}")


def handle_average_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate mean, median, mode, and standard deviation"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No numbers provided"}, "Error")

    numbers = []
    for token in re.split(r"[,;\s\n]+", text):
        token = token.strip()
        if token:
            try:
                numbers.append(float(token))
            except ValueError:
                pass

    if not numbers:
        return _text_result({"error": "No valid numbers found"}, "Error")

    mean_val = statistics.mean(numbers)
    median_val = statistics.median(numbers)
    try:
        mode_val = statistics.mode(numbers)
    except statistics.StatisticsError:
        mode_val = "No unique mode"

    std_dev = statistics.stdev(numbers) if len(numbers) > 1 else 0
    total = sum(numbers)
    count = len(numbers)
    min_val = min(numbers)
    max_val = max(numbers)
    range_val = max_val - min_val

    return _text_result({
        "result": f"Mean: {mean_val:.4f}",
        "mean": round(mean_val, 6),
        "median": round(median_val, 6),
        "mode": mode_val if isinstance(mode_val, str) else round(mode_val, 6),
        "std_deviation": round(std_dev, 6),
        "sum": round(total, 6),
        "count": count,
        "min": round(min_val, 6),
        "max": round(max_val, 6),
        "range": round(range_val, 6),
    }, f"Statistics for {count} numbers calculated")


def handle_number_base_converter(files, payload, output_dir) -> ExecutionResult:
    """Convert numbers between decimal, binary, octal, and hex"""
    text = _get_text(payload)
    from_base_raw = str(payload.get("from_base") or payload.get("base") or "decimal").lower().strip()
    if not text:
        return _text_result({"error": "No number provided. Enter a number to convert."}, "Error")

    base_map = {
        "binary": 2, "bin": 2, "2": 2,
        "octal": 8, "oct": 8, "8": 8,
        "decimal": 10, "dec": 10, "10": 10,
        "hexadecimal": 16, "hex": 16, "16": 16,
    }
    base = base_map.get(from_base_raw, 10)
    cleaned = text.strip().replace("0x", "").replace("0X", "").replace("0b", "").replace("0B", "").replace("0o", "").replace("0O", "")

    valid_chars = {2: "01", 8: "01234567", 10: "0123456789", 16: "0123456789abcdefABCDEF"}
    invalid = [c for c in cleaned if c not in valid_chars[base] and not c.isspace()]
    if invalid:
        base_name = {2: "binary", 8: "octal", 10: "decimal", 16: "hexadecimal"}[base]
        return _text_result({
            "error": f"'{text}' is not a valid {base_name} number. {base_name.capitalize()} only allows: {valid_chars[base]}"
        }, "Error")

    try:
        value = int(cleaned.replace(" ", ""), base)
    except ValueError:
        return _text_result({"error": f"Invalid number for base {base}: '{text}'"}, "Error")

    return _text_result({
        "result": str(value),
        "decimal": str(value),
        "binary": bin(value),
        "octal": oct(value),
        "hexadecimal": hex(value),
        "input": text,
        "from_base": from_base,
    }, f"Converted from {from_base}: {text}")


def handle_gpa_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate GPA from grades and credit hours"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "Provide grades as 'Grade CreditHours' per line, e.g. A 3"}, "Error")

    grade_points = {
        "A+": 4.0, "A": 4.0, "A-": 3.7,
        "B+": 3.3, "B": 3.0, "B-": 2.7,
        "C+": 2.3, "C": 2.0, "C-": 1.7,
        "D+": 1.3, "D": 1.0, "D-": 0.7,
        "F": 0.0, "E": 0.0,
    }

    total_points = 0.0
    total_credits = 0.0
    courses = []

    for line in text.strip().splitlines():
        parts = line.strip().split()
        if len(parts) >= 2:
            grade = parts[0].upper()
            try:
                credits = float(parts[1])
            except ValueError:
                continue
            gp = grade_points.get(grade)
            if gp is not None:
                total_points += gp * credits
                total_credits += credits
                courses.append({"grade": grade, "credits": credits, "points": gp})

    if total_credits == 0:
        return _text_result({"error": "No valid grade entries found"}, "Error")

    gpa = total_points / total_credits
    return _text_result({
        "result": f"GPA: {gpa:.2f}",
        "gpa": round(gpa, 4),
        "total_credits": total_credits,
        "total_points": round(total_points, 2),
        "courses": len(courses),
    }, f"GPA: {gpa:.2f} / 4.0 ({len(courses)} courses)")


def handle_bmi_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate BMI from weight and height"""
    weight = float(payload.get("weight", 0))
    height = float(payload.get("height", 0))
    unit = str(payload.get("unit", "metric")).lower()

    if weight <= 0 or height <= 0:
        return _text_result({"error": "Weight and height must be positive numbers"}, "Error")

    if unit in ("imperial", "lbs"):
        bmi = (weight / (height * height)) * 703
    else:
        height_m = height / 100 if height > 3 else height
        bmi = weight / (height_m * height_m)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return _text_result({
        "result": f"BMI: {bmi:.1f} ({category})",
        "bmi": round(bmi, 2),
        "category": category,
        "weight": weight,
        "height": height,
    }, f"BMI: {bmi:.1f} - {category}")


def handle_age_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate age from date of birth (accepts text, date, dob, birth_date, birthday, date_of_birth)."""
    dob_str = ""
    for key in ("text", "date", "dob", "birth_date", "birthday", "date_of_birth", "input_text", "input"):
        val = payload.get(key)
        if val:
            dob_str = str(val).strip()
            break
    if not dob_str:
        return _text_result({"error": "Provide date of birth (YYYY-MM-DD)"}, "Error")

    for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%Y/%m/%d"]:
        try:
            dob = datetime.strptime(dob_str, fmt)
            break
        except ValueError:
            continue
    else:
        return _text_result({"error": "Invalid date format. Use YYYY-MM-DD"}, "Error")

    today = datetime.now()
    age_years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    age_months = (today.year - dob.year) * 12 + today.month - dob.month
    if today.day < dob.day:
        age_months -= 1
    total_days = (today - dob).days

    return _text_result({
        "result": f"{age_years} years old",
        "years": age_years,
        "months": age_months,
        "total_days": total_days,
        "total_weeks": total_days // 7,
        "total_hours": total_days * 24,
        "next_birthday": dob.replace(year=today.year + (1 if (today.month, today.day) >= (dob.month, dob.day) else 0)).strftime("%Y-%m-%d"),
    }, f"Age: {age_years} years ({total_days:,} days)")


def handle_discount_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate discount price"""
    price = float(payload.get("value", 0) or payload.get("price", 0))
    discount_pct = float(payload.get("total", 0) or payload.get("discount", 0))

    if price <= 0:
        return _text_result({"error": "Price must be positive"}, "Error")

    discount_amount = price * (discount_pct / 100)
    final_price = price - discount_amount

    return _text_result({
        "result": f"Final Price: {final_price:.2f}",
        "original_price": round(price, 2),
        "discount_percent": round(discount_pct, 2),
        "discount_amount": round(discount_amount, 2),
        "final_price": round(final_price, 2),
        "you_save": round(discount_amount, 2),
    }, f"After {discount_pct}% discount: {final_price:.2f} (Save {discount_amount:.2f})")


def handle_loan_emi_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate EMI for a loan"""
    principal = float(payload.get("value", 0) or payload.get("principal", 0))
    rate = float(payload.get("total", 0) or payload.get("rate", 0))
    tenure_months = int(payload.get("months", 12))

    if principal <= 0 or rate <= 0 or tenure_months <= 0:
        return _text_result({"error": "All values must be positive"}, "Error")

    monthly_rate = rate / (12 * 100)
    emi = principal * monthly_rate * ((1 + monthly_rate) ** tenure_months) / (((1 + monthly_rate) ** tenure_months) - 1)
    total_payment = emi * tenure_months
    total_interest = total_payment - principal

    return _text_result({
        "result": f"EMI: {emi:.2f}/month",
        "emi": round(emi, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
        "principal": round(principal, 2),
        "rate_annual": round(rate, 2),
        "tenure_months": tenure_months,
    }, f"EMI: {emi:.2f}/month | Total Interest: {total_interest:.2f}")


# ============================================================================
# TEXT TRANSFORMATION TOOLS
# ============================================================================

def handle_text_reverse(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    reversed_text = text[::-1]
    return _text_result({"result": reversed_text, "original_length": len(text)}, "Text reversed")


def handle_text_to_binary(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    binary = " ".join(format(ord(c), "08b") for c in text)
    return _text_result({"result": binary, "characters": len(text)}, "Text converted to binary")


def handle_binary_to_text(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No binary input provided. Paste binary like '01001000 01101001'."}, "Error")
    cleaned = text.strip().replace(",", " ").replace("\n", " ").replace("\t", " ")
    if any(c.isalpha() for c in cleaned):
        return _text_result({
            "error": "This looks like regular text, not binary. Did you mean to use the Text-to-Binary tool? Binary input should only contain 0s, 1s, and spaces."
        }, "Error")
    bits = [b for b in cleaned.split(" ") if b]
    if not bits:
        return _text_result({"error": "No binary digits found. Paste 8-bit binary separated by spaces."}, "Error")
    try:
        chars = [chr(int(b, 2)) for b in bits]
        result = "".join(chars)
        return _text_result({"result": result, "characters": len(chars)}, "Binary converted to text")
    except ValueError:
        return _text_result({"error": "Invalid binary format. Use space-separated 8-bit binary like '01001000 01101001'."}, "Error")


def handle_morse_code_encoder(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    mode = str(payload.get("mode", "encode")).lower()
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    char_to_morse = {
        "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
        "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
        "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
        "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
        "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---",
        "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
        "8": "---..", "9": "----.", " ": "/", ".": ".-.-.-", ",": "--..--",
        "?": "..--..", "!": "-.-.--", "'": ".----.", "@": ".--.-.",
    }

    if mode == "decode":
        morse_to_char = {v: k for k, v in char_to_morse.items()}
        words = text.strip().split(" / ")
        decoded = []
        for word in words:
            chars = [morse_to_char.get(code, "?") for code in word.strip().split()]
            decoded.append("".join(chars))
        result = " ".join(decoded)
        return _text_result({"result": result}, "Morse code decoded")

    encoded = " ".join(char_to_morse.get(c.upper(), c) for c in text)
    return _text_result({"result": encoded}, "Text encoded to Morse code")


def handle_random_number_generator(files, payload, output_dir) -> ExecutionResult:
    min_val = int(payload.get("value", 1) or payload.get("min", 1))
    max_val = int(payload.get("total", 100) or payload.get("max", 100))
    count = max(1, min(100, int(payload.get("count", 1))))

    if min_val > max_val:
        min_val, max_val = max_val, min_val

    numbers = [random.randint(min_val, max_val) for _ in range(count)]
    return _text_result({
        "result": ", ".join(map(str, numbers)),
        "numbers": numbers,
        "count": count,
        "min": min_val,
        "max": max_val,
    }, f"Generated {count} random number(s) between {min_val} and {max_val}")


def handle_text_to_ascii(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    ascii_vals = [str(ord(c)) for c in text]
    return _text_result({
        "result": " ".join(ascii_vals),
        "characters": len(text),
        "ascii_values": ascii_vals[:200],
    }, "Text converted to ASCII values")


def handle_ascii_to_text(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No ASCII values provided"}, "Error")
    try:
        vals = [int(v.strip()) for v in re.split(r"[,;\s]+", text) if v.strip()]
        result = "".join(chr(v) for v in vals if 0 <= v <= 1114111)
        return _text_result({"result": result, "characters": len(result)}, "ASCII converted to text")
    except ValueError:
        return _text_result({"error": "Invalid ASCII values"}, "Error")


def handle_word_frequency(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    words = re.findall(r"\b[a-zA-Z]+\b", text.lower())
    freq: dict[str, int] = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1

    sorted_freq = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:30]
    freq_list = [{"word": w, "count": c} for w, c in sorted_freq]

    return _text_result({
        "result": "\n".join(f"{w}: {c}" for w, c in sorted_freq),
        "total_words": len(words),
        "unique_words": len(freq),
        "top_words": freq_list,
    }, f"Analyzed {len(words)} words, {len(freq)} unique")


def handle_roman_numeral_converter(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No input provided"}, "Error")

    roman_vals = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
    ]

    # Try to parse as integer first
    try:
        num = int(text.strip())
        if num <= 0 or num > 3999:
            return _text_result({"error": "Number must be 1-3999"}, "Error")
        result = ""
        for val, sym in roman_vals:
            while num >= val:
                result += sym
                num -= val
        return _text_result({"result": result, "decimal": int(text.strip())}, f"{text.strip()} = {result}")
    except ValueError:
        pass

    # Try to parse as Roman numeral
    roman_map = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    roman = text.strip().upper()
    total = 0
    prev = 0
    for ch in reversed(roman):
        val = roman_map.get(ch, 0)
        if val < prev:
            total -= val
        else:
            total += val
        prev = val

    if total > 0:
        return _text_result({"result": str(total), "roman": roman}, f"{roman} = {total}")
    return _text_result({"error": "Invalid input"}, "Error")


def handle_countdown_timer(files, payload, output_dir) -> ExecutionResult:
    """Calculate time between two dates or from now to a target date"""
    target = str(payload.get("text", "") or payload.get("date", "")).strip()
    if not target:
        return _text_result({"error": "Provide target date (YYYY-MM-DD)"}, "Error")

    for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y-%m-%d %H:%M", "%d-%m-%Y"]:
        try:
            target_dt = datetime.strptime(target, fmt)
            break
        except ValueError:
            continue
    else:
        return _text_result({"error": "Invalid date format. Use YYYY-MM-DD"}, "Error")

    now = datetime.now()
    diff = target_dt - now
    total_seconds = int(diff.total_seconds())
    is_past = total_seconds < 0
    total_seconds = abs(total_seconds)

    days = total_seconds // 86400
    hours = (total_seconds % 86400) // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60

    direction = "ago" if is_past else "from now"

    return _text_result({
        "result": f"{days}d {hours}h {minutes}m {seconds}s {direction}",
        "total_days": days,
        "total_hours": total_seconds // 3600,
        "total_minutes": total_seconds // 60,
        "total_seconds": total_seconds,
        "is_past": is_past,
        "target_date": target_dt.strftime("%Y-%m-%d %H:%M"),
    }, f"{days} days, {hours} hours {direction}")


def handle_tip_calculator(files, payload, output_dir) -> ExecutionResult:
    bill = float(payload.get("value", 0) or payload.get("bill", 0))
    tip_pct = float(payload.get("total", 15) or payload.get("tip", 15))
    people = max(1, int(payload.get("count", 1) or payload.get("people", 1)))

    if bill <= 0:
        return _text_result({"error": "Bill amount must be positive"}, "Error")

    tip_amount = bill * (tip_pct / 100)
    total = bill + tip_amount
    per_person = total / people

    return _text_result({
        "result": f"Total: {total:.2f} | Per person: {per_person:.2f}",
        "bill": round(bill, 2),
        "tip_percent": round(tip_pct, 1),
        "tip_amount": round(tip_amount, 2),
        "total": round(total, 2),
        "per_person": round(per_person, 2),
        "people": people,
    }, f"Tip: {tip_amount:.2f} | Total: {total:.2f} | Per person: {per_person:.2f}")


# ============================================================================
# HANDLER REGISTRY
# ============================================================================

EVERYDAY_HANDLERS = {
    "percentage-calculator": handle_percentage_calculator,
    "average-calculator": handle_average_calculator,
    "number-base-converter": handle_number_base_converter,
    "gpa-calculator": handle_gpa_calculator,
    "bmi-calculator": handle_bmi_calculator,
    "age-calculator": handle_age_calculator,
    "discount-calculator": handle_discount_calculator,
    "loan-emi-calculator": handle_loan_emi_calculator,
    "text-reverse": handle_text_reverse,
    "text-to-binary": handle_text_to_binary,
    "binary-to-text": handle_binary_to_text,
    "morse-code": handle_morse_code_encoder,
    "random-number-generator": handle_random_number_generator,
    "text-to-ascii": handle_text_to_ascii,
    "ascii-to-text": handle_ascii_to_text,
    "word-frequency": handle_word_frequency,
    "roman-numeral-converter": handle_roman_numeral_converter,
    "countdown-calculator": handle_countdown_timer,
    "tip-calculator": handle_tip_calculator,
}
