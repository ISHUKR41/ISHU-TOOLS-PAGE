"""
Unit converter pack — high-SEO numeric converters.
One slug-keyed handler. Pure stdlib, instant, no errors.
"""
from __future__ import annotations
import math
from typing import Callable, Dict, Tuple
from .handlers import ExecutionResult


# ─── Conversion table ──────────────────────────────────────────────────────
# Map slug -> (label_from, label_to, fn(value)->value, decimals)
def _f(factor: float):
    return lambda v: v * factor


# Temperature uses formulas, not factors
_TEMP: Dict[str, Tuple[str, str, Callable[[float], float]]] = {
    "celsius-to-fahrenheit":   ("°C", "°F", lambda c: c * 9 / 5 + 32),
    "fahrenheit-to-celsius":   ("°F", "°C", lambda f: (f - 32) * 5 / 9),
    "celsius-to-kelvin":       ("°C", "K",  lambda c: c + 273.15),
    "kelvin-to-celsius":       ("K",  "°C", lambda k: k - 273.15),
    "fahrenheit-to-kelvin":    ("°F", "K",  lambda f: (f - 32) * 5 / 9 + 273.15),
    "kelvin-to-fahrenheit":    ("K",  "°F", lambda k: (k - 273.15) * 9 / 5 + 32),
    "rankine-to-celsius":      ("°R", "°C", lambda r: (r - 491.67) * 5 / 9),
    "celsius-to-rankine":      ("°C", "°R", lambda c: (c + 273.15) * 9 / 5),
}

