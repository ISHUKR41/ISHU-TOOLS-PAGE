# Skill: flashcard-generator

## Purpose
Creates educational flashcard sets for studying, memorization, and active recall practice. Generates question-answer pairs, cloze deletions, definition cards, concept maps, and Anki-compatible exports for any subject or topic.

## When to Use
- Student needs to study for an exam
- Need to memorize technical concepts (programming, medicine, law, etc.)
- Need to learn vocabulary in a new language
- Need to create training material for employees
- Need to create quiz questions from a document or notes
- Need to create Anki decks for spaced repetition

## Flashcard Types

### 1. Basic Q&A Cards
```
FRONT: What is Big O notation?
BACK: Big O notation describes the upper bound of an algorithm's
time/space complexity as input size grows. Example: O(n) means
linear time — doubling input doubles time.
```

### 2. Cloze Deletion Cards
```
ORIGINAL: The TCP/IP model has 4 layers: Application, Transport, Internet, and Network Access.

CARD 1: The TCP/IP model has ___ layers.  → 4
CARD 2: The ___ layer handles HTTP and DNS in TCP/IP.  → Application
CARD 3: TCP and UDP operate at the ___ layer.  → Transport
```

### 3. Definition Cards
```
FRONT: Define: Polymorphism (OOP)
BACK: The ability of different objects to respond to the same 
      method call in different ways. 
      Types: Compile-time (overloading) | Runtime (overriding)
      Example: shape.draw() works for Circle, Square, Triangle
```

### 4. Comparison Cards
```
FRONT: TCP vs UDP — key differences?
BACK: TCP: Connection-oriented, reliable, ordered, slower
      UDP: Connectionless, unreliable, faster, used for streaming
      Use TCP: HTTP, FTP, email
      Use UDP: Video calls, gaming, DNS
```

## Usage Examples

```
"Generate 20 flashcards on Python data structures for a CS student"
"Create 15 flashcards on the Indian Constitution for UPSC preparation"
"Make flashcards on React hooks — useState, useEffect, useContext, useMemo"
"Generate Anki-format flashcards on organic chemistry reaction types"
"Create 10 Hindi vocabulary flashcards with English translation and example sentences"
```

## Subject-Specific Templates

### Programming Concepts
```
FRONT: What does [concept name] do in [language]?
BACK: 
  Definition: [1-2 sentences]
  Syntax: [code snippet]
  Example: [working code example]
  When to use: [use cases]
  When NOT to use: [edge cases or alternatives]
```

### History / Social Studies
```
FRONT: [Event Name] — When did it happen?
BACK:
  Date: [Year or period]
  Location: [Where]
  Cause: [Key reason]
  Effect: [Impact on history]
  Key figures: [Names]
  Connection to: [Related events]
```

### Medical / Biology
```
FRONT: What is the function of [organ/cell/molecule]?
BACK:
  Primary function: [Main role]
  Location: [Where in body]
  Structure: [Brief anatomy]
  Related conditions: [Diseases if malfunctioning]
  Mnemonic: [Memory trick if applicable]
```

### Language Learning
```
FRONT: [Target language word] | [Pronunciation]
BACK:
  Meaning: [English translation]
  Part of speech: [Noun/Verb/Adj/Adv]
  Example: [Sentence in target language]
  Translation: [Sentence in English]
  Related words: [Synonyms, antonyms, word family]
```

## ISHU TOOLS Flashcard Tool Implementation

### Tool: Flashcard Maker
```
Input fields:
- Topic (text field)
- Subject category (dropdown: UPSC, JEE, Medical, Programming, Language, Custom)
- Number of cards (10/20/30/50)
- Card type (Q&A / Cloze / Definition / Comparison)
- Difficulty (Easy / Medium / Hard)
- Custom content (paste text to generate from)

Output:
- Formatted flashcard deck
- Download as PDF (print-and-cut format)
- Download as CSV (for Anki import)
- Copy to clipboard
```

### Anki CSV Export Format
```csv
"Question","Answer","Tags"
"What is a closure in JavaScript?","A function that retains access to its outer scope's variables even after the outer function has returned.","js,closures,functions"
"What does Array.prototype.reduce() do?","Reduces an array to a single value by executing a reducer function on each element.","js,arrays,higher-order-functions"
```

## Spaced Repetition Schedule (Leitner System)
```
Box 1: Review every day (new or incorrect cards)
Box 2: Review every 2 days (answered correctly once)
Box 3: Review every 4 days (answered correctly twice)
Box 4: Review every 8 days (answered correctly three times)
Box 5: Review every 16 days (long-term memory)
```

## UPSC Preparation Sample Cards
```
Card 1:
Q: What is Article 370 of the Indian Constitution?
A: Granted special autonomous status to Jammu & Kashmir.
   Abrogated: August 5, 2019. J&K divided into two UTs:
   J&K (with legislature) and Ladakh (without legislature).

Card 2:
Q: Name the 5 BRICS countries.
A: Brazil, Russia, India, China, South Africa.
   Founded: 2009 (BRIC) | Added South Africa: 2010
   Expansion 2024: Saudi Arabia, UAE, Egypt, Iran, Ethiopia
```

## Related Skills
- `interview-prep` — interview Q&A generation (similar format)
- `content-machine` — educational content at scale
- `resume-maker` — student skill organization
- `deep-research` — research content to convert to flashcards
