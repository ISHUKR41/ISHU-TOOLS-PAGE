# Skill: geo

## Purpose
Handles geographic and location-based intelligence — country/region data lookups, coordinate transformations, distance calculations, timezone operations, geofencing logic, geocoding, and regional regulatory/cultural information.

## When to Use
- Need country/city/region information (population, area, capital, etc.)
- Need to calculate distance between two geographic points
- Need timezone conversions or "what time is it in X?" logic
- Need to validate or parse addresses
- Need country-specific data (currencies, phone codes, languages)
- Need geofencing or "is point inside region" logic
- Need IP-to-location mapping

## Core Capabilities

### Geographic Data Lookup
```python
country = "India"
data = {
    "name": "India",
    "iso2": "IN",
    "iso3": "IND",
    "capital": "New Delhi",
    "population": 1_428_627_663,
    "area_km2": 3_287_263,
    "continent": "Asia",
    "languages": ["Hindi", "English", + 21 others],
    "currency": "INR (Indian Rupee ₹)",
    "phone_code": "+91",
    "timezones": ["Asia/Kolkata (UTC+5:30)"],
    "tld": ".in",
    "subregion": "Southern Asia"
}
```

### Distance Calculations (Haversine Formula)
```python
import math

def haversine_distance(lat1, lon1, lat2, lon2) -> float:
    """Returns distance in km between two GPS coordinates"""
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2)**2 + 
         math.cos(math.radians(lat1)) * 
         math.cos(math.radians(lat2)) * 
         math.sin(dlon/2)**2)
    return R * 2 * math.asin(math.sqrt(a))

# Example: Delhi to Mumbai
distance = haversine_distance(28.6139, 77.2090, 19.0760, 72.8777)
# Result: ~1148 km
```

### Timezone Operations
```python
from datetime import datetime
import pytz

def convert_timezone(dt, from_tz: str, to_tz: str) -> datetime:
    """Convert datetime between timezones"""
    tz_from = pytz.timezone(from_tz)
    tz_to = pytz.timezone(to_tz)
    return tz_from.localize(dt).astimezone(tz_to)

# Common timezone strings
timezones = {
    "India": "Asia/Kolkata",        # UTC+5:30
    "US Eastern": "America/New_York",  # UTC-5/-4
    "US Pacific": "America/Los_Angeles", # UTC-8/-7
    "UK": "Europe/London",          # UTC+0/+1
    "UAE": "Asia/Dubai",            # UTC+4
    "Singapore": "Asia/Singapore",  # UTC+8
    "Japan": "Asia/Tokyo",          # UTC+9
}
```

### Indian Geographic Data
```python
indian_states = {
    "UP": {
        "name": "Uttar Pradesh",
        "capital": "Lucknow",
        "area_km2": 240_928,
        "population": 241_066_874,
        "districts": 75,
        "language": "Hindi"
    },
    "MH": {
        "name": "Maharashtra",
        "capital": "Mumbai",
        "area_km2": 307_713,
        "population": 123_144_223,
        "districts": 36,
        "language": "Marathi"
    },
    # ... all 28 states + 8 UTs
}
```

### Geofencing — Point in Polygon
```python
def point_in_polygon(point, polygon) -> bool:
    """Check if GPS point is inside a polygon boundary"""
    x, y = point
    n = len(polygon)
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside
```

## ISHU TOOLS Geo Tools

### Available Geo Tools
1. **Distance Calculator** — between any two cities/coordinates
2. **Timezone Converter** — convert time between any two zones
3. **Country Information** — flag, capital, currency, phone code
4. **Indian PIN Code Lookup** — state, district, city from PIN
5. **IP to Location** — geo-locate an IP address
6. **Coordinate Converter** — DMS ↔ Decimal ↔ UTM

### Indian PIN Code Tool
```python
def lookup_pin(pin: str) -> dict:
    """
    PIN format: [1-9][0-9]{5}
    First 2 digits = State zone
    11-19: Delhi zone
    20-28: UP zone  
    30-34: Rajasthan zone
    40-44: Maharashtra zone
    60-64: Tamil Nadu zone
    70-74: West Bengal zone
    """
    state_prefix = {
        "11": "Delhi", "12": "Haryana", "13": "Punjab",
        "14": "Punjab", "20": "Uttar Pradesh", "40": "Maharashtra",
        "60": "Tamil Nadu", "70": "West Bengal", "80": "Bihar",
    }
    return state_prefix.get(pin[:2], "Unknown")
```

## World Geographic Facts
```
Largest countries by area:
1. Russia (17,098,242 km²)  2. Canada (9,984,670 km²)
3. USA (9,833,517 km²)      4. China (9,596,960 km²)
5. Brazil (8,515,767 km²)   6. Australia (7,692,024 km²)
7. India (3,287,263 km²)

Most populated countries:
1. India (1.43B)    2. China (1.40B)    3. USA (336M)
4. Indonesia (278M) 5. Pakistan (230M)  6. Brazil (215M)
```

## Related Skills
- `travel-assistant` — geographic data for travel planning
- `deep-research` — in-depth geographic research
- `real-estate-analyzer` — location-based property analysis
