import type { VoiceConfig, AudienceConfig, OperationWeights, StyleDials, Binding } from "./types";

// ═══════════════════════════════════════════════════════════════
// VOICE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════

export const VOICES: VoiceConfig[] = [
  {
    id: "deadpan",
    name: "Deadpan",
    description: "Flat delivery, understated",
    icon: "😐",
    defaultOperationWeights: { emptying: 70, compression: 80 },
  },
  {
    id: "observational",
    name: "Observational",
    description: 'Shared recognition, "we all do this"',
    icon: "🔍",
    defaultOperationWeights: { exposure: 80, loading: 60 },
  },
  {
    id: "absurdist",
    name: "Absurdist",
    description: "Logic pushed to extremes",
    icon: "🌀",
    defaultOperationWeights: { categoryCrossing: 85, overliteralization: 70 },
  },
  {
    id: "self_deprecating",
    name: "Self-Deprecating",
    description: "Self as target",
    icon: "🙃",
    defaultOperationWeights: { reversal: 75, exposure: 60 },
  },
  {
    id: "sardonic",
    name: "Sardonic",
    description: "Bitter but witty",
    icon: "😏",
    defaultOperationWeights: { exposure: 70, reversal: 65 },
  },
  {
    id: "whimsical",
    name: "Whimsical",
    description: "Playful, light",
    icon: "✨",
    defaultOperationWeights: { loading: 70, categoryCrossing: 60 },
  },
];

// ═══════════════════════════════════════════════════════════════
// AUDIENCE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════

export const AUDIENCES: AudienceConfig[] = [
  {
    id: "family",
    name: "Family",
    description: "All ages appropriate",
    tabooTolerance: 10,
    maturityLevel: "family",
  },
  {
    id: "general",
    name: "General",
    description: "Adult but clean",
    tabooTolerance: 40,
    maturityLevel: "adult",
  },
  {
    id: "adult",
    name: "Adult",
    description: "Mature themes OK",
    tabooTolerance: 70,
    maturityLevel: "adult",
  },
  {
    id: "edgy",
    name: "Edgy",
    description: "Few limits",
    tabooTolerance: 90,
    maturityLevel: "edgy",
  },
];

// ═══════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_OPERATION_WEIGHTS: OperationWeights = {
  emptying: 50,
  loading: 60,
  exposure: 70,
  reflection: 20,
  reversal: 55,
  overliteralization: 40,
  categoryCrossing: 45,
  compression: 65,
};

export const DEFAULT_STYLE_DIALS: StyleDials = {
  violation: 50,
  abstraction: 40,
  verbosity: 30,
  meta: 25,
  darkness: 35,
  wordplay: 45,
};

export const STYLE_DIAL_LABELS: Record<keyof StyleDials, { left: string; right: string }> = {
  violation: { left: "Gentle", right: "Sharp" },
  abstraction: { left: "Concrete", right: "Abstract" },
  verbosity: { left: "Terse", right: "Elaborate" },
  meta: { left: "Straight", right: "Self-aware" },
  darkness: { left: "Light", right: "Dark" },
  wordplay: { left: "Situational", right: "Linguistic" },
};

// ═══════════════════════════════════════════════════════════════
// SAMPLE DATA (for demo/testing)
// ═══════════════════════════════════════════════════════════════

