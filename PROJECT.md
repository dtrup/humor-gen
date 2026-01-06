# Humor Generator: Technical Specification

*A comprehensive spec for an LLM-powered humor creation tool with human-in-the-loop design*

---

## 1. Product Vision

### 1.1 Core Purpose
A creative tool that helps users understand and generate humor by making the mechanics visible. Not a "joke dispenser" but a **collaborative creativity amplifier** that teaches while it generates.

### 1.2 Design Philosophy
- **Transparent mechanism**: Users see *why* something is funny, not just *that* it's funny
- **Participatory**: Sliders, toggles, and choices let users steer generation
- **Educational**: Failure analysis teaches the craft
- **Poetic sensibility**: Humor as a form of compressed insight, like poetry

### 1.3 Target Users
- Comedy writers seeking ideation support
- Students learning humor theory
- Content creators needing on-brand humor
- Anyone curious about the mechanics of funny

---

## 2. Data Models

### 2.1 Core Entities

```typescript
// The fundamental unit of meaning-assignment
interface Binding {
  id: string;
  carrier: string;           // The sign/word/action
  defaultMeaning: string;    // High-probability interpretation
  confidence: number;        // 0-1, how automatic this binding is
  alternativeMeanings: string[]; // Other possible interpretations
  category: BindingCategory; // lexical | intentional | causal | normative | role
}

type BindingCategory = 
  | 'lexical'      // word sense
  | 'intentional'  // speech act, motive
  | 'causal'       // why/how something happens
  | 'normative'    // social expectation
  | 'role'         // who does what to whom
  | 'temporal'     // when, sequence
  | 'epistemic';   // who knows what

// The interpretive frame established by setup
interface DefaultModel {
  id: string;
  script: string;            // Active frame (medical, romantic, professional...)
  bindings: Binding[];
  roles: Role[];
  causalStory: string;
  normStance: string;        // serious | playful | formal | casual
  overallStrength: number;   // Aggregate binding strength
}

interface Role {
  label: string;             // "doctor", "patient", "lover"
  agent: string;             // Who fills this role
  goals: string[];
  knowledge: string[];       // What they know/don't know
}

// A specific detachment move
interface DetachmentOperation {
  type: OperationType;
  targetBinding: Binding;
  mechanism: string;         // How the detachment works
  resultingMeaning: string;  // New interpretation after detachment
  bridgeCue: string;         // What helps audience find the alternative
}

type OperationType =
  | 'emptying'
  | 'loading'
  | 'exposure'
  | 'reflection'
  | 'reversal'
  | 'overliteralization'
  | 'categoryCrossing'
  | 'compression';

// What kind of expectation is violated
type ViolationType =
  | 'semantic'
  | 'pragmatic'
  | 'causal'
  | 'epistemic'
  | 'normative'
  | 'narrative';

// How the violation is made safe
interface BenignessStrategy {
  type: BenignessType;
  strength: number;          // How effectively it softens
  description: string;
}

type BenignessType =
  | 'fictional_distance'
  | 'archetypal_target'
  | 'self_inclusion'
  | 'affectionate_framing'
  | 'absurdity_escape'
  | 'consent_reclamation'
  | 'temporal_distance'
  | 'status_leveling';

// Complete joke candidate with metadata
interface JokeCandidate {
  id: string;
  text: string;
  format: JokeFormat;
  
  // Mechanism analysis
  setup: string;
  twist: string;
  twistWord: string;
  defaultModel: DefaultModel;
  alternativeModel: string;
  operations: DetachmentOperation[];
  violationTypes: ViolationType[];
  benignessStrategies: BenignessStrategy[];
  repairPath: string;        // How audience gets to alternative
  
  // Scores
  scores: JokeScores;
  
  // Metadata
  voice: ComedyVoice;
  topic: string;
  generationParams: GenerationParams;
  created: Date;
  
  // For learning
  failureAnalysis?: FailureAnalysis;
}

type JokeFormat =
  | 'one_liner'
  | 'two_liner'
  | 'qa_riddle'
  | 'dialogue'
  | 'observational'
  | 'story'
  | 'callback';

interface JokeScores {
  bindingStrength: number;   // How strong was the default? (0-1)
  violationMagnitude: number;// How far is M1 from M0? (0-1)
  repairability: number;     // How easily found is alternative? (0-1)
  benignness: number;        // How safe for target audience? (0-1)
  economy: number;           // Payoff per word (0-1)
  originality: number;       // Distance from known jokes (0-1)
  overall: number;           // Composite score
}

interface FailureAnalysis {
  failureMode: FailureMode;
  diagnosis: string;
  suggestions: string[];
}

type FailureMode =
  | 'confusion'      // Repair too hard
  | 'flatness'       // Violation too weak
  | 'offense'        // Benignness insufficient
  | 'weak_snap'      // Default too weak
  | 'telegraphed'    // Twist too obvious
  | 'overexplained'; // Too much setup
```

