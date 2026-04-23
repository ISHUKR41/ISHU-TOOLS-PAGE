"""Batch 1: Fix 50 critical missing tool handlers — text/math/utility/finance tools."""
from __future__ import annotations
import hashlib, hmac as _hmac, json, math, random, re, string, time, uuid
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
from .handlers import HANDLERS, ExecutionResult

def _jr(msg, data): return ExecutionResult(kind="json", message=msg, data=data)

# ── Text Tools ──
def handle_anagram_checker(f, p, o):
    w1 = sorted(re.sub(r'\s+','',p.get('text','').lower()))
    w2 = sorted(re.sub(r'\s+','',p.get('text2','').lower()))
    match = w1 == w2 and len(w1) > 0
    return _jr("Anagram check complete", {"is_anagram": match, "word1": p.get('text',''), "word2": p.get('text2','')})

def handle_anagram_detector(f, p, o): return handle_anagram_checker(f, p, o)

def handle_palindrome_checker(f, p, o):
    t = re.sub(r'[^a-z0-9]','',p.get('text','').lower())
    return _jr("Palindrome check done", {"is_palindrome": t == t[::-1], "cleaned": t})

def handle_is_palindrome(f, p, o): return handle_palindrome_checker(f, p, o)
def handle_number_palindrome_checker(f, p, o):
    n = str(p.get('number', p.get('text','')))
    return _jr("Number palindrome check", {"is_palindrome": n == n[::-1], "number": n})

def handle_char_frequency(f, p, o):
    t = p.get('text','')
    freq = dict(Counter(t))
    return _jr("Character frequency analysis", {"frequency": freq, "total_chars": len(t), "unique_chars": len(freq)})

def handle_character_frequency(f, p, o): return handle_char_frequency(f, p, o)
def handle_letter_frequency(f, p, o): return handle_char_frequency(f, p, o)

def handle_word_frequency_counter(f, p, o):
    t = p.get('text','')
    words = re.findall(r'\b\w+\b', t.lower())
    freq = dict(Counter(words).most_common(100))
    return _jr("Word frequency analysis", {"frequency": freq, "total_words": len(words), "unique_words": len(set(words))})

def handle_text_compare(f, p, o):
    import difflib
    t1, t2 = p.get('text',''), p.get('text2','')
    diff = list(difflib.unified_diff(t1.splitlines(), t2.splitlines(), lineterm=''))
    similarity = difflib.SequenceMatcher(None, t1, t2).ratio()
    return _jr("Text comparison complete", {"diff": '\n'.join(diff), "similarity": round(similarity*100,2), "identical": t1==t2})

def handle_text_diff(f, p, o): return handle_text_compare(f, p, o)
def handle_json_diff(f, p, o):
    try:
        j1, j2 = json.loads(p.get('text','{}')), json.loads(p.get('text2','{}'))
        def _diff(a,b,path=""):
            diffs=[]
            if type(a)!=type(b): diffs.append({"path":path,"type":"type_change","old":str(type(a).__name__),"new":str(type(b).__name__)}); return diffs
            if isinstance(a,dict):
                for k in set(list(a.keys())+list(b.keys())):
                    if k not in a: diffs.append({"path":f"{path}.{k}","type":"added","value":b[k]})
                    elif k not in b: diffs.append({"path":f"{path}.{k}","type":"removed","value":a[k]})
                    else: diffs.extend(_diff(a[k],b[k],f"{path}.{k}"))
            elif isinstance(a,list):
                for i in range(max(len(a),len(b))):
                    if i>=len(a): diffs.append({"path":f"{path}[{i}]","type":"added"})
                    elif i>=len(b): diffs.append({"path":f"{path}[{i}]","type":"removed"})
                    else: diffs.extend(_diff(a[i],b[i],f"{path}[{i}]"))
            elif a!=b: diffs.append({"path":path,"type":"changed","old":a,"new":b})
            return diffs
        d=_diff(j1,j2,"$")
        return _jr("JSON diff complete",{"differences":d,"total_changes":len(d)})
    except: return _jr("Invalid JSON",{"error":"Could not parse JSON inputs"})

