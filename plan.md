# Humor Generator: Implementation Plan

## Project Overview

**Humor Generator** is an LLM-powered humor creation tool with human-in-the-loop design. Unlike a simple "joke dispenser," it's a **collaborative creativity amplifier** that makes the mechanics of humor visible, educational, and participatory.

### Core Value Proposition
- **Transparency**: Users see *why* something is funny, not just *that* it's funny
- **Participatory**: Sliders, toggles, and choices let users steer generation
- **Educational**: Failure analysis teaches the craft of comedy
- **Poetic sensibility**: Humor as compressed insight, like poetry

---

## Current State Assessment

### What Exists

| Asset | Status | Purpose |
|-------|--------|---------|
| `THEORY.md` | Complete | Comprehensive humor mechanics theory (600 lines) covering bindings, detachment operations, violation types, benignness strategies, and the full humor pipeline |
| `PROJECT.md` | Complete | Technical specification (~1400 lines) with TypeScript data models, system architecture, prompt templates, evaluation framework, and UI specifications |
| `prototype.jsx` | Functional Demo | React UI prototype (~900 lines) demonstrating the core interaction model with sample data |
| `skill.md` → `.claude/skills/` | Migrated | Design principles skill for precision UI development |

### Prototype Analysis

The current `prototype.jsx` demonstrates:
- Topic input with binding extraction
- Voice selection (6 voices with operation weight presets)
- Audience profiles (4 presets)
- Operation weight sliders (8 operations)
- Style dials (6 dimensions)
- Binding selection interface
- Candidate display with mechanism expansion
- Learning panel for failure analysis

**Limitations of current prototype:**
- Static sample data only (no LLM integration)
- Inline styles (no design system)
- Single-file component (no modularity)
- No state persistence
- No actual generation pipeline

---

## Technical Architecture Decisions

### 1. Frontend Framework
**Recommendation: Next.js 14+ with App Router**

Rationale:
- Server components for LLM API calls (keep keys server-side)
- API routes for generation pipeline
- Built-in routing for multi-page app (Generate, Theory, Library)
- Excellent TypeScript support matching PROJECT.md models

### 2. Styling Approach
**Recommendation: Tailwind CSS + CSS Variables**

Rationale:
- Aligns with design-principles skill (4px grid, consistent spacing)
- Design tokens via CSS variables for theming
- Utility-first matches the rapid iteration needs
- Dark mode built-in (current prototype uses dark theme)

### 3. State Management
**Recommendation: Zustand for client state + React Query for server state**

Rationale:
- Zustand: lightweight, TypeScript-native, perfect for UI state (sliders, selections)
- React Query: handles LLM API calls, caching, loading states
- Clear separation of concerns

### 4. LLM Integration
**Recommendation: Claude API via Anthropic SDK**

Rationale:
- PROJECT.md prompt templates already Claude-optimized
- Structured output (JSON) for binding extraction and scoring
- Streaming for long generation responses

### 5. Data Persistence
**Recommendation: Start with localStorage, plan for Supabase**

Phase 1 (MVP):
- localStorage for session history
- No user accounts

Phase 2:
- Supabase for user accounts, saved jokes, binding library
- Vector embeddings for originality checking

---

## Implementation Phases

### Phase 1: Foundation (Project Setup)

**Objective:** Establish project structure, design system, and core components

Tasks:
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind with design tokens from skill
- [ ] Create component library matching design principles
  - [ ] Cards with consistent surface treatment
  - [ ] Sliders (operation weights, style dials)
  - [ ] Selection components (voice, audience)
  - [ ] Expandable panels (mechanism view)
  - [ ] Score bars and badges
- [ ] Implement TypeScript types from PROJECT.md
- [ ] Set up project structure:
  ```
  src/
  ├── app/
  │   ├── page.tsx (Generate)
  │   ├── theory/page.tsx
  │   ├── library/page.tsx
  │   └── api/
  │       ├── extract-bindings/route.ts
  │       ├── generate-jokes/route.ts
  │       └── analyze/route.ts
  ├── components/
  │   ├── ui/ (design system)
  │   ├── generation/ (domain-specific)
  │   └── layout/
  ├── lib/
  │   ├── prompts/ (from PROJECT.md templates)
  │   ├── types/ (from PROJECT.md models)
  │   └── hooks/
  └── stores/
  ```

### Phase 2: LLM Pipeline Integration

**Objective:** Connect UI to actual humor generation via Claude API

Tasks:
- [ ] Implement binding extraction endpoint
  - Input: topic, voice, audience
  - Output: DefaultModel with ranked Bindings
  - Use prompt template from PROJECT.md 4.1
- [ ] Implement disruption proposal endpoint
  - Input: selected bindings, operation weights
  - Output: DetachmentOperation[] with repair paths
  - Use prompt template from PROJECT.md 4.2
- [ ] Implement realization endpoint
  - Input: binding + operation + format + voice
  - Output: JokeCandidate variants
  - Use prompt template from PROJECT.md 4.3
