"""
One-shot rewriter: enrich every unit-converter tool definition with a
unique title (showing symbols), real conversion formula and a worked
example. Updates BOTH backend/app/registry.py (_UNIT_DEFS rows) AND
frontend/src/data/catalogFallback.ts (entries with category "unit-converter"
whose slug matches the `<from>-to-<to>` pattern).

Safe to run repeatedly — idempotent (it always rewrites from the canonical
slug, and skips slugs whose units it doesn't recognise).
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "backend" / "app" / "registry.py"
FALLBACK = ROOT / "frontend" / "src" / "data" / "catalogFallback.ts"

# (display_name, plain_name, symbol)
U = {
    # Temperature
    "celsius":     ("Celsius",            "celsius",        "°C"),
    "fahrenheit":  ("Fahrenheit",         "fahrenheit",     "°F"),
    "kelvin":      ("Kelvin",             "kelvin",         "K"),
    "rankine":     ("Rankine",            "rankine",        "°R"),
    # Length
    "cm":          ("Centimeters",        "centimeters",    "cm"),
    "mm":          ("Millimeters",        "millimeters",    "mm"),
    "m":           ("Meters",             "meters",         "m"),
    "meters":      ("Meters",             "meters",         "m"),
    "km":          ("Kilometers",         "kilometers",     "km"),
    "inches":      ("Inches",             "inches",         "in"),
    "feet":        ("Feet",               "feet",           "ft"),
    "miles":       ("Miles",              "miles",          "mi"),
    "yards":       ("Yards",              "yards",          "yd"),
    "nm":          ("Nanometers",         "nanometers",     "nm"),
    # Weight / mass
    "kg":          ("Kilograms",          "kilograms",      "kg"),
    "g":           ("Grams",              "grams",          "g"),
    "lbs":         ("Pounds",             "pounds",         "lb"),
    "pounds":      ("Pounds",             "pounds",         "lb"),
    "oz":          ("Ounces",             "ounces",         "oz"),
    "ounces":      ("Ounces",             "ounces",         "oz"),
    "grams":       ("Grams",              "grams",          "g"),
    "stone":       ("Stone",              "stone",          "st"),
    "tons":        ("Metric Tons",        "metric tons",    "t"),
    # Volume
    "ml":          ("Milliliters",        "milliliters",    "mL"),
    "liters":      ("Liters",             "liters",         "L"),
    "gallons":     ("US Gallons",         "US gallons",     "gal"),
    "cups":        ("US Cups",            "US cups",        "cup"),
    "tablespoons": ("Tablespoons",        "tablespoons",    "tbsp"),
    "teaspoons":   ("Teaspoons",          "teaspoons",      "tsp"),
    "pints":       ("US Pints",           "US pints",       "pt"),
    "quarts":      ("US Quarts",          "US quarts",      "qt"),
    # Area
    "sqft":        ("Square Feet",        "square feet",    "sq ft"),
    "sqm":         ("Square Meters",      "square meters",  "sq m"),
    "sqkm":        ("Square Kilometers",  "square km",      "sq km"),
    "sqmi":        ("Square Miles",       "square miles",   "sq mi"),
    "acres":       ("Acres",              "acres",          "ac"),
    "hectares":    ("Hectares",           "hectares",       "ha"),
    # Pressure
    "psi":         ("PSI",                "pounds per sq inch", "psi"),
    "bar":         ("Bar",                "bar",            "bar"),
    "atm":         ("Atmospheres",        "atmospheres",    "atm"),
    "pa":          ("Pascals",            "pascals",        "Pa"),
    "kpa":         ("Kilopascals",        "kilopascals",    "kPa"),
    "mpa":         ("Megapascals",        "megapascals",    "MPa"),
    "torr":        ("Torr",               "torr",           "Torr"),
    "mmhg":        ("mmHg",               "mmHg",           "mmHg"),
    # Speed
    "mph":         ("Miles per Hour",     "mph",            "mph"),
    "kmh":         ("Kilometers per Hour","km/h",           "km/h"),
    "kmph":        ("Kilometers per Hour","km/h",           "km/h"),
    "knots":       ("Knots",              "knots",          "kn"),
    "mps":         ("Meters per Second",  "m/s",            "m/s"),
    "fps":         ("Feet per Second",    "ft/s",           "ft/s"),
    # Data size
    "b":           ("Bits",               "bits",           "b"),
    "bytes":       ("Bytes",              "bytes",          "B"),
    "kb":          ("Kilobytes",          "kilobytes",      "KB"),
    "mb":          ("Megabytes",          "megabytes",      "MB"),
    "gb":          ("Gigabytes",          "gigabytes",      "GB"),
    "tb":          ("Terabytes",          "terabytes",      "TB"),
    "pb":          ("Petabytes",          "petabytes",      "PB"),
    # Time
    "ms":          ("Milliseconds",       "milliseconds",   "ms"),
    "seconds":     ("Seconds",            "seconds",        "sec"),
    "minutes":     ("Minutes",            "minutes",        "min"),
    "hours":       ("Hours",              "hours",          "hr"),
    "days":        ("Days",               "days",           "d"),
    "weeks":       ("Weeks",              "weeks",          "wk"),
    "months":      ("Months",             "months",         "mo"),
    "years":       ("Years",              "years",          "yr"),
    # Energy
    "joules":      ("Joules",             "joules",         "J"),
    "calories":    ("Calories",           "calories",       "cal"),
    "kj":          ("Kilojoules",         "kilojoules",     "kJ"),
    "kcal":        ("Kilocalories",       "kilocalories",   "kcal"),
    "wh":          ("Watt-hours",         "watt-hours",     "Wh"),
    "kwh":         ("Kilowatt-hours",     "kilowatt-hours", "kWh"),
    "btu":         ("BTU",                "BTU",            "BTU"),
    # Power
    "watts":       ("Watts",              "watts",          "W"),
    "kw":          ("Kilowatts",          "kilowatts",      "kW"),
    "hp":          ("Horsepower",         "horsepower",     "hp"),
    # Frequency
    "hz":          ("Hertz",              "hertz",          "Hz"),
    "khz":         ("Kilohertz",          "kilohertz",      "kHz"),
    "mhz":         ("Megahertz",          "megahertz",      "MHz"),
    "ghz":         ("Gigahertz",          "gigahertz",      "GHz"),
    # Fuel economy
    "mpg":         ("Miles per Gallon",   "mpg",            "mpg"),
    "kmpl":        ("Kilometers per Liter","km/L",          "km/L"),
    "lp100km":     ("L/100km",            "L per 100km",    "L/100km"),
    # Angles
    "degrees":     ("Degrees",            "degrees",        "°"),
    "radians":     ("Radians",            "radians",        "rad"),
    # Aliases / extras
    "nautical_miles": ("Nautical Miles",  "nautical miles", "nmi"),
    "nautical-miles": ("Nautical Miles",  "nautical miles", "nmi"),
    "mg":          ("Milligrams",         "milligrams",     "mg"),
    "stones":      ("Stones",             "stones",         "st"),
    "milliseconds":("Milliseconds",       "milliseconds",   "ms"),
    "bits":        ("Bits",               "bits",           "b"),
    "kbps":        ("Kilobits per Second","kilobits/sec",   "kbps"),
    "mbps":        ("Megabits per Second","megabits/sec",   "Mbps"),
    "gbps":        ("Gigabits per Second","gigabits/sec",   "Gbps"),
    "sqmiles":     ("Square Miles",       "square miles",   "sq mi"),
}

# Linear scale conversions: F = factor * X (for non-temperature units).
# Keys are (from_slug, to_slug). Provide one direction; reverse is auto.
FACT: dict[tuple[str, str], float] = {
    # Length
    ("inches", "cm"): 2.54,
    ("inches", "mm"): 25.4,
    ("feet", "m"): 0.3048,
    ("feet", "meters"): 0.3048,
    ("miles", "km"): 1.609344,
    ("yards", "m"): 0.9144,
    ("nm", "m"): 1e-9,
    ("m", "cm"): 100, ("km", "m"): 1000, ("mm", "cm"): 0.1,
    # Mass
    ("lbs", "kg"): 0.45359237,
    ("pounds", "kg"): 0.45359237,
    ("oz", "g"): 28.349523125,
    ("ounces", "grams"): 28.349523125,
    ("stone", "kg"): 6.35029318,
    ("tons", "kg"): 1000,
    ("kg", "g"): 1000,
    # Volume (US)
    ("gallons", "liters"): 3.785411784,
    ("cups", "ml"): 236.5882365,
    ("tablespoons", "ml"): 14.78676478,
    ("teaspoons", "ml"): 4.92892159,
    ("pints", "ml"): 473.176473,
    ("quarts", "ml"): 946.352946,
    ("liters", "ml"): 1000,
    ("oz", "ml"): 29.5735295625,   # US fluid oz
    ("ml", "oz"): 1 / 29.5735295625,
    # Area
    ("sqft", "sqm"): 0.09290304,
    ("sqmi", "sqkm"): 2.589988,
    ("acres", "hectares"): 0.40468564224,
    ("acres", "sqm"): 4046.8564224,
    ("hectares", "sqm"): 10000,
    # Pressure
    ("psi", "bar"): 0.0689475729,
    ("psi", "kpa"): 6.89475729,
    ("psi", "pa"): 6894.75729,
    ("atm", "pa"): 101325,
    ("atm", "bar"): 1.01325,
    ("kpa", "pa"): 1000,
    ("mpa", "pa"): 1_000_000,
    ("torr", "pa"): 133.322,
    ("mmhg", "pa"): 133.322,
    ("bar", "pa"): 100000,
    # Speed
    ("mph", "kmh"): 1.609344,
    ("mph", "kmph"): 1.609344,
    ("knots", "kmh"): 1.852,
    ("knots", "mph"): 1.150779,
    ("mps", "kmh"): 3.6,
    ("fps", "mps"): 0.3048,
    # Data size (binary 1024)
    ("kb", "bytes"): 1024,
    ("mb", "kb"): 1024,
    ("mb", "bytes"): 1024 * 1024,
    ("gb", "mb"): 1024,
    ("gb", "kb"): 1024 * 1024,
    ("tb", "gb"): 1024,
    ("pb", "tb"): 1024,
    ("bytes", "b"): 8,
    # Time
    ("minutes", "seconds"): 60,
    ("hours", "minutes"): 60,
    ("hours", "seconds"): 3600,
    ("days", "hours"): 24,
    ("days", "minutes"): 1440,
    ("days", "seconds"): 86400,
    ("weeks", "days"): 7,
    ("months", "days"): 30,
    ("years", "days"): 365,
    ("years", "months"): 12,
    ("seconds", "ms"): 1000,
    # Energy
    ("calories", "joules"): 4.184,
    ("kcal", "kj"): 4.184,
    ("kcal", "calories"): 1000,
    ("kj", "joules"): 1000,
    ("kwh", "wh"): 1000,
    ("kwh", "joules"): 3_600_000,
    ("wh", "joules"): 3600,
    ("btu", "joules"): 1055.06,
    # Power
    ("kw", "watts"): 1000,
    ("hp", "watts"): 745.6998715822702,
    ("hp", "kw"): 0.7457,
    # Frequency
    ("khz", "hz"): 1000,
    ("mhz", "hz"): 1_000_000,
    ("mhz", "khz"): 1000,
    ("ghz", "hz"): 1_000_000_000,
    ("ghz", "mhz"): 1000,
    ("ghz", "khz"): 1_000_000,
    # Angles
    ("degrees", "radians"): 0.017453292519943295,
    # Extras for added units
    ("nautical-miles", "km"): 1.852,
    ("mg", "g"): 0.001,
    ("stones", "kg"): 6.35029318,
    ("stones", "pounds"): 14,
    ("milliseconds", "seconds"): 0.001,
    ("bits", "bytes"): 0.125,
    ("kbps", "mbps"): 0.001,
    ("mbps", "gbps"): 0.001,
    ("sqkm", "sqmiles"): 0.386102,
}

# Add reverse pairs automatically.
for (a, b), v in list(FACT.items()):
    FACT.setdefault((b, a), 1 / v)

# Temperature conversions (non-linear) handled separately.
TEMP_INFO: dict[tuple[str, str], tuple[str, str]] = {
    ("celsius", "fahrenheit"):    ("°F = °C × 9/5 + 32",                  "100°C = 212°F"),
    ("fahrenheit", "celsius"):    ("°C = (°F − 32) × 5/9",                "32°F = 0°C"),
    ("celsius", "kelvin"):        ("K = °C + 273.15",                     "0°C = 273.15 K"),
    ("kelvin", "celsius"):        ("°C = K − 273.15",                     "273.15 K = 0°C"),
    ("fahrenheit", "kelvin"):     ("K = (°F − 32) × 5/9 + 273.15",        "32°F = 273.15 K"),
    ("kelvin", "fahrenheit"):     ("°F = (K − 273.15) × 9/5 + 32",        "273.15 K = 32°F"),
    ("celsius", "rankine"):       ("°R = (°C + 273.15) × 9/5",            "0°C = 491.67°R"),
    ("rankine", "celsius"):       ("°C = °R × 5/9 − 273.15",              "491.67°R = 0°C"),
    ("fahrenheit", "rankine"):    ("°R = °F + 459.67",                    "32°F = 491.67°R"),
    ("rankine", "fahrenheit"):    ("°F = °R − 459.67",                    "491.67°R = 32°F"),
    ("kelvin", "rankine"):        ("°R = K × 9/5",                        "273.15 K = 491.67°R"),
    ("rankine", "kelvin"):        ("K = °R × 5/9",                        "491.67°R = 273.15 K"),
}

# Special non-linear (besides temperature):
SPECIAL: dict[tuple[str, str], tuple[str, str]] = {
    ("mpg", "kmpl"):  ("km/L = mpg × 0.425144",  "30 mpg ≈ 12.75 km/L"),
    ("kmpl", "mpg"):  ("mpg = km/L × 2.35215",   "10 km/L ≈ 23.52 mpg"),
    ("mpg", "lp100km"):  ("L/100km = 235.215 ÷ mpg", "30 mpg ≈ 7.84 L/100km"),
    ("lp100km", "mpg"):  ("mpg = 235.215 ÷ L/100km", "8 L/100km ≈ 29.40 mpg"),
}

def _fmt_factor(v: float) -> str:
    if v == int(v):
        return str(int(v))
    s = f"{v:.6g}"
    return s

def _enrich(slug: str) -> tuple[str, str, list[str]] | None:
    """Return (title, description, tags) for a known slug, or None."""
    # Slug is "<from>-to-<to>", but either side may itself contain hyphens
    # (e.g. "nautical-miles-to-km"). Try every split point on "-to-".
    a = b = None
    parts = slug.split("-to-")
    if len(parts) < 2:
        return None
    # Try every partition that splits the list of "-to-" pieces in two halves.
    for cut in range(1, len(parts)):
        left = "-to-".join(parts[:cut])
        right = "-to-".join(parts[cut:])
        if left in U and right in U:
            a, b = left, right
            break
    if a is None:
        return None
    A_name, A_plain, A_sym = U[a]
    B_name, B_plain, B_sym = U[b]

    # Title always the same shape — adds the symbol arrow for instant clarity.
    title = f"{A_name} to {B_name} Converter ({A_sym} → {B_sym})"

    # Build description: formula + concrete worked example.
    if (a, b) in TEMP_INFO:
        formula, example = TEMP_INFO[(a, b)]
    elif (a, b) in SPECIAL:
        formula, example = SPECIAL[(a, b)]
    elif (a, b) in FACT:
        f = FACT[(a, b)]
        formula = f"{B_sym} = {A_sym} × {_fmt_factor(f)}"
        # Worked example for "1 of from"
        out = 1 * f
        if out >= 1000 or (0 < out < 0.001):
            ex_val = f"{out:.4g}"
        elif out == int(out):
            ex_val = str(int(out))
        else:
            ex_val = f"{out:.4f}".rstrip("0").rstrip(".")
        example = f"1 {A_sym} = {ex_val} {B_sym}"
    else:
        # Unknown numeric relationship — keep generic but still per-tool unique.
        formula = None
        example = None

    if formula and example:
        desc = (
            f"Convert {A_plain} to {B_plain} instantly. "
            f"Formula: {formula}. Example: {example}. "
            f"Free, accurate, no signup."
        )
    else:
        desc = (
            f"Convert {A_plain} ({A_sym}) to {B_plain} ({B_sym}) instantly. "
            f"Free, accurate, no signup."
        )

    tags = [
        f"{a} to {b}",
        f"{A_plain} to {B_plain}",
        f"{A_sym} to {B_sym}",
        f"{A_plain} {B_plain} converter",
        "unit converter",
        "free converter",
    ]
    return title, desc, tags


# ── Patch backend/app/registry.py _UNIT_DEFS rows ─────────────────────────
def _py_str(s: str) -> str:
    """Single-quoted Python string with backslash escapes for ' and \\."""
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"