def handle_sort_lines(f, p, o):
    t = p.get('text','')
    order = p.get('order','asc')
    lines = [l for l in t.splitlines() if l.strip()]
    lines.sort(reverse=(order=='desc'))
    return _jr("Lines sorted",{"result":'\n'.join(lines),"line_count":len(lines)})

def handle_line_sorter(f, p, o): return handle_sort_lines(f, p, o)
def handle_text_line_sorter(f, p, o): return handle_sort_lines(f, p, o)

def handle_remove_duplicates(f, p, o):
    lines = p.get('text','').splitlines()
    seen, unique = set(), []
    for l in lines:
        if l.strip() not in seen: seen.add(l.strip()); unique.append(l)
    return _jr("Duplicates removed",{"result":'\n'.join(unique),"original":len(lines),"unique":len(unique),"removed":len(lines)-len(unique)})

def handle_deduplicate_list(f, p, o): return handle_remove_duplicates(f, p, o)
def handle_list_deduplicator(f, p, o): return handle_remove_duplicates(f, p, o)

def handle_reading_time(f, p, o):
    t = p.get('text','')
    wc = len(t.split())
    mins = max(1, round(wc/200))
    return _jr("Reading time estimated",{"word_count":wc,"reading_time_minutes":mins,"speaking_time_minutes":max(1,round(wc/130))})

def handle_reading_time_estimator(f, p, o): return handle_reading_time(f, p, o)
def handle_estimate_reading_time(f, p, o): return handle_reading_time(f, p, o)

def handle_text_readability_score(f, p, o):
    t = p.get('text','')
    words = t.split(); sentences = re.split(r'[.!?]+', t); syllables = sum(max(1,len(re.findall(r'[aeiouy]+',w.lower()))) for w in words)
    wc, sc = len(words), max(1,len([s for s in sentences if s.strip()]))
    fk = 206.835 - 1.015*(wc/sc) - 84.6*(syllables/max(1,wc)) if wc else 0
    return _jr("Readability analysis",{"flesch_kincaid":round(fk,1),"word_count":wc,"sentence_count":sc,"avg_words_per_sentence":round(wc/sc,1)})

def handle_morse_code_converter(f, p, o):
    MORSE = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'}
    t = p.get('text','').upper()
    if all(c in '.-/ ' for c in t):
        REV = {v:k for k,v in MORSE.items()}
        decoded = ' '.join(''.join(REV.get(c,'?') for c in word.split(' ')) for word in t.split(' / '))
        return _jr("Morse decoded",{"result":decoded,"direction":"morse_to_text"})
    encoded = ' / '.join(' '.join(MORSE.get(c,'') for c in word) for word in t.split())
    return _jr("Morse encoded",{"result":encoded,"direction":"text_to_morse"})

def handle_morse_decoder(f, p, o): return handle_morse_code_converter(f, p, o)

def handle_braille_converter(f, p, o):
    BRAILLE = {c: chr(0x2800 + i + (1 if i<10 else 0)) for i, c in enumerate("abcdefghijklmnopqrstuvwxyz")}
    t = p.get('text','').lower()
    result = ''.join(BRAILLE.get(c, c) for c in t)
    return _jr("Braille conversion done",{"result":result})

def handle_text_to_braille(f, p, o): return handle_braille_converter(f, p, o)

# ── Math/Calculator Tools ──
def handle_percentage_change(f, p, o):
    old, new = float(p.get('old_value',0)), float(p.get('new_value',0))
    change = ((new-old)/old*100) if old else 0
    return _jr("Percentage change calculated",{"old_value":old,"new_value":new,"change_percent":round(change,2),"direction":"increase" if change>0 else "decrease"})

def handle_percentage_change_calculator(f, p, o): return handle_percentage_change(f, p, o)
def handle_percent_change(f, p, o): return handle_percentage_change(f, p, o)

