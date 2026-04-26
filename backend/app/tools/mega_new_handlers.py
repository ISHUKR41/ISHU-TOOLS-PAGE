"""
Mega New Handlers — 40+ additional tools covering science, geography,
cooking, productivity, student utilities, and more video downloaders.
"""
from __future__ import annotations

import json
import math
import random
import re
import subprocess
import tempfile
import os
from typing import Any

from .handlers import HANDLERS, coerce_float, coerce_int


MEGA_NEW_HANDLERS: dict[str, Any] = {}

# ── helpers ──────────────────────────────────────────────────────────────────

def _json(data: dict) -> dict:
    return {"type": "json", "payload": data}


def _err(msg: str) -> dict:
    return {"type": "json", "payload": {"error": msg}}


# ─── SCIENCE TOOLS ───────────────────────────────────────────────────────────

PERIODIC_TABLE = {
    "H":  {"name": "Hydrogen",   "atomic_number": 1,  "atomic_mass": 1.008,   "category": "Nonmetal"},
    "He": {"name": "Helium",     "atomic_number": 2,  "atomic_mass": 4.0026,  "category": "Noble Gas"},
    "Li": {"name": "Lithium",    "atomic_number": 3,  "atomic_mass": 6.94,    "category": "Alkali Metal"},
    "Be": {"name": "Beryllium",  "atomic_number": 4,  "atomic_mass": 9.0122,  "category": "Alkaline Earth"},
    "B":  {"name": "Boron",      "atomic_number": 5,  "atomic_mass": 10.81,   "category": "Metalloid"},
    "C":  {"name": "Carbon",     "atomic_number": 6,  "atomic_mass": 12.011,  "category": "Nonmetal"},
    "N":  {"name": "Nitrogen",   "atomic_number": 7,  "atomic_mass": 14.007,  "category": "Nonmetal"},
    "O":  {"name": "Oxygen",     "atomic_number": 8,  "atomic_mass": 15.999,  "category": "Nonmetal"},
    "F":  {"name": "Fluorine",   "atomic_number": 9,  "atomic_mass": 18.998,  "category": "Halogen"},
    "Ne": {"name": "Neon",       "atomic_number": 10, "atomic_mass": 20.180,  "category": "Noble Gas"},
    "Na": {"name": "Sodium",     "atomic_number": 11, "atomic_mass": 22.990,  "category": "Alkali Metal"},
    "Mg": {"name": "Magnesium",  "atomic_number": 12, "atomic_mass": 24.305,  "category": "Alkaline Earth"},
    "Al": {"name": "Aluminum",   "atomic_number": 13, "atomic_mass": 26.982,  "category": "Post-Transition Metal"},
    "Si": {"name": "Silicon",    "atomic_number": 14, "atomic_mass": 28.085,  "category": "Metalloid"},
    "P":  {"name": "Phosphorus", "atomic_number": 15, "atomic_mass": 30.974,  "category": "Nonmetal"},
    "S":  {"name": "Sulfur",     "atomic_number": 16, "atomic_mass": 32.06,   "category": "Nonmetal"},
    "Cl": {"name": "Chlorine",   "atomic_number": 17, "atomic_mass": 35.45,   "category": "Halogen"},
    "Ar": {"name": "Argon",      "atomic_number": 18, "atomic_mass": 39.948,  "category": "Noble Gas"},
    "K":  {"name": "Potassium",  "atomic_number": 19, "atomic_mass": 39.098,  "category": "Alkali Metal"},
    "Ca": {"name": "Calcium",    "atomic_number": 20, "atomic_mass": 40.078,  "category": "Alkaline Earth"},
    "Fe": {"name": "Iron",       "atomic_number": 26, "atomic_mass": 55.845,  "category": "Transition Metal"},
    "Cu": {"name": "Copper",     "atomic_number": 29, "atomic_mass": 63.546,  "category": "Transition Metal"},
    "Zn": {"name": "Zinc",       "atomic_number": 30, "atomic_mass": 65.38,   "category": "Transition Metal"},
    "Ag": {"name": "Silver",     "atomic_number": 47, "atomic_mass": 107.87,  "category": "Transition Metal"},
    "Au": {"name": "Gold",       "atomic_number": 79, "atomic_mass": 196.97,  "category": "Transition Metal"},
    "Pb": {"name": "Lead",       "atomic_number": 82, "atomic_mass": 207.2,   "category": "Post-Transition Metal"},
    "U":  {"name": "Uranium",    "atomic_number": 92, "atomic_mass": 238.03,  "category": "Actinide"},
}

def _handle_element_lookup(files, payload):
    symbol = str(payload.get("symbol", "")).strip()
    name_q = str(payload.get("name", "")).strip().lower()
    # search by name if symbol empty
    if not symbol and name_q:
        for sym, data in PERIODIC_TABLE.items():
            if data["name"].lower().startswith(name_q):
                symbol = sym
                break
    symbol = symbol.capitalize() if len(symbol) > 1 else symbol.upper()
    element = PERIODIC_TABLE.get(symbol)
    if not element:
        # try all
        matches = [v | {"symbol": k} for k, v in PERIODIC_TABLE.items() if name_q and name_q in v["name"].lower()]
        if matches:
            return _json({"results": matches, "message": f"Found {len(matches)} element(s)"})
        return _err(f"Element '{symbol or name_q}' not found. Try symbol like 'Fe' or name like 'Iron'.")
    return _json({**element, "symbol": symbol, "message": f"Element: {element['name']}"})

MEGA_NEW_HANDLERS["element-lookup"] = _handle_element_lookup


def _handle_molecular_weight(files, payload):
    formula = str(payload.get("formula", "")).strip()
    if not formula:
        return _err("Enter a molecular formula like H2O or C6H12O6")
    ATOMIC_MASSES = {
        "H": 1.008, "He": 4.003, "Li": 6.94, "Be": 9.012, "B": 10.81,
        "C": 12.011, "N": 14.007, "O": 15.999, "F": 18.998, "Ne": 20.180,
        "Na": 22.990, "Mg": 24.305, "Al": 26.982, "Si": 28.085, "P": 30.974,
        "S": 32.06, "Cl": 35.45, "Ar": 39.948, "K": 39.098, "Ca": 40.078,
        "Fe": 55.845, "Cu": 63.546, "Zn": 65.38, "Ag": 107.87, "Au": 196.97,
        "Pb": 207.2, "I": 126.904, "Br": 79.904, "Mn": 54.938, "Ni": 58.693,
    }
    tokens = re.findall(r'([A-Z][a-z]?)(\d*)', formula)
    total = 0.0
    composition = []
    for elem, cnt in tokens:
        if not elem:
            continue
        count = int(cnt) if cnt else 1
        mass = ATOMIC_MASSES.get(elem)
        if mass is None:
            return _err(f"Unknown element: {elem}")
        subtotal = mass * count
        total += subtotal
        composition.append({"element": elem, "count": count, "mass_per_atom": mass, "subtotal": round(subtotal, 4)})
    return _json({
        "formula": formula,
        "molecular_weight": round(total, 4),
        "unit": "g/mol",
        "composition": composition,
        "message": f"Molecular weight of {formula} = {round(total, 4)} g/mol",
    })

MEGA_NEW_HANDLERS["molecular-weight"] = _handle_molecular_weight


def _handle_physics_calculator(files, payload):
    calc_type = str(payload.get("calc_type", "kinetic_energy"))
    try:
        if calc_type == "kinetic_energy":
            m = float(payload.get("mass", 0))
            v = float(payload.get("velocity", 0))
            ke = 0.5 * m * v * v
            return _json({"result": round(ke, 6), "unit": "Joules", "formula": "KE = ½mv²",
                          "message": f"Kinetic Energy = {round(ke, 6)} J"})
        elif calc_type == "potential_energy":
            m = float(payload.get("mass", 0))
            h = float(payload.get("height", 0))
            g = 9.81
            pe = m * g * h
            return _json({"result": round(pe, 6), "unit": "Joules", "formula": "PE = mgh",
                          "message": f"Potential Energy = {round(pe, 6)} J"})
        elif calc_type == "force":
            m = float(payload.get("mass", 0))
            a = float(payload.get("acceleration", 0))
            f = m * a
            return _json({"result": round(f, 6), "unit": "Newtons", "formula": "F = ma",
                          "message": f"Force = {round(f, 6)} N"})
        elif calc_type == "velocity":
            u = float(payload.get("initial_velocity", 0))
            a = float(payload.get("acceleration", 0))
            t = float(payload.get("time", 0))
            v = u + a * t
            return _json({"result": round(v, 6), "unit": "m/s", "formula": "v = u + at",
                          "message": f"Final velocity = {round(v, 6)} m/s"})
        elif calc_type == "ohms_law":
            v_val = payload.get("voltage")
            i_val = payload.get("current")
            r_val = payload.get("resistance")
            if v_val is not None and i_val is not None:
                r = float(v_val) / float(i_val)
                return _json({"result": round(r, 6), "unit": "Ohms", "formula": "R = V/I",
                              "message": f"Resistance = {round(r, 6)} Ω"})
            elif v_val is not None and r_val is not None:
                i = float(v_val) / float(r_val)
                return _json({"result": round(i, 6), "unit": "Amperes", "formula": "I = V/R",
                              "message": f"Current = {round(i, 6)} A"})
            else:
                i2 = float(i_val or 0)
                r2 = float(r_val or 0)
                vv = i2 * r2
                return _json({"result": round(vv, 6), "unit": "Volts", "formula": "V = IR",
                              "message": f"Voltage = {round(vv, 6)} V"})
        else:
            return _err("Unknown calc_type. Use: kinetic_energy, potential_energy, force, velocity, ohms_law")
    except (ValueError, ZeroDivisionError) as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["physics-calculator"] = _handle_physics_calculator


# ─── GEOGRAPHY TOOLS ─────────────────────────────────────────────────────────

