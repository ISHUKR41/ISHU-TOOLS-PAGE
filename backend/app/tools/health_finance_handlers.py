"""
Health, Fitness & Finance tool handlers.
All pure-Python calculations — no external APIs needed.
Covers: calorie intake, BMR, body fat, water intake, sleep cycles,
heart rate zones, steps→km, GST, SIP, ROI, budget planner,
savings goal, Indian tax, number-to-words, Roman numerals.
"""
from __future__ import annotations

import math
from datetime import datetime, timedelta
from typing import Any

from .handlers import ExecutionResult, coerce_float, coerce_int


def _json(data: dict, message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)


def _err(msg: str) -> ExecutionResult:
    return _json({"error": msg, "result": msg}, msg)


# ──────────────────────────────────────────────
#  HEALTH & FITNESS
# ──────────────────────────────────────────────

def handle_calorie_calculator(files, payload, output_dir) -> ExecutionResult:
    """TDEE / daily calorie calculator."""
    age    = float(payload.get("age", 0) or 25)
    weight = float(payload.get("weight", 0) or 70)   # kg
    height = float(payload.get("height", 0) or 170)  # cm
    gender = str(payload.get("gender", "male")).lower()
    # support both 'activity_level' (from toolFields) and 'activity' (legacy)
    activity = str(payload.get("activity_level", "") or payload.get("activity", "moderate")).lower().replace("_", " ")

    # Mifflin-St Jeor BMR
    if gender in ("female", "f"):
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5

    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very active": 1.9,
        "veryactive": 1.9,
        "very_active": 1.9,
        "extra": 1.9,
    }
    mult = multipliers.get(activity, 1.55)
    tdee = bmr * mult

    return _json({
        "result": f"Daily Calories: {tdee:.0f} kcal (BMR: {bmr:.0f} kcal)",
        "bmr": round(bmr, 1),
        "tdee": round(tdee, 1),
        "weight_loss": round(tdee - 500, 1),
        "weight_gain": round(tdee + 500, 1),
        "activity": activity,
        "gender": gender,
    }, f"Daily calorie need: {tdee:.0f} kcal")


def handle_bmr_calculator(files, payload, output_dir) -> ExecutionResult:
    """Basal Metabolic Rate using Mifflin-St Jeor equation."""
    age    = float(payload.get("age", 0) or 25)
    weight = float(payload.get("weight", 0) or 70)
    height = float(payload.get("height", 0) or 170)
    gender = str(payload.get("gender", "male")).lower()

    if gender in ("female", "f"):
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
        formula = "10×weight + 6.25×height − 5×age − 161"
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
        formula = "10×weight + 6.25×height − 5×age + 5"

    harris_bmr = (
        655.1 + 9.563 * weight + 1.850 * height - 4.676 * age
        if gender in ("female", "f")
        else 66.5 + 13.75 * weight + 5.003 * height - 6.775 * age
    )

    return _json({
        "result": f"BMR: {bmr:.1f} kcal/day",
        "bmr_mifflin": round(bmr, 1),
        "bmr_harris": round(harris_bmr, 1),
        "formula": formula,
        "interpretation": "Minimum calories needed at complete rest",
    }, f"BMR: {bmr:.1f} kcal/day")


def handle_body_fat_calculator(files, payload, output_dir) -> ExecutionResult:
    """US Navy body-fat-percentage method."""
    gender = str(payload.get("gender", "male")).lower()
    height = float(payload.get("height", 0) or 175)   # cm
    neck   = float(payload.get("neck", 0) or 37)      # cm
    waist  = float(payload.get("waist", 0) or 82)     # cm
    hip    = float(payload.get("hip", 0) or 0)        # cm (women)

    if height <= 0 or neck <= 0 or waist <= 0:
        return _err("Please enter valid measurements (height, neck, waist in cm).")

    if gender in ("female", "f"):
        if hip <= 0:
            return _err("Hip measurement is required for female body fat calculation.")
        if waist + hip - neck <= neck:
            return _err("Invalid measurements. Waist + Hip must exceed Neck circumference.")
        bf = 163.205 * math.log10(waist + hip - neck) - 97.684 * math.log10(height) - 78.387
    else:
        if waist - neck <= 0:
            return _err("Waist must be larger than neck circumference.")
        bf = 86.010 * math.log10(waist - neck) - 70.041 * math.log10(height) + 36.76

    bf = max(2.0, min(bf, 60.0))

    # Category
    if gender in ("female", "f"):
        if bf < 14: cat = "Essential fat"
        elif bf < 21: cat = "Athletic"
        elif bf < 25: cat = "Fit"
        elif bf < 32: cat = "Average"
        else: cat = "Obese"
    else:
        if bf < 6: cat = "Essential fat"
        elif bf < 14: cat = "Athletic"
        elif bf < 18: cat = "Fit"
        elif bf < 25: cat = "Average"
        else: cat = "Obese"

    return _json({
        "result": f"Body Fat: {bf:.1f}% — {cat}",
        "body_fat_percent": round(bf, 1),
        "category": cat,
        "method": "US Navy Method",
    }, f"Body Fat: {bf:.1f}% ({cat})")


