"""
Extra tools handlers — text utilities, math tools, everyday tools.
Includes improved accuracy for existing calculations and NEW tools.
All production-ready with real, accurate logic.
"""
from __future__ import annotations
import base64, csv, hashlib, html, io, json, math, os, re, secrets, string, sys, uuid
from collections import Counter
from datetime import datetime, timezone, timedelta
from typing import Any

try:
    from .handlers import ExecutionResult, ToolHandler
except ImportError:
    from handlers import ExecutionResult, ToolHandler


# ═══════════════════════════════════════════════════════════
# TEXT UTILITIES — Improved Accuracy
# ═══════════════════════════════════════════════════════════

def handle_text_to_morse(files, payload, output_dir):
    text = str(payload.get("text", "")).upper()
    MORSE = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--',
        '?': '..--..', '!': '-.-.--', "'": '.----.', '"': '.-..-.', '(': '-.--.',
        ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '/': '-..-.',
        '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '@': '.--.-.',
    }
    morse = " ".join(MORSE.get(c, c) for c in text)
    return ExecutionResult(kind="json", message="Text converted to Morse code", data={"text": morse, "original": text})


def handle_morse_to_text(files, payload, output_dir):
    morse_input = str(payload.get("text", ""))
    MORSE_REV = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
        '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9', '/': ' ', '.-.-.-': '.', '--..--': ',',
        '..--..': '?', '-.-.--': '!',
    }
    words = morse_input.strip().split("   ")  # triple space = word separator
    result = []
    for word in words:
        chars = word.split(" ")
        result.append("".join(MORSE_REV.get(c, c) for c in chars))
    text = " ".join(result)
    return ExecutionResult(kind="json", message="Morse code converted to text", data={"text": text})


def handle_text_to_binary(files, payload, output_dir):
    text = str(payload.get("text", ""))
    binary = " ".join(format(ord(c), '08b') for c in text)
    return ExecutionResult(kind="json", message="Text converted to binary", data={"text": binary})


def handle_binary_to_text(files, payload, output_dir):
    binary = str(payload.get("text", "")).strip()
    try:
        bits = binary.replace(",", " ").split()
        text = "".join(chr(int(b, 2)) for b in bits)
        return ExecutionResult(kind="json", message="Binary converted to text", data={"text": text})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Error: {e}", data={"error": str(e)})


def handle_text_to_hex(files, payload, output_dir):
    text = str(payload.get("text", ""))
    hex_str = " ".join(format(ord(c), '02x') for c in text)
    return ExecutionResult(kind="json", message="Text converted to hexadecimal", data={"text": hex_str})


def handle_hex_to_text(files, payload, output_dir):
    hex_input = str(payload.get("text", "")).strip()
    try:
        hex_vals = hex_input.replace("0x", "").replace(",", " ").split()
        text = "".join(chr(int(h, 16)) for h in hex_vals)
        return ExecutionResult(kind="json", message="Hex converted to text", data={"text": text})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Error: {e}", data={"error": str(e)})


def handle_text_to_octal(files, payload, output_dir):
    text = str(payload.get("text", ""))
    octal = " ".join(format(ord(c), '03o') for c in text)
    return ExecutionResult(kind="json", message="Text converted to octal", data={"text": octal})


def handle_octal_to_text(files, payload, output_dir):
    octal_input = str(payload.get("text", "")).strip()
    try:
        octals = octal_input.split()
        text = "".join(chr(int(o, 8)) for o in octals)
        return ExecutionResult(kind="json", message="Octal converted to text", data={"text": text})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Error: {e}", data={"error": str(e)})


def handle_text_to_unicode(files, payload, output_dir):
    text = str(payload.get("text", ""))
    unicode_str = " ".join(f"U+{ord(c):04X}" for c in text)
    return ExecutionResult(kind="json", message="Text converted to Unicode codes", data={"text": unicode_str})


def handle_unicode_to_text(files, payload, output_dir):
    unicode_input = str(payload.get("text", "")).strip()
    try:
        codes = re.findall(r'(?:U\+)?([0-9a-fA-F]{2,6})', unicode_input)
        text = "".join(chr(int(c, 16)) for c in codes)
        return ExecutionResult(kind="json", message="Unicode converted to text", data={"text": text})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Error: {e}", data={"error": str(e)})


def handle_text_reverse(files, payload, output_dir):
    text = str(payload.get("text", ""))
    mode = str(payload.get("mode", "characters")).lower()
    if mode == "words":
        result = " ".join(text.split()[::-1])
    elif mode == "lines":
        result = "\n".join(text.splitlines()[::-1])
    else:
        result = text[::-1]
    return ExecutionResult(kind="json", message="Text reversed", data={"text": result})


def handle_text_repeat(files, payload, output_dir):
    text = str(payload.get("text", ""))
    count = max(1, min(1000, int(payload.get("count", 3))))
    separator = str(payload.get("separator", "\n"))
    separator = separator.replace("\\n", "\n").replace("\\t", "\t")
    result = separator.join([text] * count)
    return ExecutionResult(kind="json", message=f"Text repeated {count} times", data={"text": result})


def handle_whitespace_remover(files, payload, output_dir):
    text = str(payload.get("text", ""))
    mode = str(payload.get("mode", "extra")).lower()
    if mode == "all":
        result = re.sub(r'\s+', '', text)
    elif mode == "leading":
        result = "\n".join(line.lstrip() for line in text.splitlines())
    elif mode == "trailing":
        result = "\n".join(line.rstrip() for line in text.splitlines())
    else:
        result = re.sub(r'[ \t]+', ' ', text)
        result = re.sub(r'\n\s*\n', '\n\n', result)
    return ExecutionResult(kind="json", message="Whitespace cleaned", data={"text": result.strip()})