### 2.2 User & Session Models

```typescript
interface AudienceProfile {
  id: string;
  name: string;
  
  // Content boundaries
  maturityLevel: 'family' | 'teen' | 'adult' | 'edgy';
  tabooTolerance: number;    // 0-1
  
  // Targeting rules
  punchingDirection: 'up_only' | 'lateral' | 'any';
  protectedCategories: string[];
  
  // Cultural context
  culturalContext: string;   // US, UK, global, specific community
  inGroupIdentities: string[];// What the audience identifies as
  
  // Preferences
  preferredVoices: ComedyVoice[];
  avoidedTopics: string[];
}

type ComedyVoice =
  | 'deadpan'
  | 'absurdist'
  | 'observational'
  | 'self_deprecating'
  | 'dark'
  | 'surreal'
  | 'sardonic'
  | 'whimsical'
  | 'dry_wit'
  | 'physical'
  | 'wordplay';

interface GenerationParams {
  topic: string;
  voice: ComedyVoice;
  format: JokeFormat;
  audience: AudienceProfile;
  
  // Fine-tuning sliders (all 0-1)
  violationIntensity: number;
  abstractionLevel: number;  // concrete ↔ abstract
  verbosity: number;         // terse ↔ elaborate
  selfReferentiality: number;// straight ↔ meta
  darkness: number;          // light ↔ dark
  wordplayEmphasis: number;  // situational ↔ linguistic
  
  // Operation preferences (weights)
  operationWeights: Record<OperationType, number>;
  
  // Constraints
  maxWords?: number;
  requiredElements?: string[];
  avoidedElements?: string[];
}

interface GenerationSession {
  id: string;
  userId: string;
  created: Date;
  
  params: GenerationParams;
  
  // Mining results
  extractedBindings: Binding[];
  userSelectedBindings: Binding[];
  
  // Generation results
  candidates: JokeCandidate[];
  userFavorites: string[];   // candidate IDs
  userRejected: string[];
  
  // Learning data
  userFeedback: UserFeedback[];
}

interface UserFeedback {
  candidateId: string;
  rating: number;            // 1-5
  whatWorked?: string;
  whatDidnt?: string;
  editedVersion?: string;
}
```

### 2.3 Comedy Memory (for callbacks/sets)

```typescript
interface ComedyMemory {
  sessionId: string;
  
  // Established bindings that can be re-exploited
  establishedBindings: EstablishedBinding[];
  
  // Patterns that worked
  successfulPatterns: SuccessfulPattern[];
  
  // Running themes
  activeThemes: string[];
}

interface EstablishedBinding {
  binding: Binding;
  establishedAt: number;     // Position in sequence
  timesReferenced: number;
  lastReferenced: number;
}

interface SuccessfulPattern {
  operations: OperationType[];
  violationType: ViolationType;
  structure: string;         // Abstract pattern
  instances: string[];       // Joke IDs that used it
}
```

---

## 3. System Architecture

### 3.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Topic     │  │   Voice     │  │  Audience   │  │   Sliders   │ │
│  │   Input     │  │  Selector   │  │   Profile   │  │  & Toggles  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATION LAYER                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Generation Pipeline                        │   │
│  │                                                               │   │
│  │  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │   │
│  │  │ Extract │ → │ Disrupt │ → │ Realize │ → │ Critique│      │   │
│  │  │Bindings │   │& Bridge │   │ as Text │   │& Filter │      │   │
│  │  └─────────┘   └─────────┘   └─────────┘   └─────────┘      │   │
│  │       │             │             │             │             │   │
│  │       ▼             ▼             ▼             ▼             │   │
│  │  [User can     [User can     [User can     [User sees        │   │
│  │   select]      choose ops]    edit]        analysis]         │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Iteration Loop                             │   │
│  │  Mutate → Re-score → Compare → Keep best → Repeat            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         TOOL LAYER                                   │
│                                                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │
│  │    LLM    │ │ Phonetics │ │ WordNet/  │ │  Embed    │           │
│  │  (Claude) │ │ (CMUdict) │ │ FrameNet  │ │  Search   │           │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │
│                                                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                         │
│  │ConceptNet │ │  Binding  │ │   Joke    │                         │
│  │           │ │  Library  │ │  Corpus   │                         │
│  └───────────┘ └───────────┘ └───────────┘                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Pipeline Stages Detail

#### Stage 1: Expectation Mining

**Purpose**: Extract the default model for a topic/scenario.

**Input**: Topic string + audience profile + voice

**Process**:
1. LLM generates structured binding extraction
2. Optional: augment with FrameNet roles, ConceptNet relations
3. Rank bindings by strength (LLM confidence + corpus frequency)
4. Present top bindings to user for selection/editing

