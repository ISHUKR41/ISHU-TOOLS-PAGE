# Skill: interview-prep

## Purpose
Prepares candidates for job interviews — generates role-specific questions, provides model STAR answers, creates study plans, conducts mock interviews, offers feedback on answers, and provides interview strategy for specific companies.

## When to Use
- Preparing for a technical interview (SWE, Data Science, PM, etc.)
- Preparing for behavioral/HR rounds
- Practicing for FAANG/MAANG company interviews
- Preparing for campus placements (IIT, NIT, BITS)
- Need company-specific interview insights
- Need to practice "Tell me about yourself" and similar opens

## Interview Types Covered
| Type | Companies | Format |
|------|-----------|--------|
| DSA/Coding | Amazon, Google, Meta, Microsoft | LeetCode-style on whiteboard/screen share |
| System Design | FAANG+ senior roles | Architecture discussion, 45-60 min |
| Behavioral | All companies | STAR method, values-based |
| Case Study | McKinsey, BCG, Bain, Goldman | Business problem solving |
| Product Sense | Google PM, Meta APM | Design a product |
| Technical Screening | Startups, mid-size | Hackerrank/take-home |
| HR/Culture Fit | All | Values, salary, offers |

## Usage Examples

```
"Prepare me for a Google SWE interview — DSA questions for L4 level"
"Generate 20 behavioral questions for Amazon using Leadership Principles"
"Give me mock HR round questions for campus placements at IIT"
"Practice system design: Design YouTube's video streaming system"
"Give me questions for a Data Science role at a fintech startup"
```

## STAR Method Framework

### Structure for Behavioral Answers
```
S — SITUATION: Set the scene (1-2 sentences, specific context)
T — TASK: What was your responsibility or challenge?
A — ACTION: What YOU specifically did (not "we")
R — RESULT: Quantified outcome + what you learned

Time limit: 2-3 minutes per answer
```

### Sample STAR Answer
```
Q: "Tell me about a time you had to meet a tight deadline."

S: During my 3rd year at IIT Patna, our team had 48 hours to submit 
   a machine learning project for a national hackathon.

T: I was responsible for data preprocessing and model training,
   but our dataset was 10x larger than expected.

A: I immediately divided the data pipeline into parallel processing
   streams using multiprocessing. I also implemented early stopping
   to speed up training by 60%, and worked 30 hours straight,
   taking only 3 short breaks.

R: We submitted 2 hours before the deadline with 87% accuracy,
   won 2nd place nationally, and I learned to always buffer 
   time estimates by 50% for data-heavy tasks.
```

## Technical Interview — DSA Study Plan

### 8-Week Plan for FAANG
```
Week 1-2: Arrays & Strings (Easy → Medium)
  - Two pointers, sliding window, prefix sums
  - LeetCode: 1, 26, 121, 167, 209, 424, 438, 567

Week 3: Hash Maps & Sets
  - Frequency counters, anagram detection
  - LeetCode: 1, 49, 128, 217, 347, 560

Week 4: Trees & Graphs
  - BFS, DFS, binary trees, BST
  - LeetCode: 102, 104, 112, 124, 200, 207, 226

Week 5: Dynamic Programming (Basics)
  - Memoization, tabulation, 1D DP
  - LeetCode: 70, 198, 300, 322, 416

Week 6: DP (Advanced) + Greedy
  - 2D DP, interval problems
  - LeetCode: 53, 55, 62, 1143, 152

Week 7: System Design Study
  - Design URL shortener, load balancer, cache
  - Read: "System Design Interview" by Alex Xu

Week 8: Mock Interviews + Weakest Areas
  - 2 mocks per day, timed practice
```

## Amazon Leadership Principles — Question Bank

```
1. Customer Obsession
   Q: "Describe a time you put the customer's needs before short-term profit."

2. Ownership  
   Q: "Tell me about a time you took ownership of a problem that wasn't yours."

3. Invent and Simplify
   Q: "Describe an innovative solution you created for a complex problem."

4. Are Right, A Lot
   Q: "Tell me about a time you disagreed with the team direction and why."

5. Learn and Be Curious
   Q: "What is the most difficult thing you've taught yourself recently?"

6. Hire and Develop the Best
   Q: "Tell me about someone you mentored and how you helped them grow."

7. Insist on the Highest Standards
   Q: "Describe a time you didn't accept an 'it's good enough' approach."

8. Think Big
   Q: "Tell me about a time you proposed an idea that seemed too ambitious."

9. Bias for Action
   Q: "Describe a time you made an important decision with incomplete data."

10. Frugality
    Q: "Tell me about a time you achieved more with fewer resources."

11. Earn Trust
    Q: "Describe a time you failed publicly and what you did about it."

12. Dive Deep
    Q: "Tell me about a time you used data to solve a problem."

13. Have Backbone; Disagree and Commit
    Q: "Tell me about a time you pushed back on a manager and were right."

14. Deliver Results
    Q: "What's the most challenging project you delivered and how?"
```

## Tell Me About Yourself (ISHU TOOLS Template)
```
"I'm [Name], a [year] student at [IIT/College], studying [Branch].

[Academic achievement]: I've maintained a [CGPA] CGPA and have 
completed projects in [relevant areas].

[Technical strength]: I'm proficient in [Tech 1], [Tech 2], and [Tech 3].

[Project highlight]: Most notably, I built [project description] that 
[specific outcome/users/impact].

[Why this company]: I'm excited about [Company] because [specific reason — 
their technology, values, or products you've used].

That's the quick version — I'd love to go deeper on any area."
```

## Campus Placement HR Questions
```
1. "Why do you want this role/company?"
2. "Where do you see yourself in 5 years?"
3. "What is your biggest weakness?"
4. "Are you open to relocation/night shifts?"
5. "What are your salary expectations?"
6. "Do you have any return offer / PPO offers?"
7. "Tell me about a time you led a team."
8. "How do you handle failure?"
```

### Salary Negotiation Script
```
"Based on my research and the value I bring — specifically 
my [project/internship/skill] — I was expecting something 
in the range of ₹[X-Y] LPA. Is there flexibility there?"
```

## Related Skills
- `ai-recruiter` — from the hiring manager's perspective
- `resume-maker` — resume preparation
- `flashcard-generator` — DSA/concept review cards
- `deep-research` — company research