# Linear (factor-based) units: from_unit, to_unit, factor
_LINEAR: Dict[str, Tuple[str, str, float]] = {
    # ─── Length ─────────────────────────────────────────────────────────
    "cm-to-inches":     ("cm", "in",  0.393700787),
    "inches-to-cm":     ("in", "cm",  2.54),
    "mm-to-inches":     ("mm", "in",  0.0393700787),
    "inches-to-mm":     ("in", "mm",  25.4),
    "m-to-feet":        ("m",  "ft",  3.28083989501),
    "feet-to-m":        ("ft", "m",   0.3048),
    "feet-to-meters":   ("ft", "m",   0.3048),
    "meters-to-feet":   ("m",  "ft",  3.28083989501),
    "km-to-miles":      ("km", "mi",  0.621371192),
    "miles-to-km":      ("mi", "km",  1.609344),
    "yards-to-meters":  ("yd", "m",   0.9144),
    "meters-to-yards":  ("m",  "yd",  1.0936132983),
    "feet-to-inches":   ("ft", "in",  12.0),
    "inches-to-feet":   ("in", "ft",  1 / 12.0),
    "cm-to-mm":         ("cm", "mm",  10.0),
    "mm-to-cm":         ("mm", "cm",  0.1),
    "m-to-cm":          ("m",  "cm",  100.0),
    "cm-to-m":          ("cm", "m",   0.01),
    "km-to-m":          ("km", "m",   1000.0),
    "m-to-km":          ("m",  "km",  0.001),
    "miles-to-feet":    ("mi", "ft",  5280.0),
    "feet-to-miles":    ("ft", "mi",  1 / 5280.0),
    "nautical-miles-to-km": ("nmi", "km", 1.852),
    "km-to-nautical-miles": ("km", "nmi", 1 / 1.852),

    # ─── Weight / Mass ──────────────────────────────────────────────────
    "kg-to-lbs":        ("kg", "lbs", 2.2046226218),
    "lbs-to-kg":        ("lbs", "kg", 0.45359237),
    "kg-to-pounds":     ("kg", "lbs", 2.2046226218),
    "pounds-to-kg":     ("lbs", "kg", 0.45359237),
    "g-to-oz":          ("g",  "oz",  0.0352739619),
    "oz-to-g":          ("oz", "g",   28.349523125),
    "grams-to-ounces":  ("g",  "oz",  0.0352739619),
    "ounces-to-grams":  ("oz", "g",   28.349523125),
    "kg-to-g":          ("kg", "g",   1000.0),
    "g-to-kg":          ("g",  "kg",  0.001),
    "lbs-to-oz":        ("lbs", "oz", 16.0),
    "oz-to-lbs":        ("oz", "lbs", 1 / 16.0),
    "mg-to-g":          ("mg", "g",   0.001),
    "g-to-mg":          ("g",  "mg",  1000.0),
    "tons-to-kg":       ("t",  "kg",  1000.0),
    "kg-to-tons":       ("kg", "t",   0.001),
    "stones-to-kg":     ("st", "kg",  6.35029318),
    "kg-to-stones":     ("kg", "st",  0.157473044),
    "stones-to-pounds": ("st", "lbs", 14.0),
    "pounds-to-stones": ("lbs", "st", 1 / 14.0),

    # ─── Volume ─────────────────────────────────────────────────────────
    "liters-to-gallons":   ("L",  "gal", 0.264172052),  # US gallons
    "gallons-to-liters":   ("gal", "L",  3.785411784),
    "ml-to-oz":            ("ml", "fl oz", 0.0338140227),
    "oz-to-ml":            ("fl oz", "ml", 29.5735295625),
    "cups-to-ml":          ("cup", "ml", 236.588),
    "ml-to-cups":          ("ml", "cup", 1 / 236.588),
    "liters-to-ml":        ("L",  "ml",  1000.0),
    "ml-to-liters":        ("ml", "L",   0.001),
    "tablespoons-to-ml":   ("tbsp", "ml", 14.7868),
    "teaspoons-to-ml":     ("tsp", "ml", 4.92892),
    "ml-to-tablespoons":   ("ml", "tbsp", 1 / 14.7868),
    "ml-to-teaspoons":     ("ml", "tsp", 1 / 4.92892),
    "pints-to-liters":     ("pt", "L",  0.473176473),
    "liters-to-pints":     ("L",  "pt", 2.11337641887),
    "quarts-to-liters":    ("qt", "L",  0.946352946),
    "liters-to-quarts":    ("L",  "qt", 1.05668820943),

    # ─── Speed ──────────────────────────────────────────────────────────
    "kmh-to-mph":       ("km/h", "mph",  0.621371192),
    "mph-to-kmh":       ("mph",  "km/h", 1.609344),
    "ms-to-kmh":        ("m/s",  "km/h", 3.6),
    "kmh-to-ms":        ("km/h", "m/s",  1 / 3.6),
    "ms-to-mph":        ("m/s",  "mph",  2.2369362921),
    "mph-to-ms":        ("mph",  "m/s",  0.44704),
    "knots-to-mph":     ("kn",   "mph",  1.150779448),
    "mph-to-knots":     ("mph",  "kn",   0.868976242),
    "knots-to-kmh":     ("kn",   "km/h", 1.852),
    "kmh-to-knots":     ("km/h", "kn",   0.539956803),

    # ─── Time ───────────────────────────────────────────────────────────
    "seconds-to-minutes": ("s",  "min", 1 / 60),
    "minutes-to-seconds": ("min", "s",  60),
    "minutes-to-hours":   ("min", "h",  1 / 60),
    "hours-to-minutes":   ("h",  "min", 60),
    "hours-to-seconds":   ("h",  "s",   3600),
    "seconds-to-hours":   ("s",  "h",   1 / 3600),
    "hours-to-days":      ("h",  "d",   1 / 24),
    "days-to-hours":      ("d",  "h",   24),
    "days-to-weeks":      ("d",  "wk",  1 / 7),
    "weeks-to-days":      ("wk", "d",   7),
    "days-to-months":     ("d",  "mo",  1 / 30.4375),
    "months-to-days":     ("mo", "d",   30.4375),
    "days-to-years":      ("d",  "yr",  1 / 365.25),
    "years-to-days":      ("yr", "d",   365.25),
    "weeks-to-months":    ("wk", "mo",  7 / 30.4375),
    "months-to-weeks":    ("mo", "wk",  30.4375 / 7),
    "milliseconds-to-seconds": ("ms", "s", 0.001),
    "seconds-to-milliseconds": ("s", "ms", 1000),

    # ─── Data / Storage ─────────────────────────────────────────────────
    "bytes-to-kb":      ("B",   "KB",  1 / 1024),
    "kb-to-bytes":      ("KB",  "B",   1024),
    "kb-to-mb":         ("KB",  "MB",  1 / 1024),
    "mb-to-kb":         ("MB",  "KB",  1024),
    "mb-to-gb":         ("MB",  "GB",  1 / 1024),
    "gb-to-mb":         ("GB",  "MB",  1024),
    "gb-to-tb":         ("GB",  "TB",  1 / 1024),
    "tb-to-gb":         ("TB",  "GB",  1024),
    "tb-to-pb":         ("TB",  "PB",  1 / 1024),
    "pb-to-tb":         ("PB",  "TB",  1024),
    "bits-to-bytes":    ("bit", "B",   1 / 8),
    "bytes-to-bits":    ("B",   "bit", 8),
    "mb-to-bytes":      ("MB",  "B",   1024 * 1024),
    "gb-to-bytes":      ("GB",  "B",   1024 ** 3),
    "kbps-to-mbps":     ("Kbps", "Mbps", 0.001),
    "mbps-to-kbps":     ("Mbps", "Kbps", 1000),
    "mbps-to-gbps":     ("Mbps", "Gbps", 0.001),
    "gbps-to-mbps":     ("Gbps", "Mbps", 1000),

    # ─── Area ───────────────────────────────────────────────────────────
    "sqft-to-sqm":      ("sq ft", "sq m", 0.09290304),
    "sqm-to-sqft":      ("sq m", "sq ft", 10.7639104),
    "acres-to-hectares": ("acre", "ha", 0.40468564224),
    "hectares-to-acres": ("ha", "acre", 2.47105381),
    "acres-to-sqft":    ("acre", "sq ft", 43560),
    "sqft-to-acres":    ("sq ft", "acre", 1 / 43560),
    "sqm-to-acres":     ("sq m", "acre", 0.000247105),
    "sqkm-to-sqmiles":  ("sq km", "sq mi", 0.386102),
    "sqmiles-to-sqkm":  ("sq mi", "sq km", 2.589988),

    # ─── Pressure ───────────────────────────────────────────────────────
    "psi-to-bar":       ("psi", "bar", 0.0689475729),
    "bar-to-psi":       ("bar", "psi", 14.5037738),
    "atm-to-psi":       ("atm", "psi", 14.6959488),
    "psi-to-atm":       ("psi", "atm", 0.0680459639),
    "pa-to-psi":        ("Pa",  "psi", 0.000145037738),
    "psi-to-pa":        ("psi", "Pa",  6894.75729),
    "kpa-to-psi":       ("kPa", "psi", 0.145037738),
    "psi-to-kpa":       ("psi", "kPa", 6.89475729),
    "bar-to-kpa":       ("bar", "kPa", 100),
    "kpa-to-bar":       ("kPa", "bar", 0.01),

    # ─── Energy ─────────────────────────────────────────────────────────
    "joules-to-calories":  ("J", "cal", 0.239005736),
    "calories-to-joules":  ("cal", "J", 4.184),
    "kj-to-kcal":          ("kJ", "kcal", 0.239005736),
    "kcal-to-kj":          ("kcal", "kJ", 4.184),
    "kwh-to-joules":       ("kWh", "J", 3_600_000),
    "joules-to-kwh":       ("J", "kWh", 1 / 3_600_000),
    "btu-to-joules":       ("BTU", "J", 1055.06),
    "joules-to-btu":       ("J", "BTU", 1 / 1055.06),

    # ─── Power ──────────────────────────────────────────────────────────
    "watts-to-hp":      ("W",  "hp", 0.00134102209),
    "hp-to-watts":      ("hp", "W",  745.69987158),
    "kw-to-hp":         ("kW", "hp", 1.34102209),
    "hp-to-kw":         ("hp", "kW", 0.7457),

    # ─── Angle ──────────────────────────────────────────────────────────
    "degrees-to-radians": ("°", "rad", math.pi / 180),
    "radians-to-degrees": ("rad", "°", 180 / math.pi),

    # ─── Frequency ──────────────────────────────────────────────────────
    "hz-to-khz":        ("Hz",  "kHz", 0.001),
    "khz-to-hz":        ("kHz", "Hz",  1000),
    "khz-to-mhz":       ("kHz", "MHz", 0.001),
    "mhz-to-khz":       ("MHz", "kHz", 1000),
    "mhz-to-ghz":       ("MHz", "GHz", 0.001),
    "ghz-to-mhz":       ("GHz", "MHz", 1000),

    # ─── Fuel economy ───────────────────────────────────────────────────
    "mpg-to-kmpl":      ("mpg", "km/L", 0.425144),
    "kmpl-to-mpg":      ("km/L", "mpg", 2.35215),
}