**Output**: `DefaultModel` with ranked `Binding[]`

**User Participation**: 
- See extracted bindings
- Add custom bindings
- Adjust strength ratings
- Select which to target

#### Stage 2: Disruption Proposal

**Purpose**: Generate detachment operations for selected bindings.

**Input**: Selected bindings + operation weights + voice + audience

**Process**:
1. For each binding, propose disruptions by operation type
2. Generate the repair path (how audience finds alternative)
3. Assess violation magnitude
4. Filter by audience constraints
5. Present options to user

**Output**: `DetachmentOperation[]` with repair paths

**User Participation**:
- See proposed operations
- Adjust operation type preferences via sliders
- Select promising directions
- Suggest custom twists

#### Stage 3: Realization

**Purpose**: Convert mechanism into actual joke text.

**Input**: Binding + operation + repair path + format + voice

**Process**:
1. Generate setup that establishes default binding
2. Generate twist that executes detachment
3. Optimize punchline placement (twist word final where possible)
4. Apply format template (one-liner, Q&A, dialogue, etc.)
5. Trim for economy

**Output**: Multiple `JokeCandidate` variants

**User Participation**:
- See multiple phrasings
- Edit text directly
- Request variations
- Adjust format

#### Stage 4: Critique & Scoring

**Purpose**: Evaluate candidates on all dimensions.

**Input**: `JokeCandidate[]`

**Process**: Multi-pass evaluation

**Pass 1: Structural Validity**
```typescript
interface StructuralCheck {
  hasCleanSetup: boolean;
  hasIdentifiableBinding: boolean;
  hasCleanTwist: boolean;
  twistPosition: 'final' | 'penultimate' | 'early' | 'buried';
  issues: string[];
}
```

**Pass 2: Repairability**
```typescript
interface RepairabilityCheck {
  alternativeReachable: boolean;
  bridgeCuePresent: boolean;
  bridgeCueStrength: number;
  estimatedRepairTime: 'instant' | 'quick' | 'slow' | 'too_slow';
  confusionRisk: number;
}
```

**Pass 3: Benignness**
```typescript
interface BenignessCheck {
  strategiesUsed: BenignessType[];
  effectivenessForAudience: number;
  riskFlags: RiskFlag[];
  offenseRisk: number;
}

interface RiskFlag {
  type: 'targeting' | 'taboo' | 'stereotype' | 'cruelty' | 'political';
  severity: 'low' | 'medium' | 'high';
  description: string;
}
```

**Pass 4: Originality**
```typescript
interface OriginalityCheck {
  nearestKnownJoke?: string;
  similarityScore: number;   // 0 = novel, 1 = duplicate
  structureNovelty: number;  // Is the pattern fresh?
  contentNovelty: number;    // Is the specific content fresh?
}
```

**Pass 5: Economy**
```typescript
interface EconomyCheck {
  wordCount: number;
  payloadWords: number;      // Words essential to mechanism
  fluffWords: number;        // Words that could be cut
  payoffPerWord: number;
  suggestedCuts: string[];
}
```

**Output**: Scored candidates with detailed analysis

**User Sees**:
- Scores with explanations
- Failure diagnosis if applicable
- Improvement suggestions
- Comparison view

#### Stage 5: Iteration

**Purpose**: Improve candidates through mutation.

**Mutations**:
- Sharpen twist word
- Increase misdirection in setup
- Trim setup
- Swap operation type
- Adjust violation intensity
- Try different format

**Process**:
1. Take top N candidates
2. Generate M mutations each
3. Re-score all
4. Present improved versions

**User Participation**:
- Guide mutation direction
- Lock elements they like
- Request specific changes

---

## 4. Prompt Templates

### 4.1 Binding Extraction Prompt

```markdown
You are analyzing a topic to extract the default expectations people have about it.

**Topic**: {{topic}}
**Context**: Generating {{voice}} humor for {{audience_description}}

Extract the key BINDINGS—automatic meaning-assignments people make:

For each binding, identify:
1. **Carrier**: The word, phrase, action, or element
2. **Default meaning**: What people automatically assume it means/implies
3. **Confidence**: How automatic is this assumption? (0.0-1.0)
4. **Category**: lexical | intentional | causal | normative | role | epistemic
5. **Alternatives**: Other possible interpretations (these become twist fodder)

Also extract:
- **Active scripts**: What frames/scenarios does this topic invoke?
- **Typical roles**: Who are the expected participants?
- **Norm expectations**: What's "supposed to" happen?
- **Common intentions**: Why do people engage with this?

Format as JSON:
```json
{
  "topic": "...",
  "scripts": ["...", "..."],
  "bindings": [
    {
      "carrier": "...",
      "defaultMeaning": "...",
      "confidence": 0.X,
      "category": "...",
      "alternatives": ["...", "..."]
    }
  ],
  "roles": [...],
  "norms": [...],
  "typicalIntentions": [...]
}
```

Focus on bindings that are:
- Strong (highly automatic)
- Detachable (have viable alternatives)
- Relevant to {{voice}} comedy
```

