# Skill: ai-recruiter

## Purpose
Automates the full recruiting workflow — writing job descriptions, screening candidate resumes, generating interview questions, scoring applicants, and drafting offer/rejection letters. Functions as a full AI recruiting assistant.

## When to Use
- Hiring manager needs a job description written quickly
- Need to screen 50+ resumes against a set of criteria
- Need role-specific interview question banks
- Need to draft professional offer/rejection emails
- Need a scorecard/rubric for evaluating candidates

## Core Capabilities
| Task | Output |
|------|--------|
| Job Description (JD) | Full JD with responsibilities, requirements, benefits, salary range |
| Resume Screening | Score 1-10 with pass/fail flag per criterion |
| Interview Questions | Technical + behavioral + culture-fit questions |
| Candidate Scorecard | Weighted rubric across 5-8 dimensions |
| Offer Letter | Professional offer with compensation, start date, contingencies |
| Rejection Letter | Empathetic, legally-safe rejection with optional feedback |
| Sourcing Strategy | Where to post, Boolean search strings for LinkedIn |

## Usage Examples

```
"Write a job description for a Senior React Developer at a fintech startup, remote, ₹25-35 LPA"
"Screen these 5 resumes against: 5+ years Python, FastAPI experience, ML background"
"Generate 20 behavioral interview questions for a Product Manager role"
"Write a rejection email for a candidate who made it to final round but wasn't selected"
```

## Job Description Structure
1. **Company Overview** (2-3 sentences, culture-focused)
2. **Role Summary** (1 paragraph, impact-focused)
3. **Key Responsibilities** (6-8 bullet points, action verbs)
4. **Requirements — Must Have** (5-6 non-negotiables)
5. **Requirements — Nice to Have** (3-4 preferred)
6. **Benefits & Perks** (compensation, growth, culture)
7. **Equal Opportunity Statement** (legally required)

## Resume Screening Criteria
```python
criteria = {
    "years_experience": {"weight": 0.25, "threshold": 3},
    "required_skills": {"weight": 0.35, "threshold": 0.8},  # 80% match
    "education": {"weight": 0.15, "threshold": "bachelor"},
    "domain_experience": {"weight": 0.15},
    "communication": {"weight": 0.10},  # inferred from resume quality
}
```

## Interview Question Types
| Type | Purpose | Count |
|------|---------|-------|
| Technical/Skills | Verify hard skills | 8-10 |
| Behavioral (STAR) | Past behavior predicts future | 5-7 |
| Situational | Hypothetical judgment | 3-5 |
| Culture Fit | Values alignment | 3-5 |
| Motivation | Why this role/company | 2-3 |

## ISHU TOOLS Use Case
If building an HR tool on ISHU TOOLS, this skill powers:
- "JD Generator" tool
- "Resume Screener" tool
- "Interview Question Bank" tool
- "Offer Letter Generator" tool

## Candidate Scorecard Template
```
Dimension           Weight  Score (1-5)  Weighted
Technical Skills    30%     4            1.20
Problem Solving     20%     3            0.60
Communication       20%     5            1.00
Culture Fit         15%     4            0.60
Leadership          15%     3            0.45
────────────────────────────────────────────────
TOTAL               100%                 3.85/5.0
DECISION: ADVANCE (threshold: 3.5)
```

## Legal Compliance Notes
- Never ask about: age, marital status, religion, children, nationality (in India: per Equal Remuneration Act)
- JDs must be gender-neutral
- Salary must comply with local minimum wage laws
- Reference checks need candidate consent

## Related Skills
- `interview-prep` — candidate-side preparation
- `resume-maker` — candidate resume creation
- `legal-contract` — employment contracts