export const SAMPLE_BINDINGS: Record<string, Binding[]> = {
  "video calls": [
    {
      id: "vc-1",
      carrier: '"You\'re on mute"',
      defaultMeaning: "Helpful technical notification",
      confidence: 0.95,
      alternativeMeanings: ["Public humiliation moment", "Existential void announcement"],
      category: "intentional",
    },
    {
      id: "vc-2",
      carrier: "Professional background",
      defaultMeaning: "Curated workspace image",
      confidence: 0.85,
      alternativeMeanings: ["Elaborate fiction about your life", "Witness protection aesthetic"],
      category: "normative",
    },
    {
      id: "vc-3",
      carrier: "Camera off",
      defaultMeaning: "Technical/privacy choice",
      confidence: 0.80,
      alternativeMeanings: ["Pajama indicator", "Multitasking confession"],
      category: "intentional",
    },
    {
      id: "vc-4",
      carrier: '"Can everyone see my screen?"',
      defaultMeaning: "Technical check",
      confidence: 0.90,
      alternativeMeanings: ["Anxiety performance", "Cry for validation"],
      category: "intentional",
    },
  ],
  gym: [
    {
      id: "gym-1",
      carrier: "Going to the gym",
      defaultMeaning: "Health/fitness improvement",
      confidence: 0.90,
      alternativeMeanings: ["Guilt management ritual", "Social display", "Procrastination from work"],
      category: "intentional",
    },
    {
      id: "gym-2",
      carrier: "Personal trainer",
      defaultMeaning: "Fitness expert helping you",
      confidence: 0.85,
      alternativeMeanings: ["Paid friend who counts", "Therapist with abs"],
      category: "role",
    },
    {
      id: "gym-3",
      carrier: "Gym selfie",
      defaultMeaning: "Documenting progress",
      confidence: 0.75,
      alternativeMeanings: ["Proof of attendance", "Vanity with plausible deniability"],
      category: "intentional",
    },
  ],
  "dating apps": [
    {
      id: "da-1",
      carrier: '"Looking for something real"',
      defaultMeaning: "Seeking genuine connection",
      confidence: 0.90,
      alternativeMeanings: ["Exhaustion announcement", "Preemptive blame shift"],
      category: "intentional",
    },
    {
      id: "da-2",
      carrier: "Profile photos",
      defaultMeaning: "Authentic self-representation",
      confidence: 0.70,
      alternativeMeanings: ["Historical fiction", "Best 0.01% of existence"],
      category: "normative",
    },
    {
      id: "da-3",
      carrier: "Swiping",
      defaultMeaning: "Evaluating compatibility",
      confidence: 0.85,
      alternativeMeanings: ["Sorting humans like spam", "Dopamine farming"],
      category: "causal",
    },
  ],
};

export const SAMPLE_CANDIDATES = [
  {
    id: "cand-1",
    text: '"You\'re on mute" is just a polite way of saying "we\'ve all been staring at you failing for 30 seconds."',
    operation: "exposure" as const,
    violationType: "pragmatic" as const,
    scores: {
      bindingStrength: 0.85,
      violationMagnitude: 0.70,
      repairability: 0.90,
      benignness: 0.95,
      economy: 0.90,
      originality: 0.70,
      overall: 0.82,
    },
    mechanism: {
      default: '"You\'re on mute" → Helpful technical notification',
      twist: "Exposes the hidden social meaning: public failure announcement",
      repairPath: "Recognize that 'helpful' masks collective witnessing of your fumble",
      twistWord: "failing",
      benignness: "Universal experience, self-inclusion",
    },
  },
  {
    id: "cand-2",
    text: 'My camera is off because I\'m "having technical difficulties." The technical difficulty is that I\'m not wearing pants.',
    operation: "loading" as const,
    violationType: "epistemic" as const,
    scores: {
      bindingStrength: 0.75,
      violationMagnitude: 0.60,
      repairability: 0.80,
      benignness: 0.90,
      economy: 0.70,
      originality: 0.60,
      overall: 0.68,
    },
    mechanism: {
      default: '"Technical difficulties" → Legitimate equipment problems',
      twist: "Loads with actual meaning: deliberate concealment of unprofessionalism",
      repairPath: "Recognize the euphemism everyone uses",
      twistWord: "pants",
      benignness: "Self-deprecating, universal pandemic experience",
    },
  },
  {
    id: "cand-3",
    text: 'Video calls have taught me that "I\'ll let you go" actually means "I need to escape this conversation and you\'re going to thank me for it."',
    operation: "exposure" as const,
    violationType: "pragmatic" as const,
    scores: {
      bindingStrength: 0.80,
      violationMagnitude: 0.65,
      repairability: 0.85,
      benignness: 0.92,
      economy: 0.60,
      originality: 0.65,
      overall: 0.68,
    },
    mechanism: {
      default: '"I\'ll let you go" → Polite end to conversation',
      twist: "Exposes the inversion: speaker wants to leave, frames it as favor",
      repairPath: "Recognize the social fiction we all participate in",
      twistWord: "thank me",
      benignness: "Observational, shared experience",
    },
  },
];
