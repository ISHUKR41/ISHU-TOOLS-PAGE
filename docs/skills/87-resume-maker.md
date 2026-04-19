# Skill: resume-maker

## Purpose
Creates professional resumes/CVs — ATS-optimized, role-specific, and formatted for Indian job market (campus placements, FAANG applications, startups). Generates content, suggests action verbs, quantifies achievements, and formats in multiple styles.

## When to Use
- Student needs a campus placement resume
- Professional needs a resume for a career change
- User wants to tailor a resume for a specific job description
- User needs to pass ATS (Applicant Tracking Systems)
- User wants a LinkedIn-compatible profile summary
- User needs a cover letter to accompany the resume

## Resume Formats

### Format 1: IIT/NIT Campus Placement
```
[Single page, reverse chronological, clean serif or sans font]

EDUCATION
━━━━━━━━━
Indian Institute of Technology Patna
B.Tech. in Computer Science | CGPA: 8.2/10 | May 2026
Relevant Coursework: Data Structures, OS, DBMS, Machine Learning

WORK EXPERIENCE
━━━━━━━━━━━━━━
Software Development Intern | Google | May–Jul 2025
• Developed a feature for [product] using [tech] that improved [metric] by 30%
• Collaborated with a team of 5 engineers to ship [deliverable] on time
• Wrote 200+ unit tests achieving 90% code coverage for core module

PROJECTS
━━━━━━━━
ISHU TOOLS | Python, FastAPI, React | github.com/...
• Built a free online toolkit with 770+ tools used by 50,000+ monthly users
• Implemented content-visibility optimization reducing paint time by 60%
• Designed RESTful API with rate limiting handling 10,000 requests/day

SKILLS
━━━━━━
Programming: Python, JavaScript, TypeScript, C++, Java
Frameworks: React, FastAPI, Node.js, Django
Tools: Git, Docker, AWS, PostgreSQL, MongoDB

ACHIEVEMENTS
━━━━━━━━━━
• Winner, National Hackathon 2024 (among 500+ teams)
• JEE Advanced 2022: Rank 1,523 (Top 1% of 150,000 candidates)
• GATE 2025: Score 720/1000
```

### Format 2: FAANG Resume (USA-style)
```
[Bullet-heavy, metrics-focused, no photo, 1-2 pages]

NAME | Phone | Email | LinkedIn | GitHub | Portfolio

EDUCATION
IIT Patna | B.Tech. Computer Science | GPA: 3.7/4.0 | 2026

EXPERIENCE
Google (Intern) | Mountain View, CA | Summer 2025
• Reduced API latency by 45% by implementing caching layer using Redis
• Shipped feature used by 2M+ users to Production in 8 weeks
• Achieved 95% test coverage across 3,000+ lines of new code

TECHNICAL SKILLS
Languages: Python (Expert), JavaScript (Proficient), Go (Familiar)
Frameworks: React, FastAPI, GraphQL
Systems: Distributed systems, REST API design, Microservices
```

## Achievement Quantification Guide

### Turn Vague → Strong
```
❌ WEAK: "Worked on improving website performance"
✅ STRONG: "Reduced page load time from 8s to 1.2s (85% improvement) by 
            implementing code splitting and lazy loading"

❌ WEAK: "Helped design a database schema"
✅ STRONG: "Designed normalized database schema for 10M+ records that 
            reduced query time by 70%"

❌ WEAK: "Built a recommendation system"
✅ STRONG: "Built collaborative filtering recommendation engine 
            increasing user engagement by 23% (CTR: 8% → 10%)"

❌ WEAK: "Led a team"
✅ STRONG: "Led 4-person team to deliver [product] 2 weeks ahead of 
            schedule with zero critical bugs in production"
```

## Action Verbs by Category

### Technical / Development
```
Built, Developed, Implemented, Engineered, Designed, Architected,
Optimized, Refactored, Deployed, Integrated, Automated, Debugged,
Migrated, Scaled, Maintained, Tested, Released, Containerized
```

### Leadership / Management
```
Led, Managed, Mentored, Coordinated, Directed, Facilitated,
Spearheaded, Established, Launched, Prioritized, Delegated, Executed
```

### Analysis / Research
```
Analyzed, Researched, Evaluated, Identified, Discovered, Assessed,
Investigated, Benchmarked, Tested, Validated, Measured, Tracked
```

### Impact / Results
```
Achieved, Improved, Increased, Reduced, Eliminated, Saved,
Generated, Accelerated, Enhanced, Maximized, Streamlined, Delivered
```

## ATS Optimization

### ATS-Friendly Formatting
```
✅ DO:
• Use standard section headings: Education, Experience, Skills, Projects
• Include keywords from job description verbatim
• Use .docx or PDF format (both work)
• Use readable fonts: Arial, Calibri, Times New Roman
• Standard margins: 0.5-1 inch

❌ DON'T:
• Put text in tables or text boxes (ATS can't read these)
• Use headers/footers (often skipped by ATS)
• Use fancy fonts or graphics
• Use columns (ATS may read across columns incorrectly)
• Use abbreviations without spelling out first time
```

### Keyword Density Check
```python
def check_ats_keywords(resume_text: str, job_description: str) -> dict:
    """Check how many job description keywords appear in resume"""
    import re
    
    jd_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', job_description.lower()))
    resume_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', resume_text.lower()))
    
    common = jd_words & resume_words
    missing = jd_words - resume_words
    
    return {
        "match_rate": round(len(common) / len(jd_words) * 100, 1),
        "matched_keywords": list(common),
        "missing_keywords": list(missing)[:20],  # Top 20 missing
    }
```

## ISHU TOOLS Resume Section Template

### For Developer Building a Portfolio
```
PROJECTS

ISHU TOOLS | Python, FastAPI, React, Vite | ishu.tools
• Built a free online toolkit platform with 770+ tools across 45 categories
• Achieved sub-300ms API response times using in-process LRU caching
• Implemented content-visibility:auto and lazy loading, improving scroll 
  performance by 80% on tool catalog (10,000+ DOM nodes)
• Designed rate-limiting system (60 req/min/IP) with graceful degradation
• SEO-optimized 770+ tool pages with structured data and dynamic meta tags
• Integrated service worker for PWA support with offline capability
```

## LinkedIn Profile Summary (ISHU TOOLS Creator)
```
Computer Science student at IIT Patna, passionate about building 
tools that make technology accessible to everyone.

I created ISHU TOOLS (ishu.tools) — a platform with 770+ free online 
tools including PDF converters, image editors, developer utilities, 
and more. 50,000+ monthly users. Zero cost to them.

Technical skills: Python, FastAPI, React, TypeScript, PostgreSQL

Currently: Final year B.Tech at IIT Patna
Next: Looking for SWE / Founding Engineer roles

DM me for collabs, feedback on ISHU TOOLS, or just to chat.
```

## Related Skills
- `interview-prep` — complementary to resume preparation
- `ai-recruiter` — hiring manager perspective
- `copywriting` — strong professional copy
- `linkedin-optimization` — complementary profile skill