def _fmt(value: float) -> str:
    """Format with smart precision — drop trailing zeros."""
    if value == 0:
        return "0"
    abs_v = abs(value)
    if abs_v >= 1_000_000 or abs_v < 0.001:
        s = f"{value:.6e}"
    elif abs_v >= 100:
        s = f"{value:.4f}"
    else:
        s = f"{value:.6f}"
    if "." in s and "e" not in s:
        s = s.rstrip("0").rstrip(".")
    return s or "0"


def _parse_value(payload: dict) -> float:
    """Extract the numeric input from any common field name."""
    for key in ("value", "number", "input", "amount", "qty", "quantity", "text"):
        v = payload.get(key)
        if v is None or v == "":
            continue
        if isinstance(v, (int, float)):
            return float(v)
        try:
            # strip commas, spaces, and unit suffixes
            s = str(v).strip().replace(",", "").split()[0]
            return float(s)
        except (ValueError, IndexError):
            continue
    raise ValueError("Please enter a numeric value to convert.")


def _convert(slug: str, payload: dict) -> ExecutionResult:
    try:
        value = _parse_value(payload or {})
    except ValueError as e:
        return ExecutionResult(kind="json", message=str(e), data={"error": str(e)})

    if slug in _TEMP:
        unit_from, unit_to, fn = _TEMP[slug]
        result = fn(value)
    elif slug in _LINEAR:
        unit_from, unit_to, factor = _LINEAR[slug]
        result = value * factor
    else:
        return ExecutionResult(
            kind="json",
            message=f"Unknown converter: {slug}",
            data={"error": f"Unknown converter: {slug}"},
        )

    formatted = _fmt(result)
    line = f"{_fmt(value)} {unit_from} = {formatted} {unit_to}"
    return ExecutionResult(
        kind="json",
        message=f"✅ {line}",
        data={
            "input": value,
            "output": result,
            "formatted": formatted,
            "from_unit": unit_from,
            "to_unit": unit_to,
            "expression": line,
            "result": line,
            "text": line,
        },
    )


# Build the handler dict (one closure per slug)
def _make_handler(slug: str):
    def handler(files, payload, _job=None):
        return _convert(slug, payload or {})
    return handler


UNIT_CONVERTER_HANDLERS: Dict[str, Callable] = {}
for _slug in list(_TEMP.keys()) + list(_LINEAR.keys()):
    UNIT_CONVERTER_HANDLERS[_slug] = _make_handler(_slug)

# Public list for registry to iterate
ALL_UNIT_SLUGS = list(UNIT_CONVERTER_HANDLERS.keys())