def handle_text_statistics(files, payload, output_dir):
    text = str(payload.get("text", ""))
    words = text.split()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s for s in sentences if s.strip()]
    paragraphs = [p for p in text.split("\n\n") if p.strip()]
    chars_no_space = len(text.replace(" ", "").replace("\n", "").replace("\t", ""))
    
    avg_word_len = sum(len(w) for w in words) / max(1, len(words))
    avg_sentence_len = len(words) / max(1, len(sentences))
    reading_time = len(words) / 200
    speaking_time = len(words) / 130
    
    result = (
        f"Characters: {len(text)}\n"
        f"Characters (no spaces): {chars_no_space}\n"
        f"Words: {len(words)}\n"
        f"Sentences: {len(sentences)}\n"
        f"Paragraphs: {len(paragraphs)}\n"
        f"Lines: {len(text.splitlines())}\n"
        f"Avg word length: {avg_word_len:.1f}\n"
        f"Avg sentence length: {avg_sentence_len:.1f} words\n"
        f"Reading time: {reading_time:.1f} min\n"
        f"Speaking time: {speaking_time:.1f} min"
    )
    return ExecutionResult(kind="json", message="Text statistics generated", data={
        "text": result,
        "characters": len(text),
        "words": len(words),
        "sentences": len(sentences),
        "paragraphs": len(paragraphs),
        "reading_time_min": round(reading_time, 1),
    })


def handle_word_frequency(files, payload, output_dir):
    text = str(payload.get("text", ""))
    top_n = max(1, min(100, int(payload.get("top_n", 20))))
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    from collections import Counter
    freq = Counter(words).most_common(top_n)
    rows = [f"{w}: {c}" for w, c in freq]
    return ExecutionResult(kind="json", message=f"Top {len(freq)} words", data={
        "text": "\n".join(rows),
        "frequencies": dict(freq),
        "total_words": len(words),
        "unique_words": len(set(words)),
    })