### 4.2 Disruption Proposal Prompt

```markdown
You are generating humor by disrupting default expectations.

**Binding to disrupt**:
- Carrier: {{carrier}}
- Default meaning: {{default_meaning}}
- Alternatives: {{alternatives}}

**Operation type**: {{operation_type}}
**Voice**: {{voice}}
**Audience**: {{audience_description}}

Generate a DETACHMENT that:
1. Breaks the default binding in a way consistent with {{operation_type}}
2. Creates a clear alternative interpretation
3. Provides a bridge cue so audiences can repair quickly
4. Stays benign for {{audience_description}}

Explain:
- **Mechanism**: How does the detachment work?
- **Alternative meaning**: What does the audience realize instead?
- **Bridge cue**: What in the text helps them find the alternative?
- **Repair path**: The cognitive steps from confusion to "aha"
- **Violation type**: semantic | pragmatic | causal | epistemic | normative | narrative
- **Benignness strategy**: How is this kept safe?

Format as JSON:
```json
{
  "operation": "...",
  "mechanism": "...",
  "alternativeMeaning": "...",
  "bridgeCue": "...",
  "repairPath": "...",
  "violationType": "...",
  "benignessStrategy": "...",
  "setupDirection": "...",
  "twistDirection": "..."
}
```
```

### 4.3 Realization Prompt

```markdown
You are writing a joke based on a specific mechanism.

**Mechanism**:
- Default binding: {{carrier}} → {{default_meaning}}
- Operation: {{operation}}
- Alternative: {{alternative_meaning}}
- Bridge cue: {{bridge_cue}}

**Format**: {{format}}
**Voice**: {{voice}}
**Max words**: {{max_words}}

Write the joke so that:
1. The SETUP establishes the default binding strongly
2. The TWIST executes the detachment
3. The TWIST WORD is positioned for maximum impact (ideally final)
4. The {{bridge_cue}} is present but not heavy-handed
5. The tone matches {{voice}}
6. Every word earns its place

Provide 3 variations with different phrasing.

For each, note:
- The exact twist word
- Word count
- What could be cut
```

### 4.4 Structural Critique Prompt

```markdown
Analyze this joke candidate for structural validity:

**Joke**: {{joke_text}}
**Intended mechanism**:
- Default: {{default_binding}}
- Operation: {{operation}}
- Alternative: {{alternative}}

Evaluate:

1. **Setup clarity** (1-5): Does the setup clearly establish the default binding?
   - What binding does a naive reader form?
   - Is it the intended one?

2. **Twist identification** (1-5): Is there a clear moment of detachment?
   - Where exactly does the twist occur?
   - Is it clean or muddled?

3. **Twist position**: Where is the twist word?
   - final | penultimate | middle | early | buried
   - Could repositioning improve it?

4. **Bridge cue presence**: Can a reader find the alternative interpretation?
   - What cue points to it?
   - Is it too subtle or too obvious?

5. **Economy**: Word-by-word assessment
   - Essential words: [list]
   - Cuttable words: [list]
   - Suggested tighter version: "..."

Output JSON with scores and specific feedback.
```

### 4.5 Repairability Critique Prompt

```markdown
Evaluate whether a typical audience member can "get" this joke:

**Joke**: {{joke_text}}
**Intended alternative interpretation**: {{alternative}}
**Target audience**: {{audience_description}}

Assess:

1. **Alternative reachability**: Is the intended interpretation actually accessible?
   - What knowledge does it require?
   - Is that knowledge common for {{audience_description}}?

2. **Bridge strength**: How clearly does the text point to the alternative?
   - Too subtle → confusion
   - Too obvious → telegraphed
   - Just right → satisfying snap

3. **Repair speed estimate**:
   - instant: <0.5 seconds
   - quick: 0.5-2 seconds (ideal)
   - slow: 2-5 seconds
   - too_slow: >5 seconds (joke dies)

4. **Confusion risk**: What might go wrong?
   - Alternative interpretations that aren't the intended one?
   - Missing knowledge that blocks repair?
   - Ambiguity that diffuses the snap?

5. **Improvement suggestions**: How to increase repairability without killing the snap?

Output JSON with assessment and specific recommendations.
```

### 4.6 Benignness Critique Prompt