def handle_water_intake_calculator(files, payload, output_dir) -> ExecutionResult:
    """Daily water intake recommendation."""
    weight   = float(payload.get("weight", 0) or 70)    # kg
    activity = str(payload.get("activity_level", "") or payload.get("activity", "moderate")).lower().replace("_", " ")
    climate  = str(payload.get("climate", "temperate")).lower().replace("_", " ")

    base_liters = weight * 0.033   # 33 ml per kg

    activity_add = {"sedentary": 0, "light": 0.3, "moderate": 0.5,
                    "active": 0.7, "very active": 0.9, "veryactive": 0.9}.get(activity, 0.5)
    climate_map = {"cool": 0, "temperate": 0.1, "hot humid": 0.5, "very hot": 0.7,
                   "hot": 0.5, "humid": 0.4, "dry": 0.3, "cold": 0, "normal": 0}
    climate_add  = climate_map.get(climate, 0.1)

    total = base_liters + activity_add + climate_add
    cups  = total / 0.237   # 1 cup ≈ 237 ml

    return _json({
        "result": f"Daily Water Intake: {total:.1f} litres ({cups:.0f} cups)",
        "litres": round(total, 2),
        "ml": round(total * 1000),
        "cups_8oz": round(cups),
        "base_litres": round(base_liters, 2),
        "activity_addition": round(activity_add, 2),
        "climate_addition": round(climate_add, 2),
    }, f"Recommended: {total:.1f} L/day ({cups:.0f} cups)")


def handle_sleep_calculator(files, payload, output_dir) -> ExecutionResult:
    """Sleep cycle calculator — find best wake or sleep times."""
    # 'bedtime' is from toolFields; legacy fallbacks: 'text', 'sleep_time'
    sleep_time = str(payload.get("bedtime", "") or payload.get("text", "") or payload.get("sleep_time", "22:30")).strip()
    if not sleep_time:
        sleep_time = "22:30"
    cycles     = int(payload.get("value", 0) or 6)   # default 6 cycles (9 hrs)

    # Parse time
    try:
        t = datetime.strptime(sleep_time, "%H:%M")
    except ValueError:
        try:
            t = datetime.strptime(sleep_time, "%I:%M %p")
        except ValueError:
            t = datetime.strptime("22:30", "%H:%M")

    # Each sleep cycle ≈ 90 minutes; 15 min to fall asleep
    fall_asleep = t + timedelta(minutes=15)
    wake_times = []
    for c in range(1, 7):
        wake = fall_asleep + timedelta(minutes=90 * c)
        wake_times.append({
            "cycles": c,
            "hours_sleep": round(c * 1.5, 1),
            "wake_time": wake.strftime("%I:%M %p"),
            "quality": "Ideal" if c >= 5 else ("Good" if c >= 4 else "Short"),
        })

    return _json({
        "result": f"Best wake times after sleeping at {sleep_time}",
        "sleep_time": sleep_time,
        "fall_asleep_at": fall_asleep.strftime("%I:%M %p"),
        "wake_times": wake_times,
        "tip": "Adults need 5–6 complete cycles (7.5–9 hours) for optimal rest.",
    }, f"Sleep cycles calculated for {sleep_time} bedtime")


def handle_heart_rate_zones(files, payload, output_dir) -> ExecutionResult:
    """Heart rate training zones calculator."""
    age      = float(payload.get("age", 0) or 25)
    resting  = float(payload.get("value", 0) or payload.get("resting_hr", 65))
    formula  = str(payload.get("formula", "karvonen")).lower()

    max_hr = 220 - age   # Standard formula

    if formula == "karvonen":
        hrr = max_hr - resting
        zones = [
            ("Zone 1 – Warm Up",       50, 60),
            ("Zone 2 – Fat Burn",       60, 70),
            ("Zone 3 – Aerobic",        70, 80),
            ("Zone 4 – Anaerobic",      80, 90),
            ("Zone 5 – Max Effort",     90, 100),
        ]
        zone_data = []
        for name, lo, hi in zones:
            zone_data.append({
                "zone": name,
                "bpm_low":  round(resting + hrr * lo / 100),
                "bpm_high": round(resting + hrr * hi / 100),
                "percent_range": f"{lo}–{hi}%",
            })
        method = "Karvonen (Heart Rate Reserve)"
    else:
        zone_data = [
            {"zone": "Zone 1 – Warm Up",   "bpm_low": round(max_hr * 0.50), "bpm_high": round(max_hr * 0.60)},
            {"zone": "Zone 2 – Fat Burn",   "bpm_low": round(max_hr * 0.60), "bpm_high": round(max_hr * 0.70)},
            {"zone": "Zone 3 – Aerobic",    "bpm_low": round(max_hr * 0.70), "bpm_high": round(max_hr * 0.80)},
            {"zone": "Zone 4 – Anaerobic",  "bpm_low": round(max_hr * 0.80), "bpm_high": round(max_hr * 0.90)},
            {"zone": "Zone 5 – Max Effort", "bpm_low": round(max_hr * 0.90), "bpm_high": max_hr},
        ]
        method = "Percentage of Max HR"

    return _json({
        "result": f"Max HR: {max_hr:.0f} bpm | Resting HR: {resting:.0f} bpm",
        "max_hr": round(max_hr),
        "resting_hr": round(resting),
        "age": round(age),
        "method": method,
        "zones": zone_data,
    }, f"Heart rate zones for age {round(age)}")


def handle_steps_to_km(files, payload, output_dir) -> ExecutionResult:
    """Convert steps to distance (km/miles) and calories."""
    steps       = float(payload.get("value", 0) or payload.get("steps", 10000))
    height_cm   = float(payload.get("height", 0) or 170)
    weight_kg   = float(payload.get("weight", 0) or 70)
    gender      = str(payload.get("gender", "male")).lower()

    # Stride length estimate (Hatano formula)
    stride_factor = 0.413 if gender in ("female", "f") else 0.415
    stride_m = (height_cm / 100) * stride_factor
    distance_m = steps * stride_m
    distance_km = distance_m / 1000
    distance_mi = distance_km * 0.621371

    # MET ≈ 3.5 for walking, calories = MET × weight × time(hrs)
    speed_kmh = 5.0  # avg walking speed
    time_hrs  = distance_km / speed_kmh
    calories  = 3.5 * weight_kg * time_hrs

    return _json({
        "result": f"{steps:.0f} steps = {distance_km:.2f} km ({distance_mi:.2f} miles)",
        "steps": round(steps),
        "distance_km": round(distance_km, 2),
        "distance_miles": round(distance_mi, 2),
        "distance_m": round(distance_m),
        "calories_burned": round(calories, 1),
        "stride_length_m": round(stride_m, 3),
        "estimated_time": f"{time_hrs * 60:.0f} minutes at 5 km/h",
    }, f"{steps:.0f} steps = {distance_km:.2f} km | {calories:.0f} kcal burned")