def handle_number_to_roman(files, payload, output_dir):
    try:
        num = int(payload.get("text", "0"))
    except ValueError:
        return ExecutionResult(kind="json", message="Invalid number", data={"error": "Please enter a valid integer"})
    
    if num <= 0 or num > 3999:
        return ExecutionResult(kind="json", message="Number must be 1-3999", data={"error": "Range: 1 to 3999"})
    
    vals = [(1000,'M'),(900,'CM'),(500,'D'),(400,'CD'),(100,'C'),(90,'XC'),
            (50,'L'),(40,'XL'),(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')]
    result = ""
    for v, s in vals:
        while num >= v:
            result += s
            num -= v
    return ExecutionResult(kind="json", message="Number converted to Roman numeral", data={"text": result})


def handle_roman_to_number(files, payload, output_dir):
    roman = str(payload.get("text", "")).upper().strip()
    roman_vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    
    result = 0
    prev = 0
    for c in reversed(roman):
        val = roman_vals.get(c, 0)
        if val < prev:
            result -= val
        else:
            result += val
        prev = val
    
    return ExecutionResult(kind="json", message="Roman numeral converted to number", data={"text": str(result), "number": result})


def handle_number_base_converter(files, payload, output_dir):
    value = str(payload.get("text", "0")).strip()
    from_base = int(payload.get("from_base", 10))
    to_base = int(payload.get("to_base", 2))
    
    try:
        decimal = int(value, from_base)
        
        if to_base == 2:
            result = bin(decimal)[2:]
        elif to_base == 8:
            result = oct(decimal)[2:]
        elif to_base == 16:
            result = hex(decimal)[2:].upper()
        elif to_base == 10:
            result = str(decimal)
        else:
            digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            if decimal == 0:
                result = "0"
            else:
                r = []
                n = abs(decimal)
                while n:
                    r.append(digits[n % to_base])
                    n //= to_base
                result = ("" if decimal >= 0 else "-") + "".join(reversed(r))
        
        return ExecutionResult(kind="json", message=f"Base {from_base} → Base {to_base}", data={
            "text": result,
            "decimal": decimal,
            "binary": bin(decimal)[2:],
            "octal": oct(decimal)[2:],
            "hexadecimal": hex(decimal)[2:].upper(),
        })
    except ValueError as e:
        return ExecutionResult(kind="json", message=f"Invalid input for base {from_base}", data={"error": str(e)})


def handle_color_code_generator(files, payload, output_dir):
    import random
    count = max(1, min(50, int(payload.get("count", 10))))
    colors = []
    for _ in range(count):
        r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
        colors.append(f"#{r:02x}{g:02x}{b:02x}")
    
    return ExecutionResult(kind="json", message=f"Generated {count} random colors", data={
        "text": "\n".join(colors),
        "colors": colors,
    })


def handle_qr_text_generator(files, payload, output_dir):
    """Generate QR code as text (for when qrcode lib is available)"""
    text = str(payload.get("text", "https://ishu.tools"))
    try:
        import qrcode
        from PIL import Image
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(text)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        out_path = output_dir / "qr-code.png"
        img.save(str(out_path))
        from .handlers import create_single_file_result
        return create_single_file_result(out_path, f"QR Code for: {text}", "image/png")
    except ImportError:
        # Fallback — return text representation
        return ExecutionResult(kind="json", message="QR code data", data={
            "text": f"QR Code Data: {text}\n\n(Install 'qrcode' library for image output: pip install qrcode[pil])",
            "data": text,
        })


def handle_character_counter(files, payload, output_dir):
    text = str(payload.get("text", ""))
    from collections import Counter
    char_freq = Counter(text)
    sorted_chars = sorted(char_freq.items(), key=lambda x: -x[1])[:30]
    rows = [f"'{c}' → {n} ({n/max(1,len(text))*100:.1f}%)" for c, n in sorted_chars]
    
    return ExecutionResult(kind="json", message="Character analysis complete", data={
        "text": f"Total characters: {len(text)}\nUnique characters: {len(char_freq)}\n\n" + "\n".join(rows),
        "total": len(text),
        "unique": len(char_freq),
    })


def handle_string_hash(files, payload, output_dir):
    text = str(payload.get("text", ""))
    algorithm = str(payload.get("algorithm", "sha256")).lower()
    
    algos = {
        "md5": hashlib.md5,
        "sha1": hashlib.sha1,
        "sha224": hashlib.sha224,
        "sha256": hashlib.sha256,
        "sha384": hashlib.sha384,
        "sha512": hashlib.sha512,
    }
    
    if algorithm == "all":
        results = {}
        for name, func in algos.items():
            results[name] = func(text.encode("utf-8")).hexdigest()
        text_result = "\n".join(f"{k.upper()}: {v}" for k, v in results.items())
        return ExecutionResult(kind="json", message="All hashes generated", data={"text": text_result, **results})
    
    func = algos.get(algorithm)
    if not func:
        return ExecutionResult(kind="json", message=f"Unknown algorithm: {algorithm}", data={"error": "Use: md5, sha1, sha224, sha256, sha384, sha512, all"})
    
    result = func(text.encode("utf-8")).hexdigest()
    return ExecutionResult(kind="json", message=f"{algorithm.upper()} hash generated", data={"text": result, "hash": result, "algorithm": algorithm})


def handle_json_path_finder(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        data = json.loads(text)
        paths = []
        
        def find_paths(obj, prefix="$"):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    path = f'{prefix}.{k}'
                    paths.append(f"{path} → {type(v).__name__}" + (f" = {v}" if not isinstance(v, (dict, list)) else ""))
                    find_paths(v, path)
            elif isinstance(obj, list):
                for i, v in enumerate(obj[:10]):  # limit
                    path = f'{prefix}[{i}]'
                    paths.append(f"{path} → {type(v).__name__}" + (f" = {v}" if not isinstance(v, (dict, list)) else ""))
                    find_paths(v, path)
        
        find_paths(data)
        return ExecutionResult(kind="json", message=f"Found {len(paths)} paths", data={
            "text": "\n".join(paths),
            "path_count": len(paths),
        })
    except json.JSONDecodeError as e:
        return ExecutionResult(kind="json", message=f"Invalid JSON: {e}", data={"error": str(e)})


def handle_epoch_converter(files, payload, output_dir):
    """More accurate epoch/timestamp converter"""
    input_val = str(payload.get("text", "")).strip()
    
    now = datetime.now(timezone.utc)
    
    if not input_val or input_val.lower() == "now":
        ts = int(now.timestamp())
        ts_ms = int(now.timestamp() * 1000)
        return ExecutionResult(kind="json", message="Current epoch timestamps", data={
            "text": (
                f"Current Time:\n"
                f"  UTC: {now.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
                f"  ISO 8601: {now.isoformat()}\n"
                f"  Unix (seconds): {ts}\n"
                f"  Unix (milliseconds): {ts_ms}\n"
                f"  Day of week: {now.strftime('%A')}\n"
                f"  Day of year: {now.strftime('%j')}"
            ),
            "unix_seconds": ts,
            "unix_ms": ts_ms,
        })
    
    # Try as number
    try:
        num = float(input_val)
        if num > 1e15:  # microseconds
            dt = datetime.fromtimestamp(num / 1e6, tz=timezone.utc)
        elif num > 1e12:  # milliseconds
            dt = datetime.fromtimestamp(num / 1000, tz=timezone.utc)
        else:  # seconds
            dt = datetime.fromtimestamp(num, tz=timezone.utc)
        
        return ExecutionResult(kind="json", message="Timestamp converted", data={
            "text": (
                f"Input: {input_val}\n\n"
                f"UTC: {dt.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
                f"ISO 8601: {dt.isoformat()}\n"
                f"Unix (seconds): {int(dt.timestamp())}\n"
                f"Unix (ms): {int(dt.timestamp() * 1000)}\n"
                f"Day: {dt.strftime('%A, %B %d, %Y')}\n"
                f"Time: {dt.strftime('%I:%M:%S %p')}"
            ),
        })
    except (ValueError, OverflowError, OSError):
        pass
    
    # Try as date string
    for fmt in [
        "%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y",
        "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ",
        "%d-%m-%Y", "%d.%m.%Y", "%B %d, %Y", "%b %d, %Y",
    ]:
        try:
            dt = datetime.strptime(input_val, fmt).replace(tzinfo=timezone.utc)
            ts = int(dt.timestamp())
            return ExecutionResult(kind="json", message="Date converted to epoch", data={
                "text": f"Input: {input_val}\nUnix: {ts}\nUTC: {dt.strftime('%Y-%m-%d %H:%M:%S UTC')}",
                "unix_timestamp": ts,
            })
        except ValueError:
            continue
    
    return ExecutionResult(kind="json", message="Could not parse input", data={"error": "Unrecognized format"})


def handle_nato_alphabet(files, payload, output_dir):
    text = str(payload.get("text", "")).upper()
    NATO = {
        'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
        'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet',
        'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
        'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
        'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
        'Z': 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
        '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Niner', ' ': '(space)',
    }
    result = " ".join(NATO.get(c, c) for c in text)
    return ExecutionResult(kind="json", message="NATO phonetic alphabet", data={"text": result})


def handle_pig_latin(files, payload, output_dir):
    text = str(payload.get("text", ""))
    
    def to_pig_latin(word):
        vowels = "aeiouAEIOU"
        if word[0] in vowels:
            return word + "way"
        for i, c in enumerate(word):
            if c in vowels:
                return word[i:] + word[:i] + "ay"
        return word + "ay"
    
    words = text.split()
    result = " ".join(to_pig_latin(w) if w.isalpha() else w for w in words)
    return ExecutionResult(kind="json", message="Pig Latin generated", data={"text": result})


def handle_fancy_text(files, payload, output_dir):
    text = str(payload.get("text", ""))
    
    # Generate multiple fancy styles
    styles = {}
    
    # Bold
    bold_map = {chr(i): chr(0x1D400 + i - ord('A')) for i in range(ord('A'), ord('Z')+1)}
    bold_map.update({chr(i): chr(0x1D41A + i - ord('a')) for i in range(ord('a'), ord('z')+1)})
    styles["𝐁𝐨𝐥𝐝"] = "".join(bold_map.get(c, c) for c in text)
    
    # Italic
    italic_map = {chr(i): chr(0x1D434 + i - ord('A')) for i in range(ord('A'), ord('Z')+1)}
    italic_map.update({chr(i): chr(0x1D44E + i - ord('a')) for i in range(ord('a'), ord('z')+1)})
    styles["𝐼𝑡𝑎𝑙𝑖𝑐"] = "".join(italic_map.get(c, c) for c in text)
    
    # Circled
    circled = {chr(i): chr(0x24B6 + i - ord('A')) for i in range(ord('A'), ord('Z')+1)}
    circled.update({chr(i): chr(0x24D0 + i - ord('a')) for i in range(ord('a'), ord('z')+1)})
    styles["Ⓒⓘⓡⓒⓛⓔⓓ"] = "".join(circled.get(c, c) for c in text)
    
    # Upside Down
    flip_map = str.maketrans(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        '∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Zɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz'
    )
    styles["uʍop ǝpᴉsd∩"] = text.translate(flip_map)[::-1]
    
    # Fullwidth
    fw = {chr(i): chr(0xFF21 + i - ord('A')) for i in range(ord('A'), ord('Z')+1)}
    fw.update({chr(i): chr(0xFF41 + i - ord('a')) for i in range(ord('a'), ord('z')+1)})
    fw.update({chr(i): chr(0xFF10 + i - ord('0')) for i in range(ord('0'), ord('9')+1)})
    styles["Ｆｕｌｌｗｉｄｔｈ"] = "".join(fw.get(c, c) for c in text)
    
    result = "\n\n".join(f"【{name}】\n{val}" for name, val in styles.items())
    return ExecutionResult(kind="json", message="Fancy text generated", data={"text": result, "styles": styles})


def handle_line_counter(files, payload, output_dir):
    text = str(payload.get("text", ""))
    lines = text.splitlines()
    non_empty = [l for l in lines if l.strip()]
    
    numbered = "\n".join(f"{i+1}: {l}" for i, l in enumerate(lines))
    
    return ExecutionResult(kind="json", message=f"{len(lines)} lines total", data={
        "text": f"Total lines: {len(lines)}\nNon-empty lines: {len(non_empty)}\nEmpty lines: {len(lines) - len(non_empty)}\n\n{numbered}",
        "total": len(lines),
        "non_empty": len(non_empty),
    })


def handle_text_to_ascii_art(files, payload, output_dir):
    text = str(payload.get("text", "ISHU"))[:20]
    
    # Simple ASCII banner
    CHARS = {
        'A': [" ██ ", "█  █", "████", "█  █", "█  █"],
        'B': ["███ ", "█  █", "███ ", "█  █", "███ "],
        'C': [" ███", "█   ", "█   ", "█   ", " ███"],
        'D': ["███ ", "█  █", "█  █", "█  █", "███ "],
        'E': ["████", "█   ", "███ ", "█   ", "████"],
        'F': ["████", "█   ", "███ ", "█   ", "█   "],
        'G': [" ███", "█   ", "█ ██", "█  █", " ███"],
        'H': ["█  █", "█  █", "████", "█  █", "█  █"],
        'I': ["████", " ██ ", " ██ ", " ██ ", "████"],
        'J': ["████", "  █ ", "  █ ", "█ █ ", " █  "],
        'K': ["█  █", "█ █ ", "██  ", "█ █ ", "█  █"],
        'L': ["█   ", "█   ", "█   ", "█   ", "████"],
        'M': ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
        'N': ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
        'O': [" ██ ", "█  █", "█  █", "█  █", " ██ "],
        'P': ["███ ", "█  █", "███ ", "█   ", "█   "],
        'Q': [" ██ ", "█  █", "█ ██", "█  █", " ███"],
        'R': ["███ ", "█  █", "███ ", "█ █ ", "█  █"],
        'S': [" ███", "█   ", " ██ ", "   █", "███ "],
        'T': ["████", " ██ ", " ██ ", " ██ ", " ██ "],
        'U': ["█  █", "█  █", "█  █", "█  █", " ██ "],
        'V': ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
        'W': ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
        'X': ["█  █", " ██ ", " ██ ", " ██ ", "█  █"],
        'Y': ["█  █", " ██ ", " ██ ", " ██ ", " ██ "],
        'Z': ["████", "  █ ", " █  ", "█   ", "████"],
        ' ': ["    ", "    ", "    ", "    ", "    "],
    }
    
    upper = text.upper()
    lines = ["", "", "", "", ""]
    for c in upper:
        char_lines = CHARS.get(c, ["?   ", "?   ", "?   ", "?   ", "?   "])
        for i in range(5):
            lines[i] += char_lines[i] + " "
    
    result = "\n".join(lines)
    return ExecutionResult(kind="json", message="ASCII art generated", data={"text": result})


# ═══════════════════════════════════════════════════════════
# MATH TOOLS — Improved Accuracy
# ═══════════════════════════════════════════════════════════

def handle_percentage_calculator_improved(files, payload, output_dir):
    """Comprehensive percentage calculator — modes match toolFields exactly."""
    mode = str(payload.get("mode", "percentage")).lower()

    try:
        value = float(payload.get("value", 0))
        total = float(payload.get("total", 100))

        if mode == "percentage":
            # What % is value of total?
            if total == 0:
                return ExecutionResult(kind="json", message="Total cannot be zero", data={"error": "Total cannot be zero"})
            pct = (value / total) * 100
            return ExecutionResult(kind="json", message=f"{value} is {pct:.2f}% of {total}", data={
                "result": f"{pct:.2f}%",
                "value": value,
                "total": total,
                "percentage": round(pct, 4),
                "text": f"{value} is {pct:.4f}% of {total}",
            })

        elif mode == "of":
            # value% of total
            result = (value / 100) * total
            return ExecutionResult(kind="json", message=f"{value}% of {total} = {result:.4f}", data={
                "result": round(result, 4),
                "percentage": value,
                "of_value": total,
                "calculated": round(result, 4),
                "text": f"{value}% of {total} = {round(result, 4)}",
            })

        elif mode == "change":
            # Percentage change: old = total, new = value
            if total == 0:
                return ExecutionResult(kind="json", message="Old value cannot be zero", data={"error": "Old value cannot be zero"})
            change = ((value - total) / abs(total)) * 100
            direction = "increase" if change > 0 else "decrease" if change < 0 else "no change"
            return ExecutionResult(kind="json", message=f"Percentage change: {change:.2f}%", data={
                "result": f"{change:.2f}%",
                "old_value": total,
                "new_value": value,
                "change_percent": round(change, 4),
                "direction": direction.title(),
                "text": f"From {total} to {value}: {change:.4f}% {direction}",
            })

        else:
            # Fallback to percentage mode
            if total == 0:
                return ExecutionResult(kind="json", message="Total cannot be zero", data={"error": "Total cannot be zero"})
            pct = (value / total) * 100
            return ExecutionResult(kind="json", message=f"{value} is {pct:.2f}% of {total}", data={
                "result": f"{pct:.2f}%",
                "percentage": round(pct, 4),
                "text": f"{value} is {pct:.4f}% of {total}",
            })

    except (ValueError, TypeError) as e:
        return ExecutionResult(kind="json", message=f"Calculation error: {e}", data={"error": str(e)})


def handle_scientific_calculator_improved(files, payload, output_dir):
    """Scientific calculator with safe eval, flexible field names."""
    # Accept many possible field names so any frontend / API caller works.
    raw = ""
    for key in ("expression", "expr", "formula", "text", "input", "value", "equation", "calculation"):
        v = payload.get(key)
        if v not in (None, ""):
            raw = str(v).strip()
            break

    if not raw:
        return ExecutionResult(
            kind="json",
            message="Enter an expression like 2+3*4, sin(30), or sqrt(16).",
            data={"error": "Please enter a math expression."},
        )

    # Word-boundary aware token replacement for math functions.
    # Order matters: replace longer tokens first so `asin` isn't broken by `sin`.
    token_map = [
        ("π", "math.pi"), ("×", "*"), ("÷", "/"), ("−", "-"), ("^", "**"),
        ("factorial", "math.factorial"), ("asin", "math.asin"), ("acos", "math.acos"),
        ("atan", "math.atan"), ("sinh", "math.sinh"), ("cosh", "math.cosh"),
        ("tanh", "math.tanh"), ("sqrt", "math.sqrt"), ("cbrt", "math.cbrt"),
        ("log10", "math.log10"), ("log2", "math.log2"), ("log", "math.log10"),
        ("ln", "math.log"), ("sin", "math.sin"), ("cos", "math.cos"),
        ("tan", "math.tan"), ("ceil", "math.ceil"), ("floor", "math.floor"),
        ("exp", "math.exp"), ("rad", "math.radians"), ("deg", "math.degrees"),
        ("pow", "math.pow"), ("fact", "math.factorial"),
        ("pi", "math.pi"), ("PI", "math.pi"), ("E", "math.e"),
    ]
    safe_expr = raw
    import re
    for token, repl in token_map:
        # Only replace if not already preceded by `math.` (idempotent).
        pattern = r"(?<!math\.)(?<![A-Za-z_])" + re.escape(token) + r"(?![A-Za-z0-9_])"
        safe_expr = re.sub(pattern, repl, safe_expr)
    # Bare `e` → math.e (only when standalone, not in `exp`, `math.e`, `1e5`).
    safe_expr = re.sub(r"(?<![A-Za-z0-9_.])e(?![A-Za-z0-9_])", "math.e", safe_expr)

    # Strict whitelist after substitution.
    if not re.fullmatch(r"[\s0-9eE.+\-*/%(),math\.a-zA-Z_]+", safe_expr):
        return ExecutionResult(
            kind="json",
            message="Unsafe expression. Only math is allowed.",
            data={"error": "Only mathematical expressions are allowed."},
        )

    try:
        result = eval(  # noqa: S307 — sandboxed below
            safe_expr,
            {"__builtins__": {}},
            {"math": math, "abs": abs, "round": round, "int": int, "float": float, "min": min, "max": max},
        )
        if isinstance(result, float):
            if result == int(result) and abs(result) < 1e15:
                display = str(int(result))
            else:
                display = f"{result:.12g}"
        else:
            display = str(result)
        return ExecutionResult(
            kind="json",
            message=f"= {display}",
            data={
                "text": f"{raw} = {display}",
                "result": result if isinstance(result, (int, float)) else display,
                "expression": raw,
                "display": display,
            },
        )
    except ZeroDivisionError:
        return ExecutionResult(kind="json", message="Cannot divide by zero.", data={"error": "Division by zero", "expression": raw})
    except SyntaxError:
        return ExecutionResult(kind="json", message="Invalid expression. Check brackets and operators.", data={"error": "Syntax error", "expression": raw})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Could not evaluate: {e}", data={"error": str(e), "expression": raw})


def handle_compound_interest(files, payload, output_dir):
    """Accurate compound interest calculator"""
    principal = float(payload.get("principal", 10000))
    rate = float(payload.get("rate", 8))  # annual %
    time = float(payload.get("time", 5))  # years
    n = int(payload.get("compound_per_year", 12))  # compounding frequency
    
    r = rate / 100
    amount = principal * (1 + r/n) ** (n * time)
    interest = amount - principal
    
    # Simple interest for comparison
    simple_amount = principal * (1 + r * time)
    simple_interest = simple_amount - principal
    
    frequency_label = {1: "Annually", 2: "Semi-annually", 4: "Quarterly", 12: "Monthly", 365: "Daily"}.get(n, f"{n}x/year")
    
    return ExecutionResult(kind="json", message=f"Final amount: ₹{amount:,.2f}", data={
        "text": (
            f"═══ Compound Interest Calculator ═══\n"
            f"Principal: ₹{principal:,.2f}\n"
            f"Annual Rate: {rate}%\n"
            f"Time: {time} years\n"
            f"Compounding: {frequency_label}\n\n"
            f"Compound Interest: ₹{interest:,.2f}\n"
            f"Total Amount: ₹{amount:,.2f}\n\n"
            f"── Comparison with Simple Interest ──\n"
            f"Simple Interest: ₹{simple_interest:,.2f}\n"
            f"Simple Total: ₹{simple_amount:,.2f}\n"
            f"Extra earned via compounding: ₹{interest - simple_interest:,.2f}"
        ),
        "amount": round(amount, 2),
        "interest": round(interest, 2),
    })


def handle_loan_emi(files, payload, output_dir):
    """Accurate EMI calculator with amortization"""
    principal = float(payload.get("principal", 1000000))
    rate = float(payload.get("rate", 8.5))  # annual %
    years = float(payload.get("years", 20))
    
    months = int(years * 12)
    monthly_rate = rate / 100 / 12
    
    if monthly_rate == 0:
        emi = principal / months
    else:
        emi = principal * monthly_rate * (1 + monthly_rate)**months / ((1 + monthly_rate)**months - 1)
    
    total_payment = emi * months
    total_interest = total_payment - principal
    
    return ExecutionResult(kind="json", message=f"Monthly EMI: ₹{emi:,.2f}", data={
        "text": (
            f"═══ EMI Calculator ═══\n"
            f"Loan Amount: ₹{principal:,.2f}\n"
            f"Annual Interest Rate: {rate}%\n"
            f"Loan Tenure: {years} years ({months} months)\n\n"
            f"Monthly EMI: ₹{emi:,.2f}\n"
            f"Total Interest: ₹{total_interest:,.2f}\n"
            f"Total Payment: ₹{total_payment:,.2f}\n"
            f"Interest to Principal Ratio: {total_interest/principal*100:.1f}%"
        ),
        "emi": round(emi, 2),
        "total_interest": round(total_interest, 2),
        "total_payment": round(total_payment, 2),
    })


def handle_citation_generator(files, payload, output_dir):
    style = str(payload.get("style", "apa")).strip().lower()
    source_type = str(payload.get("source_type", "website")).strip().lower()
    title = str(payload.get("title") or payload.get("text") or "Untitled source").strip()
    author = str(payload.get("author", "")).strip()
    year = str(payload.get("year", "n.d.")).strip() or "n.d."
    publisher = str(payload.get("publisher", "")).strip()
    url = str(payload.get("url", "")).strip()
    accessed = str(payload.get("accessed", "")).strip()

    author_part = author or "Unknown author"
    publisher_part = f" {publisher}." if publisher else ""
    url_part = f" {url}" if url else ""
    accessed_part = f" Accessed {accessed}." if accessed else ""

    if style == "mla":
        citation = f'{author_part}. "{title}." {publisher or source_type.title()}, {year}.{url_part}{accessed_part}'
    elif style == "chicago":
        citation = f'{author_part}. "{title}." {publisher or source_type.title()}. {year}.{url_part}{accessed_part}'
    else:
        citation = f"{author_part}. ({year}). {title}.{publisher_part}{url_part}"

    return ExecutionResult(
        kind="json",
        message=f"{style.upper()} citation generated",
        data={"text": citation.strip(), "style": style, "source_type": source_type},
    )


def handle_flashcard_generator(files, payload, output_dir):
    text = str(payload.get("text", "")).strip()
    count = max(1, min(30, int(payload.get("count", 10))))
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n+", text) if len(s.strip()) > 20]
    words = re.findall(r"\b[A-Za-z][A-Za-z-]{4,}\b", text)
    common = []
    seen = set()
    for word in words:
        key = word.lower()
        if key not in seen:
            seen.add(key)
            common.append(word)
    cards = []
    for idx, sentence in enumerate(sentences[:count]):
        key_term = common[idx % len(common)] if common else "this concept"
        cards.append({
            "question": f"What should you remember about {key_term}?",
            "answer": sentence,
        })
    if not cards and text:
        cards.append({"question": "What is the main point of these notes?", "answer": text[:500]})
    output = "\n\n".join(f"Q{index + 1}. {card['question']}\nA. {card['answer']}" for index, card in enumerate(cards))
    return ExecutionResult(kind="json", message=f"Generated {len(cards)} flashcards", data={"text": output, "flashcards": cards})


def handle_study_planner(files, payload, output_dir):
    subjects_raw = str(payload.get("subjects") or payload.get("text") or "Math, Science, English").strip()
    subjects = [item.strip() for item in re.split(r"[,;\n]+", subjects_raw) if item.strip()]
    if not subjects:
        subjects = ["Revision"]
    hours_per_day = max(0.5, min(16.0, float(payload.get("hours_per_day", 3))))
    exam_date_raw = str(payload.get("exam_date", "")).strip()
    today = datetime.now().date()
    try:
        exam_date = datetime.strptime(exam_date_raw, "%Y-%m-%d").date() if exam_date_raw else today + timedelta(days=14)
    except ValueError:
        exam_date = today + timedelta(days=14)
    days = max(1, min(120, (exam_date - today).days or 1))
    daily_blocks = []
    for day_index in range(days):
        subject = subjects[day_index % len(subjects)]
        secondary = subjects[(day_index + 1) % len(subjects)] if len(subjects) > 1 else subject
        date_label = (today + timedelta(days=day_index)).strftime("%d %b %Y")
        daily_blocks.append(
            f"Day {day_index + 1} ({date_label}): {hours_per_day:.1f}h total — "
            f"{subject} concept revision, {secondary} practice questions, 20 min quick recap."
        )
    output = "Study Plan\n" + "\n".join(daily_blocks)
    return ExecutionResult(kind="json", message=f"Study plan created for {days} days", data={"text": output, "days": days, "subjects": subjects})


def handle_grade_calculator(files, payload, output_dir):
    raw = str(payload.get("scores") or payload.get("text") or "").strip()
    pairs = re.findall(r"(\d+(?:\.\d+)?)\s*/\s*(\d+(?:\.\d+)?)", raw)
    if pairs:
        earned = sum(float(a) for a, _ in pairs)
        total = sum(float(b) for _, b in pairs)
    else:
        earned = float(payload.get("earned", 0))
        total = float(payload.get("total", 100))
    if total <= 0:
        return ExecutionResult(kind="json", message="Invalid total marks", data={"error": "Total marks must be greater than zero"})
    percent = earned / total * 100
    if percent >= 90:
        grade = "A+"
    elif percent >= 80:
        grade = "A"
    elif percent >= 70:
        grade = "B"
    elif percent >= 60:
        grade = "C"
    elif percent >= 50:
        grade = "D"
    else:
        grade = "Needs improvement"
    text = f"Earned: {earned:g}/{total:g}\nPercentage: {percent:.2f}%\nGrade: {grade}"
    return ExecutionResult(kind="json", message=f"Grade: {grade} ({percent:.2f}%)", data={"text": text, "percentage": round(percent, 2), "grade": grade})


def handle_attendance_calculator(files, payload, output_dir):
    attended = int(float(payload.get("attended", 0)))
    total = int(float(payload.get("total", 0)))
    target = float(payload.get("target", 75))
    if total <= 0 or attended < 0 or attended > total:
        return ExecutionResult(kind="json", message="Invalid attendance values", data={"error": "Use attended <= total and total > 0"})
    current = attended / total * 100
    needed = 0
    while ((attended + needed) / (total + needed) * 100) < target and needed < 10000:
        needed += 1
    can_miss = 0
    while total + can_miss + 1 > 0 and (attended / (total + can_miss + 1) * 100) >= target:
        can_miss += 1
    text = (
        f"Current attendance: {current:.2f}% ({attended}/{total})\n"
        f"Target attendance: {target:.2f}%\n"
        f"Classes needed to reach target: {needed}\n"
        f"Classes you can miss while staying above target: {can_miss}"
    )
    return ExecutionResult(kind="json", message=f"Attendance: {current:.2f}%", data={"text": text, "current": round(current, 2), "needed": needed, "can_miss": can_miss})


def handle_reading_time_calculator(files, payload, output_dir):
    text = str(payload.get("text", ""))
    wpm = max(50, min(800, int(float(payload.get("wpm", 200)))))
    words = re.findall(r"\S+", text)
    word_count = len(words)
    reading_minutes = word_count / wpm if word_count else 0
    speaking_minutes = word_count / 130 if word_count else 0
    result = (
        f"Words: {word_count}\n"
        f"Characters: {len(text)}\n"
        f"Reading speed: {wpm} WPM\n"
        f"Estimated reading time: {reading_minutes:.1f} minutes\n"
        f"Estimated speaking time: {speaking_minutes:.1f} minutes"
    )
    return ExecutionResult(kind="json", message=f"Reading time: {reading_minutes:.1f} min", data={"text": result, "words": word_count, "reading_minutes": round(reading_minutes, 1)})


def handle_plagiarism_risk_checker(files, payload, output_dir):
    text = str(payload.get("text", "")).strip()
    words = [w.lower() for w in re.findall(r"\b[\w'-]+\b", text)]
    total = len(words)
    if total < 20:
        return ExecutionResult(kind="json", message="Text too short for risk analysis", data={"text": "Add at least 20 words for a useful repetition and uniqueness check."})
    unique_ratio = len(set(words)) / total
    trigrams = [" ".join(words[i:i + 3]) for i in range(max(0, total - 2))]
    repeated = [phrase for phrase, n in Counter(trigrams).most_common(10) if n > 1]
    risk_score = 0
    if unique_ratio < 0.45:
        risk_score += 45
    elif unique_ratio < 0.6:
        risk_score += 25
    risk_score += min(45, len(repeated) * 8)
    risk_score = min(100, risk_score)
    level = "Low" if risk_score < 30 else "Medium" if risk_score < 65 else "High"
    output = (
        f"Plagiarism risk signals: {level} ({risk_score}/100)\n"
        f"Words: {total}\n"
        f"Unique word ratio: {unique_ratio:.2f}\n"
        f"Repeated 3-word phrases: {len(repeated)}\n\n"
        f"Most repeated phrases:\n" + ("\n".join(f"- {item}" for item in repeated) if repeated else "- None found") +
        "\n\nNote: This checks repetition and originality risk signals. It does not compare against the live web."
    )
    return ExecutionResult(kind="json", message=f"{level} plagiarism-risk signals", data={"text": output, "risk_score": risk_score, "level": level})


def handle_resume_bullet_generator(files, payload, output_dir):
    role = str(payload.get("role", "student project")).strip()
    task = str(payload.get("task") or payload.get("text") or "completed an important project").strip()
    metric = str(payload.get("metric", "")).strip()
    verbs = ["Designed", "Built", "Improved", "Led", "Optimized"]
    metric_part = f", resulting in {metric}" if metric else " with measurable improvement"
    bullets = [
        f"{verb} {task} for {role}{metric_part}."
        for verb in verbs
    ]
    output = "\n".join(f"- {bullet}" for bullet in bullets)
    return ExecutionResult(kind="json", message="Resume bullets generated", data={"text": output, "bullets": bullets})


# ═══════════════════════════════════════════════════════════
# HANDLER REGISTRY
# ═══════════════════════════════════════════════════════════

EXTRA_TOOL_HANDLERS: dict[str, ToolHandler] = {
    # Text encoding/conversion
    "text-to-morse": handle_text_to_morse,
    "morse-to-text": handle_morse_to_text,
    "text-to-binary": handle_text_to_binary,
    "binary-to-text": handle_binary_to_text,
    "text-to-hex": handle_text_to_hex,
    "hex-to-text": handle_hex_to_text,
    "text-to-octal": handle_text_to_octal,
    "octal-to-text": handle_octal_to_text,
    "text-to-unicode": handle_text_to_unicode,
    "unicode-to-text": handle_unicode_to_text,
    
    # Text operations
    "text-reverse": handle_text_reverse,
    "text-repeat": handle_text_repeat,
    "whitespace-remover": handle_whitespace_remover,
    "text-statistics": handle_text_statistics,
    "word-frequency": handle_word_frequency,
    "character-counter": handle_character_counter,
    "line-counter": handle_line_counter,
    "text-to-ascii-art": handle_text_to_ascii_art,
    "fancy-text-generator": handle_fancy_text,
    "nato-alphabet": handle_nato_alphabet,
    "pig-latin": handle_pig_latin,
    
    # Number converters
    "number-to-roman": handle_number_to_roman,
    "roman-to-number": handle_roman_to_number,
    "number-base-converter": handle_number_base_converter,
    
    # Generators
    "random-color-generator": handle_color_code_generator,
    "string-hash": handle_string_hash,
    "json-path-finder": handle_json_path_finder,
    "epoch-converter": handle_epoch_converter,
    
    # Math — improved accuracy
    "percentage-calculator": handle_percentage_calculator_improved,
    "scientific-calculator": handle_scientific_calculator_improved,
    "compound-interest-calculator": handle_compound_interest,
    "loan-emi-calculator": handle_loan_emi,
    "citation-generator": handle_citation_generator,
    "flashcard-generator": handle_flashcard_generator,
    "study-planner": handle_study_planner,
    "grade-calculator": handle_grade_calculator,
    "attendance-calculator": handle_attendance_calculator,
    "reading-time-calculator": handle_reading_time_calculator,
    "plagiarism-risk-checker": handle_plagiarism_risk_checker,
    "resume-bullet-generator": handle_resume_bullet_generator,
}
