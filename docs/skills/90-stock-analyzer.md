# Skill: stock-analyzer

## Purpose
Provides stock market analysis tools — fundamental analysis, technical indicator explanations, portfolio evaluation, financial ratio calculations, sector analysis, and investment education. Focused on Indian markets (NSE/BSE) and global equities.

## When to Use
- User wants to understand fundamental metrics of a stock
- User needs to calculate financial ratios (P/E, EPS, P/B, etc.)
- User wants to understand technical indicators (RSI, MACD, SMA)
- User needs to evaluate a portfolio for diversification
- User wants to understand IPO analysis
- User wants educational content about stock investing

## ⚠️ Disclaimer
```
All analysis is for EDUCATIONAL PURPOSES ONLY.
This is NOT investment advice. Stock markets carry risk.
Past performance does not guarantee future results.
Consult a SEBI-registered Investment Advisor before investing.
```

## Fundamental Analysis Framework

### Key Financial Ratios
```python
def calculate_fundamental_ratios(
    market_price: float,
    earnings_per_share: float,
    book_value_per_share: float,
    revenue: float,
    net_income: float,
    total_debt: float,
    total_equity: float,
    dividend_per_share: float = 0,
) -> dict:
    
    pe_ratio = market_price / earnings_per_share
    pb_ratio = market_price / book_value_per_share
    net_profit_margin = (net_income / revenue) * 100
    debt_to_equity = total_debt / total_equity
    dividend_yield = (dividend_per_share / market_price) * 100
    roe = (net_income / total_equity) * 100
    
    return {
        "P/E Ratio": round(pe_ratio, 2),
        "P/B Ratio": round(pb_ratio, 2),
        "Net Profit Margin %": round(net_profit_margin, 2),
        "Debt/Equity Ratio": round(debt_to_equity, 2),
        "Dividend Yield %": round(dividend_yield, 2),
        "Return on Equity %": round(roe, 2),
    }
```

### Ratio Interpretation Guide
```
P/E Ratio (Price-to-Earnings):
< 15: Undervalued (or low growth expected)
15-25: Fair value range
> 40: Expensive (or high growth priced in)
Nifty 50 historical avg: ~20-22

P/B Ratio (Price-to-Book):
< 1.0: Trading below book value (potentially undervalued)
1-3: Fair range
> 5: Premium valuation (justify with high ROE)

ROE (Return on Equity):
> 20%: Excellent (Infosys, HDFC Bank level)
15-20%: Good
10-15%: Average
< 10%: Poor

Debt/Equity:
< 0.5: Conservative (low risk)
0.5-1.5: Moderate
> 2.0: High leverage (risky for cyclical businesses)
```

## Technical Analysis Indicators

### Simple Moving Average (SMA)
```python
def calculate_sma(prices: list[float], period: int) -> list[float]:
    """Calculate Simple Moving Average"""
    smas = []
    for i in range(len(prices)):
        if i < period - 1:
            smas.append(None)
        else:
            smas.append(sum(prices[i-period+1:i+1]) / period)
    return smas

# Usage:
# sma_20 = calculate_sma(closing_prices, 20)  # 20-day SMA
# sma_50 = calculate_sma(closing_prices, 50)  # 50-day SMA
# Crossover: SMA20 crosses above SMA50 = bullish signal
```

### RSI (Relative Strength Index)
```python
def calculate_rsi(prices: list[float], period: int = 14) -> list[float]:
    """
    RSI < 30: Oversold (potentially buy signal)
    RSI > 70: Overbought (potentially sell signal)
    RSI = 50: Neutral
    """
    changes = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    rsi_values = [None] * period
    
    for i in range(period, len(changes) + 1):
        window = changes[i-period:i]
        gains = [c for c in window if c > 0]
        losses = [-c for c in window if c < 0]
        avg_gain = sum(gains) / period if gains else 0
        avg_loss = sum(losses) / period if losses else 0
        
        if avg_loss == 0:
            rsi = 100
        else:
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
        rsi_values.append(round(rsi, 2))
    
    return rsi_values
```

## Indian Market Context

### Nifty 50 Sector Weights (2026)
```
Financial Services: ~33%
IT/Technology: ~15%
Oil & Gas: ~12%
Consumer Goods: ~9%
Automobile: ~8%
Healthcare: ~5%
Metals & Mining: ~5%
Others: ~13%
```

### Key Indian Financial Metrics
```
Market Cap categories:
Large Cap: Top 100 companies by market cap
Mid Cap: 101-250 companies
Small Cap: 251+ companies

SEBI Taxation:
Short-term Capital Gains (< 1 year): 20%
Long-term Capital Gains (> 1 year, > ₹1 lakh): 12.5%
Dividend: Taxed as per income slab

STT (Securities Transaction Tax):
Equity delivery: 0.1% of turnover
Equity intraday: 0.025% of turnover
F&O Futures: 0.02% of turnover
```

### SIP Calculator for Mutual Funds
```python
def sip_calculator(monthly_amount: float, annual_return: float, years: int) -> dict:
    """
    FV = P × [((1+r)^n - 1) / r] × (1+r)
    P = monthly amount, r = monthly rate, n = months
    """
    r = annual_return / 12 / 100
    n = years * 12
    future_value = monthly_amount * (((1 + r)**n - 1) / r) * (1 + r)
    total_invested = monthly_amount * n
    wealth_gained = future_value - total_invested
    
    return {
        "monthly_sip": monthly_amount,
        "total_invested": round(total_invested),
        "expected_returns": round(wealth_gained),
        "total_value": round(future_value),
        "return_multiple": round(future_value / total_invested, 2),
        "annualized_return_pct": annual_return
    }

# Example: ₹5000/month, 12% return, 20 years
# Total invested: ₹12,00,000
# Expected returns: ₹37,95,740
# Total value: ₹49,95,740 (4.16x return!)
```

### Stock Analysis Checklist (Before Investing)
```
BUSINESS QUALITY (Moat):
□ Does the company have a durable competitive advantage?
□ Is the business model simple and understandable?
□ Is management trustworthy? (Check promoter holding, pledging)
□ Is the industry growing?

FINANCIAL HEALTH:
□ Revenue growing consistently (5-year CAGR > 15%)?
□ Net profit margins stable or improving?
□ Debt/Equity < 1.0 (or justified by industry)?
□ Cash flow from operations positive?
□ ROE > 15% consistently?

VALUATION:
□ P/E ratio vs industry average?
□ P/E vs historical P/E of the same company?
□ Growth at Reasonable Price (GARP): P/E < Expected Growth Rate?

RED FLAGS:
□ Promoter holding decreasing significantly
□ High promoter pledge (> 50% = warning)
□ Auditor change or qualified audit opinion
□ Declining cash flows despite growing profits
□ Revenue from related party transactions
```

## Related Skills
- `real-estate-analyzer` — alternative investment analysis
- `insurance-optimizer` — portfolio protection
- `tax-reviewer` — capital gains tax planning
- `excel-generator` — investment tracking spreadsheets