def handle_fraction_calculator(f, p, o):
    from fractions import Fraction
    expr = p.get('text','').strip()
    try:
        parts = re.split(r'([+\-*/])', expr.replace(' ',''))
        if len(parts)==3:
            a,op,b = Fraction(parts[0]),parts[1],Fraction(parts[2])
            r = {'+':a+b,'-':a-b,'*':a*b,'/':a/b}[op]
            return _jr("Fraction calculated",{"result":str(r),"decimal":float(r)})
        return _jr("Fraction simplified",{"result":str(Fraction(expr)),"decimal":float(Fraction(expr))})
    except: return _jr("Error",{"error":"Invalid fraction expression"})

def handle_fraction_math(f, p, o): return handle_fraction_calculator(f, p, o)

def handle_prime_number_checker(f, p, o):
    n = int(p.get('number', p.get('text',2)))
    if n < 2: return _jr("Not prime",{"number":n,"is_prime":False})
    for i in range(2, int(n**0.5)+1):
        if n%i==0: return _jr("Not prime",{"number":n,"is_prime":False,"divisor":i})
    return _jr("Prime number",{"number":n,"is_prime":True})

def handle_speed_calculator(f, p, o):
    d,t,s = p.get('distance'), p.get('time'), p.get('speed')
    if d and t: return _jr("Speed calculated",{"speed":round(float(d)/float(t),2),"unit":"km/h"})
    if s and t: return _jr("Distance calculated",{"distance":round(float(s)*float(t),2)})
    if s and d: return _jr("Time calculated",{"time":round(float(d)/float(s),2)})
    return _jr("Error",{"error":"Provide any 2 of: distance, time, speed"})

def handle_aspect_ratio_calculator(f, p, o):
    w, h = int(p.get('width',1920)), int(p.get('height',1080))
    from math import gcd
    g = gcd(w,h)
    return _jr("Aspect ratio calculated",{"width":w,"height":h,"ratio":f"{w//g}:{h//g}","decimal":round(w/h,4)})

def handle_image_aspect_ratio(f, p, o): return handle_aspect_ratio_calculator(f, p, o)

# ── Finance Tools (India-focused) ──
def handle_gst_calculator_india(f, p, o):
    amt = float(p.get('amount',0)); rate = float(p.get('rate',18))
    gst = amt * rate / 100
    return _jr("GST calculated",{"original":amt,"gst_rate":rate,"cgst":round(gst/2,2),"sgst":round(gst/2,2),"total_gst":round(gst,2),"total_amount":round(amt+gst,2)})