COUNTRIES_DATA = {
    "India": {"capital": "New Delhi", "continent": "Asia", "population": "1.4B", "currency": "INR", "language": "Hindi/English", "area_km2": 3287263, "calling_code": "+91"},
    "USA": {"capital": "Washington D.C.", "continent": "North America", "population": "335M", "currency": "USD", "language": "English", "area_km2": 9833520, "calling_code": "+1"},
    "UK": {"capital": "London", "continent": "Europe", "population": "68M", "currency": "GBP", "language": "English", "area_km2": 242495, "calling_code": "+44"},
    "China": {"capital": "Beijing", "continent": "Asia", "population": "1.4B", "currency": "CNY", "language": "Mandarin", "area_km2": 9596960, "calling_code": "+86"},
    "Japan": {"capital": "Tokyo", "continent": "Asia", "population": "126M", "currency": "JPY", "language": "Japanese", "area_km2": 377975, "calling_code": "+81"},
    "Germany": {"capital": "Berlin", "continent": "Europe", "population": "84M", "currency": "EUR", "language": "German", "area_km2": 357114, "calling_code": "+49"},
    "France": {"capital": "Paris", "continent": "Europe", "population": "68M", "currency": "EUR", "language": "French", "area_km2": 551695, "calling_code": "+33"},
    "Brazil": {"capital": "Brasília", "continent": "South America", "population": "215M", "currency": "BRL", "language": "Portuguese", "area_km2": 8515767, "calling_code": "+55"},
    "Canada": {"capital": "Ottawa", "continent": "North America", "population": "38M", "currency": "CAD", "language": "English/French", "area_km2": 9984670, "calling_code": "+1"},
    "Australia": {"capital": "Canberra", "continent": "Oceania", "population": "26M", "currency": "AUD", "language": "English", "area_km2": 7692024, "calling_code": "+61"},
    "Russia": {"capital": "Moscow", "continent": "Europe/Asia", "population": "145M", "currency": "RUB", "language": "Russian", "area_km2": 17098242, "calling_code": "+7"},
    "Pakistan": {"capital": "Islamabad", "continent": "Asia", "population": "231M", "currency": "PKR", "language": "Urdu/English", "area_km2": 881913, "calling_code": "+92"},
    "Bangladesh": {"capital": "Dhaka", "continent": "Asia", "population": "170M", "currency": "BDT", "language": "Bengali", "area_km2": 147570, "calling_code": "+880"},
    "Sri Lanka": {"capital": "Colombo", "continent": "Asia", "population": "22M", "currency": "LKR", "language": "Sinhala/Tamil", "area_km2": 65610, "calling_code": "+94"},
    "Nepal": {"capital": "Kathmandu", "continent": "Asia", "population": "30M", "currency": "NPR", "language": "Nepali", "area_km2": 147181, "calling_code": "+977"},
    "UAE": {"capital": "Abu Dhabi", "continent": "Asia", "population": "10M", "currency": "AED", "language": "Arabic", "area_km2": 83600, "calling_code": "+971"},
    "Singapore": {"capital": "Singapore", "continent": "Asia", "population": "6M", "currency": "SGD", "language": "English/Mandarin/Malay", "area_km2": 728, "calling_code": "+65"},
    "South Korea": {"capital": "Seoul", "continent": "Asia", "population": "52M", "currency": "KRW", "language": "Korean", "area_km2": 100210, "calling_code": "+82"},
    "Italy": {"capital": "Rome", "continent": "Europe", "population": "60M", "currency": "EUR", "language": "Italian", "area_km2": 301340, "calling_code": "+39"},
    "Spain": {"capital": "Madrid", "continent": "Europe", "population": "47M", "currency": "EUR", "language": "Spanish", "area_km2": 505990, "calling_code": "+34"},
}

def _handle_country_info(files, payload):
    country = str(payload.get("country", "")).strip()
    if not country:
        return _json({"countries": list(COUNTRIES_DATA.keys()), "message": "Enter a country name to get details"})
    matches = {k: v for k, v in COUNTRIES_DATA.items() if country.lower() in k.lower()}
    if not matches:
        return _err(f"Country '{country}' not found. Try: India, USA, UK, Japan, etc.")
    if len(matches) == 1:
        k, v = list(matches.items())[0]
        return _json({**v, "country": k, "message": f"Information for {k}"})
    return _json({"results": [{"country": k, **v} for k, v in matches.items()], "message": f"Found {len(matches)} matches"})

MEGA_NEW_HANDLERS["country-info"] = _handle_country_info


def _handle_timezone_info(files, payload):
    """Return well-known timezones with current UTC offset info."""
    TIMEZONES = {
        "IST (India)": {"offset": "+05:30", "utc_offset_hrs": 5.5, "cities": ["New Delhi", "Mumbai", "Bangalore", "Kolkata"]},
        "UTC": {"offset": "+00:00", "utc_offset_hrs": 0, "cities": ["London (winter)", "Reykjavik"]},
        "EST (USA)": {"offset": "-05:00", "utc_offset_hrs": -5, "cities": ["New York", "Washington D.C.", "Boston"]},
        "PST (USA)": {"offset": "-08:00", "utc_offset_hrs": -8, "cities": ["Los Angeles", "San Francisco", "Seattle"]},
        "CST (China)": {"offset": "+08:00", "utc_offset_hrs": 8, "cities": ["Beijing", "Shanghai", "Shenzhen"]},
        "JST (Japan)": {"offset": "+09:00", "utc_offset_hrs": 9, "cities": ["Tokyo", "Osaka", "Kyoto"]},
        "GMT (UK)": {"offset": "+00:00", "utc_offset_hrs": 0, "cities": ["London", "Dublin", "Edinburgh"]},
        "CET (Europe)": {"offset": "+01:00", "utc_offset_hrs": 1, "cities": ["Paris", "Berlin", "Rome", "Madrid"]},
        "AEST (Australia)": {"offset": "+10:00", "utc_offset_hrs": 10, "cities": ["Sydney", "Melbourne", "Brisbane"]},
        "PKT (Pakistan)": {"offset": "+05:00", "utc_offset_hrs": 5, "cities": ["Karachi", "Lahore", "Islamabad"]},
        "GST (UAE/Dubai)": {"offset": "+04:00", "utc_offset_hrs": 4, "cities": ["Dubai", "Abu Dhabi", "Sharjah"]},
        "SGT (Singapore)": {"offset": "+08:00", "utc_offset_hrs": 8, "cities": ["Singapore"]},
        "KST (South Korea)": {"offset": "+09:00", "utc_offset_hrs": 9, "cities": ["Seoul", "Busan"]},
        "BRT (Brazil)": {"offset": "-03:00", "utc_offset_hrs": -3, "cities": ["São Paulo", "Rio de Janeiro", "Brasília"]},
    }
    tz_query = str(payload.get("timezone", "")).strip().lower()
    if not tz_query:
        return _json({"timezones": list(TIMEZONES.keys()), "message": "Enter a timezone name or country"})
    matches = {k: v for k, v in TIMEZONES.items() if tz_query in k.lower() or any(tz_query in c.lower() for c in v["cities"])}
    if not matches:
        return _json({"timezones": list(TIMEZONES.keys()), "message": f"No match for '{tz_query}'. Here are all timezones."})
    return _json({"results": [{"timezone": k, **v} for k, v in matches.items()], "message": f"Found {len(matches)} timezone(s)"})

MEGA_NEW_HANDLERS["timezone-info"] = _handle_timezone_info