def handle_calories_burned_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calories burned by activity and duration."""
    weight   = float(payload.get("weight", 0) or 70)
    duration = float(payload.get("total", 0) or payload.get("duration", 30))  # minutes
    activity = str(payload.get("text", "") or payload.get("activity", "walking")).lower().strip()

    # MET values (metabolic equivalent)
    MET_TABLE = {
        "walking": 3.5, "running": 9.8, "jogging": 7.0, "cycling": 7.5,
        "swimming": 8.0, "yoga": 2.5, "gym": 5.0, "weight training": 5.0,
        "aerobics": 6.5, "dancing": 4.5, "football": 8.0, "cricket": 4.0,
        "basketball": 8.0, "badminton": 5.5, "tennis": 7.3, "climbing stairs": 8.0,
        "hiking": 6.0, "skipping rope": 11.0, "jump rope": 11.0,
        "rowing": 7.0, "pilates": 3.0, "zumba": 6.0, "crossfit": 9.0,
        "sit ups": 4.0, "push ups": 5.0, "squats": 5.0,
    }
    met = MET_TABLE.get(activity, 4.0)
    calories = met * weight * (duration / 60)

    suggestions = [
        (act, round(MET_TABLE[act] * weight * (duration / 60)))
        for act in ("walking", "running", "cycling", "swimming")
    ]

    return _json({
        "result": f"{calories:.0f} kcal burned in {duration:.0f} min of {activity}",
        "activity": activity,
        "met_value": met,
        "calories_burned": round(calories, 1),
        "duration_minutes": round(duration),
        "weight_kg": round(weight),
        "comparison": [{"activity": a, "calories": c} for a, c in suggestions],
    }, f"{calories:.0f} kcal burned in {duration:.0f} min of {activity}")


# ──────────────────────────────────────────────
#  FINANCE TOOLS
# ──────────────────────────────────────────────

def handle_gst_calculator(files, payload, output_dir) -> ExecutionResult:
    """Indian GST (Goods and Services Tax) calculator."""
    amount    = float(payload.get("value", 0) or payload.get("amount", 0))
    gst_rate  = float(payload.get("rate", 18))    # %
    calc_type = str(payload.get("type", "add")).lower()  # add / remove

    if amount <= 0:
        return _err("Please enter a valid amount.")
    if gst_rate <= 0:
        return _err("Please enter a valid GST rate (e.g. 5, 12, 18, 28).")

    if calc_type in ("remove", "exclusive", "reverse"):
        # Remove GST from inclusive price
        original = amount / (1 + gst_rate / 100)
        gst_amt  = amount - original
        final    = original
        mode     = "GST Removed (Inclusive → Exclusive)"
    else:
        # Add GST to exclusive price
        gst_amt  = amount * gst_rate / 100
        final    = amount + gst_amt
        original = amount
        mode     = "GST Added (Exclusive → Inclusive)"

    cgst = gst_amt / 2
    sgst = gst_amt / 2
    igst = gst_amt

    return _json({
        "result": f"GST ({gst_rate}%): ₹{gst_amt:.2f} | Final: ₹{final:.2f}",
        "original_amount": round(original, 2),
        "gst_rate_percent": gst_rate,
        "gst_amount": round(gst_amt, 2),
        "total_amount": round(final, 2),
        "cgst": round(cgst, 2),
        "sgst": round(sgst, 2),
        "igst": round(igst, 2),
        "mode": mode,
    }, f"GST {gst_rate}%: ₹{gst_amt:.2f} | Total: ₹{final:.2f}")


def handle_sip_calculator(files, payload, output_dir) -> ExecutionResult:
    """SIP (Systematic Investment Plan) returns calculator."""
    monthly_investment = float(payload.get("monthly_sip", 0) or payload.get("value", 0) or payload.get("amount", 5000))
    annual_rate        = float(payload.get("expected_return", 0) or payload.get("rate", 12))   # %
    years              = float(payload.get("tenure", 0) or payload.get("years", 10))

    if monthly_investment <= 0 or annual_rate <= 0 or years <= 0:
        return _err("All values must be positive.")

    r = annual_rate / 100 / 12   # monthly rate
    n = years * 12               # total months

    # FV = P × ((1+r)^n - 1) / r × (1+r)
    fv = monthly_investment * ((pow(1 + r, n) - 1) / r) * (1 + r)
    total_invested  = monthly_investment * n
    total_returns   = fv - total_invested
    return_pct      = (total_returns / total_invested) * 100

    # Year-by-year breakdown
    yearly = []
    for yr in range(1, int(years) + 1):
        n_yr = yr * 12
        fv_yr = monthly_investment * ((pow(1 + r, n_yr) - 1) / r) * (1 + r)
        invested_yr = monthly_investment * n_yr
        yearly.append({
            "year": yr,
            "invested": round(invested_yr),
            "value": round(fv_yr),
            "gain": round(fv_yr - invested_yr),
        })

    return _json({
        "result": f"Maturity Value: ₹{fv:,.0f} | Returns: ₹{total_returns:,.0f} ({return_pct:.1f}%)",
        "monthly_sip": round(monthly_investment),
        "annual_return_rate": annual_rate,
        "tenure_years": years,
        "total_invested": round(total_invested),
        "estimated_returns": round(total_returns),
        "maturity_value": round(fv),
        "return_percent": round(return_pct, 1),
        "yearly_breakdown": yearly,
    }, f"SIP Maturity: ₹{fv:,.0f} after {years:.0f} years")


def handle_roi_calculator(files, payload, output_dir) -> ExecutionResult:
    """Return on Investment (ROI) calculator."""
    initial = coerce_float(
        payload.get("initial_investment") or payload.get("value")
        or payload.get("initial") or payload.get("principal") or payload.get("invested"),
        default=0.0,
    )
    final_val = coerce_float(
        payload.get("final_value") or payload.get("total") or payload.get("final")
        or payload.get("returns") or payload.get("current_value"),
        default=0.0,
    )
    years = coerce_float(payload.get("years") or payload.get("duration") or payload.get("period"),
                         default=0.0, lo=0.0)

    if initial <= 0:
        return _err("Please enter your initial investment amount (must be greater than 0).")
    if final_val < 0:
        return _err("Final value cannot be negative.")

    gain     = final_val - initial
    roi_pct  = (gain / initial) * 100

    result_parts = [f"ROI: {roi_pct:.2f}%"]

    if years > 0:
        cagr = (pow(final_val / initial, 1 / years) - 1) * 100
        result_parts.append(f"CAGR: {cagr:.2f}%")
    else:
        cagr = None

    return _json({
        "result": " | ".join(result_parts),
        "initial_investment": round(initial, 2),
        "final_value": round(final_val, 2),
        "net_profit": round(gain, 2),
        "roi_percent": round(roi_pct, 2),
        "cagr_percent": round(cagr, 2) if cagr is not None else "N/A",
        "years": years if years > 0 else "N/A",
        "interpretation": (
            "Excellent return" if roi_pct > 50 else
            "Good return" if roi_pct > 20 else
            "Average return" if roi_pct > 0 else "Loss"
        ),
    }, f"ROI: {roi_pct:.2f}%" + (f" | CAGR: {cagr:.2f}%" if cagr else ""))


def handle_budget_planner(files, payload, output_dir) -> ExecutionResult:
    """50/30/20 budget planner."""
    income = float(payload.get("income", 0) or payload.get("value", 0))

    if income <= 0:
        return _err("Please enter a valid monthly income.")

    needs_pct   = float(payload.get("needs_pct",   50) or 50) / 100
    wants_pct   = float(payload.get("wants_pct",   30) or 30) / 100
    savings_pct = float(payload.get("savings_pct", 20) or 20) / 100
    total_pct   = needs_pct + wants_pct + savings_pct
    if abs(total_pct - 1.0) > 0.01:
        return _err("Needs + Wants + Savings percentages must add up to 100.")

    needs   = income * needs_pct
    wants   = income * wants_pct
    savings = income * savings_pct

    return _json({
        "result": f"₹{income:,.0f}/month → Needs: ₹{needs:,.0f} | Wants: ₹{wants:,.0f} | Savings: ₹{savings:,.0f}",
        "monthly_income": round(income, 2),
        "needs_50_percent": round(needs, 2),
        "wants_30_percent": round(wants, 2),
        "savings_20_percent": round(savings, 2),
        "needs_examples": ["Rent/EMI", "Groceries", "Utilities", "Transport", "Insurance"],
        "wants_examples": ["Dining out", "Subscriptions", "Entertainment", "Shopping", "Hobbies"],
        "savings_examples": ["Emergency fund", "Investments", "SIP", "Debt repayment", "Fixed deposits"],
        "rule": "50/30/20 Budget Rule — Popularized by Elizabeth Warren",
    }, f"Budget: Needs ₹{needs:,.0f} | Wants ₹{wants:,.0f} | Savings ₹{savings:,.0f}")


def handle_savings_goal_calculator(files, payload, output_dir) -> ExecutionResult:
    """How many months to reach a savings goal."""
    goal         = float(payload.get("goal_amount", 0) or payload.get("total", 0) or payload.get("goal", 0))
    current      = float(payload.get("current_savings", 0) or payload.get("value", 0) or payload.get("current", 0))
    monthly_save = float(payload.get("monthly_saving", 0) or payload.get("rate", 0) or payload.get("monthly", 0))
    annual_rate  = float(payload.get("rate", 0) or payload.get("years", 0) or payload.get("interest", 6))
    # 'rate' is used for interest in toolFields; if monthly_saving is set, rate is interest rate
    if payload.get("monthly_saving") and payload.get("rate"):
        annual_rate = float(payload.get("rate", 6))

    if goal <= 0 or monthly_save <= 0:
        return _err("Goal and monthly savings must be greater than 0.")

    remaining = goal - current
    if remaining <= 0:
        return _json({"result": "You've already reached your goal! 🎉", "months": 0}, "Goal already achieved")

    if annual_rate > 0:
        r = annual_rate / 100 / 12
        # months = log(1 + remaining*r/monthly_save) / log(1+r)
        months = math.log(1 + remaining * r / monthly_save) / math.log(1 + r)
    else:
        months = remaining / monthly_save

    years_   = int(months // 12)
    months_  = int(months % 12)
    timeline = f"{years_} years {months_} months" if years_ > 0 else f"{months_} months"

    return _json({
        "result": f"Reach ₹{goal:,.0f} in {timeline} (saving ₹{monthly_save:,.0f}/month)",
        "goal": round(goal),
        "current_savings": round(current),
        "remaining": round(remaining),
        "monthly_savings": round(monthly_save),
        "interest_rate": annual_rate,
        "months_to_goal": round(months, 1),
        "timeline": timeline,
    }, f"Goal in {timeline}: ₹{monthly_save:,.0f}/month needed")


def handle_income_tax_calculator(files, payload, output_dir) -> ExecutionResult:
    """Indian income tax calculator (FY 2024-25 new regime)."""
    income   = float(payload.get("income", 0) or payload.get("value", 0))
    regime   = str(payload.get("regime", "") or payload.get("text", "") or "new").lower().strip()

    if income <= 0:
        return _err("Please enter a valid annual income.")

    if "old" in regime:
        # Old tax regime slabs FY 2024-25
        slabs = [
            (250000,    0.0),
            (500000,    0.05),
            (1000000,   0.20),
            (float("inf"), 0.30),
        ]
        deductions = f"Deductions like 80C (₹1.5L), HRA, etc. applicable."
        regime_label = "Old Tax Regime"
    else:
        # New regime FY 2024-25 (default)
        slabs = [
            (300000,    0.0),
            (600000,    0.05),
            (900000,    0.10),
            (1200000,   0.15),
            (1500000,   0.20),
            (float("inf"), 0.30),
        ]
        deductions = "Standard deduction of ₹50,000 applicable under new regime."
        regime_label = "New Tax Regime (2024-25)"

    # Calculate tax
    tax = 0.0
    prev = 0
    breakdown = []
    for limit, rate in slabs:
        if income <= prev:
            break
        taxable_in_slab = min(income, limit) - prev
        tax_in_slab = taxable_in_slab * rate
        if rate > 0:
            breakdown.append({
                "slab": f"₹{prev:,} – {'₹'+str(limit//100000)+'L' if limit < float('inf') else 'above'}",
                "rate": f"{rate*100:.0f}%",
                "tax": round(tax_in_slab),
            })
        tax += tax_in_slab
        prev = limit

    # Rebate u/s 87A
    rebate = 0
    if "new" in regime and income <= 700000:
        rebate = min(tax, 25000)
    elif "old" in regime and income <= 500000:
        rebate = min(tax, 12500)

    tax_after_rebate = max(0, tax - rebate)
    cess = tax_after_rebate * 0.04   # 4% health & education cess
    total_tax = tax_after_rebate + cess
    effective_rate = (total_tax / income) * 100

    return _json({
        "result": f"Annual Tax: ₹{total_tax:,.0f} | Effective Rate: {effective_rate:.1f}%",
        "annual_income": round(income),
        "regime": regime_label,
        "tax_before_rebate": round(tax),
        "rebate_87a": round(rebate),
        "tax_after_rebate": round(tax_after_rebate),
        "cess_4_percent": round(cess),
        "total_tax_payable": round(total_tax),
        "monthly_tax": round(total_tax / 12),
        "effective_rate_percent": round(effective_rate, 2),
        "note": deductions,
        "slab_breakdown": breakdown,
    }, f"Income Tax: ₹{total_tax:,.0f}/year | ₹{total_tax/12:,.0f}/month")


# ──────────────────────────────────────────────
#  EVERYDAY UTILITY TOOLS
# ──────────────────────────────────────────────

def handle_number_to_words(files, payload, output_dir) -> ExecutionResult:
    """Convert number to words (Indian/International system)."""
    raw = str(payload.get("number", "") or payload.get("text", "") or payload.get("value", "0")).strip().replace(",", "")
    system = str(payload.get("system", "indian")).lower()

    try:
        num = int(float(raw))
    except (ValueError, OverflowError):
        return _err("Please enter a valid integer number.")

    if abs(num) > 999_999_999_999:
        return _err("Number too large. Please enter up to 999 billion.")

    def _ones(n):
        w = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
             "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
             "Seventeen", "Eighteen", "Nineteen"]
        return w[n]

    def _tens(n):
        t = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
        if n < 20:
            return _ones(n)
        r = t[n // 10]
        if n % 10:
            r += "-" + _ones(n % 10)
        return r

    def _hundreds(n):
        if n >= 100:
            return _ones(n // 100) + " Hundred" + (" " + _tens(n % 100) if n % 100 else "")
        return _tens(n)

    def _intl(n):
        """International system"""
        if n == 0:
            return "Zero"
        parts = []
        if n >= 1_000_000_000:
            parts.append(_hundreds(n // 1_000_000_000) + " Billion")
            n %= 1_000_000_000
        if n >= 1_000_000:
            parts.append(_hundreds(n // 1_000_000) + " Million")
            n %= 1_000_000
        if n >= 1_000:
            parts.append(_hundreds(n // 1_000) + " Thousand")
            n %= 1_000
        if n:
            parts.append(_hundreds(n))
        return " ".join(parts)

    def _indian(n):
        """Indian system: Lakh, Crore"""
        if n == 0:
            return "Zero"
        parts = []
        if n >= 10_000_000_000:   # Arab
            parts.append(_hundreds(n // 10_000_000_000) + " Thousand Crore")
            n %= 10_000_000_000
        if n >= 100_000_000:      # 10 Crore
            parts.append(_hundreds(n // 100_000_000) + " Crore")
            n %= 100_000_000
        if n >= 10_000_000:
            parts.append(_ones(n // 10_000_000) + " Crore")
            n %= 10_000_000
        if n >= 100_000:
            parts.append(_hundreds(n // 100_000) + " Lakh")
            n %= 100_000
        if n >= 1_000:
            parts.append(_hundreds(n // 1_000) + " Thousand")
            n %= 1_000
        if n:
            parts.append(_hundreds(n))
        return " ".join(parts)

    sign = "Negative " if num < 0 else ""
    abs_num = abs(num)

    intl_words   = sign + _intl(abs_num)
    indian_words = sign + _indian(abs_num)

    primary = intl_words if "international" in system or "intl" in system else indian_words

    return _json({
        "result": primary,
        "number": num,
        "words_indian": indian_words,
        "words_international": intl_words,
        "formatted_number": f"{num:,}",
        "system_used": system,
    }, primary)


def handle_roman_numeral_converter(files, payload, output_dir) -> ExecutionResult:
    """Convert between Arabic and Roman numerals."""
    text = str(payload.get("value", "") or payload.get("text", "")).strip().upper()
    direction = str(payload.get("direction", "auto")).lower()  # to_roman / to_arabic / auto

    ROMAN_MAP = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
    ]
    ROMAN_VALUES = {"I": 1, "V": 5, "X": 10, "L": 50,
                    "C": 100, "D": 500, "M": 1000}

    def to_roman(n):
        if not 1 <= n <= 3999:
            raise ValueError("Number must be 1–3999")
        result = ""
        for value, numeral in ROMAN_MAP:
            while n >= value:
                result += numeral
                n -= value
        return result

    def from_roman(s):
        result = 0
        prev = 0
        for ch in reversed(s):
            val = ROMAN_VALUES.get(ch, 0)
            if val < prev:
                result -= val
            else:
                result += val
            prev = val
        return result

    # Determine direction — respect explicit direction param or auto-detect
    is_roman = all(c in ROMAN_VALUES for c in text.replace(" ", ""))
    force_arabic = direction == "to_arabic"
    force_roman  = direction == "to_roman"

    if (is_roman and text and not text.isdigit() and not force_roman) or force_arabic:
        arabic = from_roman(text)
        return _json({
            "result": f"{text} = {arabic}",
            "input": text,
            "input_type": "Roman",
            "arabic": arabic,
            "roman": text,
        }, f"{text} = {arabic}")
    else:
        try:
            n = int(text)
            roman = to_roman(n)
            return _json({
                "result": f"{n} = {roman}",
                "input": text,
                "input_type": "Arabic",
                "arabic": n,
                "roman": roman,
            }, f"{n} = {roman}")
        except ValueError as e:
            return _err(str(e))


def handle_love_calculator(files, payload, output_dir) -> ExecutionResult:
    """Fun love compatibility calculator (entertainment only)."""
    name1 = str(payload.get("name1", "") or payload.get("text", "") or "").strip()
    name2 = str(payload.get("name2", "") or payload.get("value", "") or "").strip()

    if not name1 or not name2:
        return _err("Please enter both names.")

    # Fun deterministic calculation
    combined = (name1 + name2).upper()
    score = sum(ord(c) for c in combined if c.isalpha()) % 101

    if score >= 90:
        level = "💘 Perfect Match!"
        msg = "You two are made for each other. Soulmates!"
    elif score >= 75:
        level = "❤️ Great Compatibility"
        msg = "Strong connection and great understanding between you two!"
    elif score >= 60:
        level = "💕 Good Match"
        msg = "You have good chemistry. A little effort goes a long way!"
    elif score >= 40:
        level = "💛 Average Compatibility"
        msg = "You have some differences, but love conquers all!"
    else:
        level = "💙 Needs Work"
        msg = "Opposites can attract — communication is key!"

    return _json({
        "result": f"{score}% Love Compatibility",
        "name1": name1,
        "name2": name2,
        "score": score,
        "level": level,
        "message": msg,
        "disclaimer": "This is just for fun and entertainment purposes! 😄",
    }, f"{name1} + {name2} = {score}% Love!")


def handle_time_calculator(files, payload, output_dir) -> ExecutionResult:
    """Add or subtract time values (hours, minutes, seconds)."""
    text = str(payload.get("text", "") or "").strip()

    # Parse expressions like "2h 30m + 1h 15m" or "3:30 - 1:00"
    import re as _re
    total_seconds = 0
    sign = 1

    tokens = _re.split(r"(\+|-)", text.replace(" ", ""))
    for token in tokens:
        if token == "+":
            sign = 1
        elif token == "-":
            sign = -1
        elif token:
            # Try H:M:S or HhMmSs format
            m = _re.match(r"^(\d+)(?::(\d+)(?::(\d+))?)?$", token)
            if m:
                h = int(m.group(1) or 0)
                mi = int(m.group(2) or 0)
                s = int(m.group(3) or 0)
                total_seconds += sign * (h * 3600 + mi * 60 + s)
            else:
                h  = int((_re.search(r"(\d+)h", token) or [None, 0])[1])
                mi = int((_re.search(r"(\d+)m", token) or [None, 0])[1])
                s  = int((_re.search(r"(\d+)s", token) or [None, 0])[1])
                total_seconds += sign * (h * 3600 + mi * 60 + s)

    negative = total_seconds < 0
    total_seconds = abs(total_seconds)
    hrs  = total_seconds // 3600
    mins = (total_seconds % 3600) // 60
    secs = total_seconds % 60

    prefix = "-" if negative else ""
    result_str = f"{prefix}{hrs}h {mins}m {secs}s"

    return _json({
        "result": result_str,
        "expression": text,
        "total_seconds": -total_seconds if negative else total_seconds,
        "hours": hrs,
        "minutes": mins,
        "seconds": secs,
        "formatted": f"{prefix}{hrs:02d}:{mins:02d}:{secs:02d}",
    }, f"Result: {result_str}")


def handle_date_calculator(files, payload, output_dir) -> ExecutionResult:
    """Calculate date difference or add/subtract days."""
    date1_str = str(payload.get("date1", "") or payload.get("text", "") or "").strip()
    date2_str = str(payload.get("date2", "") or payload.get("value", "") or "").strip()
    operation = str(payload.get("operation", "difference")).lower()
    days_offset = payload.get("days_offset", None) or payload.get("days", None)
    add_days  = int(days_offset) if days_offset is not None and operation in ("add", "subtract") else None
    if operation == "subtract" and add_days is not None:
        add_days = -abs(add_days)

    formats = ["%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%m/%d/%Y"]

    def parse_date(s):
        for fmt in formats:
            try:
                return datetime.strptime(s, fmt)
            except ValueError:
                continue
        return None

    if add_days is not None:
        d1 = parse_date(date1_str)
        if not d1:
            d1 = datetime.today()
        result_date = d1 + timedelta(days=int(add_days))
        return _json({
            "result": result_date.strftime("%d %B %Y (%A)"),
            "start_date": d1.strftime("%Y-%m-%d"),
            "days_added": int(add_days),
            "result_date": result_date.strftime("%Y-%m-%d"),
            "formatted": result_date.strftime("%d %B %Y"),
            "day_of_week": result_date.strftime("%A"),
        }, f"{add_days} days from {d1.strftime('%d %b %Y')} = {result_date.strftime('%d %b %Y')}")

    d1 = parse_date(date1_str)
    d2 = parse_date(date2_str)

    if not d1:
        d1 = datetime.today()
    if not d2:
        d2 = datetime.today()

    delta = abs(d2 - d1)
    total_days = delta.days
    weeks = total_days // 7
    months_approx = total_days / 30.44
    years_approx  = total_days / 365.25

    return _json({
        "result": f"Difference: {total_days} days ({weeks} weeks)",
        "date1": d1.strftime("%Y-%m-%d"),
        "date2": d2.strftime("%Y-%m-%d"),
        "total_days": total_days,
        "weeks": weeks,
        "months_approx": round(months_approx, 1),
        "years_approx": round(years_approx, 2),
        "hours": total_days * 24,
        "minutes": total_days * 24 * 60,
    }, f"Date difference: {total_days} days ({weeks} weeks)")


def handle_age_in_seconds(files, payload, output_dir) -> ExecutionResult:
    """Calculate age in various units."""
    dob_str = str(payload.get("birthdate", "") or payload.get("text", "") or payload.get("dob", "")).strip()

    formats = ["%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d %b %Y", "%B %d, %Y"]
    dob = None
    for fmt in formats:
        try:
            dob = datetime.strptime(dob_str, fmt)
            break
        except ValueError:
            continue

    if not dob:
        return _err("Please enter a valid date of birth (e.g. 1995-06-15 or 15/06/1995).")

    now   = datetime.now()
    delta = now - dob

    if delta.days < 0:
        return _err("Date of birth cannot be in the future!")

    total_days    = delta.days
    total_seconds = int(delta.total_seconds())
    years  = total_days // 365
    months = (total_days % 365) // 30
    days   = (total_days % 365) % 30

    next_bday = dob.replace(year=now.year)
    if next_bday < now:
        next_bday = next_bday.replace(year=now.year + 1)
    days_to_bday = (next_bday - now).days

    return _json({
        "result": f"{years} years, {months} months, {days} days old",
        "dob": dob.strftime("%d %B %Y"),
        "age_years": years,
        "age_months": total_days // 30,
        "age_days": total_days,
        "age_hours": total_days * 24,
        "age_minutes": total_days * 24 * 60,
        "age_seconds": total_seconds,
        "next_birthday": next_bday.strftime("%d %B %Y"),
        "days_to_birthday": days_to_bday,
    }, f"Age: {years} years {months} months {days} days ({total_seconds:,} seconds)")


def handle_random_number_generator(files, payload, output_dir) -> ExecutionResult:
    """Generate random numbers in a given range."""
    import random as _random
    lo    = int(payload.get("min", 0) or payload.get("value", 1) or 1)
    hi    = int(payload.get("max", 0) or payload.get("total", 100) or 100)
    count = min(int(payload.get("count", 1) or 1), 50)
    unique = str(payload.get("unique", "true")).lower() in ("true", "1", "yes")

    if lo > hi:
        lo, hi = hi, lo

    if unique:
        pool = list(range(lo, hi + 1))
        _random.shuffle(pool)
        numbers = pool[:min(count, len(pool))]
    else:
        numbers = [_random.randint(lo, hi) for _ in range(count)]

    return _json({
        "result": str(numbers[0]) if count == 1 else ", ".join(map(str, numbers)),
        "min": lo,
        "max": hi,
        "count": count,
        "unique": unique,
        "numbers": numbers,
    }, f"Generated {count} random number(s) between {lo} and {hi}")


def handle_random_name_generator(files, payload, output_dir) -> ExecutionResult:
    """Generate random Indian and international names."""
    import random as _random
    count  = min(int(payload.get("count", 0) or payload.get("value", 5) or 5), 20)
    gender = str(payload.get("gender", "") or payload.get("text", "") or "any").lower()
    style  = str(payload.get("style", "indian")).lower()

    indian_male   = ["Aarav", "Arjun", "Rohan", "Vikram", "Rahul", "Karan", "Ankit",
                     "Nikhil", "Siddharth", "Yash", "Harsh", "Dev", "Raj", "Kunal", "Amit",
                     "Ishaan", "Dhruv", "Kabir", "Aditya", "Pranav", "Vivek", "Tushar"]
    indian_female = ["Priya", "Sneha", "Pooja", "Anjali", "Nisha", "Riya", "Isha",
                     "Shreya", "Neha", "Divya", "Kavya", "Aisha", "Meera", "Simran", "Tanvi",
                     "Ananya", "Kritika", "Nidhi", "Sakshi", "Muskan", "Swati", "Tanya"]
    indian_last   = ["Sharma", "Patel", "Singh", "Verma", "Gupta", "Kumar", "Mishra",
                     "Joshi", "Reddy", "Nair", "Iyer", "Shah", "Mehta", "Chaudhary", "Rao",
                     "Chatterjee", "Banerjee", "Dubey", "Tiwari", "Pandey", "Malhotra"]
    western_male   = ["James", "Liam", "Noah", "Oliver", "William", "Elijah", "Lucas",
                      "Mason", "Logan", "Ethan", "Jack", "Daniel", "Henry", "Sebastian"]
    western_female = ["Emma", "Sophia", "Isabella", "Mia", "Olivia", "Charlotte", "Amelia",
                      "Evelyn", "Abigail", "Emily", "Elizabeth", "Sofia", "Madison", "Aria"]
    western_last   = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
                      "Davis", "Wilson", "Taylor", "Anderson", "Thomas", "Martin", "Lee"]

    is_western = "western" in style
    m_pool = western_male   if is_western else indian_male
    f_pool = western_female if is_western else indian_female
    l_pool = western_last   if is_western else indian_last

    names = []
    for _ in range(count):
        if gender == "male":
            first = _random.choice(m_pool)
        elif gender == "female":
            first = _random.choice(f_pool)
        else:
            first = _random.choice(m_pool + f_pool)
        last = _random.choice(l_pool)
        names.append(f"{first} {last}")

    return _json({
        "result": names[0] if count == 1 else ", ".join(names),
        "count": count,
        "names": names,
        "gender_filter": gender,
    }, f"Generated {count} random name(s)")


def handle_emi_calculator(files, payload, output_dir) -> ExecutionResult:
    """EMI (Equated Monthly Instalment) calculator for loans."""
    loan    = float(payload.get("loan_amount", 0) or payload.get("value", 0) or payload.get("amount", 0))
    rate    = float(payload.get("interest_rate", 0) or payload.get("rate", 8.5))   # annual %
    tenure  = float(payload.get("tenure", 0) or payload.get("years", 5))           # years

    if loan <= 0:
        return _err("Please enter a valid loan amount.")
    if rate <= 0:
        return _err("Please enter a valid interest rate.")
    if tenure <= 0:
        return _err("Please enter a valid tenure (years).")

    r = rate / 100 / 12                   # monthly interest rate
    n = int(tenure * 12)                  # total months
    emi = loan * r * pow(1 + r, n) / (pow(1 + r, n) - 1)
    total_paid = emi * n
    total_interest = total_paid - loan

    # Year-by-year breakdown
    yearly = []
    balance = loan
    for yr in range(1, min(int(tenure) + 1, 31)):
        yr_interest = 0
        yr_principal = 0
        for _ in range(12):
            if balance <= 0:
                break
            int_pay = balance * r
            prin_pay = emi - int_pay
            yr_interest += int_pay
            yr_principal += prin_pay
            balance = max(0, balance - prin_pay)
        yearly.append({
            "year": yr,
            "emi": round(emi),
            "principal_paid": round(yr_principal),
            "interest_paid": round(yr_interest),
            "outstanding_balance": round(balance),
        })

    return _json({
        "result": f"EMI: ₹{emi:,.0f}/month | Total Interest: ₹{total_interest:,.0f}",
        "loan_amount": round(loan),
        "interest_rate_annual": rate,
        "tenure_years": tenure,
        "monthly_emi": round(emi, 2),
        "total_amount_paid": round(total_paid, 2),
        "total_interest_paid": round(total_interest, 2),
        "principal_percent": round(loan / total_paid * 100, 1),
        "interest_percent": round(total_interest / total_paid * 100, 1),
        "yearly_breakdown": yearly,
    }, f"EMI: ₹{emi:,.0f}/month | Total outflow: ₹{total_paid:,.0f}")


# ──────────────────────────────────────────────
#  HANDLER REGISTRY
# ──────────────────────────────────────────────

HEALTH_FINANCE_HANDLERS: dict = {
    # Health & Fitness
    "calorie-calculator":         handle_calorie_calculator,
    "calorie-intake-calculator":  handle_calorie_calculator,
    "tdee-calculator":            handle_calorie_calculator,
    "bmr-calculator":             handle_bmr_calculator,
    "basal-metabolic-rate":       handle_bmr_calculator,
    "body-fat-calculator":        handle_body_fat_calculator,
    "water-intake-calculator":    handle_water_intake_calculator,
    "daily-water-intake":         handle_water_intake_calculator,
    "sleep-calculator":           handle_sleep_calculator,
    "sleep-cycle-calculator":     handle_sleep_calculator,
    "heart-rate-zones":           handle_heart_rate_zones,
    "heart-rate-calculator":      handle_heart_rate_zones,
    "steps-to-km":                handle_steps_to_km,
    "steps-to-miles":             handle_steps_to_km,
    "steps-calculator":           handle_steps_to_km,
    "calories-burned-calculator": handle_calories_burned_calculator,
    "exercise-calories":          handle_calories_burned_calculator,
    # Finance Tools
    "gst-calculator":             handle_gst_calculator,
    "gst-tax-calculator":         handle_gst_calculator,
    "sip-calculator":             handle_sip_calculator,
    "mutual-fund-calculator":     handle_sip_calculator,
    "roi-calculator":             handle_roi_calculator,
    "return-on-investment":       handle_roi_calculator,
    "budget-planner":             handle_budget_planner,
    "budget-calculator":          handle_budget_planner,
    "savings-goal-calculator":    handle_savings_goal_calculator,
    "savings-goal":               handle_savings_goal_calculator,
    "goal-calculator":            handle_savings_goal_calculator,
    "income-tax-calculator":      handle_income_tax_calculator,
    "tax-calculator":             handle_income_tax_calculator,
    "india-tax-calculator":       handle_income_tax_calculator,
    "loan-emi-calculator":        handle_emi_calculator,
    "emi-calculator":             handle_emi_calculator,
    "home-loan-emi-calculator":   handle_emi_calculator,
    # Everyday Utilities
    "number-to-words":            handle_number_to_words,
    "number-words-converter":     handle_number_to_words,
    "roman-numeral-converter":    handle_roman_numeral_converter,
    "roman-numeral":              handle_roman_numeral_converter,
    "love-calculator":            handle_love_calculator,
    "compatibility-calculator":   handle_love_calculator,
    "time-calculator":            handle_time_calculator,
    "date-calculator":            handle_date_calculator,
    "date-difference-calculator": handle_date_calculator,
    "age-in-seconds":             handle_age_in_seconds,
    "age-calculator-detailed":    handle_age_in_seconds,
    "random-number-generator":    handle_random_number_generator,
    "random-number":              handle_random_number_generator,
    "random-name-generator":      handle_random_name_generator,
    "name-generator":             handle_random_name_generator,
}