```markdown
Evaluate this joke's safety for the target audience:

**Joke**: {{joke_text}}
**Audience**: {{audience_description}}
- Maturity level: {{maturity}}
- Taboo tolerance: {{taboo_tolerance}}
- Punching direction: {{punching_direction}}
- Protected categories: {{protected_categories}}

Assess:

1. **Benignness strategies used**: Which apply?
   - fictional_distance
   - archetypal_target
   - self_inclusion
   - affectionate_framing
   - absurdity_escape
   - consent_reclamation
   - temporal_distance
   - status_leveling

2. **Strategy effectiveness**: For THIS audience, how well do they work?

3. **Risk flags**: Identify any concerns
   - targeting: Does it single out individuals or vulnerable groups?
   - taboo: Does it cross lines for this audience?
   - stereotype: Does it reinforce harmful stereotypes?
   - cruelty: Is there meanness without redemption?
   - political: Is it taking sides inappropriately?

4. **Punching direction**: Up, lateral, down, or self?

5. **Overall safety score** (0-1) for {{audience_description}}

6. **Modifications**: If risky, how could it be made safer without killing the joke?

Output JSON with detailed assessment.
```

### 4.7 Failure Analysis Prompt

```markdown
This joke attempt didn't work. Diagnose why and suggest fixes.

**Joke**: {{joke_text}}
**Intended mechanism**:
- Default: {{default_binding}}
- Operation: {{operation}}
- Alternative: {{alternative}}

**Scores**:
- Binding strength: {{binding_strength}}
- Violation magnitude: {{violation}}
- Repairability: {{repairability}}
- Benignness: {{benignness}}
- Economy: {{economy}}

Diagnose the PRIMARY failure mode:
- confusion: Alternative too hard to find
- flatness: Violation too weak, no real snap
- offense: Benignness insufficient for audience
- weak_snap: Default wasn't strong enough
- telegraphed: Twist too obvious, no surprise
- overexplained: Setup too long, killed momentum

For the identified failure mode:
1. **Why it failed**: Specific diagnosis
2. **What would fix it**: Concrete suggestions
3. **Rewrite attempt**: A version that addresses the issue
4. **Learning point**: What general principle does this illustrate?

This analysis is for the user's learning, so be educational and specific.
```

---

## 5. Evaluation Framework

### 5.1 Evaluation Philosophy

Humor resists single-metric evaluation. Our approach:

1. **Structural metrics** (automated): Is the mechanism sound?
2. **Human judgment** (gold standard): Is it actually funny?
3. **Comparative ranking**: Which version is better? (easier than absolute rating)
4. **Failure diagnosis**: Why didn't it work? (most valuable for learning)

### 5.2 Automated Metrics

```typescript
interface AutomatedMetrics {
  // Structural
  setupTwistSeparation: boolean;   // Can we identify both?
  twistWordPosition: number;        // 0 = first word, 1 = last word
  bindingIdentifiable: boolean;     // Is the mechanism clear?
  
  // Economy
  wordCount: number;
  compressionRatio: number;         // Information per word
  redundancyScore: number;          // Repeated/unnecessary content
  
  // Originality
  nearestNeighborDistance: number;  // Embedding distance to known jokes
  templateNovelty: number;          // How fresh is the structure?
  
  // Repairability proxy
  bridgeCueExplicitness: number;    // How obvious is the path?
  inferenceSteps: number;           // Estimated steps to alternative
  
  // Benignness proxy
  toxicityScore: number;            // Standard toxicity classifier
  targetingScore: number;           // Is someone singled out?
}
```

### 5.3 Human Evaluation Protocol

**Quick rating** (per joke):
- Funniness: 1-5 stars
- "I'd share this": yes/maybe/no

**Comparative** (more reliable):
- Show pairs, ask "which is funnier?"
- Use Elo or Bradley-Terry for ranking

**Diagnostic** (for learning):
- Did you get it? yes/eventually/no
- What made it work/not work? (free text)
- What would improve it? (free text)

### 5.4 LLM-as-Judge (Calibrated)

Use LLM evaluation with specific rubrics, not "is this funny?"

```markdown
You are evaluating joke quality on specific dimensions. 
DO NOT rate "funniness" directly—that's subjective.
Instead, rate structural/mechanical qualities:

1. **Setup-twist clarity** (1-5): How cleanly separated are setup and twist?
2. **Snap sharpness** (1-5): How sudden is the reinterpretation?
3. **Economy** (1-5): How efficient is the language?
4. **Originality** (1-5): How fresh vs. formulaic?
5. **Internal logic** (1-5): Does the alternative interpretation cohere?

Provide scores and brief justification for each.
```

### 5.5 Diversity Metrics

To prevent convergence on narrow style:

```typescript
interface DiversityMetrics {
  operationDistribution: Record<OperationType, number>;  // Are we using varied operations?
  violationTypeDistribution: Record<ViolationType, number>;
  formatDistribution: Record<JokeFormat, number>;
  
  lexicalDiversity: number;         // TTR or similar
  structuralVariety: number;        // How different are the patterns?
  topicCoverage: number;            // Breadth within topic
}
```