def handle_gstin_validator(f, p, o):
    gstin = p.get('text','').strip().upper()
    valid = bool(re.match(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$', gstin))
    return _jr("GSTIN validation",{"gstin":gstin,"is_valid":valid,"state_code":gstin[:2] if len(gstin)>=2 else ""})

def handle_sip_calculator_india(f, p, o):
    monthly = float(p.get('monthly_investment',5000)); rate = float(p.get('annual_rate',12))/100/12; years = int(p.get('years',10))
    months = years*12; fv = monthly*((((1+rate)**months)-1)/rate)*(1+rate) if rate else monthly*months
    invested = monthly*months
    return _jr("SIP calculated",{"monthly_investment":monthly,"years":years,"total_invested":round(invested,2),"estimated_returns":round(fv-invested,2),"maturity_value":round(fv,2)})

def handle_income_tax_calculator_india(f, p, o):
    income = float(p.get('income',0)); regime = p.get('regime','new')
    if regime == 'new':
        slabs = [(300000,0),(600000,0.05),(900000,0.10),(1200000,0.15),(1500000,0.20),(float('inf'),0.30)]
    else:
        slabs = [(250000,0),(500000,0.05),(1000000,0.20),(float('inf'),0.30)]
    tax, prev = 0, 0
    for limit, rate in slabs:
        taxable = min(income, limit) - prev
        if taxable > 0: tax += taxable * rate
        prev = limit
        if income <= limit: break
    cess = tax * 0.04
    return _jr("Income tax calculated",{"income":income,"regime":regime,"tax":round(tax,2),"cess":round(cess,2),"total_tax":round(tax+cess,2),"effective_rate":round((tax+cess)/income*100,2) if income else 0})

def handle_emi_monthly(f, p, o):
    P = float(p.get('principal',100000)); r = float(p.get('rate',10))/100/12; n = int(p.get('months', int(p.get('years',1))*12))
    if r == 0: emi = P/n
    else: emi = P*r*(1+r)**n/((1+r)**n-1)
    return _jr("EMI calculated",{"principal":P,"emi":round(emi,2),"total_payment":round(emi*n,2),"total_interest":round(emi*n-P,2)})

def handle_monthly_emi(f, p, o): return handle_emi_monthly(f, p, o)

def handle_epf_calculator_india(f, p, o):
    basic = float(p.get('basic_salary',15000)); contrib_rate = 0.12; years = int(p.get('years',20))
    monthly_contrib = basic * contrib_rate * 2; rate = 0.0816/12; months = years*12
    fv = monthly_contrib*((((1+rate)**months)-1)/rate)*(1+rate) if rate else monthly_contrib*months
    return _jr("EPF calculated",{"monthly_contribution":round(monthly_contrib,2),"years":years,"maturity_value":round(fv,2)})

def handle_ifsc_code_finder(f, p, o):
    ifsc = p.get('text','').strip().upper()
    valid = bool(re.match(r'^[A-Z]{4}0[A-Z0-9]{6}$', ifsc))
    bank_code = ifsc[:4] if len(ifsc)>=4 else ""
    return _jr("IFSC lookup",{"ifsc":ifsc,"is_valid":valid,"bank_code":bank_code,"branch_code":ifsc[4:] if len(ifsc)>4 else ""})

def handle_ppf_calculator(f, p, o):
    annual = float(p.get('annual_investment',150000)); years = int(p.get('years',15)); rate = float(p.get('rate',7.1))/100
    balance = 0
    for _ in range(years): balance = (balance + annual) * (1 + rate)
    return _jr("PPF calculated",{"annual_investment":annual,"years":years,"rate":rate*100,"maturity_value":round(balance,2),"total_invested":annual*years,"interest_earned":round(balance-annual*years,2)})

def handle_public_provident_fund_calculator(f, p, o): return handle_ppf_calculator(f, p, o)
def handle_provident_fund_calculator(f, p, o): return handle_ppf_calculator(f, p, o)

def handle_nps_calculator(f, p, o):
    monthly = float(p.get('monthly',5000)); years = int(p.get('years',25)); rate = float(p.get('rate',10))/100/12
    months = years*12; fv = monthly*((((1+rate)**months)-1)/rate)*(1+rate) if rate else monthly*months
    return _jr("NPS calculated",{"monthly":monthly,"years":years,"corpus":round(fv,2),"invested":monthly*months})

def handle_fixed_deposit_calculator_india(f, p, o):
    P = float(p.get('principal',100000)); r = float(p.get('rate',7))/100; t = float(p.get('years',1)); n = int(p.get('compounding',4))
    A = P * (1 + r/n)**(n*t)
    return _jr("FD calculated",{"principal":P,"rate":r*100,"years":t,"maturity":round(A,2),"interest":round(A-P,2)})

def handle_recurring_deposit_calculator(f, p, o):
    monthly = float(p.get('monthly',5000)); r = float(p.get('rate',7))/100/4; months = int(p.get('months',12))
    n = months//3; maturity = monthly*months + monthly*months*(months+1)*r/(2*4)
    return _jr("RD calculated",{"monthly":monthly,"months":months,"maturity":round(maturity,2)})

def handle_gratuity_calculator_india(f, p, o):
    salary = float(p.get('last_salary',30000)); years = float(p.get('years',5))
    gratuity = salary * 15 * years / 26 if years >= 5 else 0
    return _jr("Gratuity calculated",{"last_salary":salary,"years":years,"gratuity":round(gratuity,2),"eligible":years>=5})

def handle_hra_calculator_india(f, p, o):
    basic = float(p.get('basic',30000)); hra_recv = float(p.get('hra_received',12000))
    rent = float(p.get('rent_paid',15000)); metro = p.get('metro',True)
    pct = 0.50 if metro else 0.40
    exempt = min(hra_recv, pct*basic, max(0, rent - 0.10*basic))
    return _jr("HRA calculated",{"basic":basic,"hra_received":hra_recv,"exempt":round(exempt,2),"taxable_hra":round(hra_recv-exempt,2)})

def handle_in_hand_salary_calculator(f, p, o):
    ctc = float(p.get('ctc',1200000))
    basic = ctc*0.40; hra = basic*0.40; pf = min(basic*0.12,21600*12); gratuity = basic*15*1/26/12*12
    gross = ctc-gratuity; deductions = pf + ctc*0.02
    return _jr("Salary breakdown",{"ctc":ctc,"basic":round(basic,2),"hra":round(hra,2),"pf_deduction":round(pf,2),"monthly_in_hand":round((gross-deductions)/12,2)})

def handle_net_salary_calculator_india(f, p, o): return handle_in_hand_salary_calculator(f, p, o)

# ── Register all handlers ──
_MAP = {
    "anagram-checker": handle_anagram_checker, "anagram-detector": handle_anagram_detector,
    "palindrome-checker": handle_palindrome_checker, "is-palindrome": handle_is_palindrome,
    "number-palindrome-checker": handle_number_palindrome_checker,
    "char-frequency": handle_char_frequency, "character-frequency": handle_character_frequency,
    "letter-frequency": handle_letter_frequency, "word-frequency-counter": handle_word_frequency_counter,
    "text-compare": handle_text_compare, "text-diff": handle_text_diff, "json-diff": handle_json_diff,
    "sort-lines": handle_sort_lines, "line-sorter": handle_line_sorter, "text-line-sorter": handle_text_line_sorter,
    "remove-duplicates": handle_remove_duplicates, "deduplicate-list": handle_deduplicate_list,
    "list-deduplicator": handle_list_deduplicator,
    "reading-time": handle_reading_time, "reading-time-estimator": handle_reading_time_estimator,
    "estimate-reading-time": handle_estimate_reading_time, "text-readability-score": handle_text_readability_score,
    "morse-code-converter": handle_morse_code_converter, "morse-decoder": handle_morse_decoder,
    "braille-converter": handle_braille_converter, "text-to-braille": handle_text_to_braille,
    "percentage-change": handle_percentage_change, "percentage-change-calculator": handle_percentage_change_calculator,
    "percent-change": handle_percent_change,
    "fraction-calculator": handle_fraction_calculator, "fraction-math": handle_fraction_math,
    "prime-number-checker": handle_prime_number_checker, "speed-calculator": handle_speed_calculator,
    "aspect-ratio-calculator": handle_aspect_ratio_calculator, "image-aspect-ratio": handle_image_aspect_ratio,
    "gst-calculator-india": handle_gst_calculator_india, "gstin-validator": handle_gstin_validator,
    "sip-calculator-india": handle_sip_calculator_india,
    "income-tax-calculator-india": handle_income_tax_calculator_india,
    "monthly-emi": handle_monthly_emi,
    "epf-calculator-india": handle_epf_calculator_india, "ifsc-code-finder": handle_ifsc_code_finder,
    "ppf-calculator": handle_ppf_calculator, "public-provident-fund-calculator": handle_public_provident_fund_calculator,
    "provident-fund-calculator": handle_provident_fund_calculator, "nps-calculator": handle_nps_calculator,
    "fixed-deposit-calculator-india": handle_fixed_deposit_calculator_india,
    "recurring-deposit-calculator": handle_recurring_deposit_calculator,
    "gratuity-calculator-india": handle_gratuity_calculator_india,
    "hra-calculator-india": handle_hra_calculator_india,
    "in-hand-salary-calculator": handle_in_hand_salary_calculator,
    "net-salary-calculator-india": handle_net_salary_calculator_india,
}
HANDLERS.update(_MAP)