def _handle_distance_calculator(files, payload):
    """Calculate great-circle distance between two lat/lon points."""
    try:
        lat1 = float(payload.get("lat1", 0))
        lon1 = float(payload.get("lon1", 0))
        lat2 = float(payload.get("lat2", 0))
        lon2 = float(payload.get("lon2", 0))
        R = 6371.0
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        dist_km = R * c
        dist_miles = dist_km * 0.621371
        return _json({
            "distance_km": round(dist_km, 3),
            "distance_miles": round(dist_miles, 3),
            "from": {"lat": lat1, "lon": lon1},
            "to": {"lat": lat2, "lon": lon2},
            "message": f"Distance: {round(dist_km, 1)} km ({round(dist_miles, 1)} miles)",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["distance-calculator"] = _handle_distance_calculator


# ─── COOKING / FOOD TOOLS ────────────────────────────────────────────────────

def _handle_recipe_scaler(files, payload):
    """Scale a recipe up or down."""
    try:
        original_servings = float(payload.get("original_servings", 4))
        new_servings = float(payload.get("new_servings", 2))
        ingredients_text = str(payload.get("ingredients", "")).strip()
        if not ingredients_text:
            return _err("Enter ingredients list (one per line, e.g.: '2 cups flour')")
        if original_servings <= 0 or new_servings <= 0:
            return _err("Servings must be greater than 0")
        factor = new_servings / original_servings
        scaled = []
        for line in ingredients_text.split("\n"):
            line = line.strip()
            if not line:
                continue
            # Try to find a leading number
            m = re.match(r'^(\d+(?:\.\d+)?(?:/\d+)?)\s*(.*)', line)
            if m:
                qty_str, rest = m.group(1), m.group(2)
                try:
                    if "/" in qty_str:
                        num, den = qty_str.split("/")
                        qty = float(num) / float(den)
                    else:
                        qty = float(qty_str)
                    new_qty = round(qty * factor, 3)
                    scaled.append({"original": line, "scaled": f"{new_qty} {rest}"})
                except ValueError:
                    scaled.append({"original": line, "scaled": line})
            else:
                scaled.append({"original": line, "scaled": line})
        return _json({
            "original_servings": original_servings,
            "new_servings": new_servings,
            "scale_factor": round(factor, 4),
            "ingredients": scaled,
            "message": f"Recipe scaled from {original_servings} to {new_servings} servings (×{round(factor, 2)})",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["recipe-scaler"] = _handle_recipe_scaler


def _handle_cooking_measurement_converter(files, payload):
    """Convert cooking measurements."""
    CONVERSIONS = {
        "cup":         {"ml": 236.588, "tbsp": 16, "tsp": 48, "fl_oz": 8, "liter": 0.236588},
        "tbsp":        {"ml": 14.787, "tsp": 3, "cup": 0.0625},
        "tsp":         {"ml": 4.929, "tbsp": 0.333, "cup": 0.0208},
        "ml":          {"cup": 0.00423, "tbsp": 0.0676, "tsp": 0.2029, "liter": 0.001},
        "liter":       {"cup": 4.22675, "ml": 1000, "tbsp": 67.628},
        "oz":          {"g": 28.3495, "kg": 0.0283495, "lb": 0.0625},
        "lb":          {"g": 453.592, "kg": 0.453592, "oz": 16},
        "g":           {"oz": 0.035274, "kg": 0.001, "lb": 0.002205},
        "kg":          {"g": 1000, "oz": 35.274, "lb": 2.20462},
    }
    try:
        value = float(payload.get("value", 1))
        from_unit = str(payload.get("from_unit", "cup")).lower().strip()
        to_unit = str(payload.get("to_unit", "ml")).lower().strip()
        conv = CONVERSIONS.get(from_unit)
        if conv is None:
            return _err(f"Unknown unit: {from_unit}. Supported: {', '.join(CONVERSIONS.keys())}")
        factor = conv.get(to_unit)
        if factor is None:
            return _err(f"Cannot convert {from_unit} → {to_unit}")
        result = round(value * factor, 4)
        return _json({
            "input": f"{value} {from_unit}",
            "output": f"{result} {to_unit}",
            "factor": factor,
            "message": f"{value} {from_unit} = {result} {to_unit}",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["cooking-measurement-converter"] = _handle_cooking_measurement_converter


FOOD_CALORIES = {
    "apple (medium)": {"calories": 95, "protein_g": 0.5, "carbs_g": 25, "fat_g": 0.3, "fiber_g": 4.4},
    "banana (medium)": {"calories": 105, "protein_g": 1.3, "carbs_g": 27, "fat_g": 0.4, "fiber_g": 3.1},
    "rice (100g cooked)": {"calories": 130, "protein_g": 2.7, "carbs_g": 28, "fat_g": 0.3, "fiber_g": 0.4},
    "roti/chapati (1)": {"calories": 120, "protein_g": 3.2, "carbs_g": 22, "fat_g": 2.5, "fiber_g": 1.9},
    "dal (100ml)": {"calories": 116, "protein_g": 7, "carbs_g": 18, "fat_g": 1.5, "fiber_g": 4},
    "chicken breast (100g)": {"calories": 165, "protein_g": 31, "carbs_g": 0, "fat_g": 3.6, "fiber_g": 0},
    "egg (1 large)": {"calories": 78, "protein_g": 6, "carbs_g": 0.6, "fat_g": 5, "fiber_g": 0},
    "milk (250ml)": {"calories": 122, "protein_g": 8, "carbs_g": 12, "fat_g": 5, "fiber_g": 0},
    "bread (1 slice)": {"calories": 79, "protein_g": 2.7, "carbs_g": 15, "fat_g": 1, "fiber_g": 0.6},
    "potato (medium)": {"calories": 161, "protein_g": 4.3, "carbs_g": 37, "fat_g": 0.2, "fiber_g": 3.8},
    "orange (medium)": {"calories": 62, "protein_g": 1.2, "carbs_g": 15, "fat_g": 0.2, "fiber_g": 3.1},
    "paneer (100g)": {"calories": 265, "protein_g": 18.3, "carbs_g": 1.2, "fat_g": 20.8, "fiber_g": 0},
    "curd/yogurt (100g)": {"calories": 61, "protein_g": 3.5, "carbs_g": 4.7, "fat_g": 3.3, "fiber_g": 0},
    "samosa (1)": {"calories": 260, "protein_g": 5, "carbs_g": 30, "fat_g": 13, "fiber_g": 2},
    "idli (1)": {"calories": 39, "protein_g": 2, "carbs_g": 8, "fat_g": 0.2, "fiber_g": 0.5},
    "dosa (1 plain)": {"calories": 133, "protein_g": 3, "carbs_g": 22, "fat_g": 3.7, "fiber_g": 1},
    "pizza slice (1)": {"calories": 285, "protein_g": 12, "carbs_g": 36, "fat_g": 10, "fiber_g": 2},
    "burger (1)": {"calories": 354, "protein_g": 20, "carbs_g": 30, "fat_g": 17, "fiber_g": 2},
    "coffee (black, 1 cup)": {"calories": 2, "protein_g": 0.3, "carbs_g": 0, "fat_g": 0, "fiber_g": 0},
    "tea (with milk & sugar)": {"calories": 55, "protein_g": 1, "carbs_g": 9, "fat_g": 1.5, "fiber_g": 0},
}

def _handle_food_calorie_lookup(files, payload):
    food = str(payload.get("food", "")).strip().lower()
    if not food:
        return _json({"foods": list(FOOD_CALORIES.keys()), "message": "Enter a food item to look up calories"})
    matches = {k: v for k, v in FOOD_CALORIES.items() if food in k}
    if not matches:
        return _err(f"Food '{food}' not found. Try: apple, rice, roti, chicken, egg, etc.")
    return _json({
        "results": [{"food": k, **v} for k, v in matches.items()],
        "message": f"Found {len(matches)} match(es) for '{food}'",
    })

MEGA_NEW_HANDLERS["food-calorie-lookup"] = _handle_food_calorie_lookup


# ─── STUDENT TOOLS ──────────────────────────────────────────────────────────

def _handle_citation_generator(files, payload):
    """Generate APA, MLA, Chicago citations."""
    style = str(payload.get("style", "apa")).lower().strip()
    citation_type = str(payload.get("citation_type", "website")).lower().strip()
    author = str(payload.get("author", "")).strip()
    title = str(payload.get("title", "")).strip()
    year = str(payload.get("year", "")).strip()
    url = str(payload.get("url", "")).strip()
    publisher = str(payload.get("publisher", "")).strip()
    journal = str(payload.get("journal", "")).strip()
    volume = str(payload.get("volume", "")).strip()
    pages = str(payload.get("pages", "")).strip()

    if not title:
        return _err("Title is required for citation generation")

    if style == "apa":
        if citation_type == "website":
            citation = f"{author or 'Author, A.'} ({year or 'n.d.'}). *{title}*. {publisher or 'Publisher'}. {url}"
        elif citation_type == "journal":
            citation = f"{author or 'Author, A.'} ({year or 'n.d.'}). {title}. *{journal or 'Journal Name'}*, *{volume or '1'}*, {pages or '1–10'}."
        else:
            citation = f"{author or 'Author, A.'} ({year or 'n.d.'}). *{title}*. {publisher or 'Publisher'}."
    elif style == "mla":
        if citation_type == "website":
            citation = f"{author or 'Author, A.'}. \"{title}.\" *{publisher or 'Website Name'}*, {year or 'n.d.'}, {url}."
        elif citation_type == "journal":
            citation = f"{author or 'Author, A.'}. \"{title}.\" *{journal or 'Journal Name'}*, vol. {volume or '1'}, {year or 'n.d.'}, pp. {pages or '1–10'}."
        else:
            citation = f"{author or 'Author, A.'}. *{title}*. {publisher or 'Publisher'}, {year or 'n.d.'}."
    elif style == "chicago":
        if citation_type == "website":
            citation = f"{author or 'Author, A.'}. \"{title}.\" {publisher or 'Website Name'}. {year or 'n.d.'}. {url}."
        elif citation_type == "journal":
            citation = f"{author or 'Author, A.'}. \"{title}.\" *{journal or 'Journal Name'}* {volume or '1'} ({year or 'n.d.'}): {pages or '1–10'}."
        else:
            citation = f"{author or 'Author, A.'}. *{title}*. {publisher or 'Publisher'}, {year or 'n.d.'}."
    else:
        return _err("Unknown citation style. Use: apa, mla, chicago")

    return _json({"citation": citation, "style": style.upper(), "type": citation_type, "message": f"{style.upper()} citation generated"})

MEGA_NEW_HANDLERS["citation-generator"] = _handle_citation_generator


def _handle_equation_solver(files, payload):
    """Solve linear and quadratic equations."""
    eq_type = str(payload.get("eq_type", "linear")).lower()
    try:
        if eq_type == "linear":
            # ax + b = c  → x = (c - b) / a
            a = float(payload.get("a", 1))
            b = float(payload.get("b", 0))
            c = float(payload.get("c", 0))
            if a == 0:
                return _err("Coefficient 'a' cannot be zero for a linear equation")
            x = (c - b) / a
            return _json({"equation": f"{a}x + {b} = {c}", "solution": {"x": round(x, 10)},
                          "steps": [f"Move {b} to right: {a}x = {c - b}", f"Divide by {a}: x = {round(x, 10)}"],
                          "message": f"x = {round(x, 10)}"})
        elif eq_type == "quadratic":
            # ax² + bx + c = 0
            a = float(payload.get("a", 1))
            b = float(payload.get("b", 0))
            c = float(payload.get("c", 0))
            if a == 0:
                return _err("Coefficient 'a' cannot be zero for quadratic equation")
            discriminant = b * b - 4 * a * c
            if discriminant > 0:
                x1 = (-b + math.sqrt(discriminant)) / (2 * a)
                x2 = (-b - math.sqrt(discriminant)) / (2 * a)
                return _json({"equation": f"{a}x² + {b}x + {c} = 0", "discriminant": round(discriminant, 6),
                              "roots": "two real roots", "x1": round(x1, 10), "x2": round(x2, 10),
                              "message": f"x₁ = {round(x1, 6)}, x₂ = {round(x2, 6)}"})
            elif discriminant == 0:
                x = -b / (2 * a)
                return _json({"equation": f"{a}x² + {b}x + {c} = 0", "discriminant": 0,
                              "roots": "one repeated root", "x": round(x, 10),
                              "message": f"x = {round(x, 10)} (repeated root)"})
            else:
                real_part = -b / (2 * a)
                imag_part = math.sqrt(-discriminant) / (2 * a)
                return _json({"equation": f"{a}x² + {b}x + {c} = 0", "discriminant": round(discriminant, 6),
                              "roots": "complex roots",
                              "x1": f"{round(real_part, 6)} + {round(imag_part, 6)}i",
                              "x2": f"{round(real_part, 6)} - {round(imag_part, 6)}i",
                              "message": "Complex roots (discriminant < 0)"})
        elif eq_type == "system":
            # a1x + b1y = c1 and a2x + b2y = c2
            a1 = float(payload.get("a1", 1))
            b1 = float(payload.get("b1", 1))
            c1 = float(payload.get("c1", 0))
            a2 = float(payload.get("a2", 1))
            b2 = float(payload.get("b2", -1))
            c2 = float(payload.get("c2", 0))
            det = a1 * b2 - a2 * b1
            if det == 0:
                return _err("System has no unique solution (determinant = 0)")
            x = (c1 * b2 - c2 * b1) / det
            y = (a1 * c2 - a2 * c1) / det
            return _json({"equations": [f"{a1}x + {b1}y = {c1}", f"{a2}x + {b2}y = {c2}"],
                          "x": round(x, 10), "y": round(y, 10),
                          "message": f"x = {round(x, 6)}, y = {round(y, 6)}"})
        else:
            return _err("Unknown eq_type. Use: linear, quadratic, system")
    except ZeroDivisionError:
        return _err("Division by zero — check coefficients")
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["equation-solver"] = _handle_equation_solver


def _handle_gpa_cgpa_calculator(files, payload):
    """Calculate GPA/CGPA from grades and credit hours."""
    grades_json = str(payload.get("grades", "")).strip()
    scale = float(payload.get("scale", 10))
    if not grades_json:
        return _err("Enter grades as JSON: [{\"grade\": 8.5, \"credits\": 3}, ...]")
    try:
        grades = json.loads(grades_json)
        if not isinstance(grades, list):
            raise ValueError("Must be a list")
        total_credits = 0
        total_points = 0.0
        processed = []
        for item in grades:
            g = float(item.get("grade", 0))
            c = float(item.get("credits", 0))
            subject = item.get("subject", "")
            pts = g * c
            total_credits += c
            total_points += pts
            processed.append({"subject": subject, "grade": g, "credits": c, "grade_points": round(pts, 3)})
        if total_credits == 0:
            return _err("Total credits cannot be zero")
        cgpa = total_points / total_credits
        percentage = (cgpa / scale) * 100
        return _json({
            "cgpa": round(cgpa, 4),
            "total_credits": total_credits,
            "total_points": round(total_points, 4),
            "scale": scale,
            "percentage_equivalent": round(percentage, 2),
            "grade_classification": _classify_grade(cgpa, scale),
            "subjects": processed,
            "message": f"CGPA = {round(cgpa, 2)} / {scale} ({round(percentage, 1)}%)",
        })
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        return _err(f"Invalid grades format: {e}. Use: [{{'grade': 8.5, 'credits': 3}}]")

def _classify_grade(cgpa, scale):
    pct = (cgpa / scale) * 100
    if pct >= 90: return "Outstanding / O"
    if pct >= 75: return "Excellent / A+"
    if pct >= 65: return "Good / A"
    if pct >= 55: return "Average / B"
    if pct >= 45: return "Pass / C"
    return "Fail"

MEGA_NEW_HANDLERS["gpa-cgpa-calculator"] = _handle_gpa_cgpa_calculator


def _handle_attendance_calculator(files, payload):
    """Calculate if student can afford to miss more classes."""
    total_classes = int(payload.get("total_classes", 0))
    attended = int(payload.get("attended", 0))
    required_percent = float(payload.get("required_percent", 75))
    try:
        if total_classes <= 0:
            return _err("Total classes must be > 0")
        current_percent = (attended / total_classes) * 100
        min_required = math.ceil((required_percent / 100) * total_classes)
        can_miss = attended - min_required
        need_attend = max(0, min_required - attended)
        # How many more can be missed without falling below threshold?
        # Let T = total_classes + extra_miss, attended stays same
        # Need: attended / (total_classes + extra_miss) >= required_percent/100
        # extra_miss <= attended * 100/required_percent - total_classes
        max_missable = max(0, int(attended * (100 / required_percent) - total_classes))
        return _json({
            "total_classes": total_classes,
            "attended": attended,
            "missed": total_classes - attended,
            "current_percentage": round(current_percent, 2),
            "required_percentage": required_percent,
            "status": "SAFE" if current_percent >= required_percent else "LOW",
            "can_miss_more": max_missable if current_percent >= required_percent else 0,
            "need_to_attend": need_attend if current_percent < required_percent else 0,
            "message": f"Current: {round(current_percent, 1)}% — {'SAFE ✓' if current_percent >= required_percent else f'Need {need_attend} more classes ✗'}",
        })
    except ZeroDivisionError:
        return _err("Division by zero")

MEGA_NEW_HANDLERS["attendance-calculator"] = _handle_attendance_calculator


# ─── HEALTH / FITNESS TOOLS ──────────────────────────────────────────────────

def _handle_daily_calorie_needs(files, payload):
    """Calculate TDEE (Total Daily Energy Expenditure) using Mifflin-St Jeor."""
    try:
        weight = float(payload.get("weight_kg", 70))
        height = float(payload.get("height_cm", 170))
        age = float(payload.get("age", 25))
        gender = str(payload.get("gender", "male")).lower()
        activity = str(payload.get("activity_level", "moderate")).lower()

        # Mifflin-St Jeor BMR
        if gender == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        activity_factors = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9,
        }
        factor = activity_factors.get(activity, 1.55)
        tdee = bmr * factor

        return _json({
            "bmr": round(bmr, 1),
            "tdee": round(tdee, 1),
            "activity_level": activity,
            "goal_calories": {
                "weight_loss": round(tdee - 500, 1),
                "maintenance": round(tdee, 1),
                "weight_gain": round(tdee + 500, 1),
            },
            "macros_maintenance": {
                "protein_g": round(weight * 1.6, 1),
                "carbs_g": round((tdee * 0.45) / 4, 1),
                "fat_g": round((tdee * 0.30) / 9, 1),
            },
            "message": f"BMR: {round(bmr)} kcal/day | TDEE: {round(tdee)} kcal/day",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["daily-calorie-needs"] = _handle_daily_calorie_needs


def _handle_water_intake_calculator(files, payload):
    """Calculate daily water intake based on weight and activity."""
    try:
        weight_kg = float(payload.get("weight_kg", 70))
        activity = str(payload.get("activity_level", "moderate")).lower()
        climate = str(payload.get("climate", "temperate")).lower()

        base_ml = weight_kg * 35
        activity_add = {"sedentary": 0, "light": 250, "moderate": 500, "active": 750, "very_active": 1000}.get(activity, 500)
        climate_add = {"cool": -200, "temperate": 0, "hot": 400, "very_hot": 700}.get(climate, 0)
        total_ml = base_ml + activity_add + climate_add
        cups = total_ml / 240
        bottles_500 = total_ml / 500

        return _json({
            "weight_kg": weight_kg,
            "daily_water_ml": round(total_ml),
            "daily_water_liters": round(total_ml / 1000, 2),
            "cups_250ml": round(cups, 1),
            "bottles_500ml": round(bottles_500, 1),
            "hourly_sips_ml": round(total_ml / 16, 0),
            "message": f"Drink {round(total_ml / 1000, 1)} liters ({round(cups, 0)} cups) per day",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["water-intake-calculator"] = _handle_water_intake_calculator


def _handle_ideal_weight(files, payload):
    """Calculate ideal body weight using multiple formulas."""
    try:
        height_cm = float(payload.get("height_cm", 170))
        gender = str(payload.get("gender", "male")).lower()
        height_in = height_cm / 2.54
        height_ft = height_in / 12

        # Robinson formula (1983)
        if gender == "male":
            robinson = 52 + 1.9 * (height_in - 60)
            miller = 56.2 + 1.41 * (height_in - 60)
            devine = 50 + 2.3 * (height_in - 60)
        else:
            robinson = 49 + 1.7 * (height_in - 60)
            miller = 53.1 + 1.36 * (height_in - 60)
            devine = 45.5 + 2.3 * (height_in - 60)

        avg = (robinson + miller + devine) / 3
        return _json({
            "height_cm": height_cm,
            "gender": gender,
            "ideal_weight_kg": {
                "robinson": round(robinson, 1),
                "miller": round(miller, 1),
                "devine": round(devine, 1),
                "average": round(avg, 1),
            },
            "healthy_range_kg": {"min": round(avg * 0.9, 1), "max": round(avg * 1.1, 1)},
            "message": f"Ideal weight range: {round(avg * 0.9, 1)}–{round(avg * 1.1, 1)} kg",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["ideal-weight"] = _handle_ideal_weight


# ─── PRODUCTIVITY TOOLS ──────────────────────────────────────────────────────

def _handle_meeting_cost_calculator(files, payload):
    """Calculate the cost of a meeting."""
    try:
        num_people = int(payload.get("num_people", 5))
        duration_minutes = float(payload.get("duration_minutes", 60))
        avg_hourly_rate = float(payload.get("avg_hourly_rate", 2000))
        currency = str(payload.get("currency", "INR")).upper()

        total_person_hours = (num_people * duration_minutes) / 60
        total_cost = total_person_hours * avg_hourly_rate
        cost_per_minute = total_cost / duration_minutes

        return _json({
            "num_people": num_people,
            "duration_minutes": duration_minutes,
            "avg_hourly_rate": avg_hourly_rate,
            "currency": currency,
            "total_cost": round(total_cost, 2),
            "cost_per_minute": round(cost_per_minute, 2),
            "person_hours": round(total_person_hours, 2),
            "message": f"Meeting cost: {currency} {round(total_cost, 2)} ({round(cost_per_minute, 2)}/min)",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["meeting-cost-calculator"] = _handle_meeting_cost_calculator


def _handle_text_readability(files, payload):
    """Analyse text readability (Flesch reading ease, grade level, etc.)."""
    text = str(payload.get("text", "")).strip()
    if not text:
        return _err("Enter text to analyse readability")
    words = re.findall(r'\b\w+\b', text)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s for s in sentences if s.strip()]
    word_count = len(words)
    sentence_count = max(len(sentences), 1)

    def count_syllables(word):
        word = word.lower()
        count = len(re.findall(r'[aeiou]+', word))
        if word.endswith('e') and count > 1:
            count -= 1
        return max(count, 1)

    total_syllables = sum(count_syllables(w) for w in words)
    avg_words_per_sentence = word_count / sentence_count
    avg_syllables_per_word = total_syllables / max(word_count, 1)

    # Flesch Reading Ease
    flesch = 206.835 - 1.015 * avg_words_per_sentence - 84.6 * avg_syllables_per_word
    flesch = max(0, min(100, flesch))

    # Flesch-Kincaid Grade Level
    fk_grade = 0.39 * avg_words_per_sentence + 11.8 * avg_syllables_per_word - 15.59

    if flesch >= 90: level = "Very Easy (5th grade)"
    elif flesch >= 80: level = "Easy (6th grade)"
    elif flesch >= 70: level = "Fairly Easy (7th grade)"
    elif flesch >= 60: level = "Standard (8–9th grade)"
    elif flesch >= 50: level = "Fairly Difficult (10–12th grade)"
    elif flesch >= 30: level = "Difficult (College)"
    else: level = "Very Difficult (Professional)"

    char_count = len(text)
    reading_time_sec = (word_count / 200) * 60

    return _json({
        "word_count": word_count,
        "sentence_count": sentence_count,
        "character_count": char_count,
        "syllable_count": total_syllables,
        "avg_words_per_sentence": round(avg_words_per_sentence, 2),
        "avg_syllables_per_word": round(avg_syllables_per_word, 2),
        "flesch_reading_ease": round(flesch, 1),
        "flesch_kincaid_grade": round(fk_grade, 1),
        "reading_level": level,
        "reading_time_seconds": round(reading_time_sec, 1),
        "reading_time_human": f"{int(reading_time_sec // 60)}m {int(reading_time_sec % 60)}s",
        "message": f"Readability: {level} | Flesch: {round(flesch, 1)} | ~{int(reading_time_sec // 60)}m {int(reading_time_sec % 60)}s to read",
    })

MEGA_NEW_HANDLERS["text-readability"] = _handle_text_readability


def _handle_number_to_words(files, payload):
    """Convert a number to English words (useful for cheque writing)."""
    def n2w(n):
        if n < 0:
            return "negative " + n2w(-n)
        if n == 0:
            return "zero"
        ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
                "seventeen", "eighteen", "nineteen"]
        tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

        def helper(num):
            if num == 0:
                return ""
            elif num < 20:
                return ones[num] + " "
            elif num < 100:
                return tens[num // 10] + " " + helper(num % 10)
            elif num < 1000:
                return ones[num // 100] + " hundred " + helper(num % 100)
            elif num < 100000:
                return helper(num // 1000) + "thousand " + helper(num % 1000)
            elif num < 10000000:
                return helper(num // 100000) + "lakh " + helper(num % 100000)
            else:
                return helper(num // 10000000) + "crore " + helper(num % 10000000)

        return helper(n).strip()

    try:
        number_str = str(payload.get("number", "0")).strip().replace(",", "")
        if "." in number_str:
            integer_part, decimal_part = number_str.split(".", 1)
            words = n2w(int(integer_part))
            return _json({"number": number_str, "words": words + " point " + " ".join(n2w(int(d)) for d in decimal_part),
                          "message": words})
        else:
            num = int(number_str)
            words = n2w(abs(num))
            if num < 0:
                words = "negative " + words
            return _json({"number": num, "words": words.title(), "message": words.title()})
    except ValueError:
        return _err("Enter a valid number (e.g. 12345 or 1234.56)")

MEGA_NEW_HANDLERS["number-to-words"] = _handle_number_to_words


def _handle_roman_numeral_converter(files, payload):
    """Convert between Arabic and Roman numerals."""
    value = str(payload.get("value", "")).strip()
    direction = str(payload.get("direction", "to_roman")).lower()

    ROMAN_VALS = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
    ]

    def to_roman(n):
        if n <= 0 or n > 3999:
            return None
        result = ""
        for val, sym in ROMAN_VALS:
            while n >= val:
                result += sym
                n -= val
        return result

    def from_roman(s):
        s = s.upper()
        ROMAN_MAP = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        result = 0
        prev = 0
        for ch in reversed(s):
            v = ROMAN_MAP.get(ch, 0)
            if v < prev:
                result -= v
            else:
                result += v
            prev = v
        return result

    if direction == "to_roman":
        try:
            n = int(value)
            r = to_roman(n)
            if r is None:
                return _err("Number must be 1–3999 for Roman numeral conversion")
            return _json({"arabic": n, "roman": r, "message": f"{n} → {r}"})
        except ValueError:
            return _err("Enter a valid integer (1–3999)")
    else:
        n = from_roman(value)
        return _json({"roman": value.upper(), "arabic": n, "message": f"{value.upper()} → {n}"})

MEGA_NEW_HANDLERS["roman-numeral-converter"] = _handle_roman_numeral_converter


def _handle_random_password_generator(files, payload):
    import string
    try:
        length = min(max(int(payload.get("length", 16)), 4), 128)
        use_upper = str(payload.get("use_uppercase", "true")).lower() != "false"
        use_lower = str(payload.get("use_lowercase", "true")).lower() != "false"
        use_digits = str(payload.get("use_digits", "true")).lower() != "false"
        use_symbols = str(payload.get("use_symbols", "true")).lower() != "false"
        count = min(int(payload.get("count", 5)), 20)

        pool = ""
        if use_upper: pool += string.ascii_uppercase
        if use_lower: pool += string.ascii_lowercase
        if use_digits: pool += string.digits
        if use_symbols: pool += "!@#$%^&*()-_=+[]{}|;:,.<>?"

        if not pool:
            return _err("At least one character type must be selected")

        passwords = ["".join(random.SystemRandom().choice(pool) for _ in range(length)) for _ in range(count)]

        def strength(pwd):
            score = 0
            if any(c.isupper() for c in pwd): score += 1
            if any(c.islower() for c in pwd): score += 1
            if any(c.isdigit() for c in pwd): score += 1
            if any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?" for c in pwd): score += 1
            if len(pwd) >= 12: score += 1
            if len(pwd) >= 16: score += 1
            if score >= 5: return "Very Strong"
            if score >= 4: return "Strong"
            if score >= 3: return "Medium"
            return "Weak"

        return _json({
            "passwords": passwords,
            "length": length,
            "strength": strength(passwords[0]),
            "count": count,
            "message": f"Generated {count} password(s) of length {length}",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["random-password-generator"] = _handle_random_password_generator


def _handle_color_palette_generator(files, payload):
    """Generate a color palette from a base hex color."""
    import colorsys
    base_hex = str(payload.get("base_color", "#007aff")).strip().lstrip("#")
    palette_type = str(payload.get("palette_type", "complementary")).lower()
    try:
        r, g, b = int(base_hex[0:2], 16) / 255, int(base_hex[2:4], 16) / 255, int(base_hex[4:6], 16) / 255
    except (ValueError, IndexError):
        return _err("Enter a valid 6-digit hex color like #007aff")

    h, s, v = colorsys.rgb_to_hsv(r, g, b)

    def hsv_to_hex(hh, ss, vv):
        rr, gg, bb = colorsys.hsv_to_rgb(hh % 1.0, max(0, min(1, ss)), max(0, min(1, vv)))
        return "#{:02x}{:02x}{:02x}".format(int(rr * 255), int(gg * 255), int(bb * 255))

    palette = []
    if palette_type == "complementary":
        palette = [f"#{base_hex}", hsv_to_hex(h + 0.5, s, v)]
    elif palette_type == "triadic":
        palette = [f"#{base_hex}", hsv_to_hex(h + 1/3, s, v), hsv_to_hex(h + 2/3, s, v)]
    elif palette_type == "analogous":
        palette = [hsv_to_hex(h - 0.1, s, v), f"#{base_hex}", hsv_to_hex(h + 0.1, s, v)]
    elif palette_type == "shades":
        palette = [hsv_to_hex(h, s, v * m) for m in [0.3, 0.5, 0.7, 1.0, 1.0, 0.9, 0.8]]
    elif palette_type == "split_complementary":
        palette = [f"#{base_hex}", hsv_to_hex(h + 0.417, s, v), hsv_to_hex(h + 0.583, s, v)]
    else:
        palette = [f"#{base_hex}", hsv_to_hex(h + 0.5, s, v)]

    return _json({
        "base_color": f"#{base_hex}",
        "palette_type": palette_type,
        "colors": palette,
        "count": len(palette),
        "message": f"{palette_type.replace('_', ' ').title()} palette: {', '.join(palette)}",
    })

MEGA_NEW_HANDLERS["color-palette-generator"] = _handle_color_palette_generator


def _handle_loan_emi_calculator(files, payload):
    """Detailed loan EMI with amortization. Safe input coercion + amortization schedule."""
    try:
        principal = coerce_float(
            payload.get("principal") or payload.get("loan_amount") or payload.get("amount"),
            default=100000.0, lo=0.0,
        )
        annual_rate = coerce_float(
            payload.get("annual_rate") or payload.get("rate") or payload.get("interest_rate"),
            default=10.0, lo=0.0,
        )
        # Accept tenure_months directly, or tenure/years in years (convert to months)
        if payload.get("tenure_months"):
            tenure_months = coerce_int(payload.get("tenure_months"), default=12, lo=1, hi=600)
        elif payload.get("years"):
            tenure_months = max(1, int(round(coerce_float(payload.get("years"), default=1.0, lo=0.0) * 12)))
        elif payload.get("tenure"):
            tenure_months = max(1, int(round(coerce_float(payload.get("tenure"), default=1.0, lo=0.0) * 12)))
        else:
            tenure_months = 12
        if principal <= 0:
            return _err("Please enter a loan amount greater than zero.")
        if tenure_months <= 0:
            return _err("Please enter a loan tenure of at least one month.")
        monthly_rate = annual_rate / (12 * 100)
        if monthly_rate == 0:
            emi = principal / tenure_months
        else:
            emi = principal * monthly_rate * (1 + monthly_rate) ** tenure_months / ((1 + monthly_rate) ** tenure_months - 1)
        total_payment = emi * tenure_months
        total_interest = total_payment - principal
        # First 6 months amortization
        schedule = []
        balance = principal
        for m in range(1, min(tenure_months + 1, 7)):
            interest_part = balance * monthly_rate
            principal_part = emi - interest_part
            balance -= principal_part
            schedule.append({
                "month": m,
                "emi": round(emi, 2),
                "principal": round(principal_part, 2),
                "interest": round(interest_part, 2),
                "balance": round(max(balance, 0), 2),
            })
        return _json({
            "principal": principal,
            "annual_rate": annual_rate,
            "tenure_months": tenure_months,
            "emi": round(emi, 2),
            "total_payment": round(total_payment, 2),
            "total_interest": round(total_interest, 2),
            "interest_percentage": round((total_interest / principal) * 100, 2),
            "first_6_months_schedule": schedule,
            "message": f"Monthly EMI: ₹{round(emi, 2):,.2f} | Total Interest: ₹{round(total_interest, 2):,.2f}",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["loan-emi-calculator"] = _handle_loan_emi_calculator


def _handle_age_calculator_detailed(files, payload):
    """Calculate detailed age including days, months, weeks."""
    from datetime import date, datetime as _dt
    dob_str = str(
        payload.get("dob") or payload.get("date_of_birth") or payload.get("birth_date")
        or payload.get("birthday") or payload.get("text") or payload.get("date")
        or payload.get("input") or ""
    ).strip()
    reference_str = str(payload.get("reference_date") or payload.get("ref_date") or "").strip()

    def _parse_flex(s: str):
        if not s:
            return None
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d", "%d %b %Y", "%d %B %Y"):
            try:
                return _dt.strptime(s, fmt).date()
            except ValueError:
                continue
        return None

    try:
        dob = _parse_flex(dob_str)
        if dob is None:
            return _err("Enter Date of Birth (try formats: YYYY-MM-DD, DD/MM/YYYY, or DD-MM-YYYY)")
        ref = _parse_flex(reference_str) or date.today()
        if dob > ref:
            return _err("Date of birth cannot be in the future")
        years = ref.year - dob.year - ((ref.month, ref.day) < (dob.month, dob.day))
        months_total = (ref.year - dob.year) * 12 + (ref.month - dob.month)
        if ref.day < dob.day:
            months_total -= 1
        days_total = (ref - dob).days
        weeks_total = days_total // 7
        next_bday = dob.replace(year=ref.year)
        if next_bday < ref:
            next_bday = dob.replace(year=ref.year + 1)
        days_to_bday = (next_bday - ref).days
        return _json({
            "date_of_birth": str(dob),
            "reference_date": str(ref),
            "age_years": years,
            "age_months_total": months_total,
            "age_days_total": days_total,
            "age_weeks_total": weeks_total,
            "age_hours_total": days_total * 24,
            "age_minutes_total": days_total * 24 * 60,
            "days_to_next_birthday": days_to_bday,
            "next_birthday": str(next_bday),
            "zodiac_sign": _get_zodiac(dob.month, dob.day),
            "message": f"Age: {years} years, {months_total % 12} months, {days_total % 30} days",
        })
    except ValueError as e:
        return _err(str(e))

def _get_zodiac(month, day):
    zodiacs = [
        (1, 20, "Capricorn"), (2, 19, "Aquarius"), (3, 20, "Pisces"),
        (4, 20, "Aries"), (5, 21, "Taurus"), (6, 21, "Gemini"),
        (7, 23, "Cancer"), (8, 23, "Leo"), (9, 23, "Virgo"),
        (10, 23, "Libra"), (11, 22, "Scorpio"), (12, 22, "Sagittarius"),
        (12, 31, "Capricorn"),
    ]
    for end_month, end_day, sign in zodiacs:
        if month < end_month or (month == end_month and day <= end_day):
            return sign
    return "Capricorn"

MEGA_NEW_HANDLERS["age-calculator-detailed"] = _handle_age_calculator_detailed


# ─── MORE VIDEO DOWNLOADERS ──────────────────────────────────────────────────

def _yt_dlp_download(url: str, extra_args: list[str] | None = None) -> dict:
    """Generic yt-dlp downloader returning JSON metadata."""
    YT_DLP = "/home/runner/workspace/.pythonlibs/bin/yt-dlp"
    if not os.path.exists(YT_DLP):
        YT_DLP = "yt-dlp"
    with tempfile.TemporaryDirectory() as tmpdir:
        cmd = [YT_DLP, "--dump-json", "--no-playlist", url]
        if extra_args:
            cmd += extra_args
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if result.returncode != 0:
                return _err(f"Could not fetch video info: {result.stderr[:300]}")
            data = json.loads(result.stdout.split("\n")[0])
            return _json({
                "title": data.get("title", "Unknown"),
                "duration_seconds": data.get("duration"),
                "uploader": data.get("uploader") or data.get("channel"),
                "view_count": data.get("view_count"),
                "like_count": data.get("like_count"),
                "thumbnail": data.get("thumbnail"),
                "webpage_url": data.get("webpage_url", url),
                "formats": [
                    {"format_id": f.get("format_id"), "ext": f.get("ext"), "resolution": f.get("resolution"),
                     "filesize": f.get("filesize"), "note": f.get("format_note")}
                    for f in data.get("formats", [])[-6:]
                ],
                "description": (data.get("description") or "")[:200],
                "message": f"Video info fetched: {data.get('title', 'Unknown')}",
                "note": "Use the URL to download via yt-dlp or a compatible browser extension.",
            })
        except subprocess.TimeoutExpired:
            return _err("Request timed out — video platform may be rate limiting")
        except (json.JSONDecodeError, KeyError):
            return _err("Could not parse video metadata")
        except FileNotFoundError:
            return _err("yt-dlp not installed on server")


# instagram-downloader: handled by the proper version in video_extra_handlers.py
# (cookies support + IG-specific extractor args + mobile UA + clear error msg).
# instagram-reel-downloader: delegate to the same proper handler.
def _handle_instagram_reel_delegate(files, payload, *args, **kwargs):
    from .video_extra_handlers import _handle_instagram_downloader as _ig
    # Proper handler signature: (files, payload, job_dir). The runtime adapter
    # passes job_dir as 3rd positional arg; if missing, fall back to a temp dir.
    if args:
        return _ig(files, payload, args[0])
    job_dir = kwargs.get("job_dir")
    if job_dir is None:
        import tempfile
        from pathlib import Path as _P
        job_dir = _P(tempfile.mkdtemp(prefix="ig_reel_"))
    return _ig(files, payload, job_dir)

MEGA_NEW_HANDLERS["instagram-reel-downloader"] = _handle_instagram_reel_delegate


def _handle_rumble_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url or "rumble.com" not in url:
        return _err("Enter a valid Rumble video URL (e.g. https://rumble.com/v...)")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["rumble-downloader"] = _handle_rumble_downloader


def _handle_twitch_clip_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url or "twitch.tv" not in url:
        return _err("Enter a valid Twitch clip URL (e.g. https://clips.twitch.tv/...)")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["twitch-clip-downloader"] = _handle_twitch_clip_downloader


def _handle_bilibili_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url or "bilibili.com" not in url:
        return _err("Enter a valid Bilibili video URL (e.g. https://www.bilibili.com/video/...)")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["bilibili-downloader"] = _handle_bilibili_downloader


def _handle_pinterest_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url or "pinterest" not in url:
        return _err("Enter a valid Pinterest pin URL")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["pinterest-downloader"] = _handle_pinterest_downloader


def _handle_reddit_video_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url or "reddit.com" not in url:
        return _err("Enter a valid Reddit post URL containing a video")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["reddit-video-downloader"] = _handle_reddit_video_downloader


def _handle_linkedin_video_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url or "linkedin.com" not in url:
        return _err("Enter a valid LinkedIn video post URL")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["linkedin-video-downloader"] = _handle_linkedin_video_downloader


def _handle_m3u8_stream_downloader(files, payload):
    url = str(payload.get("url", "")).strip()
    if not url:
        return _err("Enter a valid video URL or M3U8 stream URL")
    return _yt_dlp_download(url)

MEGA_NEW_HANDLERS["stream-downloader"] = _handle_m3u8_stream_downloader


def _handle_video_thumbnail_downloader(files, payload):
    """Fetch and return video thumbnail URL."""
    url = str(payload.get("url", "")).strip()
    if not url:
        return _err("Enter a video URL to fetch its thumbnail")
    YT_DLP = "/home/runner/workspace/.pythonlibs/bin/yt-dlp"
    if not os.path.exists(YT_DLP):
        YT_DLP = "yt-dlp"
    try:
        result = subprocess.run([YT_DLP, "--dump-json", "--no-playlist", url], capture_output=True, text=True, timeout=20)
        if result.returncode != 0:
            return _err("Could not fetch video info")
        data = json.loads(result.stdout.split("\n")[0])
        thumbnails = data.get("thumbnails", [])
        best = max(thumbnails, key=lambda t: t.get("preference", 0), default={})
        return _json({
            "title": data.get("title"),
            "thumbnail_url": best.get("url") or data.get("thumbnail"),
            "all_thumbnails": [t.get("url") for t in thumbnails[-5:]],
            "message": "Thumbnail URL retrieved successfully",
        })
    except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError, KeyError) as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["video-thumbnail-downloader"] = _handle_video_thumbnail_downloader


# ─── MISC UTILITY TOOLS ──────────────────────────────────────────────────────

def _handle_tip_calculator(files, payload):
    try:
        bill = float(payload.get("bill_amount", 100))
        tip_pct = float(payload.get("tip_percent", 15))
        num_people = max(int(payload.get("num_people", 1)), 1)
        tip = bill * tip_pct / 100
        total = bill + tip
        per_person = total / num_people
        return _json({
            "bill_amount": bill,
            "tip_percent": tip_pct,
            "tip_amount": round(tip, 2),
            "total_amount": round(total, 2),
            "per_person": round(per_person, 2),
            "num_people": num_people,
            "message": f"Tip: {round(tip, 2)} | Total: {round(total, 2)} | Per person: {round(per_person, 2)}",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["tip-calculator"] = _handle_tip_calculator


def _handle_fuel_cost_calculator(files, payload):
    try:
        distance_km = float(payload.get("distance_km", 100))
        mileage_kmpl = float(payload.get("mileage_kmpl", 15))
        fuel_price_per_liter = float(payload.get("fuel_price_per_liter", 100))
        fuel_needed = distance_km / mileage_kmpl
        total_cost = fuel_needed * fuel_price_per_liter
        cost_per_km = total_cost / distance_km
        return _json({
            "distance_km": distance_km,
            "mileage_kmpl": mileage_kmpl,
            "fuel_price_per_liter": fuel_price_per_liter,
            "fuel_needed_liters": round(fuel_needed, 3),
            "total_cost": round(total_cost, 2),
            "cost_per_km": round(cost_per_km, 2),
            "message": f"Fuel needed: {round(fuel_needed, 2)}L | Cost: ₹{round(total_cost, 2)}",
        })
    except (ValueError, ZeroDivisionError) as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["fuel-cost-calculator"] = _handle_fuel_cost_calculator


def _handle_electricity_bill_calculator(files, payload):
    try:
        units = float(payload.get("units_consumed", 200))
        rate_per_unit = float(payload.get("rate_per_unit", 6))
        fixed_charge = float(payload.get("fixed_charge", 50))
        tax_pct = float(payload.get("tax_percent", 18))
        energy_charge = units * rate_per_unit
        tax_amount = (energy_charge + fixed_charge) * tax_pct / 100
        total = energy_charge + fixed_charge + tax_amount
        return _json({
            "units_consumed": units,
            "energy_charge": round(energy_charge, 2),
            "fixed_charge": round(fixed_charge, 2),
            "tax_amount": round(tax_amount, 2),
            "total_bill": round(total, 2),
            "average_daily_units": round(units / 30, 2),
            "message": f"Total Bill: ₹{round(total, 2)} for {units} units",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["electricity-bill-calculator"] = _handle_electricity_bill_calculator


def _handle_unit_price_calculator(files, payload):
    """Compare unit prices of two products (price per gram/ml/unit)."""
    try:
        price1 = float(payload.get("price1", 100))
        qty1 = float(payload.get("quantity1", 500))
        unit1 = str(payload.get("unit1", "g"))
        price2 = float(payload.get("price2", 180))
        qty2 = float(payload.get("quantity2", 1000))
        per1 = price1 / qty1
        per2 = price2 / qty2
        cheaper = "Product 1" if per1 < per2 else "Product 2"
        savings_pct = abs(per1 - per2) / max(per1, per2) * 100
        return _json({
            "product1": {"price": price1, "quantity": qty1, "unit": unit1, "price_per_unit": round(per1, 6)},
            "product2": {"price": price2, "quantity": qty2, "unit": unit1, "price_per_unit": round(per2, 6)},
            "cheaper": cheaper,
            "savings_percent": round(savings_pct, 2),
            "message": f"{cheaper} is cheaper by {round(savings_pct, 1)}% (₹{round(per1, 4)} vs ₹{round(per2, 4)} per {unit1})",
        })
    except (ValueError, ZeroDivisionError) as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["unit-price-calculator"] = _handle_unit_price_calculator


def _handle_days_between_dates(files, payload):
    from datetime import date, datetime as _dt
    d1_raw = str(
        payload.get("date1") or payload.get("from_date") or payload.get("start_date")
        or payload.get("start") or payload.get("text") or payload.get("date") or ""
    ).strip()
    d2_raw = str(
        payload.get("date2") or payload.get("to_date") or payload.get("end_date")
        or payload.get("end") or payload.get("text2") or ""
    ).strip()

    def _parse_flex(s: str):
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
            try:
                return _dt.strptime(s, fmt).date()
            except ValueError:
                continue
        return None

    try:
        if not d1_raw or not d2_raw:
            return _err("Provide both dates (try YYYY-MM-DD or DD/MM/YYYY)")
        d1 = _parse_flex(d1_raw)
        d2 = _parse_flex(d2_raw)
        if not d1 or not d2:
            return _err("Could not parse dates. Try YYYY-MM-DD format.")
        diff = abs((d2 - d1).days)
        weeks = diff // 7
        months_approx = diff / 30.44
        return _json({
            "date1": str(d1),
            "date2": str(d2),
            "days": diff,
            "weeks": weeks,
            "months_approx": round(months_approx, 2),
            "business_days": sum(1 for i in range(diff) if (d1 if d1 < d2 else d2).replace(day=(d1 if d1 < d2 else d2).day + i).weekday() < 5) if diff < 365 else "N/A (too many days)",
            "message": f"Between {d1} and {d2}: {diff} days ({weeks} weeks)",
        })
    except ValueError as e:
        return _err(f"Use YYYY-MM-DD format: {e}")

MEGA_NEW_HANDLERS["days-between-dates"] = _handle_days_between_dates


def _handle_fibonacci_generator(files, payload):
    try:
        n = min(max(int(payload.get("n", 10)), 1), 100)
        seq = [0, 1]
        while len(seq) < n:
            seq.append(seq[-1] + seq[-2])
        seq = seq[:n]
        golden_ratio = seq[-1] / seq[-2] if len(seq) > 1 and seq[-2] != 0 else None
        return _json({
            "n": n,
            "sequence": seq,
            "sum": sum(seq),
            "golden_ratio_approx": round(golden_ratio, 8) if golden_ratio else None,
            "message": f"First {n} Fibonacci numbers generated",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["fibonacci-generator"] = _handle_fibonacci_generator


def _handle_prime_checker(files, payload):
    try:
        n = int(payload.get("number", 17))
        if n < 2:
            return _json({"number": n, "is_prime": False, "message": f"{n} is not a prime number"})
        if n == 2:
            return _json({"number": n, "is_prime": True, "message": f"{n} is a prime number"})
        if n % 2 == 0:
            return _json({"number": n, "is_prime": False, "factors": [2, n // 2], "message": f"{n} is NOT prime"})
        factors = []
        for i in range(3, int(math.sqrt(n)) + 1, 2):
            if n % i == 0:
                factors.append(i)
                factors.append(n // i)
                break
        is_prime = len(factors) == 0
        # Find next 5 primes
        def sieve(limit):
            is_p = [True] * (limit + 1)
            is_p[0] = is_p[1] = False
            for ii in range(2, int(limit ** 0.5) + 1):
                if is_p[ii]:
                    for jj in range(ii * ii, limit + 1, ii):
                        is_p[jj] = False
            return [ii for ii in range(2, limit + 1) if is_p[ii]]
        primes_near = [p for p in sieve(n + 50) if p > n][:5]
        return _json({
            "number": n,
            "is_prime": is_prime,
            "factors": sorted(set(factors)) if not is_prime else [],
            "next_primes": primes_near,
            "message": f"{n} {'IS' if is_prime else 'is NOT'} a prime number",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["prime-checker"] = _handle_prime_checker


def _handle_matrix_calculator(files, payload):
    """Basic 2×2 and 3×3 matrix operations."""
    operation = str(payload.get("operation", "determinant")).lower()
    try:
        matrix_a_str = str(payload.get("matrix_a", "[[1,2],[3,4]]"))
        A = json.loads(matrix_a_str)

        def det2(m):
            return m[0][0] * m[1][1] - m[0][1] * m[1][0]

        def det3(m):
            return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
                    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))

        if operation == "determinant":
            if len(A) == 2:
                d = det2(A)
            elif len(A) == 3:
                d = det3(A)
            else:
                return _err("Only 2×2 and 3×3 matrices are supported")
            return _json({"matrix": A, "determinant": round(d, 6), "message": f"det(A) = {round(d, 6)}"})

        elif operation == "transpose":
            T = [[A[j][i] for j in range(len(A))] for i in range(len(A[0]))]
            return _json({"original": A, "transpose": T, "message": "Transpose computed"})

        elif operation == "add":
            B = json.loads(str(payload.get("matrix_b", "[[1,0],[0,1]]")))
            R = [[A[i][j] + B[i][j] for j in range(len(A[0]))] for i in range(len(A))]
            return _json({"A": A, "B": B, "result": R, "message": "A + B computed"})

        elif operation == "multiply":
            B = json.loads(str(payload.get("matrix_b", "[[1,0],[0,1]]")))
            R = [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]
            return _json({"A": A, "B": B, "result": R, "message": "A × B computed"})

        else:
            return _err("Unknown operation. Use: determinant, transpose, add, multiply")

    except (json.JSONDecodeError, IndexError, KeyError, ValueError) as e:
        return _err(f"Matrix error: {e}. Use format: [[1,2],[3,4]]")

MEGA_NEW_HANDLERS["matrix-calculator"] = _handle_matrix_calculator


def _handle_statistics_calculator(files, payload):
    """Descriptive statistics: mean, median, mode, std dev, etc."""
    data_str = str(payload.get("data", "")).strip()
    if not data_str:
        return _err("Enter comma-separated numbers, e.g.: 2, 4, 4, 4, 5, 5, 7, 9")
    try:
        data = [float(x.strip()) for x in data_str.split(",") if x.strip()]
        if not data:
            return _err("No valid numbers found")
        n = len(data)
        sorted_data = sorted(data)
        mean = sum(data) / n
        median = sorted_data[n // 2] if n % 2 == 1 else (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
        # Mode
        from collections import Counter
        cnt = Counter(data)
        max_count = max(cnt.values())
        mode = [k for k, v in cnt.items() if v == max_count]
        # Variance and std dev (population)
        variance = sum((x - mean) ** 2 for x in data) / n
        std_dev = math.sqrt(variance)
        # Sample std dev
        sample_variance = sum((x - mean) ** 2 for x in data) / (n - 1) if n > 1 else 0
        sample_std_dev = math.sqrt(sample_variance)
        # Range, IQR
        data_range = sorted_data[-1] - sorted_data[0]
        q1 = sorted_data[n // 4]
        q3 = sorted_data[(3 * n) // 4]
        iqr = q3 - q1
        return _json({
            "count": n,
            "sum": round(sum(data), 6),
            "mean": round(mean, 6),
            "median": round(median, 6),
            "mode": mode,
            "min": sorted_data[0],
            "max": sorted_data[-1],
            "range": round(data_range, 6),
            "variance": round(variance, 6),
            "std_dev_population": round(std_dev, 6),
            "std_dev_sample": round(sample_std_dev, 6),
            "q1": round(q1, 6),
            "q3": round(q3, 6),
            "iqr": round(iqr, 6),
            "sorted": sorted_data,
            "message": f"n={n} | Mean={round(mean, 3)} | Median={round(median, 3)} | Std Dev={round(std_dev, 3)}",
        })
    except ValueError as e:
        return _err(str(e))

MEGA_NEW_HANDLERS["statistics-calculator"] = _handle_statistics_calculator


def _handle_json_formatter(files, payload):
    """Format, minify and validate JSON."""
    json_str = str(payload.get("json", "") or payload.get("text", "")).strip()
    action = str(payload.get("action", "format")).lower()
    if not json_str:
        return _err("Enter JSON text to format or validate")
    try:
        parsed = json.loads(json_str)
        if action == "minify":
            result = json.dumps(parsed, separators=(",", ":"), ensure_ascii=False)
            action_message = "minified"
        elif action == "sort_keys":
            result = json.dumps(parsed, indent=2, sort_keys=True, ensure_ascii=False)
            action_message = "sorted by keys"
        else:
            result = json.dumps(parsed, indent=2, ensure_ascii=False)
            action_message = "formatted"
        return _json({
            "formatted": result,
            "valid": True,
            "original_length": len(json_str),
            "formatted_length": len(result),
            "action": action,
            "message": f"JSON is valid and {action_message} successfully",
        })
    except json.JSONDecodeError as e:
        return _json({"valid": False, "error": str(e), "message": f"Invalid JSON: {e}"})

MEGA_NEW_HANDLERS["json-formatter"] = _handle_json_formatter


def _handle_uuid_generator(files, payload):
    """Generate UUIDs v1 and v4."""
    import uuid
    from .handlers import coerce_int
    count = coerce_int(payload.get("count"), default=5, lo=1, hi=50)
    version = coerce_int(payload.get("version"), default=4, lo=1, hi=5)
    uuids = []
    for _ in range(count):
        if version == 1:
            uuids.append(str(uuid.uuid1()))
        else:
            uuids.append(str(uuid.uuid4()))
    return _json({
        "uuids": uuids,
        "version": version,
        "count": count,
        "message": f"Generated {count} UUID v{version}",
    })

MEGA_NEW_HANDLERS["uuid-generator"] = _handle_uuid_generator


def _handle_base64_tool(files, payload):
    """Encode or decode Base64."""
    import base64
    action = str(payload.get("action", "encode")).lower()
    text = str(payload.get("text", "")).strip()
    if not text:
        return _err("Enter text to encode or decode")
    try:
        if action == "encode":
            result = base64.b64encode(text.encode("utf-8")).decode("ascii")
            return _json({"action": "encode", "input": text, "output": result, "message": "Base64 encoded"})
        elif action == "decode":
            result = base64.b64decode(text.encode("ascii")).decode("utf-8")
            return _json({"action": "decode", "input": text, "output": result, "message": "Base64 decoded"})
        elif action == "url_encode":
            result = base64.urlsafe_b64encode(text.encode("utf-8")).decode("ascii")
            return _json({"action": "url_encode", "input": text, "output": result, "message": "URL-safe Base64 encoded"})
        else:
            return _err("Unknown action. Use: encode, decode, url_encode")
    except Exception as e:
        return _err(f"Base64 error: {e}")

MEGA_NEW_HANDLERS["base64-tool"] = _handle_base64_tool


def _handle_fitness_goal_calculator(files, payload):
    """Calculate time to reach a fitness goal based on current stats."""
    try:
        current_weight = float(payload.get("current_weight", 0))
        goal_weight = float(payload.get("goal_weight", 0))
        weekly_loss = float(payload.get("weekly_loss_rate", 0.5))
        unit = str(payload.get("unit", "kg")).strip().lower()

        if current_weight <= 0 or goal_weight <= 0:
            return _err("Enter valid current and goal weights")
        if weekly_loss <= 0:
            weekly_loss = 0.5

        diff = abs(current_weight - goal_weight)
        weeks = diff / weekly_loss
        months = weeks / 4.33
        days = weeks * 7
        direction = "lose" if current_weight > goal_weight else "gain"

        unit_label = "kg" if unit == "kg" else "lbs"
        daily_calorie_change = round(weekly_loss * (7700 if unit == "kg" else 3500) / 7)

        return _json({
            "current_weight": f"{current_weight} {unit_label}",
            "goal_weight": f"{goal_weight} {unit_label}",
            f"weight_to_{direction}": f"{diff:.1f} {unit_label}",
            "weekly_rate": f"{weekly_loss} {unit_label}/week",
            "estimated_weeks": round(weeks, 1),
            "estimated_months": round(months, 1),
            "estimated_days": round(days),
            "daily_calorie_change": f"~{daily_calorie_change} kcal/day",
            "direction": direction.capitalize(),
            "message": f"At {weekly_loss} {unit_label}/week, you'll {direction} {diff:.1f} {unit_label} in about {round(weeks, 1)} weeks ({round(months, 1)} months).",
            "tips": [
                "Stay consistent with your diet and exercise plan",
                "Track progress weekly, not daily",
                "Adjust plan if results plateau for 2+ weeks",
                "Aim for sustainable changes over quick results",
            ],
        })
    except Exception as e:
        return _err(f"Calculation error: {e}")

MEGA_NEW_HANDLERS["fitness-goal-calculator"] = _handle_fitness_goal_calculator


def _handle_formal_letter_generator(files, payload):
    """Generate a professional formal letter."""
    sender_name = str(payload.get("sender_name", "")).strip()
    sender_address = str(payload.get("sender_address", "")).strip()
    recipient_name = str(payload.get("recipient_name", "")).strip()
    recipient_designation = str(payload.get("recipient_designation", "")).strip()
    recipient_organization = str(payload.get("recipient_organization", "")).strip()
    subject = str(payload.get("subject", "")).strip()
    body = str(payload.get("body", "")).strip()
    letter_type = str(payload.get("letter_type", "general")).strip().lower()
    date_str = str(payload.get("date", "")).strip()

    if not sender_name:
        return _err("Please enter your name")
    if not subject:
        return _err("Please enter the letter subject")
    if not body:
        return _err("Please enter the letter body/content")

    from datetime import date
    today = date.today().strftime("%d %B %Y") if not date_str else date_str

    salutation = f"Dear {recipient_name}," if recipient_name else "Dear Sir/Madam,"
    recipient_block = ""
    if recipient_name:
        recipient_block = recipient_name
        if recipient_designation:
            recipient_block += f"\n{recipient_designation}"
        if recipient_organization:
            recipient_block += f"\n{recipient_organization}"

    letter = f"""{sender_name}
{sender_address if sender_address else '[Your Address]'}

{today}

{recipient_block if recipient_block else '[Recipient Name]'}

{salutation}

Subject: {subject}

{body}

Yours sincerely,

{sender_name}"""

    return _json({
        "letter": letter,
        "subject": subject,
        "letter_type": letter_type.replace("-", " ").title(),
        "character_count": len(letter),
        "word_count": len(letter.split()),
        "message": "Formal letter generated successfully",
        "tips": [
            "Review and customize the letter before sending",
            "Print on official letterhead if available",
            "Keep a copy for your records",
            "Use a professional font like Times New Roman or Arial",
        ],
    })

MEGA_NEW_HANDLERS["formal-letter-generator"] = _handle_formal_letter_generator


def _handle_readability_analyzer(files, payload):
    """Analyze text readability using Flesch-Kincaid and other metrics."""
    text = str(payload.get("text", payload.get("content", ""))).strip()
    if not text:
        return _err("Please enter text to analyze")

    import re
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    words = text.split()
    sentence_count = max(len(sentences), 1)
    word_count = len(words)

    if word_count < 3:
        return _err("Please enter at least a few sentences to analyze readability")

    syllable_count = 0
    for word in words:
        word = word.lower().strip(".,;:!?\"'")
        vowels = "aeiouy"
        count = 0
        prev_vowel = False
        for ch in word:
            is_vowel = ch in vowels
            if is_vowel and not prev_vowel:
                count += 1
            prev_vowel = is_vowel
        syllable_count += max(1, count)

    avg_sentence_length = word_count / sentence_count
    avg_syllables_per_word = syllable_count / max(word_count, 1)

    flesch = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
    flesch = round(max(0, min(100, flesch)), 1)

    fk_grade = 0.39 * avg_sentence_length + 11.8 * avg_syllables_per_word - 15.59
    fk_grade = round(max(1, min(18, fk_grade)), 1)

    if flesch >= 90:
        level = "Very Easy"
        audience = "5th grade / Elementary school"
    elif flesch >= 80:
        level = "Easy"
        audience = "6th grade / Middle school"
    elif flesch >= 70:
        level = "Fairly Easy"
        audience = "7th grade"
    elif flesch >= 60:
        level = "Standard"
        audience = "8th–9th grade / High school"
    elif flesch >= 50:
        level = "Fairly Difficult"
        audience = "10th–12th grade / High school seniors"
    elif flesch >= 30:
        level = "Difficult"
        audience = "College level"
    else:
        level = "Very Confusing"
        audience = "Professional / Expert level"

    long_words = [w for w in words if len(w) > 6]
    long_sentences = [s for s in sentences if len(s.split()) > 25]

    return _json({
        "flesch_reading_ease": flesch,
        "flesch_kincaid_grade": fk_grade,
        "readability_level": level,
        "target_audience": audience,
        "word_count": word_count,
        "sentence_count": sentence_count,
        "syllable_count": syllable_count,
        "avg_words_per_sentence": round(avg_sentence_length, 1),
        "avg_syllables_per_word": round(avg_syllables_per_word, 2),
        "long_words_count": len(long_words),
        "long_sentences_count": len(long_sentences),
        "message": f"Readability: {level} (Flesch score: {flesch}/100, Grade level: {fk_grade})",
        "suggestions": [
            "Use shorter sentences (aim for 15–20 words each)" if avg_sentence_length > 20 else "Sentence length is good",
            "Simplify complex words where possible" if len(long_words) > word_count * 0.2 else "Vocabulary complexity is appropriate",
            "Break long paragraphs into smaller chunks for better readability",
        ],
    })

MEGA_NEW_HANDLERS["readability-analyzer"] = _handle_readability_analyzer
MEGA_NEW_HANDLERS["text-readability-analyzer"] = _handle_readability_analyzer


def _handle_ideal_weight_alias(files, payload):
    """Alias for ideal-weight handler."""
    return _handle_ideal_weight(files, payload)

MEGA_NEW_HANDLERS["ideal-weight-calculator"] = _handle_ideal_weight_alias


def _handle_exercise_calories_alias(files, payload):
    """Alias for exercise-calories handler — delegates to health_finance_handlers."""
    try:
        weight = float(payload.get("weight", payload.get("body_weight", 70)))
        duration = float(payload.get("duration", payload.get("minutes", 30)))
        activity = str(payload.get("activity", payload.get("exercise_type", "walking"))).lower().strip()

        met_values = {
            "walking": 3.5, "running": 8.0, "jogging": 7.0,
            "cycling": 6.0, "swimming": 6.0, "yoga": 2.5,
            "weightlifting": 3.5, "weight training": 3.5, "gym": 4.5,
            "aerobics": 6.0, "dancing": 4.5, "football": 8.0,
            "basketball": 6.5, "badminton": 5.5, "cricket": 4.0,
            "skipping": 8.0, "jump rope": 8.0, "pilates": 3.0,
            "hiking": 5.3, "stair climbing": 8.0, "rowing": 7.0,
            "zumba": 6.5, "crossfit": 9.0, "elliptical": 5.0,
        }
        met = met_values.get(activity, 4.0)
        calories = round((met * weight * duration) / 60)

        return _json({
            "activity": activity.title(),
            "duration_minutes": duration,
            "body_weight_kg": weight,
            "calories_burned": calories,
            "met_value": met,
            "calories_per_minute": round(calories / max(duration, 1), 1),
            "message": f"{calories} calories burned during {int(duration)} min of {activity.title()}",
            "equivalent_to": f"~{round(calories/500, 1)} large samosas or {round(calories/75, 1)} glasses of juice",
        })
    except Exception as e:
        return _err(f"Calculation error: {e}")

MEGA_NEW_HANDLERS["exercise-calories-calculator"] = _handle_exercise_calories_alias


def _handle_email_validator_tool(files, payload):
    """Validate email address format."""
    import re
    email = str(payload.get("email", payload.get("text", ""))).strip()
    if not email:
        return _err("Please enter an email address to validate")

    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    is_valid = bool(re.match(pattern, email))

    parts = email.split("@") if "@" in email else [email, ""]
    local = parts[0]
    domain = parts[1] if len(parts) > 1 else ""

    issues = []
    if not "@" in email:
        issues.append("Missing @ symbol")
    elif email.count("@") > 1:
        issues.append("Multiple @ symbols found")
    if domain and "." not in domain:
        issues.append("Domain has no TLD (e.g., .com, .in)")
    if local and (local.startswith(".") or local.endswith(".")):
        issues.append("Local part cannot start or end with a dot")
    if len(email) > 254:
        issues.append("Email address too long (max 254 characters)")
    if " " in email:
        issues.append("Email cannot contain spaces")

    common_domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "rediffmail.com"]
    suggestion = None
    if domain and not is_valid:
        for d in common_domains:
            if domain.replace(".", "").startswith(d.replace(".", "")[:4]):
                suggestion = f"{local}@{d}"
                break

    return _json({
        "email": email,
        "is_valid": is_valid,
        "local_part": local,
        "domain": domain,
        "issues": issues if issues else ["No issues found"],
        "suggestion": suggestion,
        "message": f"✓ Valid email address" if is_valid else f"✗ Invalid email: {', '.join(issues) if issues else 'format error'}",
    })

MEGA_NEW_HANDLERS["email-validator-tool"] = _handle_email_validator_tool


def register_mega_new_handlers() -> int:
    """Register all mega new handlers into the main HANDLERS dict."""
    registered = 0
    for slug, handler in MEGA_NEW_HANDLERS.items():
        if slug not in HANDLERS:
            HANDLERS[slug] = handler
            registered += 1
    return registered