**Diversity enforcement**:
- Track what's been generated
- Penalize repetition of operations/structures
- Actively prompt for underrepresented types
- User toggle: "surprise me" vs "more like this"

---

## 6. User Interface Design

### 6.1 Design Principles

1. **Transparency over magic**: Show the mechanism, not just results
2. **Progressive disclosure**: Simple by default, depth available
3. **Collaborative feel**: User steers, system amplifies
4. **Learning-oriented**: Failures teach as much as successes
5. **Poetic sensibility**: Treat humor as craft, not factory output

### 6.2 Main Interface Zones

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Topic Input + Quick Settings                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                         │  │                                 │  │
│  │    CONTROL PANEL        │  │       GENERATION VIEW           │  │
│  │                         │  │                                 │  │
│  │  • Voice selector       │  │   Current candidates with       │  │
│  │  • Audience profile     │  │   mechanism annotations         │  │
│  │  • Operation sliders    │  │                                 │  │
│  │  • Style dials          │  │   [Expanded analysis on hover]  │  │
│  │  • Format picker        │  │                                 │  │
│  │                         │  │                                 │  │
│  └─────────────────────────┘  └─────────────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  MECHANISM VIEW: Binding explorer + operation visualizer            │
├─────────────────────────────────────────────────────────────────────┤
│  LEARNING PANEL: Failure analysis + suggestions + theory links      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Control Panel Details

**Voice Selector** (radio/cards):
- Visual cards with voice descriptions
- Example joke for each voice
- Affects operation weights automatically

**Audience Profile** (expandable):
- Quick presets: Family / General / Adult / Edgy
- Expandable for fine-tuning:
  - Taboo tolerance slider
  - Protected categories multi-select
  - Cultural context dropdown

**Operation Sliders** (the "equalizer"):
```
Emptying       ████████░░░░  60%
Loading        ██████░░░░░░  50%
Exposure       ████░░░░░░░░  30%
Reflection     ██░░░░░░░░░░  15%
Reversal       ██████████░░  80%
Overliteral    ████░░░░░░░░  30%
Category X     ██████░░░░░░  50%
Compression    ████████░░░░  65%
```
- Affects which operations are tried
- "Randomize" button for exploration
- "Voice default" resets to voice-appropriate weights

**Style Dials** (continuous sliders):
```
Violation:      Low ──────●────── High
Abstraction:    Concrete ────●──── Abstract
Verbosity:      Terse ──●──────── Elaborate
Meta-level:     Straight ──────●── Self-aware
Darkness:       Light ────●────── Dark
Wordplay:       Situational ●───── Linguistic
```

**Format Picker** (toggles):
- One-liner ✓
- Two-liner ✓
- Q&A riddle
- Dialogue
- Observational ✓
- Story

### 6.4 Generation View

**Candidate Card**:
```
┌─────────────────────────────────────────────────────────────────┐
│  "I finally figured out what I want to be when I grow up:      │
│   younger."                                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▸ Mechanism (click to expand)                            │   │
│  │   Default: career aspiration                             │   │
│  │   Operation: exposure + reversal                         │   │
│  │   Twist word: "younger"                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Scores: ████░ Snap  ███░░ Original  █████ Economy             │
│                                                                 │
│  [♥ Save] [✏️ Edit] [🔄 Variations] [📊 Analyze]              │
└─────────────────────────────────────────────────────────────────┘
```

**Expanded Analysis** (on click):
```
┌─────────────────────────────────────────────────────────────────┐
│  MECHANISM BREAKDOWN                                            │
│                                                                 │
│  Setup binding:                                                 │
│    "want to be when I grow up" → career/identity aspiration    │
│    Strength: 0.9 (very automatic)                              │
│                                                                 │
│  Detachment:                                                    │
│    Operation: EXPOSURE + REVERSAL                              │
│    The question was secretly about age, not career             │
│    "grow up" becomes ironic (you want to un-grow)              │
│                                                                 │
│  Repair path:                                                   │
│    1. "younger" doesn't fit career frame                       │
│    2. Re-parse "grow up" as age reference                      │
│    3. Realize the inversion: wanting past, not future          │
│                                                                 │
│  Why it works:                                                  │
│    • Strong default (everyone knows this phrase)               │
│    • Clean snap (single word triggers reparse)                 │
│    • Universal recognition (aging anxiety)                     │
│    • Perfect economy (8 words, all essential)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Mechanism View (Binding Explorer)

Visual representation of extracted bindings:

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPIC: "gym"                                                   │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ "going to   │     │ "personal   │     │ "gym        │       │
│  │  the gym"   │     │  trainer"   │     │  selfie"    │       │
│  │             │     │             │     │             │       │
│  │ → fitness   │     │ → expert    │     │ → showing   │       │
│  │   ████████  │     │   ██████    │     │   progress  │       │
│  │             │     │             │     │   ████      │       │
│  │ Alts:       │     │ Alts:       │     │             │       │
│  │ • guilt     │     │ • paid      │     │ Alts:       │       │
│  │   ritual    │     │   friend    │     │ • vanity    │       │
│  │ • social    │     │ • therapist │     │ • proof of  │       │
│  │   display   │     │   w/ abs    │     │   being     │       │
│  │ [Target ✓]  │     │ [Target]    │     │   there     │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                 │
│  [+ Add custom binding]                                         │
└─────────────────────────────────────────────────────────────────┘
```

