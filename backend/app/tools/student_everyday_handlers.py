"""
Extended student & everyday utility tool handlers.
Compound interest, simple interest, electricity bill, fuel cost,
time zone, date diff, password strength, color picker, and more.
All pure-Python implementations – no external APIs needed.
"""
from __future__ import annotations

import ast
import math
import random
import re
import string
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Any

from .handlers import ExecutionResult


def _text_result(data: dict[str, Any], message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)


def _get_text(payload: dict[str, Any]) -> str:
    return str(payload.get("text", "") or payload.get("input", "")).strip()


def _safe_scientific_eval(expression: str, angle_mode: str = "rad") -> float:
    """Evaluate a scientific-calculator expression with an AST whitelist."""
    angle = str(angle_mode or "rad").strip().lower()
    use_degrees = angle.startswith("deg")

    def _to_rad(value: float) -> float:
        return math.radians(value) if use_degrees else value

    def _from_rad(value: float) -> float:
        return math.degrees(value) if use_degrees else value

    functions: dict[str, Any] = {
        "sin": lambda x: math.sin(_to_rad(x)),
        "cos": lambda x: math.cos(_to_rad(x)),
        "tan": lambda x: math.tan(_to_rad(x)),
        "asin": lambda x: _from_rad(math.asin(x)),
        "acos": lambda x: _from_rad(math.acos(x)),
        "atan": lambda x: _from_rad(math.atan(x)),
        "sinh": math.sinh,
        "cosh": math.cosh,
        "tanh": math.tanh,
        "sqrt": math.sqrt,
        "cbrt": lambda x: math.copysign(abs(x) ** (1 / 3), x),
        "ln": math.log,
        "log": math.log,
        "log10": math.log10,
        "log2": math.log2,
        "exp": math.exp,
        "abs": abs,
        "round": round,
        "floor": math.floor,
        "ceil": math.ceil,
        "pow": pow,
        "factorial": math.factorial,
        "gcd": math.gcd,
        "radians": math.radians,
        "degrees": math.degrees,
    }
    constants = {"pi": math.pi, "e": math.e, "tau": math.tau}

    expr = expression.strip()
    if not expr:
        raise ValueError("Enter a math expression")
    if len(expr) > 500:
        raise ValueError("Expression is too long")
    expr = (
        expr.replace("×", "*")
        .replace("÷", "/")
        .replace("−", "-")
        .replace("π", "pi")
        .replace("^", "**")
    )
    expr = re.sub(r"(?<![\w.])(\d+(?:\.\d+)?)%", r"(\1/100)", expr)
    if re.search(r"[^0-9+\-*/().,% a-zA-Z_*\t]", expr):
        raise ValueError("Expression contains invalid characters")

    tree = ast.parse(expr, mode="eval")
    node_count = sum(1 for _ in ast.walk(tree))
    if node_count > 140:
        raise ValueError("Expression is too complex")

    def _eval(node: ast.AST) -> float:
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return float(node.value)
        if isinstance(node, ast.Name):
            key = node.id.lower()
            if key in constants:
                return float(constants[key])
            raise ValueError(f"Unknown name '{node.id}'")
        if isinstance(node, ast.UnaryOp):
            value = _eval(node.operand)
            if isinstance(node.op, ast.UAdd):
                return value
            if isinstance(node.op, ast.USub):
                return -value
            raise ValueError("Unsupported unary operator")
        if isinstance(node, ast.BinOp):
            left = _eval(node.left)
            right = _eval(node.right)
            if isinstance(node.op, ast.Add):
                return left + right
            if isinstance(node.op, ast.Sub):
                return left - right
            if isinstance(node.op, ast.Mult):
                return left * right
            if isinstance(node.op, ast.Div):
                if right == 0:
                    raise ValueError("Cannot divide by zero")
                return left / right
            if isinstance(node.op, ast.Mod):
                if right == 0:
                    raise ValueError("Cannot divide by zero")
                return left % right
            if isinstance(node.op, ast.Pow):
                if abs(right) > 1000:
                    raise ValueError("Exponent is too large")
                return left ** right
            raise ValueError("Unsupported operator")
        if isinstance(node, ast.Call):
            if not isinstance(node.func, ast.Name):
                raise ValueError("Unsupported function")
            name = node.func.id.lower()
            fn = functions.get(name)
            if not fn:
                raise ValueError(f"Unsupported function '{node.func.id}'")
            if node.keywords:
                raise ValueError("Keyword arguments are not supported")
            args = [_eval(arg) for arg in node.args]
            if name in {"factorial", "gcd"}:
                args = [int(arg) for arg in args]
            if name == "factorial" and (len(args) != 1 or args[0] < 0 or args[0] > 170):
                raise ValueError("Factorial supports whole numbers from 0 to 170")
            return float(fn(*args))
        raise ValueError("Unsupported expression")

    result = _eval(tree)
    if not math.isfinite(result):
        raise ValueError("Result is not finite")
    return result


