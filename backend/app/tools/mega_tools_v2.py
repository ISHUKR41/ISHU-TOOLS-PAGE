"""
ISHU TOOLS — Mega Tools V2
New tool handlers: AI Writing, Crypto/Web3, HR/Jobs, Legal, Travel,
Developer Tools V2, Finance V2, Health V2, Productivity V2.
~60 new handlers, all production-ready.
"""
from __future__ import annotations
import hashlib
import json
import math
import re
import string
import random
import unicodedata
from dataclasses import dataclass
from datetime import datetime, date, timedelta
from pathlib import Path
from typing import Any, Optional


@dataclass
class ExecutionResult:
    kind: str
    message: str
    output_path: Optional[Path] = None
    filename: Optional[str] = None
    data: Optional[dict] = None
    content_type: Optional[str] = None


# ══════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════

def _ok(data: Any, message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", data=data, message=message)

def _err(msg: str) -> ExecutionResult:
    return ExecutionResult(kind="json", data={"error": msg}, message=msg)

def _p(payload: dict, key: str, default="") -> str:
    return str(payload.get(key, default)).strip()

def _pi(payload: dict, key: str, default: int = 0) -> int:
    try:
        return int(float(payload.get(key, default)))
    except Exception:
        return default

def _pf(payload: dict, key: str, default: float = 0.0) -> float:
    try:
        return float(payload.get(key, default))
    except Exception:
        return default


# ══════════════════════════════════════════════════════════════════
# AI WRITING TOOLS
# ══════════════════════════════════════════════════════════════════

def handle_ai_headline_generator(files, payload, job_dir):
    topic = _p(payload, "text")
    style = _p(payload, "style", "listicle")
    count = max(1, min(10, _pi(payload, "count", 5)))
    if not topic:
        return _err("Please enter a topic or product name.")

    templates = {
        "listicle": [
            f"{random.choice([5,7,10,12,15])} Ways to {topic.title()} (That Actually Work in {datetime.now().year})",
            f"The Top {random.choice([7,10,12])} {topic.title()} Strategies You Haven't Tried Yet",
            f"{random.choice([3,5,7])} {topic.title()} Mistakes Everyone Makes (And How to Avoid Them)",
            f"{random.choice([10,15,20])} Proven {topic.title()} Tips for Beginners",
            f"The Ultimate {topic.title()} Checklist: {random.choice([10,15,20])} Must-Know Points",
        ],
        "howto": [
            f"How to {topic.title()} in {random.choice(['5 Minutes','Under an Hour','One Week'])}",
            f"How to Master {topic.title()} (Complete Step-by-Step Guide)",
            f"How I {topic.title()} and Saved {random.choice(['₹50,000','$500','10 Hours a Week'])}",
            f"How to {topic.title()} Without {random.choice(['Any Experience','Breaking the Bank','Stress'])}",
            f"The Easiest Way to {topic.title()}: A Beginner's Guide",
        ],
        "question": [
            f"Is {topic.title()} Worth It in {datetime.now().year}?",
            f"What Nobody Tells You About {topic.title()}",
            f"Why Is {topic.title()} So Important? (The Truth)",
            f"Are You Making These {topic.title()} Mistakes?",
            f"Which {topic.title()} Method Is Right for You?",
        ],
        "controversial": [
            f"Why {topic.title()} Is Overrated (And What to Do Instead)",
            f"The {topic.title()} Myth That Experts Won't Admit",
            f"Stop Doing {topic.title()} This Way — Here's Why",
            f"The Dark Side of {topic.title()} No One Talks About",
            f"I Tried {topic.title()} for 30 Days — Here's What Happened",
        ],
    }

    all_headlines = templates.get(style, templates["listicle"])
    selected = (all_headlines * math.ceil(count / len(all_headlines)))[:count]

    return _ok({
        "topic": topic,
        "style": style,
        "headlines": selected,
        "tip": "Test multiple headlines with A/B testing. Headlines with numbers typically get 36% more clicks."
    }, f"Generated {len(selected)} {style} headlines")


def handle_blog_outline_generator(files, payload, job_dir):
    topic = _p(payload, "text")
    tone = _p(payload, "tone", "informative")
    sections = max(3, min(10, _pi(payload, "sections", 6)))
    if not topic:
        return _err("Please enter a blog topic.")

    intro_hooks = [
        f"Did you know that {topic.lower()} affects millions of people every year?",
        f"If you've ever struggled with {topic.lower()}, you're not alone.",
        f"In {datetime.now().year}, {topic.lower()} has become more important than ever.",
    ]

    outline = {
        "title": f"The Complete Guide to {topic.title()} ({datetime.now().year} Edition)",
        "meta_description": f"Everything you need to know about {topic.lower()} — tips, strategies, and expert insights. Updated for {datetime.now().year}.",
        "estimated_word_count": sections * 300,
        "reading_time": f"{max(1, sections * 300 // 200)} min",
        "tone": tone,
        "intro_hook": random.choice(intro_hooks),
        "sections": [
            {"heading": f"What Is {topic.title()} and Why It Matters", "type": "intro", "word_target": 200},
            {"heading": f"The Key Benefits of {topic.title()}", "type": "benefits", "word_target": 300},
            {"heading": f"How to Get Started with {topic.title()}", "type": "howto", "word_target": 400},
            {"heading": f"Common {topic.title()} Mistakes to Avoid", "type": "mistakes", "word_target": 300},
            {"heading": f"Best {topic.title()} Tools and Resources", "type": "tools", "word_target": 250},
            {"heading": f"{topic.title()}: FAQs Answered", "type": "faq", "word_target": 200},
            {"heading": f"Conclusion: Your {topic.title()} Action Plan", "type": "conclusion", "word_target": 150},
        ][:sections],
        "suggested_keywords": [
            topic.lower(), f"{topic.lower()} guide", f"{topic.lower()} tips",
            f"how to {topic.lower()}", f"best {topic.lower()}", f"{topic.lower()} {datetime.now().year}"
        ],
    }

    return _ok(outline, f"Generated {sections}-section blog outline for: {topic}")


def handle_email_subject_generator(files, payload, job_dir):
    context = _p(payload, "text")
    goal = _p(payload, "goal", "engagement")
    count = max(1, min(10, _pi(payload, "count", 5)))
    if not context:
        return _err("Please enter email context or product/campaign name.")

    base = context.title()
    now_year = datetime.now().year
    subjects = {
        "engagement": [
            f"Quick question about {base}",
            f"You won't believe what {base} can do",
            f"[Action required] Your {base} update",
            f"Don't miss this — {base} insight",
            f"Re: {base} — important",
        ],
        "promotion": [
            f"🎯 {base} — Limited time offer",
            f"Exclusive deal: {base} at special price",
            f"Your {base} discount expires soon",
            f"Last chance: {base} sale ends tonight",
            f"Unlock your {base} benefit now",
        ],
        "newsletter": [
            f"This week in {base}: Top picks",
            f"{base} digest — {datetime.now().strftime('%B %Y')}",
            f"What's new in {base} this week",
            f"{base} roundup: The best of the week",
            f"Your {base} briefing is ready",
        ],
        "reengagement": [
            f"We miss you — here's what's new in {base}",
            f"It's been a while... {base} has changed",
            f"Come back — we've improved {base} just for you",
            f"Still thinking about {base}?",
            f"A special gift because you've been away from {base}",
        ],
    }

    options = (subjects.get(goal, subjects["engagement"]) * 2)[:count]
    return _ok({
        "context": context,
        "goal": goal,
        "subjects": options,
        "open_rate_tip": "Keep subjects under 50 chars for mobile. Personalization tokens increase open rates by 26%."
    }, f"Generated {len(options)} email subject lines")


def handle_product_description_generator(files, payload, job_dir):
    product = _p(payload, "text")
    features = _p(payload, "features", "")
    tone = _p(payload, "tone", "professional")
    if not product:
        return _err("Please enter a product name.")

    feature_list = [f.strip() for f in features.split(",") if f.strip()] if features else [
        "premium quality", "easy to use", "durable", "value for money"
    ]

    tones = {
        "professional": f"Introducing {product} — designed for professionals who demand excellence. {', '.join(feature_list[:3])} come together in one powerful solution.",
        "casual": f"Meet {product}! It's got everything you need — {', '.join(feature_list[:3])} and so much more. You're going to love it.",
        "luxury": f"Experience the pinnacle of refinement with {product}. Crafted for those who accept nothing but the finest — {', '.join(feature_list[:3])}.",
        "technical": f"{product} specifications: {', '.join(feature_list)}. Engineered for precision and performance.",
    }

    short_desc = tones.get(tone, tones["professional"])

    return _ok({
        "product": product,
        "short_description": short_desc,
        "bullet_points": [f"✓ {f.title()}" for f in feature_list[:6]],
        "seo_title": f"Buy {product} Online — Best Price, Fast Delivery",
        "meta_description": f"{product} — {', '.join(feature_list[:3])}. Shop now at best price with free shipping.",
        "amazon_style_title": f"{product} | {' | '.join(feature_list[:3]).title()} | Premium Quality",
    }, f"Generated product description for: {product}")


def handle_social_caption_generator(files, payload, job_dir):
    content = _p(payload, "text")
    platform = _p(payload, "platform", "instagram")
    tone = _p(payload, "tone", "casual")
    if not content:
        return _err("Please describe what your post is about.")

    hashtag_map = {
        "instagram": ["#instadaily", "#photooftheday", "#instagood", "#love", "#trending", "#viral", f"#{content.replace(' ', '').lower()[:15]}"],
        "twitter": [f"#{content.split()[0].lower()}", "#trending", "#viral"],
        "linkedin": [f"#{content.replace(' ', '').lower()[:15]}", "#professional", "#career", "#growth"],
        "facebook": [],
    }

    tone_starters = {
        "casual": ["Just wanted to share", "Honestly?", "Real talk:", "Here's something cool:"],
        "professional": ["Excited to share", "Proud to announce", "Key insight:", "A reminder:"],
        "funny": ["Plot twist:", "Nobody asked but", "Unpopular opinion:", "Hot take:"],
        "inspirational": ["Remember:", "Every day is a chance to", "Believe this:", "Your reminder:"],
    }

    starter = random.choice(tone_starters.get(tone, tone_starters["casual"]))
    hashtags = " ".join(hashtag_map.get(platform, hashtag_map["instagram"])[:5])

    captions = [
        f"{starter} {content}. What do you think? Drop your thoughts below! 👇\n\n{hashtags}",
        f"{content} — and that's the truth. 💯\n\n{hashtags}",
        f"🔥 {content}\n\nSave this post if it helped you!\n\n{hashtags}",
    ]

    return _ok({
        "platform": platform,
        "captions": captions,
        "hashtags": hashtag_map.get(platform, []),
        "best_time_to_post": {
            "instagram": "Tue-Fri, 11am-1pm or 7pm-9pm",
            "twitter": "Mon-Wed, 9am-11am",
            "linkedin": "Tue-Thu, 7am-9am or 5pm-6pm",
            "facebook": "Wed-Sun, 1pm-4pm",
        }.get(platform, "Weekdays, 10am-12pm"),
    }, f"Generated {platform} captions")


# ══════════════════════════════════════════════════════════════════
# CRYPTO / WEB3 TOOLS
# ══════════════════════════════════════════════════════════════════

def handle_crypto_profit_calculator(files, payload, job_dir):
    buy_price = _pf(payload, "buy_price")
    sell_price = _pf(payload, "sell_price")
    quantity = _pf(payload, "quantity", 1)
    investment = _pf(payload, "investment")
    coin = _p(payload, "coin", "BTC")

    if buy_price <= 0:
        return _err("Please enter a valid buy price.")

    if investment > 0 and quantity == 0:
        quantity = investment / buy_price

    cost_basis = buy_price * quantity
    if sell_price > 0:
        sell_value = sell_price * quantity
        profit = sell_value - cost_basis
        profit_pct = (profit / cost_basis) * 100 if cost_basis > 0 else 0
        # Indian STCG/LTCG tax (flat 30% for crypto in India post 2022)
        tax_india = max(0, profit) * 0.30
        tds = sell_value * 0.01  # 1% TDS on sell value
    else:
        sell_value = profit = profit_pct = tax_india = tds = 0

    return _ok({
        "coin": coin.upper(),
        "quantity": round(quantity, 8),
        "buy_price": buy_price,
        "sell_price": sell_price,
        "cost_basis": round(cost_basis, 2),
        "sell_value": round(sell_value, 2),
        "profit_loss": round(profit, 2),
        "profit_loss_pct": round(profit_pct, 2),
        "india_tax": {
            "flat_30pct_tax": round(tax_india, 2),
            "tds_1pct": round(tds, 2),
            "note": "India: 30% flat tax on crypto gains + 1% TDS on sell value (Budget 2022)"
        },
        "break_even_price": round(buy_price * 1.01, 4),
        "status": "profit" if profit > 0 else ("loss" if profit < 0 else "break-even"),
    }, "Crypto profit/loss calculated")


def handle_eth_gas_calculator(files, payload, job_dir):
    gas_limit = _pi(payload, "gas_limit", 21000)
    gas_price_gwei = _pf(payload, "gas_price_gwei", 20)
    eth_price_usd = _pf(payload, "eth_price_usd", 3000)

    gas_cost_eth = (gas_limit * gas_price_gwei) / 1e9
    gas_cost_usd = gas_cost_eth * eth_price_usd
    gas_cost_inr = gas_cost_usd * 83.5  # approx INR

    return _ok({
        "gas_limit": gas_limit,
        "gas_price_gwei": gas_price_gwei,
        "gas_cost_eth": round(gas_cost_eth, 8),
        "gas_cost_usd": round(gas_cost_usd, 4),
        "gas_cost_inr": round(gas_cost_inr, 2),
        "transaction_types": {
            "Simple ETH Transfer": f"${round((21000 * gas_price_gwei / 1e9) * eth_price_usd, 4)} (21,000 gas)",
            "ERC-20 Transfer": f"${round((65000 * gas_price_gwei / 1e9) * eth_price_usd, 4)} (~65,000 gas)",
            "Uniswap Swap": f"${round((150000 * gas_price_gwei / 1e9) * eth_price_usd, 4)} (~150,000 gas)",
            "NFT Mint": f"${round((200000 * gas_price_gwei / 1e9) * eth_price_usd, 4)} (~200,000 gas)",
        },
        "tip": "Use Etherscan Gas Tracker for live gas prices. Transactions are cheapest on weekends."
    }, "ETH gas fee calculated")


def handle_crypto_dca_calculator(files, payload, job_dir):
    coin = _p(payload, "coin", "BTC")
    weekly_invest = _pf(payload, "weekly_invest", 1000)
    weeks = max(1, min(260, _pi(payload, "weeks", 52)))
    start_price = _pf(payload, "start_price", 1000)
    current_price = _pf(payload, "current_price")
    price_growth_pct = _pf(payload, "price_growth_pct", 50)

    if current_price <= 0:
        current_price = start_price * (1 + price_growth_pct / 100)

    total_invested = weekly_invest * weeks
    # Simulate DCA: buy every week with linearly interpolated price
    total_coins = 0.0
    entries = []
    for w in range(weeks):
        price = start_price + (current_price - start_price) * (w / max(1, weeks - 1))
        coins = weekly_invest / price
        total_coins += coins
        if w % max(1, weeks // 6) == 0:
            entries.append({"week": w + 1, "price": round(price, 2), "coins_bought": round(coins, 6)})

    avg_cost = total_invested / total_coins if total_coins > 0 else 0
    current_value = total_coins * current_price
    profit = current_value - total_invested

    return _ok({
        "coin": coin.upper(),
        "strategy": f"₹{weekly_invest:,.0f}/week × {weeks} weeks",
        "total_invested": round(total_invested, 2),
        "total_coins": round(total_coins, 6),
        "average_cost": round(avg_cost, 2),
        "current_price": round(current_price, 2),
        "current_value": round(current_value, 2),
        "profit_loss": round(profit, 2),
        "profit_pct": round((profit / total_invested) * 100, 2) if total_invested > 0 else 0,
        "vs_lump_sum": {
            "lump_sum_coins": round(total_invested / start_price, 6),
            "lump_sum_value": round((total_invested / start_price) * current_price, 2),
            "dca_advantage": round(current_value - (total_invested / start_price) * current_price, 2),
        },
        "sample_entries": entries[:6],
    }, "DCA simulation complete")


def handle_nft_royalty_calculator(files, payload, job_dir):
    sale_price = _pf(payload, "sale_price", 1)
    royalty_pct = _pf(payload, "royalty_pct", 10)
    platform_fee_pct = _pf(payload, "platform_fee_pct", 2.5)
    eth_price = _pf(payload, "eth_price", 3000)

    royalty_eth = sale_price * royalty_pct / 100
    platform_fee_eth = sale_price * platform_fee_pct / 100
    creator_proceeds_eth = sale_price - platform_fee_eth  # primary sale
    royalty_usd = royalty_eth * eth_price
    royalty_inr = royalty_usd * 83.5

    return _ok({
        "sale_price_eth": sale_price,
        "royalty_pct": royalty_pct,
        "royalty_eth": round(royalty_eth, 6),
        "royalty_usd": round(royalty_usd, 2),
        "royalty_inr": round(royalty_inr, 2),
        "platform_fee_eth": round(platform_fee_eth, 6),
        "creator_primary_proceeds_eth": round(creator_proceeds_eth, 6),
        "lifetime_royalty_at_100_sales": {
            "eth": round(royalty_eth * 100, 4),
            "usd": round(royalty_usd * 100, 2),
        },
        "platforms": {
            "OpenSea": "2.5% fee",
            "Blur": "0% fee (creator royalties optional)",
            "Foundation": "5% fee",
            "Rarible": "2.5% fee",
        },
        "india_tax_note": "30% flat tax on crypto/NFT profits in India (Budget 2022). Consult a CA."
    }, "NFT royalty calculated")


def handle_hash_rate_calculator(files, payload, job_dir):
    hash_rate = _pf(payload, "hash_rate", 100)
    unit = _p(payload, "unit", "TH/s")
    network_difficulty = _pf(payload, "network_difficulty", 86e12)
    block_reward = _pf(payload, "block_reward", 3.125)
    btc_price = _pf(payload, "btc_price", 60000)
    power_watts = _pf(payload, "power_watts", 3000)
    electricity_cost = _pf(payload, "electricity_cost", 5)

    multipliers = {"H/s": 1, "KH/s": 1e3, "MH/s": 1e6, "GH/s": 1e9, "TH/s": 1e12, "PH/s": 1e15, "EH/s": 1e18}
    hash_per_sec = hash_rate * multipliers.get(unit, 1e12)

    blocks_per_day = (hash_per_sec / max(1, network_difficulty)) * 86400
    btc_per_day = blocks_per_day * block_reward
    revenue_usd_day = btc_per_day * btc_price
    power_cost_day = (power_watts / 1000) * 24 * electricity_cost
    profit_day = revenue_usd_day - power_cost_day

    return _ok({
        "hash_rate": f"{hash_rate} {unit}",
        "btc_per_day": round(btc_per_day, 8),
        "btc_per_month": round(btc_per_day * 30, 6),
        "revenue_usd_per_day": round(revenue_usd_day, 2),
        "electricity_cost_per_day": round(power_cost_day, 2),
        "net_profit_per_day": round(profit_day, 2),
        "net_profit_per_month": round(profit_day * 30, 2),
        "break_even_btc_price": round(power_cost_day / btc_per_day, 2) if btc_per_day > 0 else 0,
        "roi_days": round(0 / max(0.01, profit_day), 1),  # need hardware cost for full ROI
        "profitability": "profitable" if profit_day > 0 else "unprofitable",
    }, "Mining profitability calculated")


# ══════════════════════════════════════════════════════════════════
# HR / JOBS TOOLS
# ══════════════════════════════════════════════════════════════════

def handle_salary_hike_calculator(files, payload, job_dir):
    current_salary = _pf(payload, "current_salary")
    hike_pct = _pf(payload, "hike_pct")
    if current_salary <= 0:
        return _err("Please enter your current salary.")
    if hike_pct <= 0:
        return _err("Please enter a hike percentage.")

    new_salary = current_salary * (1 + hike_pct / 100)
    monthly_increase = (new_salary - current_salary) / 12
    annual_increase = new_salary - current_salary

    # CTC breakdown (approximate, India)
    basic_new = new_salary * 0.40
    hra_new = basic_new * 0.50
    pf_new = min(basic_new * 0.12, 21600)  # PF capped at 21600/yr

    return _ok({
        "current_ctc": round(current_salary, 2),
        "hike_pct": hike_pct,
        "new_ctc": round(new_salary, 2),
        "annual_increase": round(annual_increase, 2),
        "monthly_increase": round(monthly_increase, 2),
        "monthly_in_hand_approx": round((new_salary - pf_new) / 12, 2),
        "ctc_breakdown_approx": {
            "basic": round(basic_new, 2),
            "hra": round(hra_new, 2),
            "pf_employer_contribution": round(pf_new, 2),
            "special_allowance": round(new_salary - basic_new - hra_new - pf_new, 2),
        },
        "comparison": {
            "current_monthly": round(current_salary / 12, 2),
            "new_monthly": round(new_salary / 12, 2),
        },
        "tip": f"A {hike_pct}% hike is {'excellent (>20%)' if hike_pct > 20 else 'good (10-20%)' if hike_pct >= 10 else 'average (<10%)'}. Industry average is 8-12% in India."
    }, f"Calculated {hike_pct}% salary hike")


def handle_notice_period_calculator(files, payload, job_dir):
    last_working = _p(payload, "last_working_date")
    notice_days = _pi(payload, "notice_days", 90)
    buy_out_possible = _p(payload, "buyout", "yes").lower() == "yes"

    if last_working:
        try:
            end = datetime.strptime(last_working, "%Y-%m-%d")
            start = end - timedelta(days=notice_days)
        except ValueError:
            return _err("Invalid date format. Use YYYY-MM-DD.")
    else:
        start = datetime.today()
        end = start + timedelta(days=notice_days)

    business_days = sum(1 for i in range(notice_days) if (start + timedelta(days=i)).weekday() < 5)

    return _ok({
        "notice_period_days": notice_days,
        "start_date": start.strftime("%Y-%m-%d"),
        "last_working_date": end.strftime("%Y-%m-%d"),
        "calendar_days": notice_days,
        "business_days": business_days,
        "buy_out_option": buy_out_possible,
        "resignation_tips": [
            "Submit written resignation to HR and direct manager simultaneously",
            "Keep resignation email professional and brief",
            "Request formal acknowledgment of resignation letter",
            "Ensure PF transfer/withdrawal form is submitted (EPF Form 13/19)",
            "Collect all documents: relieving letter, experience letter, pay slips (12 months)",
        ],
        "checklist": [
            "Submit resignation letter",
            "Hand over pending work/documentation",
            "Transfer knowledge to replacement/team",
            "Complete exit formalities with HR",
            "Return company assets (laptop, ID card, etc.)",
            "Collect relieving & experience certificate",
        ]
    }, f"Notice period ends: {end.strftime('%d %b %Y')}")


def handle_job_offer_comparator(files, payload, job_dir):
    job1_title = _p(payload, "job1_title", "Job A")
    job1_ctc = _pf(payload, "job1_ctc")
    job1_wfh = _p(payload, "job1_wfh", "hybrid")
    job1_growth = _pi(payload, "job1_growth", 7)

    job2_title = _p(payload, "job2_title", "Job B")
    job2_ctc = _pf(payload, "job2_ctc")
    job2_wfh = _p(payload, "job2_wfh", "onsite")
    job2_growth = _pi(payload, "job2_growth", 10)

    if job1_ctc <= 0 or job2_ctc <= 0:
        return _err("Please enter CTC for both jobs.")

    ctc_diff = job2_ctc - job1_ctc
    ctc_diff_pct = (ctc_diff / job1_ctc) * 100

    # Score each job (rough heuristic)
    def score(ctc, wfh, growth):
        s = ctc / 100000  # base score from CTC (lakh units)
        wfh_bonus = {"wfh": 2, "remote": 2, "hybrid": 1, "onsite": 0, "office": 0}.get(wfh.lower(), 0)
        return s + wfh_bonus + (growth * 0.3)

    score1 = score(job1_ctc, job1_wfh, job1_growth)
    score2 = score(job2_ctc, job2_wfh, job2_growth)

    return _ok({
        "job1": {"title": job1_title, "ctc": job1_ctc, "work_mode": job1_wfh, "growth_pct": job1_growth, "score": round(score1, 1)},
        "job2": {"title": job2_title, "ctc": job2_ctc, "work_mode": job2_wfh, "growth_pct": job2_growth, "score": round(score2, 1)},
        "ctc_difference": round(ctc_diff, 2),
        "ctc_difference_pct": round(ctc_diff_pct, 1),
        "recommended": job1_title if score1 > score2 else job2_title,
        "5_year_projection": {
            job1_title: round(job1_ctc * ((1 + job1_growth / 100) ** 5), 2),
            job2_title: round(job2_ctc * ((1 + job2_growth / 100) ** 5), 2),
        },
        "considerations": [
            "Higher growth rate often beats higher starting salary over 3-5 years",
            "WFH saves 2-4 hours/day and ₹5,000-15,000/month in commute costs",
            "Company culture and manager quality matter as much as CTC",
            "Equity/ESOPs can multiply value significantly in startups",
        ]
    }, "Job offer comparison complete")


def handle_interview_question_generator(files, payload, job_dir):
    role = _p(payload, "text", "Software Engineer")
    level = _p(payload, "level", "mid")
    category = _p(payload, "category", "behavioral")

    questions = {
        "behavioral": {
            "junior": [
                f"Tell me about yourself and why you want to be a {role}.",
                "Describe a time you faced a challenge in a team project.",
                "How do you prioritize tasks when you have multiple deadlines?",
                "What's your greatest strength? How has it helped you?",
                "Tell me about a time you received critical feedback.",
            ],
            "mid": [
                f"Describe a complex {role} problem you solved independently.",
                "Tell me about a time you mentored or helped a junior colleague.",
                "How do you handle disagreements with your manager or team lead?",
                "Describe a project where you had to learn something new quickly.",
                "Tell me about a time you failed. What did you learn?",
            ],
            "senior": [
                f"How have you influenced the technical direction of a {role} team?",
                "Describe a time you made a high-impact architectural decision.",
                "How do you handle competing priorities from multiple stakeholders?",
                "Tell me about a time you turned around an underperforming team.",
                "How do you balance technical debt with feature delivery?",
            ],
        },
        "technical": {
            "junior": [
                "What is the difference between == and === in JavaScript?",
                "Explain the concept of version control and why we use Git.",
                "What is REST API? How is it different from GraphQL?",
                "Explain the difference between SQL and NoSQL databases.",
                "What is a Promise in JavaScript?",
            ],
            "mid": [
                "Explain SOLID principles with examples from your work.",
                "How do you design a rate limiter for an API?",
                "What is database indexing and when would you use it?",
                "Explain the difference between horizontal and vertical scaling.",
                "How do you handle race conditions in concurrent systems?",
            ],
            "senior": [
                "Design a URL shortener like bit.ly that handles 100M requests/day.",
                "How would you design a distributed cache system?",
                "Explain CAP theorem with real-world trade-offs you've navigated.",
                "How do you ensure zero-downtime deployments?",
                "Design a real-time notification system for 10M users.",
            ],
        },
        "situational": {
            "junior": [
                f"If your code breaks production at 2am, what do you do?",
                "A teammate is not pulling their weight. How do you handle it?",
                "You're given a task you've never done before. What's your approach?",
            ],
            "mid": [
                "Product wants feature X in 2 weeks but engineering says 6 weeks. What do you do?",
                "You discover a critical security vulnerability in your system. Describe your response.",
                f"A senior {role} on your team consistently delivers poor quality code. How do you address this?",
            ],
            "senior": [
                "How do you build technical roadmaps and get buy-in from non-technical stakeholders?",
                "The company is losing engineers to competitors. What systemic changes do you recommend?",
                "How do you evaluate build vs buy vs open-source decisions?",
            ],
        }
    }

    q_list = questions.get(category, questions["behavioral"]).get(level, questions["behavioral"]["mid"])

    return _ok({
        "role": role,
        "level": level,
        "category": category,
        "questions": q_list,
        "tips": {
            "behavioral": "Use STAR method: Situation → Task → Action → Result",
            "technical": "Think aloud, clarify requirements, discuss trade-offs",
            "situational": "Show structured thinking: prioritize → communicate → execute",
        }.get(category, "Prepare specific examples from your experience"),
    }, f"Generated {len(q_list)} {category} questions for {level}-level {role}")


def handle_resignation_letter_generator(files, payload, job_dir):
    name = _p(payload, "name", "Your Name")
    manager = _p(payload, "manager", "Manager Name")
    company = _p(payload, "company", "Company Name")
    role = _p(payload, "role", "Current Role")
    notice_days = _pi(payload, "notice_days", 90)
    last_day = (datetime.today() + timedelta(days=notice_days)).strftime("%d %B %Y")
    reason = _p(payload, "reason", "personal growth opportunities")

    letter = f"""Date: {datetime.today().strftime('%d %B %Y')}

To,
{manager}
{company}

Subject: Resignation from the Position of {role}

Dear {manager},

I am writing to formally resign from my position as {role} at {company}, effective {last_day} (serving {notice_days} days notice period as per my employment agreement).

This was not an easy decision. My time at {company} has been a valuable and enriching experience. I have grown tremendously as a professional and am deeply grateful for the opportunities, mentorship, and support I have received during my tenure.

I am resigning to pursue {reason}. I assure you that I will do my utmost to ensure a smooth transition by completing all pending assignments, documenting ongoing projects, and training my replacement if needed.

I would be happy to assist in any way to ensure business continuity during this period.

Thank you for your leadership and for the wonderful experience working with such a talented team. I hope to maintain a positive professional relationship and stay connected.

Yours sincerely,
{name}
{role}"""

    return _ok({
        "letter": letter,
        "last_working_date": last_day,
        "notice_period_days": notice_days,
        "checklist_after_submitting": [
            "Get written acknowledgment of resignation from HR",
            "Start knowledge transfer documentation",
            "Initiate PF withdrawal/transfer if needed",
            "Request experience and relieving letter date",
            "Ensure proper clearance certificate process",
        ]
    }, "Resignation letter generated")


def handle_salary_negotiation_helper(files, payload, job_dir):
    current_ctc = _pf(payload, "current_ctc")
    offered_ctc = _pf(payload, "offered_ctc")
    expected_ctc = _pf(payload, "expected_ctc")
    experience_yrs = _pf(payload, "experience", 3)
    role = _p(payload, "role", "Software Engineer")

    if offered_ctc <= 0:
        return _err("Please enter the offered CTC.")

    gap = expected_ctc - offered_ctc
    gap_pct = (gap / offered_ctc) * 100 if offered_ctc > 0 else 0

    if gap_pct <= 5:
        strategy = "counter_low"
    elif gap_pct <= 20:
        strategy = "counter_medium"
    else:
        strategy = "counter_high"

    scripts = {
        "counter_low": f"""Thank you for the offer of ₹{offered_ctc:,.0f} LPA for the {role} role. I'm very excited about this opportunity and the team.

After careful consideration, given my {experience_yrs:.0f} years of experience in [relevant skills], I was expecting something closer to ₹{expected_ctc:,.0f} LPA. 

Could we bridge this small gap? I'm confident I'll add significant value from day one and am flexible on the exact structure if needed.""",

        "counter_medium": f"""I really appreciate the offer of ₹{offered_ctc:,.0f} LPA for the {role} position. The role and company are exactly what I'm looking for.

Based on my {experience_yrs:.0f} years of experience with [specific skills], and my research on market rates for this role in [city], I was expecting ₹{expected_ctc:,.0f} LPA.

Is there flexibility to move closer to that range? I'm open to discussing the structure — base salary, bonus, ESOPs — whatever works best for the company.""",

        "counter_high": f"""Thank you for the generous offer of ₹{offered_ctc:,.0f} LPA. I'm genuinely excited about joining {role} at [company].

I want to be transparent with you — my current CTC is ₹{current_ctc:,.0f} LPA, and I was expecting ₹{expected_ctc:,.0f} LPA based on the scope of this role and market benchmarks.

I believe I bring [specific value] that directly impacts [business outcome]. Would you be able to reconsider the offer? If base salary flexibility is limited, I'm also open to exploring a higher variable component, signing bonus, or additional ESOPs.""",
    }

    return _ok({
        "offered_ctc": offered_ctc,
        "expected_ctc": expected_ctc,
        "gap_amount": round(gap, 2),
        "gap_pct": round(gap_pct, 1),
        "negotiation_strategy": strategy.replace("_", " ").title(),
        "negotiation_script": scripts[strategy],
        "tips": [
            "Always negotiate — 85% of employers expect it",
            "Never give a number first; let them anchor",
            "Justify with market data (LinkedIn Salary, Glassdoor, AmbitionBox)",
            "Consider total compensation: base + bonus + ESOPs + benefits",
            "Silence after your counteroffer is powerful — let them respond",
            "Get final offer in writing before resigning from current job",
        ],
        "india_benchmarks_note": "Check AmbitionBox.com, Glassdoor, and Levels.fyi for accurate market data."
    }, "Salary negotiation script ready")


# ══════════════════════════════════════════════════════════════════
# LEGAL TOOLS
# ══════════════════════════════════════════════════════════════════

def handle_nda_generator(files, payload, job_dir):
    party1 = _p(payload, "party1", "Disclosing Party")
    party2 = _p(payload, "party2", "Receiving Party")
    purpose = _p(payload, "purpose", "business discussions and potential collaboration")
    duration_years = _pi(payload, "duration", 2)
    state = _p(payload, "state", "Delhi")

    nda = f"""NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement ("Agreement") is entered into as of {datetime.today().strftime('%d %B %Y')} between:

DISCLOSING PARTY: {party1} ("Discloser")
RECEIVING PARTY: {party2} ("Recipient")

1. PURPOSE
The parties intend to engage in {purpose} (the "Purpose"). In connection with this Purpose, the Discloser may share certain confidential and proprietary information with the Recipient.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any data, information, or material shared by the Discloser that is designated as confidential or that reasonably should be understood to be confidential, including but not limited to: business plans, financial data, technical specifications, trade secrets, customer lists, pricing, and intellectual property.

3. OBLIGATIONS OF RECIPIENT
The Recipient agrees to:
(a) Hold all Confidential Information in strict confidence;
(b) Not disclose Confidential Information to any third party without prior written consent;
(c) Use Confidential Information solely for the Purpose;
(d) Protect Confidential Information with at least the same degree of care it uses for its own confidential information (but no less than reasonable care).

4. EXCLUSIONS
This Agreement does not apply to information that: (a) is or becomes publicly available through no fault of Recipient; (b) was known to Recipient prior to disclosure; (c) is independently developed by Recipient; (d) is disclosed as required by law or court order.

5. TERM
This Agreement is effective for a period of {duration_years} year(s) from the date above.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of {state}, India.

7. REMEDIES
The Recipient acknowledges that breach of this Agreement may cause irreparable harm and that monetary damages may be inadequate. The Discloser shall be entitled to seek equitable relief including injunction in addition to other legal remedies.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

DISCLOSING PARTY: _____________________     Date: ________________
{party1}

RECEIVING PARTY: _____________________      Date: ________________
{party2}

---
⚠️ DISCLAIMER: This template is for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before using this in a real business context."""

    return _ok({
        "nda_text": nda,
        "party1": party1,
        "party2": party2,
        "duration_years": duration_years,
        "governing_state": state,
        "tip": "Always have a qualified advocate review NDAs before signing, especially for high-value engagements."
    }, "NDA template generated")


def handle_freelance_contract_generator(files, payload, job_dir):
    client = _p(payload, "client", "Client Name")
    freelancer = _p(payload, "freelancer", "Freelancer Name")
    project = _p(payload, "project", "Website Development")
    amount = _pf(payload, "amount", 50000)
    advance_pct = _pi(payload, "advance_pct", 50)
    deadline_days = _pi(payload, "deadline_days", 30)
    start_date = datetime.today()
    end_date = start_date + timedelta(days=deadline_days)
    advance = amount * advance_pct / 100
    balance = amount - advance

    contract = f"""FREELANCE SERVICE AGREEMENT

Date: {start_date.strftime('%d %B %Y')}

CLIENT: {client}
FREELANCER: {freelancer}
PROJECT: {project}

1. SCOPE OF WORK
The Freelancer agrees to provide the following services: {project}. 
The complete scope of work, deliverables, and revision policy shall be documented separately in the Project Brief agreed by both parties.

2. TIMELINE
Project Start Date: {start_date.strftime('%d %B %Y')}
Expected Delivery Date: {end_date.strftime('%d %B %Y')} ({deadline_days} calendar days)

3. PAYMENT TERMS
Total Project Cost: ₹{amount:,.0f}
Advance Payment ({advance_pct}%): ₹{advance:,.0f} — Due upon signing this contract
Balance Payment ({100-advance_pct}%): ₹{balance:,.0f} — Due upon final delivery and approval

Payment Method: Bank Transfer / UPI (as agreed)
Invoices shall be raised by the Freelancer and are payable within 7 business days.

4. REVISIONS
This contract includes up to 2 rounds of revisions. Additional revisions will be billed at ₹500-1000/hour as mutually agreed.

5. INTELLECTUAL PROPERTY
Upon receipt of full payment, all work product created under this Agreement shall become the exclusive property of the Client.

6. CONFIDENTIALITY
Both parties agree to keep the terms of this Agreement and any shared confidential information strictly private.

7. TERMINATION
Either party may terminate this Agreement with 7 days' written notice. The Client shall pay for all work completed to date. Any advance paid for undelivered work shall be negotiated in good faith.

8. GOVERNING LAW
This Agreement is governed by the laws of India.

CLIENT SIGNATURE: _____________________     Date: ________________
{client}

FREELANCER SIGNATURE: _________________     Date: ________________
{freelancer}

---
⚠️ DISCLAIMER: Template for informational purposes only. Consult a legal professional for binding contracts."""

    return _ok({
        "contract_text": contract,
        "total_amount": amount,
        "advance": advance,
        "balance_due": balance,
        "deadline": end_date.strftime("%d %B %Y"),
        "tip": "Always collect advance before starting work. Use UPI with transaction ID as payment proof."
    }, "Freelance contract generated")


def handle_privacy_policy_generator(files, payload, job_dir):
    website = _p(payload, "website", "YourWebsite.com")
    company = _p(payload, "company", "Your Company")
    email = _p(payload, "email", "privacy@yourwebsite.com")
    country = _p(payload, "country", "India")
    collects_analytics = _p(payload, "analytics", "yes").lower() == "yes"
    collects_payments = _p(payload, "payments", "no").lower() == "yes"

    policy = f"""PRIVACY POLICY

Last Updated: {datetime.today().strftime('%d %B %Y')}
Website: {website}
Company: {company}

1. INTRODUCTION
{company} ("we", "us", "our") respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal data when you use {website}.

2. INFORMATION WE COLLECT
We collect the following types of information:
- Information you provide: Name, email address, and other details you submit via forms.
- Usage data: Pages visited, time spent, browser type, IP address.
{"- Payment data: We use secure third-party payment processors. We do not store card details." if collects_payments else ""}
{"- Analytics: We use analytics tools to understand how visitors use our website." if collects_analytics else ""}

3. HOW WE USE YOUR INFORMATION
We use collected data to:
(a) Provide and improve our services;
(b) Respond to your inquiries and support requests;
(c) Send service updates and notifications (with your consent);
(d) Comply with legal obligations.

4. DATA SHARING
We do not sell your personal data. We may share data with:
- Service providers who assist in operating our website;
- Law enforcement if required by applicable law.

5. COOKIES
We use cookies to enhance your experience. You can disable cookies in your browser settings, though this may affect functionality.

6. DATA SECURITY
We implement industry-standard security measures to protect your data. However, no transmission over the Internet is 100% secure.

7. YOUR RIGHTS (under applicable law in {country})
You have the right to access, correct, or delete your personal data. Contact us at {email} to exercise these rights.

8. CHILDREN'S PRIVACY
Our services are not directed to children under 13. We do not knowingly collect data from minors.

9. CHANGES TO THIS POLICY
We may update this policy periodically. Changes will be posted on this page with a revised date.

10. CONTACT US
For privacy-related queries: {email}

---
⚠️ DISCLAIMER: This is a template for general informational use. Consult a legal professional to ensure compliance with GDPR, IT Act 2000, PDPB (India), or other applicable regulations."""

    return _ok({
        "policy_text": policy,
        "website": website,
        "company": company,
        "tip": "For Indian websites: comply with IT Act 2000 & IT (Reasonable Security Practices) Rules 2011. For users in EU, also comply with GDPR."
    }, "Privacy policy generated")


# ══════════════════════════════════════════════════════════════════
# TRAVEL TOOLS
# ══════════════════════════════════════════════════════════════════

def handle_travel_cost_estimator(files, payload, job_dir):
    origin = _p(payload, "origin", "Delhi")
    destination = _p(payload, "destination", "Goa")
    days = max(1, min(60, _pi(payload, "days", 5)))
    travelers = max(1, _pi(payload, "travelers", 2))
    budget_type = _p(payload, "budget_type", "mid")
    transport = _p(payload, "transport", "flight")

    budgets = {
        "budget": {"hotel": 800, "food": 400, "local": 200, "activities": 300},
        "mid": {"hotel": 2500, "food": 1000, "local": 500, "activities": 800},
        "luxury": {"hotel": 8000, "food": 3000, "local": 1500, "activities": 2500},
    }
    transport_cost = {
        "flight": {"Delhi-Goa": 4500, "Mumbai-Goa": 2500, "default": 4000},
        "train": {"default": 1200},
        "bus": {"default": 600},
        "car": {"default": 2500},
    }

    b = budgets.get(budget_type, budgets["mid"])
    per_night = b["hotel"]
    food_per_day = b["food"]
    local_per_day = b["local"]
    activities_per_day = b["activities"]

    route_key = f"{origin.split()[0]}-{destination.split()[0]}"
    t_cost_per_person = transport_cost.get(transport, {}).get(route_key, transport_cost.get(transport, {}).get("default", 3000))

    hotel_total = per_night * days * math.ceil(travelers / 2)
    food_total = food_per_day * days * travelers
    local_total = local_per_day * days
    activities_total = activities_per_day * days
    transport_total = t_cost_per_person * travelers * 2  # round trip

    grand_total = hotel_total + food_total + local_total + activities_total + transport_total
    buffer = grand_total * 0.15

    return _ok({
        "route": f"{origin} → {destination}",
        "duration_days": days,
        "travelers": travelers,
        "budget_type": budget_type,
        "transport": transport,
        "cost_breakdown": {
            "transport_round_trip": round(transport_total, 0),
            "accommodation": round(hotel_total, 0),
            "food": round(food_total, 0),
            "local_transport": round(local_total, 0),
            "activities_sightseeing": round(activities_total, 0),
            "emergency_buffer_15pct": round(buffer, 0),
        },
        "total_estimated_cost": round(grand_total + buffer, 0),
        "per_person_cost": round((grand_total + buffer) / travelers, 0),
        "per_day_per_person": round((grand_total + buffer) / travelers / days, 0),
        "packing_tips": [
            "Book flights 6-8 weeks in advance for best prices",
            "Use MakeMyTrip, EaseMyTrip, or Skyscanner for cheap flights",
            "Book hotels via Booking.com or OYO for best deals",
            "Carry cash in small denominations for local markets",
        ]
    }, f"Travel cost estimate for {origin} → {destination}")


def handle_visa_checklist_generator(files, payload, job_dir):
    nationality = _p(payload, "nationality", "Indian")
    destination_country = _p(payload, "destination", "United States")
    visa_type = _p(payload, "visa_type", "tourist")

    common_docs = [
        "Valid passport (min 6 months validity beyond travel date)",
        "Completed visa application form",
        "Recent passport-size photographs (as per specifications)",
        "Proof of accommodation (hotel bookings or invitation letter)",
        "Return/onward travel tickets",
        "Travel insurance (min $50,000 coverage for Schengen)",
        "Proof of sufficient funds (bank statements - last 3 months)",
        "ITR (Income Tax Returns) - last 2 years",
        "Leave letter from employer or business registration documents",
        "Cover letter explaining purpose of visit",
    ]

    country_specific = {
        "United States": {
            "visa": "B1/B2 Tourist Visa",
            "processing": "3-5 weeks (interview required)",
            "extra_docs": ["DS-160 form", "SEVIS fee receipt (if student)", "Appointment confirmation"],
            "interview_tips": ["Be honest and concise", "Show strong ties to India (job, family, property)", "Carry all originals"],
        },
        "United Kingdom": {
            "visa": "Standard Visitor Visa",
            "processing": "3 weeks",
            "extra_docs": ["Biometrics appointment", "Bank statements (6 months)", "Property documents"],
            "interview_tips": ["Apply online via UKVI", "No interview usually required", "Show financial stability"],
        },
        "Schengen": {
            "visa": "Schengen Type C Visa",
            "processing": "15 business days",
            "extra_docs": ["Travel itinerary", "Travel insurance (MANDATORY - €30,000 min)", "Accommodation for all nights"],
            "interview_tips": ["Apply at embassy of country with longest stay", "Consistency in documents is key"],
        },
        "Australia": {
            "visa": "Tourist Visa (Subclass 600)",
            "processing": "20-30 days",
            "extra_docs": ["Genuine Temporary Entrant (GTE) statement", "Character check may be required"],
            "interview_tips": ["Apply online via ImmiAccount", "Show strong reasons to return to India"],
        },
    }

    country_info = None
    for key in country_specific:
        if key.lower() in destination_country.lower() or destination_country.lower() in key.lower():
            country_info = country_specific[key]
            break
    if not country_info:
        country_info = {"visa": f"{visa_type.title()} Visa", "processing": "2-4 weeks", "extra_docs": [], "interview_tips": []}

    return _ok({
        "nationality": nationality,
        "destination": destination_country,
        "visa_type": country_info["visa"],
        "processing_time": country_info["processing"],
        "common_documents": common_docs,
        "country_specific_documents": country_info["extra_docs"],
        "interview_tips": country_info["interview_tips"],
        "important_notes": [
            "Start visa process at least 2-3 months before travel",
            "Apply for the exact amount of days/multiple entry as needed",
            "Keep photocopies of all documents separate from originals",
            "Track application at official embassy website only",
        ]
    }, f"Visa checklist for {nationality} → {destination_country}")


def handle_currency_travel_calculator(files, payload, job_dir):
    amount = _pf(payload, "amount", 10000)
    from_currency = _p(payload, "from_currency", "INR").upper()
    to_currency = _p(payload, "to_currency", "USD").upper()
    markup_pct = _pf(payload, "markup_pct", 3.0)

    rates_to_usd = {
        "INR": 0.01198, "USD": 1.0, "EUR": 1.085, "GBP": 1.27, "JPY": 0.0067,
        "AUD": 0.65, "CAD": 0.74, "SGD": 0.74, "AED": 0.272, "THB": 0.028,
        "CHF": 1.11, "CNY": 0.138, "MYR": 0.213, "NZD": 0.60, "HKD": 0.128,
    }

    from_rate = rates_to_usd.get(from_currency, 1.0)
    to_rate = rates_to_usd.get(to_currency, 1.0)

    mid_rate = from_rate / to_rate
    bank_rate = mid_rate * (1 - markup_pct / 100)
    converted = amount * bank_rate
    fee = amount * mid_rate - converted

    return _ok({
        "from": f"{amount:,.2f} {from_currency}",
        "to_currency": to_currency,
        "mid_market_rate": round(mid_rate, 4),
        "bank_rate_approx": round(bank_rate, 4),
        "converted_amount": round(converted, 2),
        "markup_fee": round(fee, 2),
        "markup_pct": markup_pct,
        "equivalents": {
            "1 USD in INR": round(1 / rates_to_usd["INR"], 2),
            "1 EUR in INR": round(rates_to_usd["EUR"] / rates_to_usd["INR"], 2),
            "1 GBP in INR": round(rates_to_usd["GBP"] / rates_to_usd["INR"], 2),
            "1 AED in INR": round(rates_to_usd["AED"] / rates_to_usd["INR"], 2),
            "1 SGD in INR": round(rates_to_usd["SGD"] / rates_to_usd["INR"], 2),
        },
        "money_saving_tips": [
            "Use Wise (formerly TransferWise) — best rates for international transfers",
            "Niyo Global card for zero forex markup abroad",
            "Avoid airport currency exchange — rates are 8-12% worse",
            "Use international-enabled debit/credit cards with low forex markup",
            "Carry some local currency cash for emergencies",
        ]
    }, f"Currency conversion: {amount} {from_currency} → {to_currency}")


def handle_packing_list_generator(files, payload, job_dir):
    destination = _p(payload, "destination", "Beach")
    days = max(1, min(90, _pi(payload, "days", 7)))
    climate = _p(payload, "climate", "tropical")
    trip_type = _p(payload, "trip_type", "leisure")

    base_list = {
        "Documents & Money": [
            "Passport / Aadhaar + PAN card",
            "Visa documents (if international)",
            "Travel insurance documents",
            "Hotel booking confirmations",
            "Flight/train tickets (digital + print)",
            "Emergency cash + forex card",
            "Bank cards + ATM card",
        ],
        "Clothing": [
            f"{days} pairs of underwear / socks",
            f"{math.ceil(days/2)} casual T-shirts",
            f"{math.ceil(days/3)} trousers / jeans",
            "1 formal outfit (for dinners/meetings)",
            "Comfortable walking shoes",
            "Flip-flops / sandals",
            "Light jacket or hoodie",
        ],
        "Toiletries": [
            "Toothbrush + toothpaste",
            "Deodorant",
            "Shampoo + conditioner (travel size)",
            "Sunscreen SPF 50+",
            "Moisturizer",
            "Razor + shaving cream",
            "Sanitary products (if needed)",
        ],
        "Tech & Electronics": [
            "Phone + charger",
            "Power bank (10,000 mAh min)",
            "Universal travel adapter",
            "Earphones / AirPods",
            "Camera (optional)",
            "Laptop + charger (if needed)",
        ],
        "Health & Safety": [
            "Personal medications (extra supply)",
            "Basic first aid kit",
            "Pain relievers (Crocin, Combiflam)",
            "Anti-diarrhea medicine (ORS sachets)",
            "Hand sanitizer",
            "Mosquito repellent",
            "Water purification tablets",
        ],
    }

    climate_extras = {
        "tropical": ["Lightweight breathable clothes", "Insect repellent", "Swimwear", "Waterproof bag"],
        "cold": ["Thermal innerwear", "Heavy winter jacket", "Gloves + woolen cap", "Snow boots", "Lip balm"],
        "desert": ["UV protection sunglasses", "Light long-sleeved shirts", "Lots of water bottles", "Electrolyte sachets"],
        "temperate": ["Rain jacket / umbrella", "Layering clothes", "Comfortable walking shoes"],
    }

    trip_extras = {
        "trekking": ["Hiking boots", "Trekking poles", "Headlamp + extra batteries", "Energy bars", "Hydration pack"],
        "business": ["Business cards", "Formal blazer", "Laptop", "Noise-cancelling headphones", "Portable printer"],
        "beach": ["Swimwear (2-3)", "Beach towel", "Waterproof sandals", "Goggles", "After-sun lotion"],
        "leisure": ["Books/Kindle", "Travel pillow", "Comfortable shoes", "Day bag/backpack"],
    }

    base_list["Climate Extras"] = climate_extras.get(climate, climate_extras["temperate"])
    base_list["Trip Extras"] = trip_extras.get(trip_type, trip_extras["leisure"])

    total_items = sum(len(v) for v in base_list.values())

    return _ok({
        "destination": destination,
        "duration_days": days,
        "climate": climate,
        "trip_type": trip_type,
        "packing_list": base_list,
        "total_items": total_items,
        "packing_tips": [
            "Use packing cubes to organize and compress clothes",
            "Roll clothes instead of folding to save space",
            "Pack heavier items at the bottom of the bag",
            "Carry a small daypack for day trips",
            "Wear your heaviest shoes on travel day",
            "Leave 20% bag space for souvenirs",
        ]
    }, f"Packing list generated for {days}-day {trip_type} trip to {destination}")


# ══════════════════════════════════════════════════════════════════
# DEVELOPER TOOLS V2
# ══════════════════════════════════════════════════════════════════

def handle_api_response_generator(files, payload, job_dir):
    resource = _p(payload, "text", "user")
    method = _p(payload, "method", "GET").upper()
    status = _pi(payload, "status", 200)
    include_pagination = _p(payload, "pagination", "yes").lower() == "yes"

    r = resource.lower().rstrip("s")
    R = r.title()

    responses = {
        ("GET", 200): {
            "status": "success",
            "message": f"{R} retrieved successfully",
            "data": {
                r: {
                    "id": "usr_01HX2K9MXYZ",
                    "name": "Ishu Kumar",
                    "email": "ishu@example.com",
                    "created_at": "2024-01-15T10:30:00Z",
                    "updated_at": "2024-06-01T14:22:00Z",
                }
            },
            **({"pagination": {"page": 1, "per_page": 20, "total": 150, "total_pages": 8}} if include_pagination else {}),
        },
        ("POST", 201): {
            "status": "success",
            "message": f"{R} created successfully",
            "data": {r: {"id": "usr_01HX2K9MXYZ", "created_at": datetime.utcnow().isoformat() + "Z"}},
        },
        ("PUT", 200): {
            "status": "success",
            "message": f"{R} updated successfully",
            "data": {r: {"id": "usr_01HX2K9MXYZ", "updated_at": datetime.utcnow().isoformat() + "Z"}},
        },
        ("DELETE", 200): {"status": "success", "message": f"{R} deleted successfully", "data": None},
        ("GET", 404): {"status": "error", "code": "NOT_FOUND", "message": f"{R} not found", "data": None},
        ("POST", 422): {
            "status": "error",
            "code": "VALIDATION_ERROR",
            "message": "Validation failed",
            "errors": [{"field": "email", "message": "Invalid email format"}, {"field": "name", "message": "Name is required"}],
        },
        ("GET", 401): {"status": "error", "code": "UNAUTHORIZED", "message": "Authentication required. Include Authorization: Bearer <token>", "data": None},
        ("GET", 429): {"status": "error", "code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests. Retry after 60 seconds.", "retry_after": 60},
    }

    response = responses.get((method, status), responses.get(("GET", 200)))

    return _ok({
        "method": method,
        "status_code": status,
        "response_json": json.dumps(response, indent=2),
        "response_object": response,
        "http_status_text": {200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 422: "Unprocessable Entity", 429: "Too Many Requests", 500: "Internal Server Error"}.get(status, "Unknown"),
        "headers": {
            "Content-Type": "application/json",
            "X-Request-Id": "req_" + hashlib.md5(str(status).encode()).hexdigest()[:12],
            "X-RateLimit-Remaining": "99",
        }
    }, f"API response mock for {method} {resource} ({status})")


def handle_sql_query_builder(files, payload, job_dir):
    table = _p(payload, "table", "users")
    operation = _p(payload, "operation", "SELECT").upper()
    columns = _p(payload, "columns", "*")
    where = _p(payload, "where", "")
    order_by = _p(payload, "order_by", "")
    limit = _pi(payload, "limit", 10)

    queries = {}
    t = table.lower()
    cols = columns if columns else "*"

    queries["SELECT"] = f"SELECT {cols}\nFROM {t}" + (f"\nWHERE {where}" if where else "") + (f"\nORDER BY {order_by}" if order_by else "") + (f"\nLIMIT {limit}" if limit else "") + ";"
    queries["SELECT_COUNT"] = f"SELECT COUNT(*) as total_count\nFROM {t}" + (f"\nWHERE {where}" if where else "") + ";"
    queries["INSERT"] = f"INSERT INTO {t} (id, created_at, {cols.replace('*', 'name, email, status')})\nVALUES (gen_random_uuid(), NOW(), 'John Doe', 'john@example.com', 'active');"
    queries["UPDATE"] = f"UPDATE {t}\nSET updated_at = NOW(), status = 'active'\nWHERE id = $1;"
    queries["DELETE"] = f"DELETE FROM {t}\nWHERE id = $1;"
    queries["CREATE_TABLE"] = f"""CREATE TABLE IF NOT EXISTS {t} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);"""
    queries["ADD_INDEX"] = f"CREATE INDEX idx_{t}_email ON {t}(email);\nCREATE INDEX idx_{t}_status ON {t}(status);\nCREATE INDEX idx_{t}_created ON {t}(created_at DESC);"

    main_query = queries.get(operation, queries["SELECT"])

    return _ok({
        "table": table,
        "operation": operation,
        "query": main_query,
        "all_queries": queries,
        "tips": [
            "Always use parameterized queries ($1, $2) to prevent SQL injection",
            "Add indexes on columns used in WHERE clauses",
            "Use EXPLAIN ANALYZE to debug slow queries",
            "Prefer UUIDs over serial integers for distributed systems",
            "Use transactions for multiple related operations",
        ]
    }, f"SQL query built for {operation} on {table}")


def handle_gitignore_generator(files, payload, job_dir):
    project_type = _p(payload, "text", "node")

    gitignores = {
        "node": """# Node.js
node_modules/
dist/
build/
.next/
.nuxt/
.output/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.env
.env.local
.env.*.local
.DS_Store
.vscode/
.idea/
coverage/
.nyc_output/
*.tsbuildinfo
""",
        "python": """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv/
dist/
build/
*.egg-info/
.eggs/
*.egg
.env
.env.local
.pytest_cache/
.mypy_cache/
.ruff_cache/
.coverage
htmlcov/
.DS_Store
.vscode/
.idea/
""",
        "react": """# React / Vite
node_modules/
dist/
dist-ssr/
build/
*.local
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.DS_Store
.vscode/
.idea/
*.log
coverage/
.nyc_output/
""",
        "django": """# Django
*.pyc
__pycache__/
*.pyo
.env
.venv/
venv/
db.sqlite3
media/
staticfiles/
*.log
.DS_Store
.vscode/
.idea/
dist/
build/
""",
        "java": """# Java / Maven / Gradle
target/
*.class
*.war
*.ear
*.jar
.gradle/
build/
.mvn/
.env
.DS_Store
.vscode/
.idea/
*.iml
""",
        "flutter": """# Flutter / Dart
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
build/
.env
.DS_Store
*.g.dart
*.freezed.dart
coverage/
""",
        "go": """# Go
*.exe
*.test
*.out
vendor/
.env
.DS_Store
.vscode/
.idea/
""",
        "rust": """# Rust
target/
Cargo.lock
*.pdb
.env
.DS_Store
.vscode/
.idea/
""",
    }

    content = gitignores.get(project_type.lower(), gitignores["node"])

    return _ok({
        "project_type": project_type,
        "gitignore_content": content,
        "tip": "Copy this to your .gitignore file in the project root. Use gitignore.io for more specific combinations."
    }, f".gitignore generated for {project_type}")


def handle_color_palette_generator(files, payload, job_dir):
    base_hex = _p(payload, "text", "#3BD0FF").strip().lstrip("#")
    scheme = _p(payload, "scheme", "analogous")

    def hex_to_rgb(h):
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

    def rgb_to_hex(r, g, b):
        return f"#{int(r):02X}{int(g):02X}{int(b):02X}"

    def hex_to_hsl(h):
        r, g, b = [x/255 for x in hex_to_rgb(h)]
        cmax, cmin = max(r,g,b), min(r,g,b)
        d = cmax - cmin
        l = (cmax + cmin) / 2
        s = 0 if d == 0 else d / (1 - abs(2*l - 1))
        if d == 0:
            h_val = 0
        elif cmax == r:
            h_val = 60 * (((g-b)/d) % 6)
        elif cmax == g:
            h_val = 60 * ((b-r)/d + 2)
        else:
            h_val = 60 * ((r-g)/d + 4)
        return h_val, s * 100, l * 100

    def hsl_to_hex(h, s, l):
        s, l = s/100, l/100
        c = (1 - abs(2*l - 1)) * s
        x = c * (1 - abs((h/60) % 2 - 1))
        m = l - c/2
        if h < 60: r,g,b = c,x,0
        elif h < 120: r,g,b = x,c,0
        elif h < 180: r,g,b = 0,c,x
        elif h < 240: r,g,b = 0,x,c
        elif h < 300: r,g,b = x,0,c
        else: r,g,b = c,0,x
        return rgb_to_hex((r+m)*255, (g+m)*255, (b+m)*255)

    try:
        if len(base_hex) not in (3, 6):
            raise ValueError
        if len(base_hex) == 3:
            base_hex = ''.join(c*2 for c in base_hex)
        h, s, l = hex_to_hsl(base_hex)
    except Exception:
        return _err("Invalid hex color. Use format: #3BD0FF or #FFF")

    schemes = {
        "analogous": [(h-30)%360, h, (h+30)%360, (h+60)%360, (h-60)%360],
        "complementary": [h, (h+180)%360, (h+30)%360, (h+210)%360, (h+150)%360],
        "triadic": [h, (h+120)%360, (h+240)%360, (h+60)%360, (h+180)%360],
        "split-complementary": [h, (h+150)%360, (h+210)%360, (h+30)%360, (h+180)%360],
        "tetradic": [h, (h+90)%360, (h+180)%360, (h+270)%360, h],
        "monochromatic": [h, h, h, h, h],
    }

    hues = schemes.get(scheme, schemes["analogous"])
    lightness_vals = [60, 50, 45, 55, 65] if scheme != "monochromatic" else [80, 65, 50, 35, 20]

    palette = []
    for i, hue in enumerate(hues[:5]):
        lv = lightness_vals[i]
        palette.append({
            "hex": hsl_to_hex(hue, s, lv),
            "hsl": f"hsl({hue:.0f}, {s:.0f}%, {lv:.0f}%)",
            "role": ["primary", "secondary", "accent", "neutral", "background"][i]
        })

    return _ok({
        "base_color": f"#{base_hex.upper()}",
        "scheme": scheme,
        "palette": palette,
        "css_variables": "\n".join(f"  --color-{p['role']}: {p['hex']};" for p in palette),
        "tailwind_config": {f"color-{p['role']}": p['hex'] for p in palette},
        "usage_tip": f"Scheme: {scheme}. Use primary for CTAs, secondary for cards, accent for highlights, neutral for text, background for page bg."
    }, f"Color palette generated ({scheme} scheme)")


def handle_docker_compose_generator(files, payload, job_dir):
    app_type = _p(payload, "text", "fastapi")
    with_db = _p(payload, "database", "postgres").lower()
    with_redis = _p(payload, "redis", "yes").lower() == "yes"
    with_nginx = _p(payload, "nginx", "no").lower() == "yes"
    port = _pi(payload, "port", 8000)

    app_configs = {
        "fastapi": {"image": "python:3.11-slim", "command": "uvicorn main:app --host 0.0.0.0 --port 8000 --reload", "port": 8000},
        "node": {"image": "node:20-alpine", "command": "npm start", "port": 3000},
        "react": {"image": "node:20-alpine", "command": "npm run dev -- --host", "port": 5173},
        "django": {"image": "python:3.11-slim", "command": "python manage.py runserver 0.0.0.0:8000", "port": 8000},
        "nextjs": {"image": "node:20-alpine", "command": "npm run dev", "port": 3000},
    }

    db_configs = {
        "postgres": {"image": "postgres:16-alpine", "env": {"POSTGRES_USER": "user", "POSTGRES_PASSWORD": "password", "POSTGRES_DB": "appdb"}, "port": 5432},
        "mysql": {"image": "mysql:8", "env": {"MYSQL_ROOT_PASSWORD": "rootpass", "MYSQL_DATABASE": "appdb", "MYSQL_USER": "user", "MYSQL_PASSWORD": "password"}, "port": 3306},
        "mongodb": {"image": "mongo:7", "env": {"MONGO_INITDB_ROOT_USERNAME": "admin", "MONGO_INITDB_ROOT_PASSWORD": "password"}, "port": 27017},
        "none": None,
    }

    app = app_configs.get(app_type.lower(), app_configs["fastapi"])
    db = db_configs.get(with_db, None)

    services = {}
    services["app"] = {
        "build": ".",
        "ports": [f"{port}:{app['port']}"],
        "environment": {
            "DATABASE_URL": f"postgresql://user:password@db:5432/appdb" if with_db == "postgres" else f"mongodb://admin:password@db:27017" if with_db == "mongodb" else "",
            "REDIS_URL": "redis://redis:6379" if with_redis else "",
        },
        "depends_on": (["db"] if db else []) + (["redis"] if with_redis else []),
        "volumes": ["./:/app"],
        "command": app["command"],
    }

    if db:
        services["db"] = {
            "image": db["image"],
            "environment": db["env"],
            "ports": [f"{db['port']}:{db['port']}"],
            "volumes": [f"db_data:/var/lib/{with_db.replace('postgres', 'postgresql')}/data"],
        }

    if with_redis:
        services["redis"] = {"image": "redis:7-alpine", "ports": ["6379:6379"]}

    if with_nginx:
        services["nginx"] = {
            "image": "nginx:alpine",
            "ports": ["80:80", "443:443"],
            "volumes": ["./nginx.conf:/etc/nginx/conf.d/default.conf"],
            "depends_on": ["app"],
        }

    volumes = {}
    if db:
        volumes["db_data"] = {}

    compose = {
        "version": "3.9",
        "services": services,
    }
    if volumes:
        compose["volumes"] = volumes

    return _ok({
        "app_type": app_type,
        "database": with_db,
        "redis": with_redis,
        "nginx": with_nginx,
        "docker_compose_yaml": f"# docker-compose.yml for {app_type.title()} + {with_db.title()}\n# Generated by ISHU TOOLS\n\n" + json.dumps(compose, indent=2).replace('"', '').replace('{', '').replace('}', ''),
        "commands": [
            "docker-compose up -d          # Start all services",
            "docker-compose logs -f app    # Follow app logs",
            "docker-compose down           # Stop and remove containers",
            "docker-compose down -v        # Stop + remove volumes (DESTRUCTIVE)",
            "docker-compose ps             # Show service status",
        ]
    }, f"docker-compose.yml generated for {app_type}")


# ══════════════════════════════════════════════════════════════════
# FINANCE V2
# ══════════════════════════════════════════════════════════════════

def handle_fd_calculator(files, payload, job_dir):
    principal = _pf(payload, "principal", 100000)
    rate = _pf(payload, "rate", 7.0)
    years = _pf(payload, "years", 5)
    compounding = _p(payload, "compounding", "quarterly")
    is_senior = _p(payload, "senior_citizen", "no").lower() == "yes"

    if is_senior:
        rate += 0.5  # Banks give 0.5% extra to senior citizens

    n_map = {"monthly": 12, "quarterly": 4, "half-yearly": 2, "yearly": 1}
    n = n_map.get(compounding, 4)

    maturity = principal * ((1 + rate / (100 * n)) ** (n * years))
    interest = maturity - principal
    effective_rate = ((maturity / principal) ** (1 / years) - 1) * 100

    tds = interest * 0.10 if interest > 40000 else 0  # 10% TDS if interest > 40k
    after_tax = maturity - tds

    banks = [
        {"bank": "SBI", "rate": "6.5-7.0%", "senior_extra": "+0.50%"},
        {"bank": "HDFC Bank", "rate": "7.0-7.25%", "senior_extra": "+0.25-0.75%"},
        {"bank": "ICICI Bank", "rate": "6.9-7.1%", "senior_extra": "+0.50%"},
        {"bank": "Bajaj Finance", "rate": "7.8-8.0%", "senior_extra": "+0.25%"},
        {"bank": "Post Office TD", "rate": "6.9-7.5%", "senior_extra": "None"},
    ]

    return _ok({
        "principal": principal,
        "rate_pct": rate,
        "tenure_years": years,
        "compounding": compounding,
        "senior_citizen": is_senior,
        "maturity_amount": round(maturity, 2),
        "interest_earned": round(interest, 2),
        "tds_deducted": round(tds, 2),
        "maturity_after_tds": round(after_tax, 2),
        "effective_annual_rate": round(effective_rate, 2),
        "monthly_interest_equivalent": round(interest / (years * 12), 2),
        "current_fd_rates": banks,
        "tip": "Senior citizens get 0.25-0.75% extra. FD interest is taxable per your slab. File 15G/15H to avoid TDS if income is below taxable limit."
    }, "FD maturity calculated")


def handle_sip_calculator(files, payload, job_dir):
    monthly_sip = _pf(payload, "monthly_sip", 5000)
    annual_return = _pf(payload, "annual_return", 12.0)
    years = max(1, min(40, _pi(payload, "years", 10)))
    step_up_pct = _pf(payload, "step_up_pct", 0)  # annual step-up %

    monthly_rate = annual_return / 100 / 12
    months = years * 12

    # SIP with step-up
    if step_up_pct > 0:
        total_invested = 0
        total_value = 0
        current_sip = monthly_sip
        for year in range(years):
            for month in range(12):
                total_invested += current_sip
                total_value = (total_value + current_sip) * (1 + monthly_rate)
            current_sip *= (1 + step_up_pct / 100)
    else:
        total_invested = monthly_sip * months
        total_value = monthly_sip * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)

    returns = total_value - total_invested
    wealth_gain_pct = (returns / total_invested) * 100

    # Milestones
    milestones = {}
    for y in [1, 3, 5, 10, 15, 20]:
        if y <= years:
            m = y * 12
            v = monthly_sip * (((1 + monthly_rate) ** m - 1) / monthly_rate) * (1 + monthly_rate)
            milestones[f"{y} year{'s' if y > 1 else ''}"] = {"invested": round(monthly_sip * m, 0), "value": round(v, 0)}

    return _ok({
        "monthly_sip": monthly_sip,
        "annual_return_pct": annual_return,
        "years": years,
        "step_up_pct": step_up_pct,
        "total_invested": round(total_invested, 2),
        "maturity_value": round(total_value, 2),
        "total_returns": round(returns, 2),
        "wealth_gain_pct": round(wealth_gain_pct, 1),
        "milestones": milestones,
        "power_of_compounding": {
            "returns_to_invested_ratio": round(returns / total_invested, 2),
            "note": f"For every ₹1 invested, you get ₹{round(total_value/total_invested, 2)} back"
        },
        "popular_funds_note": "Top performing ELSS funds: Mirae Asset ELSS, Axis ELSS, Parag Parikh ELSS. For large-cap: UTI Nifty 50 Index Fund."
    }, f"SIP calculator: ₹{monthly_sip:,.0f}/month × {years}yr = ₹{round(total_value, 0):,.0f}")


def handle_emi_calculator_advanced(files, payload, job_dir):
    principal = _pf(payload, "principal", 1000000)
    annual_rate = _pf(payload, "rate", 8.5)
    years = max(1, min(30, _pi(payload, "years", 20)))
    loan_type = _p(payload, "loan_type", "home")

    monthly_rate = annual_rate / 100 / 12
    months = years * 12
    emi = principal * monthly_rate * ((1 + monthly_rate) ** months) / (((1 + monthly_rate) ** months) - 1)
    total_payment = emi * months
    total_interest = total_payment - principal

    # Amortization first 6 months
    balance = principal
    schedule = []
    for i in range(1, min(7, months + 1)):
        interest_part = balance * monthly_rate
        principal_part = emi - interest_part
        balance -= principal_part
        schedule.append({
            "month": i,
            "emi": round(emi, 2),
            "principal": round(principal_part, 2),
            "interest": round(interest_part, 2),
            "balance": round(max(0, balance), 2),
        })

    tax_benefit = {
        "home": {"section": "80C + 24(b)", "principal_deduction": min(150000, principal * 0.05), "interest_deduction": min(200000, total_interest / years)},
        "education": {"section": "80E", "note": "Full interest deductible for 8 years"},
        "personal": {"section": "None", "note": "No tax benefit on personal loan interest"},
        "car": {"section": "None for salaried", "note": "Business owners can deduct as business expense"},
    }

    return _ok({
        "principal": principal,
        "annual_rate": annual_rate,
        "years": years,
        "loan_type": loan_type,
        "monthly_emi": round(emi, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
        "interest_to_principal_ratio": round(total_interest / principal, 2),
        "first_6_months_schedule": schedule,
        "tax_benefits": tax_benefit.get(loan_type, tax_benefit["personal"]),
        "prepayment_tip": f"Paying one extra EMI per year saves {round(years * 0.08, 1)} years off your loan tenure",
    }, f"EMI: ₹{round(emi, 0):,.0f}/month for {years} years")


# ══════════════════════════════════════════════════════════════════
# PRODUCTIVITY TOOLS
# ══════════════════════════════════════════════════════════════════

def handle_pomodoro_planner(files, payload, job_dir):
    tasks = _p(payload, "text", "")
    work_mins = _pi(payload, "work_minutes", 25)
    break_mins = _pi(payload, "break_minutes", 5)
    long_break = _pi(payload, "long_break_minutes", 15)
    start_time = _p(payload, "start_time", "09:00")

    task_list = [t.strip() for t in tasks.split("\n") if t.strip()] if tasks else [
        "Email and messages", "Deep work task 1", "Deep work task 2", "Review and planning"
    ]

    try:
        h, m = map(int, start_time.split(":"))
        current = datetime(2024, 1, 1, h, m)
    except Exception:
        current = datetime(2024, 1, 1, 9, 0)

    schedule = []
    pomodoro_count = 0
    for task in task_list:
        pomodoro_count += 1
        start = current.strftime("%H:%M")
        current += timedelta(minutes=work_mins)
        end = current.strftime("%H:%M")
        schedule.append({"pomodoro": pomodoro_count, "task": task, "start": start, "end": end, "type": "work"})

        if pomodoro_count % 4 == 0:
            b_start = current.strftime("%H:%M")
            current += timedelta(minutes=long_break)
            schedule.append({"pomodoro": "LONG BREAK", "task": "Rest & recharge", "start": b_start, "end": current.strftime("%H:%M"), "type": "long_break"})
        else:
            b_start = current.strftime("%H:%M")
            current += timedelta(minutes=break_mins)
            schedule.append({"pomodoro": "break", "task": "Short break", "start": b_start, "end": current.strftime("%H:%M"), "type": "short_break"})

    total_work = len(task_list) * work_mins
    total_break = len(task_list) * break_mins

    return _ok({
        "work_minutes": work_mins,
        "short_break_minutes": break_mins,
        "long_break_minutes": long_break,
        "start_time": start_time,
        "end_time": current.strftime("%H:%M"),
        "schedule": schedule,
        "stats": {
            "total_pomodoros": len(task_list),
            "total_work_minutes": total_work,
            "total_break_minutes": total_break,
            "total_duration_minutes": total_work + total_break,
        },
        "tips": [
            "Eliminate distractions completely during work sessions",
            "Note down interruptions, don't act on them immediately",
            "After 4 pomodoros, take a 15-30 minute break",
            "Adjust session length to your flow state — some prefer 50/10",
        ]
    }, f"Pomodoro plan generated: {len(task_list)} sessions starting at {start_time}")


def handle_habit_tracker_generator(files, payload, job_dir):
    habits = _p(payload, "text", "")
    days = max(7, min(90, _pi(payload, "days", 30)))
    goal = _p(payload, "goal", "build")

    habit_list = [h.strip() for h in habits.split("\n") if h.strip()] if habits else [
        "Exercise (30 min)", "Read (20 pages)", "Meditate (10 min)", "No social media before 10am", "Drink 2L water"
    ]

    science = {
        "build": "New habits take 18-254 days to form (avg 66 days). Start tiny — 2 minutes max.",
        "break": "Replace the bad habit with a better one. Identify the cue → routine → reward loop.",
        "improve": "Use 1% better every day. Track streaks — don't break the chain.",
    }

    return _ok({
        "habits": habit_list,
        "tracking_days": days,
        "goal_type": goal,
        "tracker_template": {f"Day {d+1}": {h: "☐" for h in habit_list} for d in range(min(7, days))},
        "weekly_review_questions": [
            "Which habits did I complete consistently this week?",
            "What obstacles prevented habit completion?",
            "What's one small change to make next week better?",
            "How did my habits affect my energy, mood, or productivity?",
        ],
        "science": science.get(goal, science["build"]),
        "tips": [
            "Habit stack: attach new habits to existing ones (after coffee → meditate)",
            "Environment design: make good habits obvious, bad habits invisible",
            "Two-day rule: never miss twice in a row",
            "Track publicly for accountability",
            "Reward yourself immediately after completing the habit",
        ],
        "printable_prompt": f"Print a {days}-day tracker with habits: {', '.join(habit_list[:4])}. Check off daily."
    }, f"Habit tracker for {len(habit_list)} habits × {days} days")


def handle_meeting_agenda_generator(files, payload, job_dir):
    meeting_title = _p(payload, "text", "Team Sync")
    duration_mins = _pi(payload, "duration", 60)
    attendees = _p(payload, "attendees", "")
    objective = _p(payload, "objective", "project update and next steps")

    attendee_list = [a.strip() for a in attendees.split(",") if a.strip()] if attendees else ["Team Members"]

    time_alloc = {
        30: [("Welcome & Objectives", 3), ("Updates from team", 10), ("Key discussion", 12), ("Decisions & Action Items", 5)],
        45: [("Welcome & Objectives", 5), ("Updates from team", 15), ("Key discussion", 15), ("Blockers & risks", 5), ("Action items & owners", 5)],
        60: [("Welcome & Objectives", 5), ("Updates from team", 15), ("Key discussion", 20), ("Blockers & risks", 10), ("Decisions", 5), ("Action items & next steps", 5)],
        90: [("Welcome & Objectives", 5), ("Updates from team", 20), ("Deep dive: Topic 1", 20), ("Deep dive: Topic 2", 20), ("Blockers & risks", 10), ("Decisions & action items", 10), ("Wrap-up", 5)],
    }

    closest = min(time_alloc.keys(), key=lambda x: abs(x - duration_mins))
    agenda_items = time_alloc[closest]

    current_time = datetime.now().replace(second=0, microsecond=0)
    agenda_with_times = []
    for item, mins in agenda_items:
        agenda_with_times.append({
            "item": item,
            "duration_min": mins,
            "start_time": current_time.strftime("%H:%M"),
            "facilitator": "Host",
        })
        current_time += timedelta(minutes=mins)

    return _ok({
        "meeting_title": meeting_title,
        "objective": objective,
        "duration_minutes": duration_mins,
        "attendees": attendee_list,
        "agenda": agenda_with_times,
        "pre_meeting_checklist": [
            "Send agenda 24 hours in advance",
            "Confirm attendance from all stakeholders",
            "Prepare any necessary materials/slides",
            "Test video conferencing setup",
            "Assign a note-taker",
        ],
        "facilitation_tips": [
            "Start on time — respect everyone's schedule",
            "Park off-topic discussions in a 'parking lot'",
            "Assign an owner and deadline to every action item",
            "End 5 minutes early to allow buffer",
            "Send meeting notes within 2 hours",
        ],
        "meeting_invite_template": f"Meeting: {meeting_title}\nObjective: {objective}\nDuration: {duration_mins} minutes\nAttendees: {', '.join(attendee_list)}\n\nAgenda:\n" + "\n".join(f"{i+1}. {a['item']} ({a['duration_min']} min)" for i, a in enumerate(agenda_with_times))
    }, f"Meeting agenda generated for '{meeting_title}' ({duration_mins} min)")


# ══════════════════════════════════════════════════════════════════
# HANDLER REGISTRY
# ══════════════════════════════════════════════════════════════════

MEGA_TOOLS_V2_HANDLERS = {
    # AI Writing
    "ai-headline-generator": handle_ai_headline_generator,
    "blog-outline-generator": handle_blog_outline_generator,
    "email-subject-generator": handle_email_subject_generator,
    "product-description-generator": handle_product_description_generator,
    "social-caption-generator": handle_social_caption_generator,

    # Crypto / Web3
    "crypto-profit-calculator": handle_crypto_profit_calculator,
    "eth-gas-calculator": handle_eth_gas_calculator,
    "crypto-dca-calculator": handle_crypto_dca_calculator,
    "nft-royalty-calculator": handle_nft_royalty_calculator,
    "hash-rate-calculator": handle_hash_rate_calculator,

    # HR / Jobs
    "salary-hike-calculator": handle_salary_hike_calculator,
    "notice-period-calculator": handle_notice_period_calculator,
    "job-offer-comparator": handle_job_offer_comparator,
    "interview-question-generator": handle_interview_question_generator,
    "resignation-letter-generator": handle_resignation_letter_generator,
    "salary-negotiation-helper": handle_salary_negotiation_helper,

    # Legal
    "nda-generator": handle_nda_generator,
    "freelance-contract-generator": handle_freelance_contract_generator,
    "privacy-policy-generator": handle_privacy_policy_generator,

    # Travel
    "travel-cost-estimator": handle_travel_cost_estimator,
    "visa-checklist-generator": handle_visa_checklist_generator,
    "currency-travel-calculator": handle_currency_travel_calculator,
    "packing-list-generator": handle_packing_list_generator,

    # Developer V2
    "api-response-generator": handle_api_response_generator,
    "sql-query-builder": handle_sql_query_builder,
    "gitignore-generator": handle_gitignore_generator,
    "color-palette-generator": handle_color_palette_generator,
    "docker-compose-generator": handle_docker_compose_generator,

    # Finance V2
    "fd-calculator": handle_fd_calculator,
    "sip-calculator": handle_sip_calculator,
    "emi-calculator-advanced": handle_emi_calculator_advanced,

    # Productivity
    "pomodoro-planner": handle_pomodoro_planner,
    "habit-tracker-generator": handle_habit_tracker_generator,
    "meeting-agenda-generator": handle_meeting_agenda_generator,
}