User can:
- Click bindings to target them
- Add custom bindings
- Adjust strength ratings
- See which operations apply to each

### 6.6 Learning Panel

**When a joke fails or is weak**:

```
┌─────────────────────────────────────────────────────────────────┐
│  💡 LEARNING MOMENT                                             │
│                                                                 │
│  This joke scored low on REPAIRABILITY                         │
│                                                                 │
│  Diagnosis: CONFUSION                                           │
│  The alternative interpretation requires knowing that           │
│  "gymnasium" originally meant "place to exercise naked"         │
│  in ancient Greek—most audiences won't have this.              │
│                                                                 │
│  Principle: The bridge must use COMMON knowledge                │
│                                                                 │
│  Suggestions:                                                   │
│  • Use a more accessible alternative meaning                    │
│  • Add a subtle cue that hints at the needed knowledge          │
│  • Try a different binding from this topic                      │
│                                                                 │
│  [Try suggested fix] [See theory: Repairability] [Dismiss]      │
└─────────────────────────────────────────────────────────────────┘
```

**Theory links**: Expandable sections connecting to the theory document
**Pattern library**: "This operation often works with these binding types"

---

## 7. Non-LLM Components

### 7.1 Phonetics Module (for puns)

**Tool**: CMUdict + custom homophone detection

**Functions**:
```typescript
interface PhoneticsModule {
  // Find words that sound like the input
  getHomophones(word: string): string[];
  getNearHomophones(word: string, tolerance: number): string[];
  
  // Check if two phrases sound similar
  phraseSimilarity(a: string, b: string): number;
  
  // Find pun candidates for a word
  getPunCandidates(word: string): PunCandidate[];
}

interface PunCandidate {
  original: string;
  replacement: string;
  phoneticDistance: number;
  replacementSenses: string[];  // From WordNet
}
```

### 7.2 Semantic Resources

**WordNet integration**:
```typescript
interface SemanticModule {
  // Get all senses of a word
  getSenses(word: string): WordSense[];
  
  // Check if word has relevant polysemy
  isPolysemous(word: string): boolean;
  
  // Get semantic distance between senses
  senseDistance(a: WordSense, b: WordSense): number;
}
```

**FrameNet integration**:
```typescript
interface FrameModule {
  // Get frames a word/phrase evokes
  getFrames(text: string): Frame[];
  
  // Get typical roles in a frame
  getRoles(frame: Frame): Role[];
  
  // Find frame conflicts (for script opposition)
  findConflicts(frameA: Frame, frameB: Frame): Conflict[];
}
```

### 7.3 Commonsense Relations (ConceptNet)

```typescript
interface CommonsenseModule {
  // Get typical relations
  getRelations(concept: string): Relation[];
  
  // "X is used for Y", "X is a type of Y", etc.
  getRelation(concept: string, relationType: string): string[];
  
  // Find unexpected but valid relations
  getSurprisingRelations(concept: string): Relation[];
}
```

### 7.4 Originality Checker

```typescript
interface OriginalityModule {
  // Check against joke corpus
  findSimilarJokes(candidate: string): SimilarJoke[];
  
  // Embedding-based novelty
  getNoveltyScore(candidate: string): number;
  
  // Structure matching (is this a known template?)
  matchTemplate(candidate: string): Template | null;
}
```

### 7.5 Binding Library (grows over time)

```typescript
interface BindingLibrary {
  // Store successful binding-operation pairs
  store(binding: Binding, operation: OperationType, success: boolean): void;
  
  // Retrieve high-success bindings for a topic
  getSuccessfulBindings(topic: string): BindingRecord[];
  
  // Get operations that work well with a binding type
  getEffectiveOperations(bindingCategory: BindingCategory): OperationType[];
}
```

---

## 8. MVP Scope

### 8.1 MVP Feature Set

**In scope for v1**:
- Single topic → multiple one-liners
- 3 voices: Observational, Deadpan, Self-deprecating
- 3 audience presets: Family, General, Adult
- Core operation sliders (all 8 types)
- 3 style dials: Violation, Verbosity, Darkness
- Binding extraction with user selection
- Mechanism display for each joke
- Basic failure analysis
- Human rating (thumbs up/down + optional text)