# ============================================================================
# FINANCE & MATH
# ============================================================================

def handle_compound_interest(files, payload, output_dir) -> ExecutionResult:
    """Calculate compound interest"""
    principal = float(payload.get("value", 0) or payload.get("principal", 0))
    rate = float(payload.get("total", 0) or payload.get("rate", 0))
    time_years = float(payload.get("years", 1))
    n = int(payload.get("compound_per_year", 12))  # monthly by default

    if principal <= 0 or rate <= 0 or time_years <= 0:
        return _text_result({"error": "All values must be positive"}, "Error")

    r = rate / 100
    amount = principal * (1 + r / n) ** (n * time_years)
    interest = amount - principal

    return _text_result({
        "result": f"Amount: {amount:.2f} | Interest: {interest:.2f}",
        "principal": round(principal, 2),
        "rate": round(rate, 2),
        "time_years": time_years,
        "compound_per_year": n,
        "amount": round(amount, 2),
        "interest_earned": round(interest, 2),
    }, f"Compound Interest: {interest:.2f} | Total: {amount:.2f}")


def handle_simple_interest(files, payload, output_dir) -> ExecutionResult:
    """Calculate simple interest"""
    principal = float(payload.get("value", 0) or payload.get("principal", 0))
    rate = float(payload.get("total", 0) or payload.get("rate", 0))
    time_years = float(payload.get("years", 1))

    if principal <= 0 or rate <= 0 or time_years <= 0:
        return _text_result({"error": "All values must be positive"}, "Error")

    interest = principal * rate * time_years / 100
    amount = principal + interest

    return _text_result({
        "result": f"Interest: {interest:.2f} | Total: {amount:.2f}",
        "principal": round(principal, 2),
        "rate": round(rate, 2),
        "time_years": time_years,
        "interest": round(interest, 2),
        "total_amount": round(amount, 2),
    }, f"Simple Interest: {interest:.2f} | Total: {amount:.2f}")


def handle_salary_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate monthly/annual salary breakdown"""
    annual = float(payload.get("value", 0) or payload.get("annual", 0))
    if annual <= 0:
        return _text_result({"error": "Annual salary must be positive"}, "Error")

    monthly = annual / 12
    weekly = annual / 52
    daily = annual / 365
    hourly = annual / (52 * 40)  # 40 hours/week

    return _text_result({
        "result": f"Monthly: {monthly:.2f}",
        "annual": round(annual, 2),
        "monthly": round(monthly, 2),
        "biweekly": round(annual / 26, 2),
        "weekly": round(weekly, 2),
        "daily": round(daily, 2),
        "hourly": round(hourly, 2),
    }, f"Monthly: {monthly:.2f} | Weekly: {weekly:.2f} | Hourly: {hourly:.2f}")


def handle_fuel_cost_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate fuel cost for a trip"""
    distance = float(payload.get("value", 0) or payload.get("distance", 0))
    mileage = float(payload.get("total", 0) or payload.get("mileage", 15))
    fuel_price = float(payload.get("price", 100))

    if distance <= 0 or mileage <= 0 or fuel_price <= 0:
        return _text_result({"error": "All values must be positive"}, "Error")

    fuel_needed = distance / mileage
    total_cost = fuel_needed * fuel_price

    return _text_result({
        "result": f"Fuel: {fuel_needed:.2f}L | Cost: ₹{total_cost:.2f}",
        "distance_km": round(distance, 2),
        "mileage_kmpl": round(mileage, 2),
        "fuel_price_per_liter": round(fuel_price, 2),
        "fuel_needed_liters": round(fuel_needed, 2),
        "total_cost": round(total_cost, 2),
    }, f"Trip cost: ₹{total_cost:.2f} ({fuel_needed:.1f}L fuel)")


