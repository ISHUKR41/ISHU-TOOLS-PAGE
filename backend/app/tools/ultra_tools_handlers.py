"""
ISHU TOOLS — Ultra Tools Handlers (v3)
Handles 40+ new tools: validators, calculators, CSS generators, health, finance, and more.
"""
from __future__ import annotations

import json
import math
import re
import random
import string
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

from .handlers import HANDLERS, ExecutionResult


def _make_json(data: dict, msg: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=msg, data=data)


# ─── 1. Text Readability Score ─────────────────────────────────────────────
def _handle_text_readability_score(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please provide text to analyze."}, "No text")

    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    words = re.findall(r'\b\w+\b', text)
    syllables = sum(_count_syllables(w) for w in words)

    num_sentences = max(len(sentences), 1)
    num_words = max(len(words), 1)
    num_syllables = syllables

    asl = num_words / num_sentences
    asw = num_syllables / num_words

    flesch_reading_ease = 206.835 - (1.015 * asl) - (84.6 * asw)
    flesch_kincaid_grade = (0.39 * asl) + (11.8 * asw) - 15.59

    flesch_reading_ease = round(max(0, min(100, flesch_reading_ease)), 1)
    flesch_kincaid_grade = round(max(0, flesch_kincaid_grade), 1)

    if flesch_reading_ease >= 90:
        level = "Very Easy"
        audience = "5th grade students"
    elif flesch_reading_ease >= 80:
        level = "Easy"
        audience = "6th grade students"
    elif flesch_reading_ease >= 70:
        level = "Fairly Easy"
        audience = "7th grade students"
    elif flesch_reading_ease >= 60:
        level = "Standard"
        audience = "8th–9th grade students"
    elif flesch_reading_ease >= 50:
        level = "Fairly Difficult"
        audience = "10th–12th grade students"
    elif flesch_reading_ease >= 30:
        level = "Difficult"
        audience = "College level"
    else:
        level = "Very Confusing"
        audience = "Professional / Academic"

    avg_word_length = round(sum(len(w) for w in words) / num_words, 1)

    return _make_json({
        "flesch_reading_ease": flesch_reading_ease,
        "flesch_kincaid_grade": flesch_kincaid_grade,
        "readability_level": level,
        "best_for": audience,
        "word_count": num_words,
        "sentence_count": num_sentences,
        "syllable_count": num_syllables,
        "avg_words_per_sentence": round(asl, 1),
        "avg_syllables_per_word": round(asw, 2),
        "avg_word_length": avg_word_length,
        "character_count": len(text),
        "paragraph_count": len([p for p in text.split("\n") if p.strip()]),
    }, f"Readability: {level} (Flesch: {flesch_reading_ease})")


def _count_syllables(word: str) -> int:
    word = word.lower()
    word = re.sub(r'[^a-z]', '', word)
    if not word:
        return 0
    if len(word) <= 3:
        return 1
    word = re.sub(r'e$', '', word)
    vowels = re.findall(r'[aeiouy]+', word)
    return max(1, len(vowels))


# ─── 2. Cron Expression Builder ────────────────────────────────────────────
def _handle_cron_builder(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    expression = str(payload.get("expression", "")).strip()
    if not expression:
        return _make_json({"error": "Please provide a cron expression (e.g. '0 9 * * 1-5')"}, "No expression")

    parts = expression.split()
    if len(parts) not in (5, 6):
        return _make_json({"error": "Cron expression must have 5 or 6 space-separated fields: minute hour day month weekday [year]"}, "Invalid format")

    labels = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"]
    if len(parts) == 6:
        labels.append("Year")

    explained = []
    for label, part in zip(labels, parts):
        explained.append({"field": label, "value": part, "meaning": _explain_cron_field(label, part)})

    human = _cron_to_human(parts)

    # Next 5 run times (simplified)
    return _make_json({
        "expression": expression,
        "human_readable": human,
        "fields": explained,
        "common_examples": [
            {"expr": "* * * * *", "desc": "Every minute"},
            {"expr": "0 * * * *", "desc": "Every hour"},
            {"expr": "0 0 * * *", "desc": "Every day at midnight"},
            {"expr": "0 9 * * 1-5", "desc": "Weekdays at 9 AM"},
            {"expr": "0 0 1 * *", "desc": "First day of every month"},
            {"expr": "0 0 * * 0", "desc": "Every Sunday at midnight"},
            {"expr": "*/15 * * * *", "desc": "Every 15 minutes"},
            {"expr": "0 9,17 * * *", "desc": "9 AM and 5 PM daily"},
        ],
    }, f"Cron: {human}")


def _explain_cron_field(label: str, value: str) -> str:
    if value == "*":
        return f"Every {label.lower()}"
    if value.startswith("*/"):
        return f"Every {value[2:]} {label.lower()}s"
    if "-" in value:
        return f"{label} range: {value}"
    if "," in value:
        return f"{label}s: {value}"
    return f"{label} = {value}"


def _cron_to_human(parts: list[str]) -> str:
    minute, hour, dom, month, dow = parts[0], parts[1], parts[2], parts[3], parts[4]
    if all(p == "*" for p in [minute, hour, dom, month, dow]):
        return "Every minute"
    if minute != "*" and hour != "*" and dom == "*" and month == "*" and dow == "*":
        return f"Every day at {hour}:{minute.zfill(2)}"
    if minute == "0" and hour == "*" and dom == "*" and month == "*" and dow == "*":
        return "Every hour, on the hour"
    if minute.startswith("*/"):
        return f"Every {minute[2:]} minutes"
    return f"Custom schedule: {' '.join(parts)}"


# ─── 3. Investment Return Calculator ───────────────────────────────────────
def _handle_investment_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        principal = float(payload.get("principal", 0))
        rate = float(payload.get("rate", 10))
        years = float(payload.get("years", 10))
        mode = str(payload.get("mode", "compound")).lower()
        contribution = float(payload.get("monthly_contribution", 0))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid numeric values."}, "Invalid input")

    if principal < 0 or rate < 0 or years <= 0:
        return _make_json({"error": "Values must be positive. Years must be > 0."}, "Invalid")

    r = rate / 100

    if mode == "simple":
        interest = principal * r * years
        total = principal + interest
        monthly_data = []
    else:
        # Compound + monthly contributions
        monthly_rate = r / 12
        months = int(years * 12)
        total = principal * ((1 + monthly_rate) ** months)
        if contribution > 0 and monthly_rate > 0:
            total += contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate)
        elif contribution > 0:
            total += contribution * months
        interest = total - principal - (contribution * months)
        monthly_data = []
        running = principal
        for yr in range(1, min(int(years) + 1, 31)):
            m = yr * 12
            val = principal * ((1 + monthly_rate) ** m)
            if contribution > 0 and monthly_rate > 0:
                val += contribution * (((1 + monthly_rate) ** m - 1) / monthly_rate)
            elif contribution > 0:
                val += contribution * m
            monthly_data.append({"year": yr, "value": round(val, 2)})

    total_invested = principal + contribution * int(years * 12)

    return _make_json({
        "initial_investment": round(principal, 2),
        "total_invested": round(total_invested, 2),
        "interest_rate_pa": rate,
        "years": years,
        "compound_mode": mode,
        "monthly_contribution": contribution,
        "final_amount": round(total, 2),
        "total_interest": round(total - total_invested, 2),
        "wealth_created": round(total - principal, 2),
        "cagr": round(rate, 2),
        "yearly_projection": monthly_data[:20],
    }, f"Final Amount: ₹{round(total, 2):,.2f}")


# ─── 4. Net Worth Calculator ───────────────────────────────────────────────
def _handle_net_worth_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        cash = float(payload.get("cash", 0))
        investments = float(payload.get("investments", 0))
        real_estate = float(payload.get("real_estate", 0))
        vehicle = float(payload.get("vehicle", 0))
        other_assets = float(payload.get("other_assets", 0))
        home_loan = float(payload.get("home_loan", 0))
        car_loan = float(payload.get("car_loan", 0))
        personal_loan = float(payload.get("personal_loan", 0))
        credit_card = float(payload.get("credit_card", 0))
        other_liabilities = float(payload.get("other_liabilities", 0))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid numeric values."}, "Invalid input")

    total_assets = cash + investments + real_estate + vehicle + other_assets
    total_liabilities = home_loan + car_loan + personal_loan + credit_card + other_liabilities
    net_worth = total_assets - total_liabilities

    debt_to_asset_ratio = round((total_liabilities / total_assets * 100), 1) if total_assets > 0 else 0

    if net_worth > 10_000_000:
        status = "Excellent — You are financially very strong!"
    elif net_worth > 1_000_000:
        status = "Great — Strong net worth"
    elif net_worth > 0:
        status = "Positive — Keep growing your assets"
    elif net_worth == 0:
        status = "Neutral — Assets equal liabilities"
    else:
        status = "Negative — Focus on debt reduction"

    return _make_json({
        "assets": {
            "cash_savings": round(cash, 2),
            "investments_stocks_mf": round(investments, 2),
            "real_estate": round(real_estate, 2),
            "vehicles": round(vehicle, 2),
            "other_assets": round(other_assets, 2),
            "total_assets": round(total_assets, 2),
        },
        "liabilities": {
            "home_loan": round(home_loan, 2),
            "car_loan": round(car_loan, 2),
            "personal_loan": round(personal_loan, 2),
            "credit_card_debt": round(credit_card, 2),
            "other_liabilities": round(other_liabilities, 2),
            "total_liabilities": round(total_liabilities, 2),
        },
        "net_worth": round(net_worth, 2),
        "debt_to_asset_ratio_percent": debt_to_asset_ratio,
        "financial_status": status,
    }, f"Net Worth: ₹{net_worth:,.2f}")


# ─── 5. Retirement Planner ─────────────────────────────────────────────────
def _handle_retirement_planner(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        current_age = int(payload.get("current_age", 30))
        retirement_age = int(payload.get("retirement_age", 60))
        monthly_expense = float(payload.get("monthly_expense", 50000))
        current_savings = float(payload.get("current_savings", 0))
        monthly_saving = float(payload.get("monthly_saving", 10000))
        expected_return = float(payload.get("expected_return", 10))
        inflation = float(payload.get("inflation", 6))
        life_expectancy = int(payload.get("life_expectancy", 80))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    years_to_retire = max(retirement_age - current_age, 1)
    retirement_years = max(life_expectancy - retirement_age, 1)
    monthly_rate = expected_return / 100 / 12

    # Corpus needed at retirement (inflation adjusted)
    future_monthly_expense = monthly_expense * ((1 + inflation / 100) ** years_to_retire)
    annual_expense_at_retirement = future_monthly_expense * 12
    # 4% withdrawal rule adjusted for inflation
    corpus_needed = annual_expense_at_retirement * retirement_years * (1 - (1 / ((1 + (expected_return - inflation) / 100) ** retirement_years)))
    if (expected_return - inflation) <= 0:
        corpus_needed = annual_expense_at_retirement * retirement_years

    # Projected savings at retirement
    months = years_to_retire * 12
    projected_corpus = current_savings * ((1 + monthly_rate) ** months)
    if monthly_rate > 0:
        projected_corpus += monthly_saving * (((1 + monthly_rate) ** months - 1) / monthly_rate)
    else:
        projected_corpus += monthly_saving * months

    gap = corpus_needed - projected_corpus
    monthly_needed = 0
    if gap > 0 and monthly_rate > 0:
        monthly_needed = gap * monthly_rate / (((1 + monthly_rate) ** months) - 1)

    return _make_json({
        "current_age": current_age,
        "retirement_age": retirement_age,
        "years_to_retirement": years_to_retire,
        "retirement_years": retirement_years,
        "current_monthly_expense": round(monthly_expense, 2),
        "future_monthly_expense_at_retirement": round(future_monthly_expense, 2),
        "corpus_required": round(corpus_needed, 2),
        "projected_corpus": round(projected_corpus, 2),
        "corpus_gap": round(max(0, gap), 2),
        "additional_monthly_saving_needed": round(max(0, monthly_needed), 2),
        "is_on_track": projected_corpus >= corpus_needed,
        "inflation_rate": inflation,
        "expected_return": expected_return,
    }, f"Corpus Needed: ₹{corpus_needed:,.0f}")


# ─── 6. Pace Calculator ────────────────────────────────────────────────────
def _handle_pace_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        distance_km = float(payload.get("distance", 5))
        time_minutes = float(payload.get("time_minutes", 30))
        unit = str(payload.get("unit", "km"))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid distance and time values."}, "Invalid input")

    if distance_km <= 0 or time_minutes <= 0:
        return _make_json({"error": "Distance and time must be positive."}, "Invalid")

    if unit == "miles":
        distance_km = distance_km * 1.60934

    pace_min_per_km = time_minutes / distance_km
    speed_kmh = distance_km / (time_minutes / 60)
    pace_min_per_mile = time_minutes / (distance_km / 1.60934)

    pace_minutes = int(pace_min_per_km)
    pace_seconds = round((pace_min_per_km - pace_minutes) * 60)

    mile_minutes = int(pace_min_per_mile)
    mile_seconds = round((pace_min_per_mile - mile_minutes) * 60)

    def finish_time(dist: float, pace: float) -> str:
        total = dist * pace
        h = int(total // 60)
        m = int(total % 60)
        s = round((total - int(total)) * 60)
        return f"{h}h {m}m {s}s" if h > 0 else f"{m}m {s}s"

    return _make_json({
        "distance_km": round(distance_km, 2),
        "time_minutes": round(time_minutes, 2),
        "pace_per_km": f"{pace_minutes}:{str(pace_seconds).zfill(2)} min/km",
        "pace_per_mile": f"{mile_minutes}:{str(mile_seconds).zfill(2)} min/mile",
        "speed_kmh": round(speed_kmh, 2),
        "speed_mph": round(speed_kmh / 1.60934, 2),
        "race_predictions": {
            "5K": finish_time(5, pace_min_per_km),
            "10K": finish_time(10, pace_min_per_km),
            "Half Marathon (21.1km)": finish_time(21.1, pace_min_per_km),
            "Marathon (42.2km)": finish_time(42.2, pace_min_per_km),
        },
    }, f"Pace: {pace_minutes}:{str(pace_seconds).zfill(2)} min/km | Speed: {round(speed_kmh, 1)} km/h")


# ─── 7. Menstrual Cycle Calculator ─────────────────────────────────────────
def _handle_menstrual_cycle_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        last_period_str = str(payload.get("last_period_date", "")).strip()
        cycle_length = int(payload.get("cycle_length", 28))
        period_duration = int(payload.get("period_duration", 5))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    try:
        last_period = datetime.strptime(last_period_str, "%Y-%m-%d").date()
    except ValueError:
        try:
            last_period = datetime.strptime(last_period_str, "%d/%m/%Y").date()
        except ValueError:
            last_period = date.today() - timedelta(days=14)

    ovulation_day = last_period + timedelta(days=cycle_length - 14)
    fertile_start = ovulation_day - timedelta(days=5)
    fertile_end = ovulation_day + timedelta(days=1)
    next_period = last_period + timedelta(days=cycle_length)
    period_end = last_period + timedelta(days=period_duration)

    next_3_periods = []
    for i in range(1, 4):
        np = last_period + timedelta(days=cycle_length * i)
        next_3_periods.append(np.strftime("%d %b %Y"))

    today = date.today()
    days_until_next = (next_period - today).days

    phase = "Menstrual"
    if today > period_end:
        if today < fertile_start:
            phase = "Follicular"
        elif fertile_start <= today <= fertile_end:
            phase = "Fertile Window"
        elif today == ovulation_day:
            phase = "Ovulation Day"
        elif today < next_period:
            phase = "Luteal"

    return _make_json({
        "last_period": last_period.strftime("%d %b %Y"),
        "period_end": period_end.strftime("%d %b %Y"),
        "ovulation_day": ovulation_day.strftime("%d %b %Y"),
        "fertile_window": f"{fertile_start.strftime('%d %b')} — {fertile_end.strftime('%d %b %Y')}",
        "next_period": next_period.strftime("%d %b %Y"),
        "days_until_next_period": days_until_next,
        "current_cycle_phase": phase,
        "next_3_periods": next_3_periods,
        "cycle_length_days": cycle_length,
        "period_duration_days": period_duration,
    }, f"Next Period: {next_period.strftime('%d %b %Y')} ({days_until_next} days)")


# ─── 8. Pregnancy Week Calculator ──────────────────────────────────────────
def _handle_pregnancy_week_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        lmp_str = str(payload.get("lmp_date", "")).strip()
        lmp = datetime.strptime(lmp_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter the first day of your Last Menstrual Period (LMP) in YYYY-MM-DD format."}, "Invalid date")

    today = date.today()
    days_pregnant = (today - lmp).days

    if days_pregnant < 0:
        return _make_json({"error": "LMP date cannot be in the future."}, "Invalid date")

    weeks = days_pregnant // 7
    days = days_pregnant % 7
    due_date = lmp + timedelta(days=280)

    days_to_due = (due_date - today).days

    if weeks < 13:
        trimester = "First Trimester (Weeks 1–12)"
    elif weeks < 28:
        trimester = "Second Trimester (Weeks 13–27)"
    else:
        trimester = "Third Trimester (Weeks 28–40)"

    # Milestones
    milestones = []
    important_weeks = {
        4: "Implantation complete, HCG rising",
        6: "Heartbeat may be detected",
        8: "Baby is size of a raspberry",
        10: "End of embryonic period, now a fetus",
        12: "End of first trimester",
        16: "Baby can hear sounds",
        18: "Anatomy scan recommended",
        20: "Halfway! Anatomy scan",
        24: "Viability milestone",
        28: "Third trimester begins",
        32: "Baby gains weight rapidly",
        36: "Baby considered early term",
        37: "Baby is full term",
        40: "Due date!",
    }
    for w, milestone in important_weeks.items():
        milestone_date = lmp + timedelta(weeks=w)
        status = "passed" if today >= milestone_date else "upcoming"
        milestones.append({"week": w, "milestone": milestone, "date": milestone_date.strftime("%d %b %Y"), "status": status})

    return _make_json({
        "lmp_date": lmp.strftime("%d %b %Y"),
        "today": today.strftime("%d %b %Y"),
        "pregnancy_week": weeks,
        "pregnancy_days": days,
        "full_weeks_pregnant": f"{weeks} weeks {days} days",
        "trimester": trimester,
        "due_date": due_date.strftime("%d %b %Y"),
        "days_until_due": max(0, days_to_due),
        "days_pregnant": days_pregnant,
        "milestones": milestones,
    }, f"Week {weeks}: {trimester}")


# ─── 9. Speed / Distance / Time Calculator ─────────────────────────────────
def _handle_speed_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        solve_for = str(payload.get("solve_for", "speed")).lower()
        speed = payload.get("speed")
        distance = payload.get("distance")
        time_hours = payload.get("time")

        speed = float(speed) if speed not in (None, "", "null") else None
        distance = float(distance) if distance not in (None, "", "null") else None
        time_hours = float(time_hours) if time_hours not in (None, "", "null") else None
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid numeric values."}, "Invalid input")

    if solve_for == "speed":
        if distance is None or time_hours is None:
            return _make_json({"error": "Provide distance and time to calculate speed."}, "Missing values")
        if time_hours <= 0:
            return _make_json({"error": "Time must be positive."}, "Invalid")
        result_speed = distance / time_hours
        return _make_json({
            "solve_for": "speed",
            "distance_km": distance,
            "time_hours": time_hours,
            "speed_kmh": round(result_speed, 4),
            "speed_mph": round(result_speed / 1.60934, 4),
            "speed_ms": round(result_speed / 3.6, 4),
        }, f"Speed: {round(result_speed, 2)} km/h")

    elif solve_for == "distance":
        if speed is None or time_hours is None:
            return _make_json({"error": "Provide speed and time to calculate distance."}, "Missing values")
        result_distance = speed * time_hours
        return _make_json({
            "solve_for": "distance",
            "speed_kmh": speed,
            "time_hours": time_hours,
            "distance_km": round(result_distance, 4),
            "distance_miles": round(result_distance / 1.60934, 4),
            "distance_meters": round(result_distance * 1000, 1),
        }, f"Distance: {round(result_distance, 2)} km")

    else:  # time
        if speed is None or distance is None:
            return _make_json({"error": "Provide speed and distance to calculate time."}, "Missing values")
        if speed <= 0:
            return _make_json({"error": "Speed must be positive."}, "Invalid")
        result_time = distance / speed
        hours = int(result_time)
        minutes = int((result_time - hours) * 60)
        seconds = round(((result_time - hours) * 60 - minutes) * 60)
        return _make_json({
            "solve_for": "time",
            "distance_km": distance,
            "speed_kmh": speed,
            "time_hours": round(result_time, 4),
            "time_formatted": f"{hours}h {minutes}m {seconds}s",
            "time_minutes": round(result_time * 60, 2),
        }, f"Time: {hours}h {minutes}m {seconds}s")


# ─── 10. Aspect Ratio Calculator ───────────────────────────────────────────
def _handle_aspect_ratio_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        width = float(payload.get("width", 0))
        height = float(payload.get("height", 0))
        target_width = payload.get("target_width")
        target_height = payload.get("target_height")

        target_width = float(target_width) if target_width not in (None, "", "null") else None
        target_height = float(target_height) if target_height not in (None, "", "null") else None
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid numeric values."}, "Invalid")

    if width <= 0 or height <= 0:
        return _make_json({"error": "Width and height must be positive."}, "Invalid")

    gcd = math.gcd(int(width), int(height))
    ratio_w = int(width) // gcd
    ratio_h = int(height) // gcd
    ratio_decimal = round(width / height, 4)

    new_width = new_height = None
    if target_width:
        new_height = round(target_width / (width / height))
        new_width = int(target_width)
    elif target_height:
        new_width = round(target_height * (width / height))
        new_height = int(target_height)

    common_ratios = {
        "16:9": 16 / 9,
        "4:3": 4 / 3,
        "1:1": 1,
        "3:2": 3 / 2,
        "21:9": 21 / 9,
        "9:16": 9 / 16,
        "4:5": 4 / 5,
        "2:1": 2,
    }
    closest = min(common_ratios, key=lambda r: abs(common_ratios[r] - ratio_decimal))

    result = {
        "original_width": int(width),
        "original_height": int(height),
        "aspect_ratio": f"{ratio_w}:{ratio_h}",
        "aspect_ratio_decimal": ratio_decimal,
        "closest_common_ratio": closest,
        "pixels": int(width * height),
        "megapixels": round(width * height / 1_000_000, 2),
        "common_sizes": {
            "HD (1280×720)": "16:9",
            "Full HD (1920×1080)": "16:9",
            "4K (3840×2160)": "16:9",
            "Instagram Post (1080×1080)": "1:1",
            "Instagram Story (1080×1920)": "9:16",
            "Twitter Post (1200×675)": "16:9",
        },
    }
    if new_width and new_height:
        result["scaled_width"] = new_width
        result["scaled_height"] = new_height

    return _make_json(result, f"Ratio: {ratio_w}:{ratio_h} ({ratio_decimal})")


# ─── 11. GSTIN Validator ───────────────────────────────────────────────────
def _handle_gstin_validator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    gstin = str(payload.get("gstin", "")).strip().upper().replace(" ", "")
    if not gstin:
        return _make_json({"error": "Please enter a GSTIN number."}, "No GSTIN")

    pattern = r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
    is_valid = bool(re.match(pattern, gstin))

    state_codes = {
        "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab", "04": "Chandigarh",
        "05": "Uttarakhand", "06": "Haryana", "07": "Delhi", "08": "Rajasthan",
        "09": "Uttar Pradesh", "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
        "13": "Nagaland", "14": "Manipur", "15": "Mizoram", "16": "Tripura",
        "17": "Meghalaya", "18": "Assam", "19": "West Bengal", "20": "Jharkhand",
        "21": "Odisha", "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
        "26": "Dadra & Nagar Haveli", "27": "Maharashtra", "28": "Andhra Pradesh",
        "29": "Karnataka", "30": "Goa", "31": "Lakshadweep", "32": "Kerala",
        "33": "Tamil Nadu", "34": "Puducherry", "35": "Andaman & Nicobar",
        "36": "Telangana", "37": "Andhra Pradesh (New)",
    }

    result: dict[str, Any] = {
        "gstin": gstin,
        "is_valid": is_valid,
        "length": len(gstin),
        "format": "XX XXXXX XXXX X X Z X",
    }

    if is_valid and len(gstin) == 15:
        state_code = gstin[:2]
        pan = gstin[2:12]
        entity_number = gstin[12]
        z_check = gstin[13]
        checksum = gstin[14]

        result["state_code"] = state_code
        result["state"] = state_codes.get(state_code, "Unknown State")
        result["pan_number"] = pan
        result["entity_number"] = entity_number
        result["z_character"] = z_check
        result["checksum"] = checksum
        result["validation_message"] = "Valid GSTIN ✓"
    else:
        errors = []
        if len(gstin) != 15:
            errors.append(f"Length must be 15 characters (got {len(gstin)})")
        if not re.match(r'^[0-9]{2}', gstin[:2] if len(gstin) >= 2 else ""):
            errors.append("First 2 digits must be state code (01-37)")
        result["errors"] = errors
        result["validation_message"] = "Invalid GSTIN ✗"

    return _make_json(result, "Valid ✓" if is_valid else "Invalid ✗")


# ─── 12. PAN Card Validator ────────────────────────────────────────────────
def _handle_pan_validator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    pan = str(payload.get("pan", "")).strip().upper().replace(" ", "")
    if not pan:
        return _make_json({"error": "Please enter a PAN number."}, "No PAN")

    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    is_valid = bool(re.match(pattern, pan))

    holder_types = {
        "P": "Individual (Person)",
        "C": "Company",
        "H": "Hindu Undivided Family (HUF)",
        "F": "Firm / Partnership",
        "A": "Association of Persons (AOP)",
        "T": "Trust",
        "B": "Body of Individuals",
        "L": "Local Authority",
        "J": "Artificial Juridical Person",
        "G": "Government",
    }

    result: dict[str, Any] = {
        "pan": pan,
        "is_valid": is_valid,
        "format": "AAAAA0000A (5 letters, 4 digits, 1 letter)",
    }

    if is_valid and len(pan) == 10:
        holder_type_code = pan[3]
        result["pan_holder_type"] = holder_types.get(holder_type_code, "Unknown")
        result["first_three_letters"] = pan[:3]
        result["holder_initial"] = pan[4]
        result["validation_message"] = "Valid PAN ✓"
    else:
        result["validation_message"] = "Invalid PAN ✗"
        result["expected_format"] = "5 uppercase letters + 4 digits + 1 uppercase letter (e.g. ABCDE1234F)"

    return _make_json(result, "Valid PAN ✓" if is_valid else "Invalid PAN ✗")


# ─── 13. Phone Number Validator ────────────────────────────────────────────
def _handle_phone_number_validator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    phone = str(payload.get("phone", "")).strip()
    country = str(payload.get("country", "IN")).strip().upper()

    if not phone:
        return _make_json({"error": "Please enter a phone number."}, "No number")

    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)

    country_patterns = {
        "IN": {"pattern": r'^[6-9]\d{9}$', "code": "+91", "length": 10, "name": "India"},
        "US": {"pattern": r'^[2-9]\d{9}$', "code": "+1", "length": 10, "name": "United States"},
        "UK": {"pattern": r'^[1-9]\d{9,10}$', "code": "+44", "length": "10-11", "name": "United Kingdom"},
        "AU": {"pattern": r'^[2-9]\d{8}$', "code": "+61", "length": 9, "name": "Australia"},
        "CA": {"pattern": r'^[2-9]\d{9}$', "code": "+1", "length": 10, "name": "Canada"},
    }

    # Remove country code if present
    clean_num = cleaned
    for cc in ["+91", "91", "+1", "1", "+44", "44"]:
        if cleaned.startswith(cc) and len(cleaned) > len(cc):
            clean_num = cleaned[len(cc):]
            break

    country_info = country_patterns.get(country, country_patterns["IN"])
    is_valid = bool(re.match(country_info["pattern"], clean_num))

    # Indian mobile detection
    operator_prefixes = {
        "6": "Airtel/Jio/Others", "7": "Vodafone-Idea/BSNL",
        "8": "Airtel/BSNL/Others", "9": "Airtel/Jio/Vodafone",
    }

    result: dict[str, Any] = {
        "input": phone,
        "cleaned": cleaned,
        "country": country_info["name"],
        "country_code": country_info["code"],
        "is_valid": is_valid,
        "number_without_code": clean_num,
        "length": len(clean_num),
    }

    if country == "IN" and is_valid:
        result["operator_hint"] = operator_prefixes.get(clean_num[0], "Unknown operator")
        result["formatted"] = f"+91-{clean_num[:5]}-{clean_num[5:]}"
        result["type"] = "Mobile"
    elif is_valid:
        result["formatted"] = f"{country_info['code']}{clean_num}"

    result["validation_message"] = f"Valid {country_info['name']} number ✓" if is_valid else f"Invalid {country_info['name']} number ✗"
    return _make_json(result, result["validation_message"])


# ─── 14. Email Validator ───────────────────────────────────────────────────
def _handle_email_validator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    email = str(payload.get("email", "")).strip().lower()
    if not email:
        return _make_json({"error": "Please enter an email address."}, "No email")

    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    is_valid = bool(re.match(pattern, email))

    issues = []
    if "@" not in email:
        issues.append("Missing @ symbol")
    elif email.count("@") > 1:
        issues.append("Multiple @ symbols found")
    if is_valid:
        local, domain = email.split("@")
        if len(local) > 64:
            issues.append("Local part (before @) too long (max 64 chars)")
            is_valid = False
        if len(domain) > 255:
            issues.append("Domain too long (max 255 chars)")
            is_valid = False
        if local.startswith(".") or local.endswith("."):
            issues.append("Local part cannot start or end with a dot")
            is_valid = False
        if ".." in local:
            issues.append("Consecutive dots not allowed in local part")
            is_valid = False

    # Common domain check
    free_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com", "protonmail.com", "icloud.com"]
    edu_domains = [".edu", ".ac.in", ".edu.in", "iit", "nit", "iiit", "bits"]
    
    email_type = "Personal"
    if "@" in email:
        domain = email.split("@")[1]
        if domain in free_domains:
            email_type = "Free / Personal"
        elif any(d in domain for d in edu_domains):
            email_type = "Educational"
        else:
            email_type = "Professional / Corporate"

    return _make_json({
        "email": email,
        "is_valid": is_valid,
        "email_type": email_type if is_valid else "N/A",
        "domain": email.split("@")[1] if "@" in email else "N/A",
        "local_part": email.split("@")[0] if "@" in email else email,
        "issues": issues,
        "validation_message": "Valid email address ✓" if is_valid else "Invalid email address ✗",
        "disposable_check": "Disposable domain check not available offline",
    }, "Valid email ✓" if is_valid else "Invalid email ✗")


# ─── 15. CSS Gradient Generator ────────────────────────────────────────────
def _handle_css_gradient_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    gradient_type = str(payload.get("type", "linear")).lower()
    color1 = str(payload.get("color1", "#3bd0ff")).strip()
    color2 = str(payload.get("color2", "#a855f7")).strip()
    color3 = str(payload.get("color3", "")).strip()
    angle = str(payload.get("angle", "135")).strip()
    position = str(payload.get("position", "circle at center")).strip()

    colors = [c for c in [color1, color2, color3] if c]
    colors_str = ", ".join(colors)

    css_snippets = {}
    if gradient_type == "linear":
        css = f"background: linear-gradient({angle}deg, {colors_str});"
        css_snippets = {
            "CSS": css,
            "With fallback": f"background: {color1};\n{css}",
            "As background-image": f"background-image: linear-gradient({angle}deg, {colors_str});",
            "Text gradient": f"background: linear-gradient({angle}deg, {colors_str});\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;",
        }
    elif gradient_type == "radial":
        css = f"background: radial-gradient({position}, {colors_str});"
        css_snippets = {
            "CSS": css,
            "Elliptical": f"background: radial-gradient(ellipse at center, {colors_str});",
            "Top-left": f"background: radial-gradient(circle at top left, {colors_str});",
        }
    elif gradient_type == "conic":
        css = f"background: conic-gradient(from {angle}deg, {colors_str});"
        css_snippets = {
            "CSS": css,
            "Pie chart base": f"background: conic-gradient({colors_str});",
        }

    # Tailwind equivalent
    tw_from = color1.replace("#", "")
    tw_to = color2.replace("#", "")
    tailwind_note = f"Use: bg-gradient-to-br from-[{color1}] to-[{color2}]"

    presets = [
        {"name": "Ocean Blue", "css": "background: linear-gradient(135deg, #667eea, #764ba2);"},
        {"name": "Sunset", "css": "background: linear-gradient(135deg, #f093fb, #f5576c);"},
        {"name": "Forest", "css": "background: linear-gradient(135deg, #4facfe, #00f2fe);"},
        {"name": "Purple Dream", "css": "background: linear-gradient(135deg, #a18cd1, #fbc2eb);"},
        {"name": "Fire", "css": "background: linear-gradient(135deg, #ff6b6b, #feca57);"},
        {"name": "Midnight", "css": "background: linear-gradient(135deg, #0c3483, #a2b6df);"},
        {"name": "Peach", "css": "background: linear-gradient(135deg, #ffb347, #ffcc33);"},
        {"name": "Teal", "css": "background: linear-gradient(135deg, #00b09b, #96c93d);"},
    ]

    return _make_json({
        "gradient_type": gradient_type,
        "colors": colors,
        "angle_or_position": angle if gradient_type != "radial" else position,
        "css_code": css_snippets,
        "tailwind_hint": tailwind_note,
        "preview_style": list(css_snippets.values())[0] if css_snippets else "",
        "presets": presets,
    }, f"CSS {gradient_type.title()} Gradient generated")


# ─── 16. Box Shadow Generator ──────────────────────────────────────────────
def _handle_box_shadow_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        h_offset = int(payload.get("h_offset", 0))
        v_offset = int(payload.get("v_offset", 10))
        blur = int(payload.get("blur", 20))
        spread = int(payload.get("spread", 0))
        color = str(payload.get("color", "rgba(0,0,0,0.3)")).strip()
        inset = str(payload.get("inset", "false")).lower() == "true"
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    inset_str = "inset " if inset else ""
    shadow = f"{inset_str}{h_offset}px {v_offset}px {blur}px {spread}px {color}"
    css = f"box-shadow: {shadow};"
    webkit_css = f"-webkit-box-shadow: {shadow};\n{css}"

    presets = [
        {"name": "Subtle", "css": "box-shadow: 0 2px 8px rgba(0,0,0,0.1);"},
        {"name": "Card Shadow", "css": "box-shadow: 0 4px 16px rgba(0,0,0,0.12);"},
        {"name": "Elevation 1", "css": "box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);"},
        {"name": "Elevation 2", "css": "box-shadow: 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12);"},
        {"name": "Deep Shadow", "css": "box-shadow: 0 20px 60px rgba(0,0,0,0.3);"},
        {"name": "Glow Blue", "css": "box-shadow: 0 0 20px rgba(59,208,255,0.5);"},
        {"name": "Glow Purple", "css": "box-shadow: 0 0 20px rgba(168,85,247,0.5);"},
        {"name": "Inner Shadow", "css": "box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);"},
        {"name": "Neon Green", "css": "box-shadow: 0 0 10px #39ff14, 0 0 30px #39ff14;"},
        {"name": "Multi-layer", "css": "box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1);"},
    ]

    return _make_json({
        "settings": {
            "h_offset": h_offset,
            "v_offset": v_offset,
            "blur": blur,
            "spread": spread,
            "color": color,
            "inset": inset,
        },
        "shadow_value": shadow,
        "css_code": css,
        "css_with_prefix": webkit_css,
        "tailwind_ring": "ring-2 ring-black/30 (approximate)",
        "presets": presets,
    }, "Box shadow CSS generated")


# ─── 17. PPF Calculator ────────────────────────────────────────────────────
def _handle_ppf_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        yearly_investment = float(payload.get("yearly_investment", 150000))
        years = int(payload.get("years", 15))
        interest_rate = float(payload.get("interest_rate", 7.1))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    if yearly_investment < 500 or yearly_investment > 150000:
        return _make_json({"error": "PPF investment must be between ₹500 and ₹1,50,000 per year."}, "Invalid amount")
    if years < 15:
        return _make_json({"error": "Minimum PPF tenure is 15 years."}, "Invalid tenure")

    rate = interest_rate / 100
    yearly_data = []
    balance = 0
    total_invested = 0

    for yr in range(1, years + 1):
        balance = (balance + yearly_investment) * (1 + rate)
        total_invested += yearly_investment
        interest_earned = balance - total_invested
        yearly_data.append({
            "year": yr,
            "investment": round(total_invested, 2),
            "balance": round(balance, 2),
            "interest_earned": round(interest_earned, 2),
        })

    maturity = round(balance, 2)
    total_interest = round(maturity - total_invested, 2)
    wealth_gain = round((maturity / total_invested - 1) * 100, 1)

    return _make_json({
        "yearly_investment": yearly_investment,
        "tenure_years": years,
        "interest_rate": interest_rate,
        "total_invested": round(total_invested, 2),
        "maturity_amount": maturity,
        "total_interest_earned": total_interest,
        "wealth_gained_percent": wealth_gain,
        "tax_benefit": f"₹{min(150000, yearly_investment):,.0f}/year under Section 80C",
        "tax_status": "EEE (Exempt-Exempt-Exempt) — Completely Tax Free",
        "account_type": "Government-backed, Risk-free",
        "yearly_breakdown": yearly_data,
    }, f"PPF Maturity: ₹{maturity:,.2f}")


# ─── 18. NPS Calculator ────────────────────────────────────────────────────
def _handle_nps_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        monthly_contribution = float(payload.get("monthly_contribution", 5000))
        current_age = int(payload.get("current_age", 30))
        retirement_age = int(payload.get("retirement_age", 60))
        expected_return = float(payload.get("expected_return", 10))
        annuity_rate = float(payload.get("annuity_rate", 6))
        annuity_percent = float(payload.get("annuity_percent", 40))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    years = retirement_age - current_age
    if years < 1:
        return _make_json({"error": "Retirement age must be greater than current age."}, "Invalid")

    months = years * 12
    monthly_rate = expected_return / 100 / 12
    total_invested = monthly_contribution * months

    # Corpus at retirement
    corpus = monthly_contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)

    lump_sum = corpus * (1 - annuity_percent / 100)
    annuity_corpus = corpus * (annuity_percent / 100)
    monthly_pension = annuity_corpus * (annuity_rate / 100) / 12

    employer_benefit = "Additional 10% employer contribution possible (government employees)"

    return _make_json({
        "monthly_contribution": monthly_contribution,
        "current_age": current_age,
        "retirement_age": retirement_age,
        "investment_years": years,
        "total_invested": round(total_invested, 2),
        "expected_corpus": round(corpus, 2),
        "lump_sum_withdrawal": round(lump_sum, 2),
        "annuity_corpus": round(annuity_corpus, 2),
        "estimated_monthly_pension": round(monthly_pension, 2),
        "annuity_percentage": annuity_percent,
        "annuity_rate": annuity_rate,
        "wealth_gain": round(corpus - total_invested, 2),
        "tax_benefit": "Up to ₹2L deduction (80C + 80CCD(1B))",
        "note": employer_benefit,
    }, f"NPS Corpus: ₹{corpus:,.0f} | Monthly Pension: ₹{monthly_pension:,.0f}")


# ─── 19. Macro Calculator ─────────────────────────────────────────────────
def _handle_macro_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        weight = float(payload.get("weight", 70))
        height_cm = float(payload.get("height", 175))
        age = int(payload.get("age", 25))
        gender = str(payload.get("gender", "male")).lower()
        activity = str(payload.get("activity", "moderate")).lower()
        goal = str(payload.get("goal", "maintain")).lower()
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    # BMR (Mifflin-St Jeor)
    if gender == "female":
        bmr = (10 * weight) + (6.25 * height_cm) - (5 * age) - 161
    else:
        bmr = (10 * weight) + (6.25 * height_cm) - (5 * age) + 5

    activity_factors = {
        "sedentary": 1.2, "light": 1.375, "moderate": 1.55,
        "active": 1.725, "very active": 1.9,
    }
    activity_factor = activity_factors.get(activity, 1.55)
    tdee = bmr * activity_factor

    if goal == "lose":
        target_calories = tdee - 500
        goal_text = "Weight Loss (500 cal deficit)"
    elif goal == "gain":
        target_calories = tdee + 300
        goal_text = "Muscle Gain (300 cal surplus)"
    else:
        target_calories = tdee
        goal_text = "Maintain Weight"

    # Macros
    protein_g = weight * 2.2  # 2.2g per kg for active
    fat_g = target_calories * 0.25 / 9
    carb_g = (target_calories - (protein_g * 4) - (fat_g * 9)) / 4

    protein_cal = protein_g * 4
    fat_cal = fat_g * 9
    carb_cal = carb_g * 4

    return _make_json({
        "inputs": {"weight_kg": weight, "height_cm": height_cm, "age": age, "gender": gender, "activity": activity, "goal": goal_text},
        "bmr": round(bmr),
        "tdee": round(tdee),
        "target_calories": round(target_calories),
        "macros": {
            "protein": {"grams": round(protein_g), "calories": round(protein_cal), "percent": round(protein_cal / target_calories * 100)},
            "fats": {"grams": round(fat_g), "calories": round(fat_cal), "percent": round(fat_cal / target_calories * 100)},
            "carbohydrates": {"grams": round(carb_g), "calories": round(carb_cal), "percent": round(carb_cal / target_calories * 100)},
        },
        "bmi": round(weight / ((height_cm / 100) ** 2), 1),
        "ideal_weight_range_kg": {
            "min": round(18.5 * (height_cm / 100) ** 2, 1),
            "max": round(24.9 * (height_cm / 100) ** 2, 1),
        },
        "meal_split_suggestion": "3 main meals + 2 snacks" if target_calories > 2000 else "3 meals",
        "water_intake_liters": round(weight * 0.033, 1),
    }, f"Target: {round(target_calories)} kcal/day | Protein: {round(protein_g)}g | Carbs: {round(carb_g)}g | Fat: {round(fat_g)}g")


# ─── 20. Braille Converter ─────────────────────────────────────────────────
def _handle_braille_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please enter text to convert to Braille."}, "No text")

    braille_map = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
        'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
        'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
        'y': '⠽', 'z': '⠵',
        '0': '⠚', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
        ' ': '⠀', ',': '⠂', '.': '⠄', '?': '⠦', '!': '⠖', "'": '⠄', '-': '⠤',
    }

    result_chars = []
    for char in text.lower():
        result_chars.append(braille_map.get(char, char))

    return _make_json({
        "original_text": text,
        "braille_text": ''.join(result_chars),
        "character_count": len(text),
        "info": "Grade 1 Braille (uncontracted). Each cell uses 6 raised dots in a 3×2 grid.",
        "about_braille": "Braille was created by Louis Braille in 1824. It is a tactile writing system for blind and visually impaired people.",
    }, "Text converted to Braille")


# ─── 21. Net Salary Calculator India ──────────────────────────────────────
def _handle_net_salary_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        ctc = float(payload.get("ctc", 1000000))
        regime = str(payload.get("regime", "new")).lower()
        extra_deductions = float(payload.get("extra_deductions_80c", 150000))
        hra_received = float(payload.get("hra_received", 0))
        rent_paid = float(payload.get("rent_paid", 0))
        city_type = str(payload.get("city_type", "metro")).lower()
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    # Basic salary (usually 40-50% of CTC)
    basic = ctc * 0.40
    hra = ctc * 0.20
    special_allowance = ctc * 0.35
    pf_employer = basic * 0.12
    gratuity = basic * 4.81 / 100
    annual_gross = ctc - pf_employer - gratuity

    # PF deduction (employee)
    pf_employee = min(basic * 0.12, 21600)

    # Professional tax
    professional_tax = 2400

    # HRA exemption
    if rent_paid > 0 and hra_received > 0:
        basic_monthly = basic / 12
        hra_exempt = min(hra_received, rent_paid - basic_monthly * 0.1, hra_received * (0.5 if city_type == "metro" else 0.4))
        hra_exempt = max(0, hra_exempt)
    else:
        hra_exempt = 0

    # Standard deduction
    standard_deduction = 75000 if regime == "new" else 50000

    # Taxable income
    if regime == "new":
        taxable_income = ctc - standard_deduction - pf_employee - gratuity - pf_employer
        # New regime slabs (FY 2024-25)
        tax = _calc_new_regime_tax(taxable_income)
    else:
        gross_taxable = annual_gross - hra_exempt
        deductions = min(extra_deductions, 150000) + standard_deduction + pf_employee
        taxable_income = max(0, gross_taxable - deductions)
        tax = _calc_old_regime_tax(taxable_income)

    # 87A rebate
    if taxable_income <= 700000 and regime == "new":
        tax = 0
    elif taxable_income <= 500000 and regime == "old":
        tax = 0

    # Surcharge + Cess
    surcharge = 0
    if taxable_income > 5000000:
        surcharge = tax * 0.10
    cess = (tax + surcharge) * 0.04
    total_tax = tax + surcharge + cess

    annual_net = ctc - pf_employee - professional_tax - total_tax - pf_employer - gratuity
    monthly_net = annual_net / 12

    return _make_json({
        "ctc": ctc,
        "tax_regime": f"{'New' if regime == 'new' else 'Old'} Regime (FY 2024-25)",
        "gross_salary": round(annual_gross, 2),
        "deductions": {
            "pf_employee": round(pf_employee, 2),
            "professional_tax": professional_tax,
            "income_tax": round(total_tax, 2),
        },
        "taxable_income": round(taxable_income, 2),
        "income_tax": round(total_tax, 2),
        "effective_tax_rate": round(total_tax / ctc * 100, 2) if ctc > 0 else 0,
        "annual_net_salary": round(annual_net, 2),
        "monthly_net_salary": round(monthly_net, 2),
        "monthly_ctc": round(ctc / 12, 2),
        "components": {
            "basic": round(basic, 2),
            "hra": round(hra, 2),
            "special_allowance": round(special_allowance, 2),
        },
    }, f"Monthly In-Hand: ₹{round(monthly_net, 2):,.2f}")


def _calc_new_regime_tax(income: float) -> float:
    slabs = [(300000, 0), (600000, 0.05), (900000, 0.10), (1200000, 0.15), (1500000, 0.20), (float('inf'), 0.30)]
    prev = 0
    tax = 0.0
    for limit, rate in slabs:
        if income <= prev:
            break
        taxable = min(income, limit) - prev
        tax += taxable * rate
        prev = limit
    return tax


def _calc_old_regime_tax(income: float) -> float:
    slabs = [(250000, 0), (500000, 0.05), (1000000, 0.20), (float('inf'), 0.30)]
    prev = 0
    tax = 0.0
    for limit, rate in slabs:
        if income <= prev:
            break
        taxable = min(income, limit) - prev
        tax += taxable * rate
        prev = limit
    return tax


# ─── 22. HRA Calculator India ─────────────────────────────────────────────
def _handle_hra_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        basic_monthly = float(payload.get("basic_monthly", 40000))
        hra_received = float(payload.get("hra_received", 20000))
        rent_paid = float(payload.get("rent_paid", 25000))
        city_type = str(payload.get("city_type", "metro")).lower()
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    # Three conditions for HRA exemption
    condition1 = hra_received * 12  # Actual HRA received
    condition2 = rent_paid * 12 - basic_monthly * 12 * 0.10  # Rent - 10% of basic
    condition3 = basic_monthly * 12 * (0.50 if city_type == "metro" else 0.40)  # 50% or 40% of basic

    hra_exempt = max(0, min(condition1, condition2, condition3))
    hra_taxable = max(0, hra_received * 12 - hra_exempt)

    return _make_json({
        "basic_annual": round(basic_monthly * 12, 2),
        "hra_received_annual": round(hra_received * 12, 2),
        "rent_paid_annual": round(rent_paid * 12, 2),
        "city_type": city_type,
        "three_conditions": {
            "actual_hra_received": round(condition1, 2),
            "rent_minus_10_percent_basic": round(condition2, 2),
            f"{'50%' if city_type == 'metro' else '40%'}_of_basic": round(condition3, 2),
        },
        "hra_exempt": round(hra_exempt, 2),
        "hra_taxable": round(hra_taxable, 2),
        "monthly_hra_exempt": round(hra_exempt / 12, 2),
        "note": "HRA exemption = lowest of the 3 conditions",
    }, f"HRA Exempt: ₹{hra_exempt:,.2f}/year")


# ─── 23. EPF Calculator India ─────────────────────────────────────────────
def _handle_epf_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        basic_da = float(payload.get("basic_da", 50000))
        years = int(payload.get("years", 10))
        interest_rate = float(payload.get("interest_rate", 8.25))
        existing_balance = float(payload.get("existing_balance", 0))
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    monthly_employee = min(basic_da * 0.12, 1800)  # Capped at ₹15000 * 12%
    monthly_employer_epf = min(basic_da * 0.0367, 550)  # 3.67% goes to EPF
    monthly_employer_eps = min(basic_da * 0.0833, 1250)  # 8.33% goes to EPS

    annual_rate = interest_rate / 100 / 12
    months = years * 12
    total_monthly = monthly_employee + monthly_employer_epf

    corpus = existing_balance * ((1 + annual_rate) ** months)
    corpus += total_monthly * (((1 + annual_rate) ** months - 1) / annual_rate)

    total_invested = (total_monthly * months) + existing_balance
    interest_earned = corpus - total_invested

    return _make_json({
        "basic_da_monthly": basic_da,
        "employee_contribution_monthly": round(monthly_employee, 2),
        "employer_epf_monthly": round(monthly_employer_epf, 2),
        "employer_eps_monthly": round(monthly_employer_eps, 2),
        "total_monthly_to_epf": round(total_monthly, 2),
        "years": years,
        "interest_rate": interest_rate,
        "existing_balance": existing_balance,
        "projected_corpus": round(corpus, 2),
        "total_invested": round(total_invested, 2),
        "interest_earned": round(interest_earned, 2),
        "tax_status": "EEE — Completely Tax-Free",
        "withdrawal_note": "Full withdrawal after 58 years or 2+ months of unemployment",
    }, f"EPF Corpus: ₹{corpus:,.2f}")


# ─── 24. Gratuity Calculator India ────────────────────────────────────────
def _handle_gratuity_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        last_basic_da = float(payload.get("last_basic_da", 50000))
        years = float(payload.get("years_of_service", 10))
        is_covered = str(payload.get("is_covered", "true")).lower() == "true"
    except (ValueError, TypeError):
        return _make_json({"error": "Please enter valid values."}, "Invalid input")

    if years < 5:
        return _make_json({
            "is_eligible": False,
            "message": "Minimum 5 years of continuous service required for gratuity.",
            "years_of_service": years,
        }, "Not eligible (< 5 years)")

    if is_covered:
        # Covered under Gratuity Act
        gratuity = (last_basic_da / 26) * 15 * years
        formula = "(Last Basic+DA / 26) × 15 × Years of Service"
    else:
        # Not covered
        gratuity = (last_basic_da / 30) * 15 * years
        formula = "(Last Basic+DA / 30) × 15 × Years of Service"

    # Tax exemption
    tax_exempt = min(gratuity, 2000000)  # ₹20 lakh limit
    taxable = max(0, gratuity - tax_exempt)

    return _make_json({
        "last_basic_da_monthly": last_basic_da,
        "years_of_service": years,
        "covered_under_act": is_covered,
        "formula": formula,
        "gratuity_amount": round(gratuity, 2),
        "tax_exempt_amount": round(tax_exempt, 2),
        "taxable_amount": round(taxable, 2),
        "is_eligible": True,
        "note": "Gratuity is paid by employer on retirement, resignation (after 5 yrs), death, or disability.",
    }, f"Gratuity: ₹{gratuity:,.2f}")


# ─── 25. URL Validator & Analyzer ─────────────────────────────────────────
def _handle_url_validator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = str(payload.get("url", "")).strip()
    if not url:
        return _make_json({"error": "Please enter a URL to validate."}, "No URL")

    import urllib.parse
    try:
        parsed = urllib.parse.urlparse(url)
        is_valid = all([parsed.scheme, parsed.netloc])
        is_secure = parsed.scheme == "https"

        query_params = urllib.parse.parse_qs(parsed.query)

        return _make_json({
            "url": url,
            "is_valid": is_valid,
            "is_secure_https": is_secure,
            "scheme": parsed.scheme,
            "domain": parsed.netloc,
            "path": parsed.path or "/",
            "query_string": parsed.query,
            "fragment": parsed.fragment,
            "query_parameters": {k: v[0] if len(v) == 1 else v for k, v in query_params.items()},
            "total_length": len(url),
            "url_encoded": urllib.parse.quote(url, safe=':/?=&#+%'),
            "issues": (["Not HTTPS — insecure connection"] if not is_secure else []) +
                      (["URL too long (> 2083 chars)"] if len(url) > 2083 else []),
        }, "Valid URL ✓" if is_valid else "Invalid URL ✗")
    except Exception as exc:
        return _make_json({"error": str(exc), "is_valid": False}, "Parse error")


# ─── 26. Color Blindness Simulator ────────────────────────────────────────
def _handle_color_blindness_simulator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    hex_color = str(payload.get("color", "#3bd0ff")).strip().lstrip("#")
    if len(hex_color) not in (3, 6):
        return _make_json({"error": "Please enter a valid hex color (e.g. #FF5733 or #F53)."}, "Invalid hex")

    if len(hex_color) == 3:
        hex_color = ''.join(c * 2 for c in hex_color)

    try:
        r = int(hex_color[0:2], 16) / 255
        g = int(hex_color[2:4], 16) / 255
        b = int(hex_color[4:6], 16) / 255
    except ValueError:
        return _make_json({"error": "Invalid hex color value."}, "Invalid hex")

    def to_hex(rv: float, gv: float, bv: float) -> str:
        return "#{:02X}{:02X}{:02X}".format(int(max(0, min(1, rv)) * 255), int(max(0, min(1, gv)) * 255), int(max(0, min(1, bv)) * 255))

    # Simulate Protanopia (no red cones)
    proto_r = 0.56667 * r + 0.43333 * g
    proto_g = 0.55833 * r + 0.44167 * g
    proto_b = b

    # Simulate Deuteranopia (no green cones)
    deut_r = 0.625 * r + 0.375 * g
    deut_g = 0.70 * r + 0.30 * g
    deut_b = b

    # Simulate Tritanopia (no blue cones)
    trit_r = 0.95 * r + 0.05 * b
    trit_g = g
    trit_b = 0.43333 * g + 0.56667 * b

    # Achromatopsia (total color blindness)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    achro = to_hex(lum, lum, lum)

    return _make_json({
        "original_color": f"#{hex_color.upper()}",
        "rgb": {"r": int(r * 255), "g": int(g * 255), "b": int(b * 255)},
        "simulations": {
            "protanopia": {"hex": to_hex(proto_r, proto_g, proto_b), "description": "Red-blind (1% of men affected)"},
            "deuteranopia": {"hex": to_hex(deut_r, deut_g, deut_b), "description": "Green-blind (most common, ~5% of men)"},
            "tritanopia": {"hex": to_hex(trit_r, trit_g, trit_b), "description": "Blue-blind (very rare)"},
            "achromatopsia": {"hex": achro, "description": "Total color blindness (grayscale only)"},
        },
        "accessibility_tip": "Ensure text has ≥ 4.5:1 contrast ratio (WCAG AA) for colorblind users.",
        "affected_population": "About 8% of men and 0.5% of women have some form of color blindness.",
    }, f"Color blindness simulation for #{hex_color.upper()}")


# ─── 27. Grammar Score Estimator ──────────────────────────────────────────
def _handle_grammar_score(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please provide text to analyze."}, "No text")

    issues = []
    score = 100

    # Check common grammar issues
    # Double spaces
    if "  " in text:
        issues.append({"issue": "Double spaces found", "severity": "minor", "suggestion": "Replace double spaces with single spaces"})
        score -= 2

    # Sentence starting with lowercase
    sentences = re.split(r'(?<=[.!?])\s+', text)
    for i, sentence in enumerate(sentences[1:], 1):
        if sentence and sentence[0].islower() and sentence[0].isalpha():
            issues.append({"issue": f"Sentence {i + 1} starts with lowercase", "severity": "moderate", "suggestion": f"Capitalize first word of sentence"})
            score -= 5

    # Comma before 'and'/'but' in lists (Oxford comma check)
    if re.search(r'\w,\s+and\s+', text):
        issues.append({"issue": "Oxford comma detected (style choice)", "severity": "info", "suggestion": "Oxford comma is acceptable; be consistent"})

    # Double punctuation
    if re.search(r'[.!?]{2,}', text):
        issues.append({"issue": "Multiple punctuation marks", "severity": "moderate", "suggestion": "Use a single punctuation mark"})
        score -= 5

    # Common spelling errors
    common_errors = {
        "recieve": "receive", "seperate": "separate", "definately": "definitely",
        "occured": "occurred", "adress": "address", "beleive": "believe",
        "becuase": "because", "dont": "don't", "cant": "can't", "wont": "won't",
        "its a": "it's a (if possessive: its)", "there going": "they're going",
        "your welcome": "you're welcome",
    }
    for wrong, right in common_errors.items():
        if wrong.lower() in text.lower():
            issues.append({"issue": f"Possible error: '{wrong}'", "severity": "high", "suggestion": f"Consider: '{right}'"})
            score -= 10

    # Passive voice detection (simple)
    passive_patterns = [r'\bwas\s+\w+ed\b', r'\bwere\s+\w+ed\b', r'\bis\s+\w+ed\b', r'\bare\s+\w+ed\b']
    passive_count = sum(len(re.findall(p, text, re.IGNORECASE)) for p in passive_patterns)
    if passive_count > 2:
        issues.append({"issue": f"Passive voice detected ({passive_count} instances)", "severity": "minor", "suggestion": "Consider using active voice for clarity"})
        score -= 3

    score = max(0, min(100, score))

    if score >= 90:
        grade = "Excellent"
    elif score >= 75:
        grade = "Good"
    elif score >= 60:
        grade = "Fair"
    elif score >= 40:
        grade = "Needs Improvement"
    else:
        grade = "Poor"

    return _make_json({
        "grammar_score": score,
        "grade": grade,
        "issues_found": len(issues),
        "issues": issues,
        "word_count": len(text.split()),
        "sentence_count": len([s for s in re.split(r'[.!?]+', text) if s.strip()]),
        "suggestion": "Use a professional grammar tool like Grammarly for comprehensive checks." if issues else "Text looks grammatically correct!",
    }, f"Grammar Score: {score}/100 ({grade})")


# ─── Bill Splitter ────────────────────────────────────────────────────────
def _handle_bill_splitter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        total = float(payload.get("total", payload.get("amount", 0)))
        people = int(payload.get("people", payload.get("persons", 2)))
        tip_pct = float(payload.get("tip", payload.get("tip_percent", 0)))
        if total <= 0:
            return _make_json({"error": "Enter a valid bill amount greater than 0."}, "Invalid amount")
        if people < 1:
            return _make_json({"error": "Number of people must be at least 1."}, "Invalid count")
        tip_amount = round(total * tip_pct / 100, 2)
        total_with_tip = round(total + tip_amount, 2)
        per_person = round(total_with_tip / people, 2)
        per_person_no_tip = round(total / people, 2)
        return _make_json({
            "bill_amount": total,
            "tip_percent": tip_pct,
            "tip_amount": tip_amount,
            "total_with_tip": total_with_tip,
            "number_of_people": people,
            "per_person": per_person,
            "per_person_without_tip": per_person_no_tip,
            "summary": f"Each person pays ₹{per_person} (₹{per_person_no_tip} bill + ₹{round(tip_amount/people,2)} tip)"
        }, f"Each person pays ₹{per_person}")
    except (ValueError, ZeroDivisionError) as e:
        return _make_json({"error": f"Invalid input: {e}"}, "Error")


# ─── Time Converter ─────────────────────────────────────────────────────────
def _handle_time_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        value = float(payload.get("value", payload.get("amount", 1)))
        from_unit = str(payload.get("from_unit", payload.get("from", "hours"))).lower().strip()
        to_unit = str(payload.get("to_unit", payload.get("to", "minutes"))).lower().strip()
        # Seconds multipliers
        to_sec = {"seconds": 1, "second": 1, "sec": 1, "s": 1,
                  "minutes": 60, "minute": 60, "min": 60, "m": 60,
                  "hours": 3600, "hour": 3600, "hr": 3600, "h": 3600,
                  "days": 86400, "day": 86400, "d": 86400,
                  "weeks": 604800, "week": 604800, "w": 604800,
                  "months": 2592000, "month": 2592000,
                  "years": 31536000, "year": 31536000, "yr": 31536000,
                  "milliseconds": 0.001, "ms": 0.001,
                  "microseconds": 0.000001, "us": 0.000001,
                  "nanoseconds": 1e-9, "ns": 1e-9}
        if from_unit not in to_sec or to_unit not in to_sec:
            return _make_json({"error": f"Unknown time unit. Supported: {', '.join(sorted(set(to_sec.keys())))}"}, "Error")
        seconds = value * to_sec[from_unit]
        result = seconds / to_sec[to_unit]
        return _make_json({
            "input": value,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "result": round(result, 10) if result < 1 else round(result, 6),
            "in_seconds": round(seconds, 10),
            "breakdown": {
                "years": round(seconds / 31536000, 6),
                "days": round(seconds / 86400, 6),
                "hours": round(seconds / 3600, 6),
                "minutes": round(seconds / 60, 6),
                "seconds": round(seconds, 4),
                "milliseconds": round(seconds * 1000, 4),
            }
        }, f"{value} {from_unit} = {round(result, 6)} {to_unit}")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Coin Flipper ──────────────────────────────────────────────────────────
def _handle_coin_flipper(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    import random as _rnd
    flips = max(1, min(int(payload.get("flips", payload.get("count", 1))), 1000))
    results = [_rnd.choice(["Heads", "Tails"]) for _ in range(flips)]
    heads = results.count("Heads")
    tails = results.count("Tails")
    return _make_json({
        "result": results[0] if flips == 1 else results,
        "total_flips": flips,
        "heads_count": heads,
        "tails_count": tails,
        "heads_percent": round(heads / flips * 100, 1),
        "tails_percent": round(tails / flips * 100, 1),
        "summary": f"🪙 {results[0]}" if flips == 1 else f"🪙 {heads} Heads, {tails} Tails out of {flips} flips"
    }, results[0] if flips == 1 else f"{heads}H {tails}T")


# ─── Morse Code Converter ──────────────────────────────────────────────────
def _handle_morse_code_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    MORSE = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.',  '.': '.-.-.-', ',': '--..--', '?': '..--..',
        "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
        '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
        '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    }
    REVERSE = {v: k for k, v in MORSE.items()}
    text = str(payload.get("text", "")).strip()
    mode = str(payload.get("mode", "encode")).lower()
    if not text:
        return _make_json({"error": "Please enter text to convert."}, "No input")
    if mode in ("decode", "to_text"):
        words = text.strip().split("   ")
        decoded_words = []
        for word in words:
            chars = word.strip().split()
            decoded_words.append("".join(REVERSE.get(c, "?") for c in chars))
        result = " ".join(decoded_words)
        return _make_json({"morse": text, "text": result, "mode": "decode"}, result)
    else:
        encoded = " ".join("   " if c == " " else MORSE.get(c.upper(), "?") for c in text)
        return _make_json({"text": text, "morse": encoded, "mode": "encode",
                           "legend": "Dots=., Dashes=-, Letter separator=space, Word separator=3 spaces"}, encoded)


# ─── Fraction Calculator ────────────────────────────────────────────────────
def _handle_fraction_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    from math import gcd
    def parse_frac(s: str):
        s = s.strip()
        if '/' in s:
            n, d = s.split('/', 1)
            return int(n.strip()), int(d.strip())
        return int(s), 1
    def simplify(n, d):
        if d == 0:
            raise ZeroDivisionError("Denominator cannot be zero")
        sign = -1 if (n * d < 0) else 1
        n, d = abs(n), abs(d)
        g = gcd(n, d)
        return sign * (n // g), d // g
    def frac_str(n, d):
        n, d = simplify(n, d)
        if d == 1:
            return str(n)
        return f"{n}/{d}"
    try:
        f1 = str(payload.get("fraction1", payload.get("frac1", "1/2")))
        f2 = str(payload.get("fraction2", payload.get("frac2", "1/3")))
        op = str(payload.get("operation", payload.get("op", "add"))).lower()
        n1, d1 = parse_frac(f1)
        n2, d2 = parse_frac(f2)
        if op in ("add", "+", "plus"):
            rn, rd = n1 * d2 + n2 * d1, d1 * d2
        elif op in ("subtract", "-", "minus", "sub"):
            rn, rd = n1 * d2 - n2 * d1, d1 * d2
        elif op in ("multiply", "*", "x", "mul", "times"):
            rn, rd = n1 * n2, d1 * d2
        elif op in ("divide", "/", "div"):
            rn, rd = n1 * d2, d1 * n2
        else:
            return _make_json({"error": "Operation must be: add, subtract, multiply, or divide"}, "Error")
        result = frac_str(rn, rd)
        decimal = round(rn / rd, 8) if rd != 0 else "undefined"
        return _make_json({
            "fraction1": f1, "fraction2": f2, "operation": op,
            "result_fraction": result, "result_decimal": decimal,
            "simplified": result,
            "summary": f"{f1} {op} {f2} = {result} ≈ {decimal}"
        }, f"{result} (≈ {decimal})")
    except (ValueError, ZeroDivisionError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Percentage Change Calculator ──────────────────────────────────────────
def _handle_percentage_change_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        old = float(payload.get("old_value", payload.get("original", payload.get("from", 0))))
        new = float(payload.get("new_value", payload.get("new", payload.get("to", 0))))
        if old == 0:
            return _make_json({"error": "Original value cannot be zero (division by zero)"}, "Error")
        change = new - old
        pct = round((change / abs(old)) * 100, 4)
        direction = "increase" if change > 0 else ("decrease" if change < 0 else "no change")
        return _make_json({
            "original_value": old,
            "new_value": new,
            "absolute_change": round(change, 4),
            "percentage_change": pct,
            "direction": direction,
            "summary": f"{abs(pct)}% {direction} (from {old} to {new})"
        }, f"{abs(pct)}% {direction}")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── EMI Calculator ─────────────────────────────────────────────────────────
def _handle_emi_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        principal = float(payload.get("principal", payload.get("loan_amount", payload.get("amount", 100000))))
        rate = float(payload.get("rate", payload.get("interest_rate", 10)))
        tenure_months = int(payload.get("tenure_months", payload.get("tenure", payload.get("months", 12))))
        monthly_rate = rate / 12 / 100
        if monthly_rate == 0:
            emi = principal / tenure_months
        else:
            emi = principal * monthly_rate * (1 + monthly_rate) ** tenure_months / ((1 + monthly_rate) ** tenure_months - 1)
        emi = round(emi, 2)
        total = round(emi * tenure_months, 2)
        interest = round(total - principal, 2)
        return _make_json({
            "principal": principal,
            "interest_rate_percent": rate,
            "tenure_months": tenure_months,
            "tenure_years": round(tenure_months / 12, 2),
            "monthly_emi": emi,
            "total_payment": total,
            "total_interest": interest,
            "interest_percent_of_principal": round(interest / principal * 100, 2),
            "summary": f"Monthly EMI: ₹{emi} | Total Payment: ₹{total} | Interest: ₹{interest}"
        }, f"EMI: ₹{emi}/month")
    except (ValueError, TypeError, ZeroDivisionError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Interest Calculator ─────────────────────────────────────────────────────
def _handle_interest_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        principal = float(payload.get("principal", payload.get("amount", 10000)))
        rate = float(payload.get("rate", payload.get("interest_rate", 8)))
        time_years = float(payload.get("time", payload.get("years", payload.get("time_years", 1))))
        mode = str(payload.get("type", payload.get("mode", "compound"))).lower()
        n = int(payload.get("compounding_times", payload.get("n", 12)))  # per year
        if mode in ("simple", "si"):
            interest = round(principal * rate * time_years / 100, 2)
            final = round(principal + interest, 2)
            return _make_json({
                "type": "Simple Interest",
                "principal": principal, "rate": rate, "time_years": time_years,
                "simple_interest": interest, "final_amount": final,
                "summary": f"Simple Interest: ₹{interest} | Final Amount: ₹{final}"
            }, f"SI: ₹{interest} | Total: ₹{final}")
        else:
            final = round(principal * (1 + rate / (n * 100)) ** (n * time_years), 2)
            interest = round(final - principal, 2)
            return _make_json({
                "type": "Compound Interest",
                "principal": principal, "rate": rate, "time_years": time_years,
                "compounding_frequency": n,
                "compound_interest": interest, "final_amount": final,
                "summary": f"Compound Interest: ₹{interest} | Final Amount: ₹{final}"
            }, f"CI: ₹{interest} | Total: ₹{final}")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Reading Time Estimator ─────────────────────────────────────────────────
def _handle_reading_time_estimator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    word_count_input = int(payload.get("word_count", 0))
    wpm = int(payload.get("wpm", payload.get("reading_speed", 200)))
    if text:
        words = len(text.split())
    elif word_count_input:
        words = word_count_input
    else:
        return _make_json({"error": "Please enter text or provide word count."}, "No input")
    if wpm <= 0:
        wpm = 200
    minutes = words / wpm
    seconds = round(minutes * 60)
    m = int(minutes)
    s = seconds % 60
    chars = len(text) if text else 0
    sentences = text.count('.') + text.count('!') + text.count('?') if text else 0
    return _make_json({
        "word_count": words,
        "character_count": chars,
        "sentence_count": sentences,
        "reading_speed_wpm": wpm,
        "reading_time_minutes": round(minutes, 2),
        "reading_time_seconds": seconds,
        "reading_time_display": f"{m} min {s} sec" if m > 0 else f"{s} sec",
        "slow_reader_time": f"{round(words/150, 1)} min (150 wpm)",
        "average_reader_time": f"{round(words/200, 1)} min (200 wpm)",
        "fast_reader_time": f"{round(words/300, 1)} min (300 wpm)",
        "summary": f"~{m} min {s} sec to read {words} words at {wpm} wpm"
    }, f"~{m} min {s} sec" if m > 0 else f"~{s} sec")


# ─── Attendance Calculator ──────────────────────────────────────────────────
def _handle_attendance_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        attended = int(payload.get("attended", payload.get("classes_attended", payload.get("present", 0))))
        total = int(payload.get("total", payload.get("total_classes", payload.get("classes", 1))))
        required_pct = float(payload.get("required_percent", payload.get("required", 75)))
        if total <= 0:
            return _make_json({"error": "Total classes must be greater than 0"}, "Error")
        current_pct = round(attended / total * 100, 2)
        status = "✅ Safe" if current_pct >= required_pct else "⚠️ Short"
        if current_pct >= required_pct:
            # How many classes can be skipped
            skip = int((attended - required_pct / 100 * total) / (required_pct / 100))
            advice = f"You can skip up to {max(0, skip)} more classes."
        else:
            # How many classes needed to reach required %
            need = 0
            while (attended + need) / (total + need) * 100 < required_pct:
                need += 1
            advice = f"Attend next {need} classes without missing any to reach {required_pct}%."
        return _make_json({
            "classes_attended": attended, "total_classes": total,
            "current_percentage": current_pct,
            "required_percentage": required_pct,
            "status": status, "advice": advice,
            "summary": f"{current_pct}% attendance — {status}. {advice}"
        }, f"{current_pct}% — {status}")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Exam Score / Marks Calculator ─────────────────────────────────────────
def _handle_exam_score_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        obtained = float(payload.get("obtained", payload.get("marks_obtained", payload.get("score", 0))))
        total_marks = float(payload.get("total", payload.get("total_marks", payload.get("max_marks", 100))))
        if total_marks <= 0:
            return _make_json({"error": "Total marks must be greater than 0"}, "Error")
        percentage = round(obtained / total_marks * 100, 2)
        if percentage >= 90:
            grade, gpa = "A+", 10.0
        elif percentage >= 80:
            grade, gpa = "A", 9.0
        elif percentage >= 70:
            grade, gpa = "B+", 8.0
        elif percentage >= 60:
            grade, gpa = "B", 7.0
        elif percentage >= 50:
            grade, gpa = "C", 6.0
        elif percentage >= 40:
            grade, gpa = "D", 5.0
        else:
            grade, gpa = "F (Fail)", 0.0
        return _make_json({
            "marks_obtained": obtained, "total_marks": total_marks,
            "percentage": percentage, "grade": grade, "gpa_equivalent": gpa,
            "pass_fail": "Pass" if percentage >= 33 else "Fail",
            "marks_to_pass": max(0, round(total_marks * 0.33 - obtained, 1)),
            "marks_for_distinction": max(0, round(total_marks * 0.75 - obtained, 1)),
            "summary": f"{percentage}% | Grade: {grade} | {gpa}/10 GPA"
        }, f"{percentage}% — {grade}")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Anagram Checker ────────────────────────────────────────────────────────
def _handle_anagram_checker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    word1 = str(payload.get("word1", payload.get("text1", ""))).strip().lower()
    word2 = str(payload.get("word2", payload.get("text2", ""))).strip().lower()
    if not word1 or not word2:
        return _make_json({"error": "Please enter two words/phrases to check."}, "No input")
    clean1 = "".join(c for c in word1 if c.isalnum())
    clean2 = "".join(c for c in word2 if c.isalnum())
    is_anagram = sorted(clean1) == sorted(clean2)
    from collections import Counter
    freq1 = dict(Counter(clean1))
    freq2 = dict(Counter(clean2))
    missing_in_2 = {k: v - freq2.get(k, 0) for k, v in freq1.items() if freq2.get(k, 0) < v}
    missing_in_1 = {k: v - freq1.get(k, 0) for k, v in freq2.items() if freq1.get(k, 0) < v}
    return _make_json({
        "word1": word1, "word2": word2,
        "is_anagram": is_anagram,
        "result": "✅ Anagram!" if is_anagram else "❌ Not an anagram",
        "char_count_1": len(clean1), "char_count_2": len(clean2),
        "missing_chars": {"in_word2": missing_in_2, "in_word1": missing_in_1} if not is_anagram else {},
        "summary": f"'{word1}' and '{word2}' {'ARE' if is_anagram else 'are NOT'} anagrams"
    }, "✅ Anagram!" if is_anagram else "❌ Not an anagram")


# ─── Text Line Sorter ────────────────────────────────────────────────────────
def _handle_text_line_sorter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please enter text to sort."}, "No input")
    order = str(payload.get("order", "asc")).lower()
    case_sensitive = bool(payload.get("case_sensitive", False))
    lines = text.split('\n')
    key_fn = (lambda x: x) if case_sensitive else (lambda x: x.lower())
    if order in ("desc", "descending", "z-a"):
        sorted_lines = sorted(lines, key=key_fn, reverse=True)
    elif order in ("length", "len"):
        sorted_lines = sorted(lines, key=lambda x: len(x))
    elif order in ("length_desc", "len_desc"):
        sorted_lines = sorted(lines, key=lambda x: len(x), reverse=True)
    elif order in ("random", "shuffle"):
        import random as _r
        sorted_lines = lines[:]
        _r.shuffle(sorted_lines)
    else:
        sorted_lines = sorted(lines, key=key_fn)
    result = '\n'.join(sorted_lines)
    return _make_json({
        "original_lines": len(lines), "sort_order": order,
        "sorted_text": result, "lines": sorted_lines,
        "summary": f"Sorted {len(lines)} lines ({order})"
    }, result[:200] + "..." if len(result) > 200 else result)


# ─── List Deduplicator ────────────────────────────────────────────────────────
def _handle_list_deduplicator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please enter a list (one item per line)."}, "No input")
    case_sensitive = bool(payload.get("case_sensitive", True))
    sep = str(payload.get("separator", "\n"))
    if sep == "\\n":
        sep = "\n"
    items = [i.strip() for i in text.split(sep) if i.strip()]
    seen = set()
    unique = []
    duplicates = []
    for item in items:
        key = item if case_sensitive else item.lower()
        if key not in seen:
            seen.add(key)
            unique.append(item)
        else:
            duplicates.append(item)
    result = sep.join(unique)
    return _make_json({
        "original_count": len(items),
        "unique_count": len(unique),
        "duplicate_count": len(duplicates),
        "removed_duplicates": duplicates,
        "unique_list": unique,
        "result": result,
        "summary": f"Removed {len(duplicates)} duplicates. {len(unique)} unique items remain."
    }, result[:200] + "..." if len(result) > 200 else result)


# ─── Character Frequency ─────────────────────────────────────────────────────
def _handle_character_frequency(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    from collections import Counter
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please enter text."}, "No input")
    ignore_spaces = bool(payload.get("ignore_spaces", True))
    case_sensitive = bool(payload.get("case_sensitive", False))
    target = text if case_sensitive else text.lower()
    if ignore_spaces:
        target = target.replace(" ", "")
    freq = dict(Counter(target))
    sorted_freq = dict(sorted(freq.items(), key=lambda x: -x[1]))
    top5 = list(sorted_freq.items())[:5]
    word_count = len(text.split())
    return _make_json({
        "text_length": len(text),
        "analyzed_chars": len(target),
        "word_count": word_count,
        "unique_characters": len(freq),
        "character_frequency": sorted_freq,
        "top_5_characters": [{"char": k, "count": v, "percent": round(v/len(target)*100,2)} for k,v in top5],
        "summary": f"Top char: '{top5[0][0]}' ({top5[0][1]}x) | {len(freq)} unique chars in {len(text)} chars"
    }, f"Top: '{top5[0][0]}'×{top5[0][1]}" if top5 else "No data")


# ─── Calorie Calculator (TDEE) ──────────────────────────────────────────────
def _handle_calorie_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        weight_kg = float(payload.get("weight", payload.get("weight_kg", 70)))
        height_cm = float(payload.get("height", payload.get("height_cm", 170)))
        age = int(payload.get("age", 25))
        gender = str(payload.get("gender", payload.get("sex", "male"))).lower()
        activity = str(payload.get("activity", payload.get("activity_level", "moderate"))).lower()
        # Mifflin-St Jeor BMR
        if gender in ("male", "m", "man"):
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
        else:
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
        activity_map = {
            "sedentary": 1.2, "sedentary": 1.2,
            "light": 1.375, "lightly active": 1.375,
            "moderate": 1.55, "moderately active": 1.55,
            "active": 1.725, "very active": 1.725,
            "extra": 1.9, "extra active": 1.9, "athlete": 1.9,
        }
        multiplier = activity_map.get(activity, 1.55)
        tdee = round(bmr * multiplier)
        bmi = round(weight_kg / ((height_cm / 100) ** 2), 1)
        if bmi < 18.5: bmi_cat = "Underweight"
        elif bmi < 25: bmi_cat = "Normal weight"
        elif bmi < 30: bmi_cat = "Overweight"
        else: bmi_cat = "Obese"
        return _make_json({
            "bmr": round(bmr),
            "tdee": tdee,
            "bmi": bmi,
            "bmi_category": bmi_cat,
            "calorie_goals": {
                "extreme_loss": tdee - 1000, "weight_loss": tdee - 500,
                "maintenance": tdee, "weight_gain": tdee + 500, "muscle_gain": tdee + 1000
            },
            "summary": f"TDEE: {tdee} kcal/day | BMI: {bmi} ({bmi_cat})"
        }, f"TDEE: {tdee} kcal/day")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Assignment Deadline Tracker ─────────────────────────────────────────────
def _handle_assignment_deadline_tracker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    from datetime import datetime, timedelta
    text = str(payload.get("text", payload.get("assignments", ""))).strip()
    deadline_str = str(payload.get("deadline", payload.get("due_date", ""))).strip()
    subject = str(payload.get("subject", payload.get("name", "Assignment"))).strip()
    today = datetime.now().date()
    results = []
    if deadline_str:
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%m/%d/%Y"):
            try:
                due = datetime.strptime(deadline_str, fmt).date()
                days_left = (due - today).days
                status = "⚠️ Overdue" if days_left < 0 else ("🔥 Due today!" if days_left == 0 else ("🚨 Due tomorrow!" if days_left == 1 else (f"✅ {days_left} days left" if days_left <= 7 else f"📅 {days_left} days left")))
                results.append({"subject": subject, "deadline": deadline_str, "days_left": days_left, "status": status})
                break
            except ValueError:
                continue
    if text:
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        for line in lines:
            results.append({"item": line, "status": "📝 Pending"})
    if not results:
        return _make_json({"error": "Please enter a deadline date (YYYY-MM-DD) or assignment list."}, "No input")
    return _make_json({
        "today": str(today),
        "assignments": results,
        "count": len(results),
        "summary": results[0].get("status", "Tracked") if results else "No assignments"
    }, results[0].get("status", "Tracked") if results else "Tracked")


# ─── Number Palindrome Checker ───────────────────────────────────────────────
def _handle_number_palindrome_checker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", payload.get("number", payload.get("input", "")))).strip()
    if not text:
        return _make_json({"error": "Please enter a number or text to check."}, "No input")
    clean = text.replace(" ", "").lower()
    reversed_text = clean[::-1]
    is_palindrome = clean == reversed_text
    results = []
    for word in text.split():
        w_clean = word.lower().strip(".,!?")
        results.append({"word": word, "is_palindrome": w_clean == w_clean[::-1]})
    return _make_json({
        "input": text,
        "is_palindrome": is_palindrome,
        "reversed": reversed_text,
        "result": "✅ Palindrome!" if is_palindrome else "❌ Not a palindrome",
        "word_analysis": results,
        "summary": f"'{text}' {'IS' if is_palindrome else 'is NOT'} a palindrome"
    }, "✅ Palindrome!" if is_palindrome else "❌ Not a palindrome")


# ─── Resume Word Count ───────────────────────────────────────────────────────
def _handle_resume_word_count(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    from collections import Counter
    text = str(payload.get("text", "")).strip()
    if not text:
        return _make_json({"error": "Please paste your resume text."}, "No input")
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    char_no_space = len(text.replace(" ", ""))
    sentences = text.count('.') + text.count('!') + text.count('?')
    paragraphs = len([p for p in text.split('\n\n') if p.strip()])
    # Estimate reading time
    reading_min = round(word_count / 200, 1)
    # Common resume power words
    power_words = ["achieved", "increased", "decreased", "improved", "managed", "led", "developed", "created",
                   "designed", "implemented", "optimized", "built", "launched", "delivered", "reduced", "generated"]
    found_power = [w for w in power_words if w in text.lower()]
    if word_count < 300:
        advice = "Too short — aim for 400–700 words for a strong resume."
    elif word_count <= 700:
        advice = "Good length! Your resume is within the ideal 400–700 word range."
    elif word_count <= 1000:
        advice = "Slightly long — consider trimming to keep it concise."
    else:
        advice = "Too long — resume should be under 700 words (1 page). Trim aggressively."
    return _make_json({
        "word_count": word_count, "character_count": char_count,
        "characters_without_spaces": char_no_space,
        "sentence_count": max(1, sentences),
        "paragraph_count": paragraphs,
        "estimated_reading_time": f"{reading_min} min",
        "page_estimate": round(word_count / 500, 1),
        "power_words_found": found_power,
        "power_words_missing": [w for w in power_words if w not in text.lower()][:5],
        "advice": advice,
        "summary": f"{word_count} words | {advice}"
    }, f"{word_count} words — {advice[:50]}")


# ─── Study Hours Calculator ──────────────────────────────────────────────────
def _handle_study_hours_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        subjects = int(payload.get("subjects", payload.get("subject_count", 5)))
        days_left = int(payload.get("days_left", payload.get("days", payload.get("exam_days", 7))))
        hours_available = float(payload.get("hours_per_day", payload.get("available_hours", 8)))
        difficulty = str(payload.get("difficulty", "medium")).lower()
        if days_left <= 0:
            return _make_json({"error": "Days left must be greater than 0"}, "Error")
        diff_multiplier = {"easy": 0.7, "medium": 1.0, "hard": 1.3, "very hard": 1.5}.get(difficulty, 1.0)
        total_hours = days_left * hours_available
        per_subject = round(total_hours / subjects, 1)
        breaks_per_day = max(1, int(hours_available / 2))
        pomodoros_per_day = int(hours_available * 60 / 25)
        return _make_json({
            "subjects": subjects, "days_left": days_left,
            "hours_available_per_day": hours_available,
            "total_study_hours": total_hours,
            "hours_per_subject": per_subject,
            "recommended_breaks_per_day": breaks_per_day,
            "pomodoro_sessions_per_day": pomodoros_per_day,
            "daily_schedule": {
                "morning": f"{round(hours_available * 0.4, 1)} hours (most difficult topics)",
                "afternoon": f"{round(hours_available * 0.35, 1)} hours (revision)",
                "evening": f"{round(hours_available * 0.25, 1)} hours (practice & notes)"
            },
            "difficulty": difficulty,
            "summary": f"{per_subject} hrs/subject over {days_left} days | {total_hours} total study hours"
        }, f"{per_subject} hrs per subject")
    except (ValueError, TypeError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Unit Converter (Meta/General) ──────────────────────────────────────────
def _handle_unit_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    try:
        value = float(payload.get("value", 1))
        from_unit = str(payload.get("from_unit", payload.get("from", ""))).lower().strip()
        to_unit = str(payload.get("to_unit", payload.get("to", ""))).lower().strip()
        # All conversions normalized to SI base units
        conversions: dict[str, float] = {
            # Length (base: meter)
            "meter": 1, "m": 1, "meters": 1, "metre": 1, "metres": 1,
            "kilometer": 1000, "km": 1000, "kilometers": 1000,
            "centimeter": 0.01, "cm": 0.01, "centimeters": 0.01,
            "millimeter": 0.001, "mm": 0.001,
            "inch": 0.0254, "inches": 0.0254, "in": 0.0254,
            "foot": 0.3048, "feet": 0.3048, "ft": 0.3048,
            "yard": 0.9144, "yards": 0.9144, "yd": 0.9144,
            "mile": 1609.344, "miles": 1609.344, "mi": 1609.344,
            # Weight (base: kg)
            "kilogram": 1, "kg": 1, "kilograms": 1,
            "gram": 0.001, "g": 0.001, "grams": 0.001,
            "milligram": 0.000001, "mg": 0.000001,
            "pound": 0.453592, "lb": 0.453592, "pounds": 0.453592, "lbs": 0.453592,
            "ounce": 0.0283495, "oz": 0.0283495, "ounces": 0.0283495,
            "tonne": 1000, "ton": 1000, "metric ton": 1000,
            # Volume (base: liter)
            "liter": 1, "l": 1, "litre": 1, "liters": 1,
            "milliliter": 0.001, "ml": 0.001, "milliliters": 0.001,
            "gallon": 3.78541, "gallons": 3.78541, "gal": 3.78541,
            "cup": 0.236588, "cups": 0.236588,
            "pint": 0.473176, "pints": 0.473176, "pt": 0.473176,
            "quart": 0.946353, "quarts": 0.946353, "qt": 0.946353,
            "tablespoon": 0.0147868, "tbsp": 0.0147868,
            "teaspoon": 0.00492892, "tsp": 0.00492892,
            # Data (base: byte)
            "byte": 1, "bytes": 1, "b": 1,
            "kilobyte": 1024, "kb": 1024, "kilobytes": 1024,
            "megabyte": 1048576, "mb": 1048576, "megabytes": 1048576,
            "gigabyte": 1073741824, "gb": 1073741824, "gigabytes": 1073741824,
            "terabyte": 1099511627776, "tb": 1099511627776, "terabytes": 1099511627776,
            # Speed (base: m/s)
            "m/s": 1, "mps": 1, "meters per second": 1,
            "km/h": 1/3.6, "kmh": 1/3.6, "kph": 1/3.6, "kilometers per hour": 1/3.6,
            "mph": 0.44704, "miles per hour": 0.44704,
            "knot": 0.514444, "knots": 0.514444,
            # Area (base: m²)
            "m2": 1, "sqm": 1, "square meter": 1, "square meters": 1,
            "km2": 1e6, "square kilometer": 1e6,
            "cm2": 0.0001, "square centimeter": 0.0001,
            "ft2": 0.092903, "sqft": 0.092903, "square foot": 0.092903, "square feet": 0.092903,
            "acre": 4046.86, "acres": 4046.86,
            "hectare": 10000, "hectares": 10000, "ha": 10000,
        }
        if from_unit not in conversions or to_unit not in conversions:
            return _make_json({"error": f"Unit not found. Known units include: km, m, cm, mm, inch, foot, kg, g, lb, liter, ml, gallon, byte, kb, mb, gb, m/s, km/h, mph, etc."}, "Error")
        base_value = value * conversions[from_unit]
        result = base_value / conversions[to_unit]
        return _make_json({
            "input": value, "from": from_unit, "to": to_unit,
            "result": round(result, 10) if abs(result) < 0.01 else round(result, 6),
            "summary": f"{value} {from_unit} = {round(result, 6)} {to_unit}"
        }, f"{round(result, 6)} {to_unit}")
    except (ValueError, TypeError, ZeroDivisionError) as e:
        return _make_json({"error": str(e)}, "Error")


# ─── Random Name Picker ────────────────────────────────────────────────────
def _handle_random_name_picker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = str(payload.get("text", payload.get("names", ""))).strip()
    count = int(payload.get("count", payload.get("pick", 1)))
    if not text:
        return _make_json({"error": "Please enter a list of names (one per line or comma-separated)."}, "No names")
    # Support both newline and comma separated
    if '\n' in text:
        names = [n.strip() for n in text.split('\n') if n.strip()]
    else:
        names = [n.strip() for n in text.split(',') if n.strip()]
    if not names:
        return _make_json({"error": "No valid names found. Enter names separated by new lines or commas."}, "No names")
    count = max(1, min(count, len(names)))
    picked = random.sample(names, count)
    return _make_json({
        "picked": picked,
        "winner": picked[0] if count == 1 else None,
        "all_names": names,
        "total_names": len(names),
        "picked_count": count,
        "summary": f"🎉 Winner: {picked[0]}" if count == 1 else f"🎉 Selected: {', '.join(picked)}"
    }, f"Picked: {', '.join(picked)}")


# ─── Registry of all new handlers ─────────────────────────────────────────
ULTRA_HANDLERS: dict[str, Any] = {
    "text-readability-score": _handle_text_readability_score,
    "text-readability": _handle_text_readability_score,
    "cron-builder": _handle_cron_builder,
    "cron-expression-builder": _handle_cron_builder,
    "investment-calculator": _handle_investment_calculator,
    "net-worth-calculator": _handle_net_worth_calculator,
    "retirement-planner": _handle_retirement_planner,
    "pace-calculator": _handle_pace_calculator,
    "running-pace-calculator": _handle_pace_calculator,
    "menstrual-cycle-calculator": _handle_menstrual_cycle_calculator,
    "period-calculator": _handle_menstrual_cycle_calculator,
    "pregnancy-week-calculator": _handle_pregnancy_week_calculator,
    "speed-calculator": _handle_speed_calculator,
    "aspect-ratio-calculator": _handle_aspect_ratio_calculator,
    "image-aspect-ratio": _handle_aspect_ratio_calculator,
    "gstin-validator": _handle_gstin_validator,
    "pan-validator": _handle_pan_validator,
    "pan-card-validator": _handle_pan_validator,
    "phone-number-validator": _handle_phone_number_validator,
    "email-validator": _handle_email_validator,
    "css-gradient-generator": _handle_css_gradient_generator,
    "box-shadow-generator": _handle_box_shadow_generator,
    "ppf-calculator": _handle_ppf_calculator,
    "public-provident-fund-calculator": _handle_ppf_calculator,
    "nps-calculator": _handle_nps_calculator,
    "macro-calculator": _handle_macro_calculator,
    "macronutrient-calculator": _handle_macro_calculator,
    "braille-converter": _handle_braille_converter,
    "text-to-braille": _handle_braille_converter,
    "net-salary-calculator-india": _handle_net_salary_calculator,
    "in-hand-salary-calculator": _handle_net_salary_calculator,
    "hra-calculator-india": _handle_hra_calculator,
    "epf-calculator-india": _handle_epf_calculator,
    "provident-fund-calculator": _handle_epf_calculator,
    "gratuity-calculator-india": _handle_gratuity_calculator,
    "url-validator": _handle_url_validator,
    "color-blindness-simulator": _handle_color_blindness_simulator,
    "grammar-score": _handle_grammar_score,
    "grammar-checker-advanced": _handle_grammar_score,
    "bill-splitter": _handle_bill_splitter,
    "split-bill": _handle_bill_splitter,
    "restaurant-bill-splitter": _handle_bill_splitter,
    "random-name-picker": _handle_random_name_picker,
    "random-winner-picker": _handle_random_name_picker,
    "name-randomizer": _handle_random_name_picker,
    # New batch
    "time-converter": _handle_time_converter,
    "time-unit-converter": _handle_time_converter,
    "convert-time": _handle_time_converter,
    "coin-flipper": _handle_coin_flipper,
    "flip-coin": _handle_coin_flipper,
    "coin-toss": _handle_coin_flipper,
    "morse-code-converter": _handle_morse_code_converter,
    "morse-code": _handle_morse_code_converter,
    "text-to-morse": _handle_morse_code_converter,
    "morse-decoder": _handle_morse_code_converter,
    "fraction-calculator": _handle_fraction_calculator,
    "fraction-math": _handle_fraction_calculator,
    "percentage-change-calculator": _handle_percentage_change_calculator,
    "percent-change": _handle_percentage_change_calculator,
    "percentage-change": _handle_percentage_change_calculator,
    "emi-calculator": _handle_emi_calculator,
    "loan-emi-calculator": _handle_emi_calculator,
    "monthly-emi": _handle_emi_calculator,
    "interest-calculator": _handle_interest_calculator,
    "simple-interest-calculator": _handle_interest_calculator,
    "compound-interest-calculator": _handle_interest_calculator,
    "reading-time-estimator": _handle_reading_time_estimator,
    "reading-time": _handle_reading_time_estimator,
    "estimate-reading-time": _handle_reading_time_estimator,
    "attendance-calculator": _handle_attendance_calculator,
    "attendance-tracker": _handle_attendance_calculator,
    "exam-score-calculator": _handle_exam_score_calculator,
    "marks-calculator": _handle_exam_score_calculator,
    "marks-to-percentage": _handle_exam_score_calculator,
    "anagram-checker": _handle_anagram_checker,
    "anagram-detector": _handle_anagram_checker,
    "text-line-sorter": _handle_text_line_sorter,
    "line-sorter": _handle_text_line_sorter,
    "sort-lines": _handle_text_line_sorter,
    "list-deduplicator": _handle_list_deduplicator,
    "remove-duplicates": _handle_list_deduplicator,
    "deduplicate-list": _handle_list_deduplicator,
    "character-frequency": _handle_character_frequency,
    "char-frequency": _handle_character_frequency,
    "letter-frequency": _handle_character_frequency,
    "calorie-calculator": _handle_calorie_calculator,
    "tdee-calculator": _handle_calorie_calculator,
    "daily-calorie-calculator": _handle_calorie_calculator,
    "assignment-deadline-tracker": _handle_assignment_deadline_tracker,
    "deadline-tracker": _handle_assignment_deadline_tracker,
    "number-palindrome-checker": _handle_number_palindrome_checker,
    "palindrome-checker": _handle_number_palindrome_checker,
    "is-palindrome": _handle_number_palindrome_checker,
    "resume-word-count": _handle_resume_word_count,
    "resume-analyzer": _handle_resume_word_count,
    "study-hours-calculator": _handle_study_hours_calculator,
    "study-planner": _handle_study_hours_calculator,
    "unit-converter": _handle_unit_converter,
    "universal-converter": _handle_unit_converter,
}


def register_ultra_handlers() -> int:
    """Register all ultra handlers into the global HANDLERS dict."""
    registered = 0
    for slug, handler in ULTRA_HANDLERS.items():
        if slug not in HANDLERS:
            HANDLERS[slug] = handler
            registered += 1
    return registered