- [ ] Implement critique endpoints (4 passes)
  - Structural validity (4.4)
  - Repairability (4.5)
  - Benignness (4.6)
  - Failure analysis (4.7)
- [ ] Wire up React Query for all endpoints
- [ ] Add loading states and streaming display

### Phase 3: Evaluation & Iteration

**Objective:** Complete the feedback loop with scoring and improvement

Tasks:
- [ ] Implement JokeScores calculation
  - Binding strength
  - Violation magnitude
  - Repairability
  - Benignness
  - Economy
  - Originality (basic, no corpus yet)
- [ ] Implement failure mode detection
  - confusion, flatness, offense, weak_snap, telegraphed, overexplained
- [ ] Build mutation system
  - Sharpen twist word
  - Increase misdirection
  - Trim setup
  - Swap operation type
  - Try different format
- [ ] User feedback collection (thumbs up/down + optional text)
- [ ] Learning panel with actionable suggestions

### Phase 4: Polish & Depth ✅

**Objective:** Add features that make the tool truly educational

Tasks:
- [x] Theory integration
  - Link mechanism explanations to THEORY.md sections
  - Inline concept definitions on hover (ConceptTooltip component)
  - "Why it works" always references theory principles
- [x] Library/History
  - Save favorite jokes with mechanism metadata
  - Session history with parameters (recentTopics)
  - Export functionality (JSON export, copy all)
- [ ] Advanced audience profiling (deferred)
  - Custom protected categories
  - In-group identity selection
  - Punching direction controls
- [ ] Binding library (deferred - grows over time)
  - Store successful binding-operation pairs
  - Surface high-success bindings for new topics

### Phase 5: MVP Launch Checklist ✅

- [x] 3+ voices working end-to-end (7 voices: Deadpan, Observational, Absurdist, Self-deprecating, Sardonic, Whimsical, Dry Wit)
- [x] 3+ audience presets (4 audiences: Family, General, Adult, Edgy)
- [x] All 8 operations functional (emptying, loading, exposure, reflection, reversal, overliteralization, categoryCrossing, compression)
- [x] Core style dials (commented out per user preference - sliders work via Operation Weights)
- [x] Binding extraction with user selection (multi-select bindings with visual feedback)
- [x] Mechanism display for each joke (expandable mechanism view with default/twist/repair)
- [x] Basic failure analysis (Learning Panel with dimension-specific suggestions)
- [x] Human rating (thumbs up/down with visual feedback)
- [x] Responsive design (2-column desktop layout with compact controls)
- [x] Error handling and edge cases (API errors shown, loading states, empty states)
- [x] Performance optimization (React Query for caching, debounced inputs via controlled components)

**Additional Features Delivered:**
- 🧬 Mutation system with 6 mutation types
- 📚 Library with save/export/delete functionality
- 📖 Theory tab with educational content and inline tooltips
- 💡 ConceptTooltips for learning throughout the Generate tab

---

## Design Direction

Per the design-principles skill, the recommended direction for Humor Lab:

**Personality:** Blend of **Precision & Density** + **Warmth & Approachability**
- Dense controls for power users (sliders, operation weights)
- Generous space for creative output (joke candidates, mechanism view)

**Color Foundation:**
- Dark mode primary (current prototype direction)
- Warm cream accent (#e8d5b7) for active elements
- Cool slate backgrounds for depth

**Typography:**
- IBM Plex Sans (already in prototype) - geometric, technical, readable
- IBM Plex Mono for data (scores, binding carriers)

**Depth Strategy:**
- Borders-only for control panels
- Subtle shadows for candidate cards (they're the "product")
- Surface color shifts for hierarchy

---

## Open Questions

1. **Hosting/Deployment**: Vercel is natural for Next.js. Need to consider API route timeouts for long LLM calls.

2. **Rate Limiting**: How to handle Claude API costs for public usage? Consider:
   - Generation limits per session
   - Optional API key input for power users

3. **Originality Checking**: The spec mentions embedding-based novelty and joke corpus. This is Phase 2+ scope. For MVP, skip or use simple heuristics.

4. **Phonetics Module**: The spec mentions CMUdict for pun generation. Defer to post-MVP unless user specifically needs puns.

5. **Collaboration Features**: The spec mentions share/remix. Defer to post-MVP.

---

## Success Metrics (MVP)

**Engagement:**
- Session duration > 5 minutes
- Return usage within 7 days
- Jokes saved to library

**Quality Signals:**
- Thumbs up rate > 30%
- "I'd share this" rate > 15%
- Mechanism clarity rating (users understand why it's funny)

**Learning Value:**
- Users read failure analyses
- Users adjust parameters based on suggestions
- Self-reported learning ("I understand humor better")

---

## Next Steps

1. Initialize Next.js project with TypeScript and Tailwind
2. Set up component library following design-principles skill
3. Port prototype UI to proper components with real state management
4. Implement first API route (binding extraction)
5. Test end-to-end flow with single topic