def handle_electricity_bill_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate electricity bill from units consumed"""
    units = float(payload.get("value", 0) or payload.get("units", 0))
    rate = float(payload.get("total", 0) or payload.get("rate", 7))  # ₹/unit

    if units <= 0:
        return _text_result({"error": "Units must be positive"}, "Error")

    # Slab-based calculation (Indian standard)
    cost = 0
    remaining = units
    slabs = [(100, 3.5), (200, 5.5), (200, 7.0), (float('inf'), 8.5)]
    slab_details = []

    for slab_units, slab_rate in slabs:
        if remaining <= 0:
            break
        consumed = min(remaining, slab_units)
        slab_cost = consumed * slab_rate
        cost += slab_cost
        slab_details.append({"units": consumed, "rate": slab_rate, "cost": round(slab_cost, 2)})
        remaining -= consumed

    # Or simple calculation if rate given
    simple_cost = units * rate

    return _text_result({
        "result": f"Slab-based: ₹{cost:.2f} | Flat rate: ₹{simple_cost:.2f}",
        "units_consumed": round(units, 2),
        "slab_based_cost": round(cost, 2),
        "flat_rate_cost": round(simple_cost, 2),
        "rate_per_unit": round(rate, 2),
        "slabs": slab_details,
    }, f"Electricity Bill: ₹{cost:.2f} (slab) / ₹{simple_cost:.2f} (flat)")


def handle_speed_distance_time(files, payload, output_dir) -> ExecutionResult:
    """Calculate speed, distance, or time given two values"""
    mode = str(payload.get("mode", "speed")).lower()
    val1 = float(payload.get("value", 0))
    val2 = float(payload.get("total", 0))

    if val1 <= 0 or val2 <= 0:
        return _text_result({"error": "Values must be positive"}, "Error")

    if mode == "speed":
        # distance / time = speed
        result = val1 / val2
        return _text_result({
            "result": f"Speed: {result:.2f} km/h",
            "distance": val1, "time_hours": val2, "speed": round(result, 4),
        }, f"Speed = {result:.2f} km/h")
    elif mode == "distance":
        # speed × time = distance
        result = val1 * val2
        return _text_result({
            "result": f"Distance: {result:.2f} km",
            "speed": val1, "time_hours": val2, "distance": round(result, 4),
        }, f"Distance = {result:.2f} km")
    else:  # time
        # distance / speed = time
        result = val1 / val2
        hours = int(result)
        minutes = int((result - hours) * 60)
        return _text_result({
            "result": f"Time: {hours}h {minutes}m",
            "distance": val1, "speed": val2, "time_hours": round(result, 4),
        }, f"Time = {hours}h {minutes}m")


def handle_profit_loss_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate profit or loss percentage"""
    cost_price = float(payload.get("value", 0) or payload.get("cost", 0))
    selling_price = float(payload.get("total", 0) or payload.get("selling", 0))

    if cost_price <= 0 or selling_price <= 0:
        return _text_result({"error": "Prices must be positive"}, "Error")

    diff = selling_price - cost_price
    pct = (diff / cost_price) * 100
    status = "Profit" if diff > 0 else "Loss" if diff < 0 else "Break-even"

    return _text_result({
        "result": f"{status}: {abs(diff):.2f} ({abs(pct):.2f}%)",
        "cost_price": round(cost_price, 2),
        "selling_price": round(selling_price, 2),
        "difference": round(diff, 2),
        "percentage": round(pct, 2),
        "status": status,
    }, f"{status}: {abs(diff):.2f} ({abs(pct):.2f}%)")


def handle_cgpa_to_percentage(files, payload, output_dir) -> ExecutionResult:
    """Convert CGPA to percentage and vice versa"""
    text = _get_text(payload)
    mode = str(payload.get("mode", "cgpa_to_pct")).lower()
    value = float(payload.get("value", 0) or (float(text) if text else 0))

    if value <= 0:
        return _text_result({"error": "Enter a valid positive number"}, "Error")

    if mode == "pct_to_cgpa":
        # Percentage to CGPA (divide by 9.5 — CBSE standard)
        cgpa = value / 9.5
        return _text_result({
            "result": f"CGPA: {cgpa:.2f}",
            "percentage": round(value, 2),
            "cgpa": round(cgpa, 2),
            "formula": "CGPA = Percentage / 9.5",
        }, f"{value}% = {cgpa:.2f} CGPA")
    else:
        # CGPA to Percentage (multiply by 9.5 — CBSE standard)
        pct = value * 9.5
        return _text_result({
            "result": f"Percentage: {pct:.2f}%",
            "cgpa": round(value, 2),
            "percentage": round(pct, 2),
            "formula": "Percentage = CGPA × 9.5",
        }, f"{value} CGPA = {pct:.2f}%")