**Out of scope for v1**:
- Dialogue/story formats
- Callback/set generation
- Phonetics module (puns)
- Full originality checking
- Advanced audience profiling
- Comedy memory across sessions

### 8.2 MVP User Flow

```
1. USER enters topic ("first dates")
   
2. SYSTEM extracts bindings, shows top 6
   USER can: select which to target, add custom, adjust strength
   
3. USER adjusts sliders (or uses defaults)
   - Voice: Observational
   - Audience: General
   - Operation weights: [defaults for voice]
   - Style: [middle positions]
   
4. SYSTEM generates 8-12 candidates
   Shows: joke text, operation used, scores
   
5. USER interacts:
   - Expand to see mechanism
   - Rate (👍/👎)
   - Request variations
   - Edit directly
   
6. For low-scoring or 👎 jokes:
   SYSTEM shows failure analysis + suggestions
   
7. USER can iterate:
   - Adjust sliders → regenerate
   - Target different bindings
   - Request "more like this one"
```

### 8.3 Success Metrics for MVP

**Engagement**:
- Time spent per session
- Jokes saved/exported
- Return usage

**Quality proxies**:
- 👍 rate
- "I'd share this" rate
- Mechanism clarity ratings ("did you understand why it's funny?")

**Learning value**:
- Do users read failure analyses?
- Do they adjust based on suggestions?
- Self-reported learning

---

## 9. Future Directions

### 9.1 v2 Candidates

- **Pun generation**: Add phonetics module, pun-specific templates
- **Dialogue scenes**: Multi-turn humor with timing
- **Callbacks & sets**: Comedy memory, routine building
- **Topicality**: News integration for current-events humor
- **Personalization**: Learn user preferences over time
- **Collaboration**: Share/remix jokes with attribution

### 9.2 Research Questions

- Can structural metrics predict human funniness ratings?
- Which operations are most learnable?
- Does explicit mechanism exposure improve user generation?
- What's the ceiling for LLM-generated humor?

### 9.3 Ethical Considerations

- **Harm prevention**: Robust benignness checking, no punching down
- **Attribution**: When does generated humor become plagiarism?
- **Manipulation**: Comedy is persuasive—what are the limits?
- **Homogenization**: Preventing convergence to "AI comedy style"

---

## Appendix A: Example Generation Trace

**Input**:
```json
{
  "topic": "video calls",
  "voice": "observational",
  "audience": "general",
  "format": "one_liner"
}
```

**Step 1: Binding Extraction**
```json
{
  "bindings": [
    {
      "carrier": "you're on mute",
      "defaultMeaning": "helpful technical notification",
      "confidence": 0.95,
      "alternatives": ["public humiliation", "existential void"]
    },
    {
      "carrier": "professional background",
      "defaultMeaning": "curated workspace image",
      "confidence": 0.85,
      "alternatives": ["lies about your life", "witness protection"]
    }
  ]
}
```

**Step 2: User Selects** binding #1 ("you're on mute")

**Step 3: Disruption Proposals**
```json
[
  {
    "operation": "loading",
    "mechanism": "Load 'you're on mute' with existential meaning",
    "alternative": "No one can hear you in life, not just on the call",
    "repair": "Recognize 'on mute' as metaphor for being ignored"
  },
  {
    "operation": "exposure",
    "mechanism": "Expose the social horror beneath helpful notification",
    "alternative": "The phrase marks public failure moment",
    "repair": "Recognize the cringe factor we all suppress"
  }
]
```

**Step 4: Realization (exposure chosen)**
```
Candidate A: "You're on mute" is the video call equivalent of 
             having spinach in your teeth, except everyone watched 
             you eat the entire salad.

Candidate B: "You're on mute" is just a polite way of saying 
             "we've all been staring at you failing for 30 seconds."

Candidate C: The worst part of "you're on mute" isn't the technical 
             failure—it's realizing you've been performing to silence.
```

**Step 5: Scoring**
```
Candidate B scores highest:
- Binding strength: 0.95 (universal experience)
- Violation: 0.7 (reframes helpful as humiliating)
- Repairability: 0.9 (obvious once stated)
- Economy: 0.85 (tight phrasing)
- Benignness: 0.95 (self-inclusion, universal target)
```

**Step 6: Output with Analysis**
```
"'You're on mute' is just a polite way of saying 
'we've all been staring at you failing for 30 seconds.'"

Mechanism:
- Default: Technical help notification
- Operation: Exposure (reveals hidden social meaning)
- Alternative: Public failure announcement
- Twist phrase: "staring at you failing"

Why it works:
- Universal recognition
- Exposes what we all know but don't say
- Benign (happens to everyone)
- Tight economy
```

---

*End of Specification*
