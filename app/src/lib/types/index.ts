/**
 * HUMOR LAB Type Definitions
 * Based on PROJECT.md data models
 */

// ═══════════════════════════════════════════════════════════════
// CORE ENTITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Categories of meaning-bindings in language/action
 */
export type BindingCategory =
  | 'lexical'      // word sense
  | 'intentional'  // speech act, motive
  | 'causal'       // why/how something happens
  | 'normative'    // social expectation
  | 'role'         // who does what to whom
  | 'temporal'     // when, sequence
  | 'epistemic';   // who knows what

/**
 * The fundamental unit of meaning-assignment
 * A binding connects a carrier (sign/word/action) to its interpretation
 */
export interface Binding {
  id: string;
  carrier: string;           // The sign/word/action
  defaultMeaning: string;    // High-probability interpretation
  confidence: number;        // 0-1, how automatic this binding is
  alternativeMeanings: string[]; // Other possible interpretations
  category: BindingCategory;
}

/**
 * Role within a script/frame
 */
export interface Role {
  label: string;             // "doctor", "patient", "lover"
  agent: string;             // Who fills this role
  goals: string[];
  knowledge: string[];       // What they know/don't know
}

/**
 * The interpretive frame established by setup
 * Represents the "default model" (M₀) the audience builds
 */
export interface DefaultModel {
  id: string;
  script: string;            // Active frame (medical, romantic, professional...)
  bindings: Binding[];
  roles: Role[];
  causalStory: string;
  normStance: string;        // serious | playful | formal | casual
  overallStrength: number;   // Aggregate binding strength
}

// ═══════════════════════════════════════════════════════════════
// DETACHMENT OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Types of detachment operations (the "engine" of humor)
 */
export type OperationType =
  | 'emptying'           // Remove expected meaning/motive
  | 'loading'            // Attach unexpected meaning
  | 'exposure'           // Make binding process visible
  | 'reflection'         // Self-reference, meta
  | 'reversal'           // Flip roles, status, valence
  | 'overliteralization' // Treat figurative as literal
  | 'categoryCrossing'   // Violate ontological boundaries
  | 'compression';       // Collapse complex chain into compact line

/**
 * A specific detachment move
 */
export interface DetachmentOperation {
  type: OperationType;
  targetBinding: Binding;
  mechanism: string;         // How the detachment works
  resultingMeaning: string;  // New interpretation after detachment
  bridgeCue: string;         // What helps audience find the alternative
}

// ═══════════════════════════════════════════════════════════════
// VIOLATION & BENIGNNESS
// ═══════════════════════════════════════════════════════════════

/**
 * What kind of expectation is violated
 */
export type ViolationType =
  | 'semantic'    // Word sense, category membership
  | 'pragmatic'   // Speech act, implicature, politeness
  | 'causal'      // Wrong cause, reversed logic
  | 'epistemic'   // Who knows what, confident ignorance
  | 'normative'   // Etiquette, taboo, moral expectation
  | 'narrative';  // Genre rules, perspective, pacing

/**
 * Strategies that make violations "safe enough to enjoy"
 */
export type BenignessType =
  | 'fictional_distance'    // "A man walks into a bar..."
  | 'archetypal_target'     // Roles, not individuals
  | 'self_inclusion'        // "We all do this..."
  | 'affectionate_framing'  // "I love him, but..."
  | 'absurdity_escape'      // Too implausible to be threatening
  | 'consent_reclamation'   // In-group playing with stereotypes
  | 'temporal_distance'     // "Looking back, it's funny..."
  | 'status_leveling';      // Punching up at power

/**
 * How the violation is made safe
 */
export interface BenignessStrategy {
  type: BenignessType;
  strength: number;          // How effectively it softens
  description: string;
}

// ═══════════════════════════════════════════════════════════════
// JOKE FORMATS & VOICES
// ═══════════════════════════════════════════════════════════════

export type JokeFormat =
  | 'one_liner'
  | 'two_liner'
  | 'qa_riddle'
  | 'dialogue'
  | 'observational'
  | 'story'
  | 'callback';

export type ComedyVoice =
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

// ═══════════════════════════════════════════════════════════════
// JOKE SCORING
// ═══════════════════════════════════════════════════════════════

export interface JokeScores {
  bindingStrength: number;   // How strong was the default? (0-1)
  violationMagnitude: number;// How far is M1 from M0? (0-1)
  repairability: number;     // How easily found is alternative? (0-1)
  benignness: number;        // How safe for target audience? (0-1)
  economy: number;           // Payoff per word (0-1)
  originality: number;       // Distance from known jokes (0-1)
  overall: number;           // Composite score
}