# ============================================================================
# DATE & TIME TOOLS
# ============================================================================

def handle_date_difference(files, payload, output_dir) -> ExecutionResult:
    """Calculate difference between two dates"""
    date1_str = str(payload.get("text", "")).strip()
    date2_str = str(payload.get("text2", "") or payload.get("date2", "")).strip()

    if not date1_str:
        return _text_result({"error": "Provide at least one date (YYYY-MM-DD)"}, "Error")

    for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"]:
        try:
            d1 = datetime.strptime(date1_str, fmt)
            break
        except ValueError:
            continue
    else:
        return _text_result({"error": "Invalid date 1. Use YYYY-MM-DD"}, "Error")

    if date2_str:
        for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"]:
            try:
                d2 = datetime.strptime(date2_str, fmt)
                break
            except ValueError:
                continue
        else:
            return _text_result({"error": "Invalid date 2. Use YYYY-MM-DD"}, "Error")
    else:
        d2 = datetime.now()

    diff = abs(d2 - d1)
    total_days = diff.days
    years = total_days // 365
    months = (total_days % 365) // 30
    days = (total_days % 365) % 30

    return _text_result({
        "result": f"{years}y {months}m {days}d ({total_days:,} days)",
        "total_days": total_days,
        "years": years,
        "months": months,
        "days": days,
        "total_weeks": total_days // 7,
        "total_hours": total_days * 24,
        "total_minutes": total_days * 24 * 60,
    }, f"Difference: {years}y {months}m {days}d ({total_days:,} days)")


def handle_time_zone_converter(files, payload, output_dir) -> ExecutionResult:
    """Convert time between timezones"""
    text = _get_text(payload)
    from_tz = str(payload.get("from_tz", "IST")).upper().strip()
    to_tz = str(payload.get("to_tz", "UTC")).upper().strip()

    # Timezone offsets from UTC
    tz_offsets = {
        "UTC": 0, "GMT": 0, "IST": 5.5, "EST": -5, "EDT": -4,
        "CST": -6, "CDT": -5, "MST": -7, "MDT": -6, "PST": -8,
        "PDT": -7, "JST": 9, "KST": 9, "CST_CHINA": 8, "AEST": 10,
        "AEDT": 11, "NZST": 12, "CET": 1, "CEST": 2, "EET": 2,
        "SGT": 8, "HKT": 8, "ICT": 7, "WIB": 7, "PKT": 5,
        "BDT": 6, "NPT": 5.75, "GST": 4, "AST": 3, "MSK": 3,
    }

    if from_tz not in tz_offsets or to_tz not in tz_offsets:
        return _text_result({
            "error": f"Unknown timezone. Supported: {', '.join(sorted(tz_offsets.keys()))}",
        }, "Error")

    # Parse time
    if text:
        for fmt in ["%H:%M", "%I:%M %p", "%H:%M:%S"]:
            try:
                t = datetime.strptime(text, fmt)
                break
            except ValueError:
                continue
        else:
            return _text_result({"error": "Invalid time format. Use HH:MM or HH:MM AM/PM"}, "Error")
    else:
        t = datetime.now()

    offset_diff = tz_offsets[to_tz] - tz_offsets[from_tz]
    converted = t + timedelta(hours=offset_diff)

    return _text_result({
        "result": f"{t.strftime('%H:%M')} {from_tz} = {converted.strftime('%H:%M')} {to_tz}",
        "from_time": t.strftime("%H:%M"),
        "from_tz": from_tz,
        "to_time": converted.strftime("%H:%M"),
        "to_tz": to_tz,
        "offset_hours": offset_diff,
    }, f"{t.strftime('%H:%M')} {from_tz} → {converted.strftime('%H:%M')} {to_tz}")


# ============================================================================
# TEXT & STRING TOOLS
# ============================================================================