def patch_registry() -> int:
    text = REGISTRY.read_text(encoding="utf-8")
    # Each row looks like:  ('slug', 'title', 'desc', ['tag1', 'tag2', ...]),
    # We only touch rows whose slug matches `<a>-to-<b>` and is recognised.
    pat = re.compile(
        r"\(\s*'([a-z0-9-]+)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\[([^\]]*)\]\s*\)",
    )
    changed = 0

    def replace(m: re.Match) -> str:
        nonlocal changed
        slug = m.group(1)
        enriched = _enrich(slug)
        if not enriched:
            return m.group(0)
        title, desc, tags = enriched
        tag_str = ", ".join(_py_str(t) for t in tags)
        new = f"({_py_str(slug)}, {_py_str(title)}, {_py_str(desc)}, [{tag_str}])"
        if new != m.group(0):
            changed += 1
        return new

    new_text = pat.sub(replace, text)
    if new_text != text:
        REGISTRY.write_text(new_text, encoding="utf-8")
    return changed


# ── Patch frontend/src/data/catalogFallback.ts unit-converter entries ─────
def _ts_str(s: str) -> str:
    """Double-quoted JSON-style string."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def patch_fallback() -> int:
    text = FALLBACK.read_text(encoding="utf-8")
    # Match objects with slug + title + description + category "unit-converter"
    # then a tags array. Be tolerant of whitespace/newlines.
    obj_pat = re.compile(
        r"""
        \{\s*
        "slug"\s*:\s*"(?P<slug>[a-z0-9-]+)"\s*,\s*
        "title"\s*:\s*"(?P<title>[^"]*)"\s*,\s*
        "description"\s*:\s*"(?P<desc>[^"]*)"\s*,\s*
        "category"\s*:\s*"unit-converter"\s*,\s*
        "tags"\s*:\s*\[(?P<tags>[^\]]*)\]\s*,\s*
        "input_kind"\s*:\s*"(?P<ik>[^"]*)"\s*,\s*
        "accepts_multiple"\s*:\s*(?P<am>true|false)\s*
        \}
        """,
        re.VERBOSE,
    )
    changed = 0

    def replace(m: re.Match) -> str:
        nonlocal changed
        slug = m.group("slug")
        enriched = _enrich(slug)
        if not enriched:
            return m.group(0)
        title, desc, tags = enriched
        tag_lines = ",\n      ".join(_ts_str(t) for t in tags)
        new = (
            "{\n"
            f'    "slug": {_ts_str(slug)},\n'
            f'    "title": {_ts_str(title)},\n'
            f'    "description": {_ts_str(desc)},\n'
            f'    "category": "unit-converter",\n'
            f'    "tags": [\n      {tag_lines}\n    ],\n'
            f'    "input_kind": {_ts_str(m.group("ik"))},\n'
            f'    "accepts_multiple": {m.group("am")}\n'
            "  }"
        )
        if new != m.group(0):
            changed += 1
        return new

    new_text = obj_pat.sub(replace, text)
    if new_text != text:
        FALLBACK.write_text(new_text, encoding="utf-8")
    return changed


if __name__ == "__main__":
    a = patch_registry()
    b = patch_fallback()
    print(f"registry.py rows updated: {a}")
    print(f"catalogFallback.ts entries updated: {b}")