export type FailureMode =
  | 'confusion'      // Repair too hard
  | 'flatness'       // Violation too weak
  | 'offense'        // Benignness insufficient
  | 'weak_snap'      // Default too weak
  | 'telegraphed'    // Twist too obvious
  | 'overexplained'; // Too much setup

export interface FailureAnalysis {
  failureMode: FailureMode;
  diagnosis: string;
  suggestions: string[];
}

// ═══════════════════════════════════════════════════════════════
// JOKE CANDIDATE
// ═══════════════════════════════════════════════════════════════

/**
 * Complete joke candidate with metadata
 */
export interface JokeCandidate {
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

// ═══════════════════════════════════════════════════════════════
// AUDIENCE & GENERATION PARAMS
// ═══════════════════════════════════════════════════════════════

export type MaturityLevel = 'family' | 'teen' | 'adult' | 'edgy';
export type PunchingDirection = 'up_only' | 'lateral' | 'any';

export interface AudienceProfile {
  id: string;
  name: string;

  // Content boundaries
  maturityLevel: MaturityLevel;
  tabooTolerance: number;    // 0-1

  // Targeting rules
  punchingDirection: PunchingDirection;
  protectedCategories: string[];

  // Cultural context
  culturalContext: string;   // US, UK, global, specific community
  inGroupIdentities: string[];// What the audience identifies as

  // Preferences
  preferredVoices: ComedyVoice[];
  avoidedTopics: string[];
}

export interface GenerationParams {
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

// ═══════════════════════════════════════════════════════════════
// SESSION & FEEDBACK
// ═══════════════════════════════════════════════════════════════

export interface UserFeedback {
  candidateId: string;
  rating: number;            // 1-5
  whatWorked?: string;
  whatDidnt?: string;
  editedVersion?: string;
}

export interface GenerationSession {
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

// ═══════════════════════════════════════════════════════════════
// COMEDY MEMORY (for callbacks/sets)
// ═══════════════════════════════════════════════════════════════

export interface EstablishedBinding {
  binding: Binding;
  establishedAt: number;     // Position in sequence
  timesReferenced: number;
  lastReferenced: number;
}

export interface SuccessfulPattern {
  operations: OperationType[];
  violationType: ViolationType;
  structure: string;         // Abstract pattern
  instances: string[];       // Joke IDs that used it
}

export interface ComedyMemory {
  sessionId: string;

  // Established bindings that can be re-exploited
  establishedBindings: EstablishedBinding[];

  // Patterns that worked
  successfulPatterns: SuccessfulPattern[];

  // Running themes
  activeThemes: string[];
}

// ═══════════════════════════════════════════════════════════════
// UI STATE TYPES
// ═══════════════════════════════════════════════════════════════

export interface OperationWeights {
  [key: string]: number;
  emptying: number;
  loading: number;
  exposure: number;
  reflection: number;
  reversal: number;
  overliteralization: number;
  categoryCrossing: number;
  compression: number;
}

export interface StyleDials {
  [key: string]: number;
  violation: number;      // 0-100
  abstraction: number;    // 0-100
  verbosity: number;      // 0-100
  meta: number;           // 0-100
  darkness: number;       // 0-100
  wordplay: number;       // 0-100
}

export interface VoiceConfig {
  id: ComedyVoice;
  name: string;
  description: string;
  icon: string;
  defaultOperationWeights: Partial<OperationWeights>;
}

export interface AudienceConfig {
  id: string;
  name: string;
  description: string;
  tabooTolerance: number;
  maturityLevel: MaturityLevel;
}

// ═══════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════

export interface ExtractBindingsRequest {
  topic: string;
  voice: ComedyVoice;
  audienceId: string;
}

export interface ExtractBindingsResponse {
  topic: string;
  scripts: string[];
  bindings: Binding[];
  roles: Role[];
  norms: string[];
  typicalIntentions: string[];
}

export interface GenerateJokesRequest {
  selectedBindings: Binding[];
  operationWeights: OperationWeights;
  styleDials: StyleDials;
  voice: ComedyVoice;
  audienceId: string;
  format: JokeFormat;
}

export interface GenerateJokesResponse {
  candidates: JokeCandidate[];
}

export interface AnalyzeJokeRequest {
  jokeText: string;
  intendedMechanism?: {
    defaultBinding: string;
    operation: OperationType;
    alternative: string;
  };
}

export interface AnalyzeJokeResponse {
  scores: JokeScores;
  failureAnalysis?: FailureAnalysis;
  suggestions: string[];
}