def handle_password_strength_checker(files, payload, output_dir) -> ExecutionResult:
    """Check password strength"""
    password = _get_text(payload)
    if not password:
        return _text_result({"error": "No password provided"}, "Error")

    score = 0
    feedback = []

    if len(password) >= 8:
        score += 1
    else:
        feedback.append("At least 8 characters")
    if len(password) >= 12:
        score += 1
    if len(password) >= 16:
        score += 1
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Add lowercase letters")
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Add uppercase letters")
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Add numbers")
    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>?/~`]', password):
        score += 1
    else:
        feedback.append("Add special characters")
    if not re.search(r'(.)\1{2,}', password):
        score += 1
    else:
        feedback.append("Avoid repeated characters")

    strength = (
        "Very Weak" if score <= 2 else
        "Weak" if score <= 4 else
        "Medium" if score <= 5 else
        "Strong" if score <= 7 else
        "Very Strong"
    )

    entropy = len(password) * math.log2(len(set(password))) if password else 0

    return _text_result({
        "result": f"{strength} ({score}/8)",
        "strength": strength,
        "score": score,
        "max_score": 8,
        "length": len(password),
        "entropy_bits": round(entropy, 1),
        "suggestions": feedback if feedback else ["Great password!"],
    }, f"Password Strength: {strength} ({score}/8)")


def handle_text_to_hex(files, payload, output_dir) -> ExecutionResult:
    """Convert text to hexadecimal"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    hex_val = text.encode("utf-8").hex()
    formatted = " ".join(hex_val[i:i+2] for i in range(0, len(hex_val), 2))
    return _text_result({"result": formatted, "raw_hex": hex_val}, "Text converted to hex")


def handle_hex_to_text(files, payload, output_dir) -> ExecutionResult:
    """Convert hexadecimal to text"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No hex input provided"}, "Error")
    try:
        clean = text.replace(" ", "").replace("0x", "").replace(",", "")
        decoded = bytes.fromhex(clean).decode("utf-8")
        return _text_result({"result": decoded}, "Hex converted to text")
    except Exception as e:
        return _text_result({"error": f"Invalid hex: {e}"}, "Error")


def handle_text_to_unicode(files, payload, output_dir) -> ExecutionResult:
    """Convert text to Unicode escape sequences"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    unicode_vals = [f"\\u{ord(c):04x}" for c in text]
    return _text_result({
        "result": "".join(unicode_vals),
        "characters": len(text),
        "code_points": [f"U+{ord(c):04X}" for c in text[:100]],
    }, "Text converted to Unicode")


def handle_unicode_to_text(files, payload, output_dir) -> ExecutionResult:
    """Convert Unicode escape sequences to text"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No Unicode input provided"}, "Error")
    try:
        decoded = text.encode().decode("unicode_escape")
        return _text_result({"result": decoded}, "Unicode converted to text")
    except Exception:
        try:
            # Try parsing U+XXXX format
            codes = re.findall(r'U\+([0-9A-Fa-f]{4,6})', text)
            decoded = "".join(chr(int(c, 16)) for c in codes)
            return _text_result({"result": decoded}, "Unicode converted to text")
        except Exception as e:
            return _text_result({"error": f"Invalid Unicode: {e}"}, "Error")


def handle_string_hash_generator(files, payload, output_dir) -> ExecutionResult:
    """Generate multiple hash formats from text"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    encoded = text.encode("utf-8")
    hashes = {
        "md5": hashlib.md5(encoded).hexdigest(),
        "sha1": hashlib.sha1(encoded).hexdigest(),
        "sha256": hashlib.sha256(encoded).hexdigest(),
        "sha512": hashlib.sha512(encoded).hexdigest(),
    }

    result_text = "\n".join(f"{k.upper()}: {v}" for k, v in hashes.items())
    return _text_result({
        "result": result_text,
        **hashes,
        "input_length": len(text),
    }, f"Generated 4 hashes for {len(text)} chars")


def handle_text_statistics(files, payload, output_dir) -> ExecutionResult:
    """Complete text statistics including sentences, paragraphs, etc."""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    words = re.findall(r'\b\w+\b', text)
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    lines = text.split("\n")
    unique_words = len(set(w.lower() for w in words))

    # Average word length
    avg_word_len = sum(len(w) for w in words) / max(1, len(words))
    # Average sentence length
    avg_sent_len = len(words) / max(1, len(sentences))

    # Reading time
    reading_time_min = len(words) / 200
    speaking_time_min = len(words) / 130

    return _text_result({
        "result": f"Words: {len(words)} | Sentences: {len(sentences)} | Reading: {reading_time_min:.1f} min",
        "characters": len(text),
        "characters_no_spaces": len(text.replace(" ", "").replace("\n", "").replace("\t", "")),
        "words": len(words),
        "unique_words": unique_words,
        "sentences": len(sentences),
        "paragraphs": len(paragraphs),
        "lines": len(lines),
        "avg_word_length": round(avg_word_len, 1),
        "avg_sentence_length": round(avg_sent_len, 1),
        "reading_time_minutes": round(reading_time_min, 1),
        "speaking_time_minutes": round(speaking_time_min, 1),
    }, f"Text stats: {len(words)} words, {len(sentences)} sentences")


def handle_case_converter_advanced(files, payload, output_dir) -> ExecutionResult:
    """Advanced case converter with many modes"""
    text = _get_text(payload)
    mode = str(payload.get("mode", "camelCase")).strip()
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    words = re.findall(r'[a-zA-Z0-9]+', text)

    if mode == "camelCase":
        result = words[0].lower() + "".join(w.capitalize() for w in words[1:]) if words else ""
    elif mode == "PascalCase":
        result = "".join(w.capitalize() for w in words)
    elif mode == "snake_case":
        result = "_".join(w.lower() for w in words)
    elif mode == "SCREAMING_SNAKE":
        result = "_".join(w.upper() for w in words)
    elif mode == "kebab-case":
        result = "-".join(w.lower() for w in words)
    elif mode == "dot.case":
        result = ".".join(w.lower() for w in words)
    elif mode == "path/case":
        result = "/".join(w.lower() for w in words)
    elif mode == "CONSTANT":
        result = "_".join(w.upper() for w in words)
    elif mode == "alternating":
        result = "".join(c.upper() if i % 2 else c.lower() for i, c in enumerate(text))
    elif mode == "inverse":
        result = text.swapcase()
    elif mode == "capitalize":
        result = text.capitalize()
    else:
        result = text.title()

    return _text_result({
        "result": result,
        "mode": mode,
        "original": text[:200],
    }, f"Converted to {mode}")


def handle_coin_flip(files, payload, output_dir) -> ExecutionResult:
    """Flip a coin"""
    count = max(1, min(100, int(payload.get("count", 1))))
    flips = [random.choice(["Heads", "Tails"]) for _ in range(count)]
    heads = flips.count("Heads")
    tails = flips.count("Tails")

    return _text_result({
        "result": ", ".join(flips) if count <= 20 else f"Heads: {heads} | Tails: {tails}",
        "flips": flips[:50],
        "heads": heads,
        "tails": tails,
        "count": count,
    }, f"Coin flip: {'Heads' if count == 1 else f'Heads: {heads}, Tails: {tails}'}")


def handle_dice_roller(files, payload, output_dir) -> ExecutionResult:
    """Roll dice"""
    sides = max(2, min(100, int(payload.get("value", 6) or payload.get("sides", 6))))
    count = max(1, min(50, int(payload.get("count", 1))))
    rolls = [random.randint(1, sides) for _ in range(count)]

    return _text_result({
        "result": ", ".join(map(str, rolls)),
        "rolls": rolls,
        "total": sum(rolls),
        "average": round(sum(rolls) / len(rolls), 2),
        "sides": sides,
        "count": count,
        "min_roll": min(rolls),
        "max_roll": max(rolls),
    }, f"Rolled {count}d{sides}: {', '.join(map(str, rolls))} (Total: {sum(rolls)})")


def handle_stopwatch_calculator(files, payload, output_dir) -> ExecutionResult:
    """Convert time between hours, minutes, seconds"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "Enter time in format HH:MM:SS or total seconds"}, "Error")

    try:
        total_seconds = int(float(text))
    except ValueError:
        parts = text.split(":")
        try:
            if len(parts) == 3:
                total_seconds = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
            elif len(parts) == 2:
                total_seconds = int(parts[0]) * 60 + int(parts[1])
            else:
                return _text_result({"error": "Use HH:MM:SS format or total seconds"}, "Error")
        except ValueError:
            return _text_result({"error": "Invalid time format"}, "Error")

    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60

    return _text_result({
        "result": f"{hours:02d}:{minutes:02d}:{seconds:02d}",
        "total_seconds": total_seconds,
        "total_minutes": round(total_seconds / 60, 2),
        "total_hours": round(total_seconds / 3600, 4),
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
    }, f"Time: {hours:02d}:{minutes:02d}:{seconds:02d} ({total_seconds:,}s)")


def handle_scientific_calculator(files, payload, output_dir) -> ExecutionResult:
    """Evaluate mathematical expressions safely."""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "Enter a math expression"}, "Error")

    try:
        angle_mode = str(
            payload.get("angle_mode")
            or payload.get("angleMode")
            or payload.get("angle")
            or payload.get("mode")
            or "rad"
        )
        result = _safe_scientific_eval(text, angle_mode)
        formatted = f"{result:.12g}"
        return _text_result({
            "result": formatted,
            "expression": text,
            "value": result,
            "angle_mode": "deg" if angle_mode.lower().startswith("deg") else "rad",
            "supported_functions": [
                "sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "cbrt",
                "ln", "log", "log10", "log2", "exp", "abs", "pow", "factorial",
            ],
        }, f"{text} = {formatted}")
    except Exception as e:
        return _text_result({"error": f"Calculation error: {e}"}, "Error")


def handle_unit_price_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate unit price to compare products"""
    price = float(payload.get("value", 0) or payload.get("price", 0))
    quantity = float(payload.get("total", 0) or payload.get("quantity", 0))
    unit = str(payload.get("unit", "unit")).strip()

    if price <= 0 or quantity <= 0:
        return _text_result({"error": "Price and quantity must be positive"}, "Error")

    unit_price = price / quantity

    return _text_result({
        "result": f"₹{unit_price:.4f} per {unit}",
        "total_price": round(price, 2),
        "quantity": round(quantity, 2),
        "unit": unit,
        "unit_price": round(unit_price, 4),
    }, f"Unit price: ₹{unit_price:.4f}/{unit}")


def handle_number_to_words(files, payload, output_dir) -> ExecutionResult:
    """Convert number to words"""
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No number provided"}, "Error")

    try:
        num = int(float(text))
    except ValueError:
        return _text_result({"error": "Invalid number"}, "Error")

    if num == 0:
        return _text_result({"result": "Zero", "number": 0}, "Zero")

    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    def _convert(n):
        if n < 0:
            return "Negative " + _convert(-n)
        if n < 20:
            return ones[n]
        if n < 100:
            return tens[n // 10] + (" " + ones[n % 10] if n % 10 else "")
        if n < 1000:
            return ones[n // 100] + " Hundred" + (" and " + _convert(n % 100) if n % 100 else "")
        if n < 100000:
            return _convert(n // 1000) + " Thousand" + (" " + _convert(n % 1000) if n % 1000 else "")
        if n < 10000000:
            return _convert(n // 100000) + " Lakh" + (" " + _convert(n % 100000) if n % 100000 else "")
        return _convert(n // 10000000) + " Crore" + (" " + _convert(n % 10000000) if n % 10000000 else "")

    words = _convert(num)
    return _text_result({"result": words, "number": num}, f"{num} = {words}")


# ============================================================================
# HANDLER REGISTRY
# ============================================================================

STUDENT_EVERYDAY_HANDLERS = {
    "compound-interest-calculator": handle_compound_interest,
    "simple-interest-calculator": handle_simple_interest,
    "salary-calculator": handle_salary_calculator,
    "fuel-cost-calculator": handle_fuel_cost_calculator,
    "electricity-bill-calculator": handle_electricity_bill_calculator,
    "speed-distance-time": handle_speed_distance_time,
    "profit-loss-calculator": handle_profit_loss_calculator,
    "cgpa-to-percentage": handle_cgpa_to_percentage,
    "date-difference": handle_date_difference,
    "time-zone-converter": handle_time_zone_converter,
    "password-strength-checker": handle_password_strength_checker,
    "text-to-hex": handle_text_to_hex,
    "hex-to-text": handle_hex_to_text,
    "text-to-unicode": handle_text_to_unicode,
    "unicode-to-text": handle_unicode_to_text,
    "string-hash-generator": handle_string_hash_generator,
    "text-statistics": handle_text_statistics,
    "case-converter-advanced": handle_case_converter_advanced,
    "coin-flip": handle_coin_flip,
    "dice-roller": handle_dice_roller,
    "stopwatch-calculator": handle_stopwatch_calculator,
    "scientific-calculator": handle_scientific_calculator,
    "unit-price-calculator": handle_unit_price_calculator,
    "number-to-words": handle_number_to_words,
}
