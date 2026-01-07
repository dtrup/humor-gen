"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardTitle,
  Button,
  Input,
  Slider,
  SliderGroup,
  Tabs,
  SelectCard,
  SelectButtonGroup,
  ConceptTooltip,
  CONCEPTS,
} from "@/components/ui";
import { BindingGrid, CandidateCard, LearningPanel } from "@/components/generation";
import {
  VOICES,
  AUDIENCES,
  DEFAULT_OPERATION_WEIGHTS,
  DEFAULT_STYLE_DIALS,
  STYLE_DIAL_LABELS,
  OPERATION_DESCRIPTIONS,
} from "@/lib/constants";
import { useExtractBindings, useGenerateJokes } from "@/lib/hooks/use-humor-api";
import type { OperationWeights, StyleDials, Binding, ComedyVoice, JokeScores } from "@/lib/types";

type TabId = "generate" | "theory" | "library";

// Local storage keys
const SAVED_JOKES_KEY = "humor-lab-saved-jokes";
const RECENT_TOPICS_KEY = "humor-lab-recent-topics";

interface SavedJoke {
  id: string;
  text: string;
  operation: string;
  scores: JokeScores;
  rating?: "up" | "down";
  savedAt: string;
  topic: string;
  voice: string;
}

interface RecentTopic {
  topic: string;
  voice: ComedyVoice;
  audience: string;
  timestamp: string;
}

export default function HumorLab() {
  // Core state
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState<ComedyVoice>("observational");
  const [audience, setAudience] = useState("general");
  const [activeTab, setActiveTab] = useState<TabId>("generate");

  // Bindings state
  const [showBindings, setShowBindings] = useState(false);
  const [selectedBindingIds, setSelectedBindingIds] = useState<string[]>([]);
  const [bindings, setBindings] = useState<Binding[]>([]);

  // Generation controls
  const [operationWeights, setOperationWeights] = useState<OperationWeights>(DEFAULT_OPERATION_WEIGHTS);
  const [styleDials, setStyleDials] = useState<StyleDials>(DEFAULT_STYLE_DIALS);

  // Library state
  const [savedJokes, setSavedJokes] = useState<SavedJoke[]>([]);
  const [ratings, setRatings] = useState<Record<string, "up" | "down">>({});
  const [recentTopics, setRecentTopics] = useState<RecentTopic[]>([]);

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load saved jokes
      const saved = localStorage.getItem(SAVED_JOKES_KEY);
      if (saved) {
        try {
          setSavedJokes(JSON.parse(saved));
        } catch {
          console.error("Failed to load saved jokes");
        }
      }
      // Load recent topics
      const recent = localStorage.getItem(RECENT_TOPICS_KEY);
      if (recent) {
        try {
          setRecentTopics(JSON.parse(recent));
        } catch {
          console.error("Failed to load recent topics");
        }
      }
    }
  }, []);

  // API hooks
  const {
    extractBindings,
    isLoading: isExtractingBindings,
    error: extractError,
  } = useExtractBindings();

  const {
    generateJokes,
    isLoading: isGeneratingJokes,
    error: generateError,
    candidates,
    clearCandidates,
  } = useGenerateJokes();

  // Handle extract bindings
  const handleExtractBindings = async () => {
    if (!topic) return;

    // Clear previous candidates when starting a new extraction
    clearCandidates();

    try {
      const result = await extractBindings(topic, voice, audience);
      setBindings(result.bindings);
      setShowBindings(true);
      setSelectedBindingIds([]);
    } catch {
      // Error is handled by the hook
    }
  };

  // Handle generate jokes
  const handleGenerateJokes = async () => {
    const selectedBindings = bindings.filter((b) =>
      selectedBindingIds.includes(b.id)
    );

    if (selectedBindings.length === 0) return;

    try {
      await generateJokes(
        selectedBindings,
        operationWeights,
        styleDials,
        voice,
        audience,
        "one_liner"
      );
    } catch {
      // Error is handled by the hook
    }
  };

  // Handle rating a joke (thumbs up/down)
  const handleRate = (candidateId: string, rating: "up" | "down") => {
    setRatings((prev) => ({ ...prev, [candidateId]: rating }));
    // Could send to analytics or improve future generations
    console.log(`Rated ${candidateId}: ${rating}`);
  };

  // Handle saving a joke to library
  const handleSave = (candidate: typeof candidates[0]) => {
    const newSaved: SavedJoke = {
      id: candidate.id,
      text: candidate.text,
      operation: candidate.operation,
      scores: candidate.scores,
      rating: ratings[candidate.id],
      savedAt: new Date().toISOString(),
      topic,
      voice,
    };

    const updated = [...savedJokes, newSaved];
    setSavedJokes(updated);

    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SAVED_JOKES_KEY, JSON.stringify(updated));
    }

    alert("Joke saved to library! 📚");
  };

  // Handle mutation - calls the mutation API
  type MutationType =
    | "sharpen_twist"
    | "increase_misdirection"
    | "trim_setup"
    | "swap_operation"
    | "change_format"
    | "amplify_violation";

  const handleMutate = async (candidate: typeof candidates[0], mutationType: MutationType) => {
    try {
      const response = await fetch("/api/mutate-joke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jokeText: candidate.text,
          mutationType,
          currentMechanism: {
            operation: candidate.operation,
            twistWord: candidate.twistWord,
            setup: candidate.setup,
            alternative: candidate.repairPath,
          },
          voice,
          format: "one_liner",
        }),
      });

      if (!response.ok) {
        throw new Error("Mutation failed");
      }

      const result = await response.json();
      return {
        mutatedJoke: result.mutatedJoke,
        changes: result.changes || [],
        explanation: result.explanation || "Mutation applied successfully",
        scores: result.scores,
      };
    } catch (err) {
      console.error("Mutation error:", err);
      return null;
    }
  };

  // Toggle binding selection
  const toggleBinding = (id: string) => {
    setSelectedBindingIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Update operation weight
  const updateOperationWeight = (key: keyof OperationWeights, value: number) => {
    setOperationWeights((prev) => ({ ...prev, [key]: value }));
  };

  // Update style dial
  const updateStyleDial = (key: string, value: number) => {
    setStyleDials((prev) => ({ ...prev, [key]: value }));
  };

  // Randomize operation weights
  const randomizeWeights = () => {
    setOperationWeights({
      emptying: Math.floor(Math.random() * 100),
      loading: Math.floor(Math.random() * 100),
      exposure: Math.floor(Math.random() * 100),
      reflection: Math.floor(Math.random() * 100),
      reversal: Math.floor(Math.random() * 100),
      overliteralization: Math.floor(Math.random() * 100),
      categoryCrossing: Math.floor(Math.random() * 100),
      compression: Math.floor(Math.random() * 100),
    });
  };

  // Voice options for SelectCard
  const voiceOptions = VOICES.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description,
    icon: v.icon,
  }));

  // Audience options
  const audienceOptions = AUDIENCES.map((a) => ({
    id: a.id,
    name: a.name,
  }));

  // Tabs
  const tabs = [
    { id: "generate" as const, label: "Generate" },
    { id: "theory" as const, label: "Theory" },
    { id: "library" as const, label: "Library" },
  ];

  // Find lowest scoring dimension for learning panel
  const getLowestDimension = (): string | null => {
    if (candidates.length === 0) return null;
    const lastCandidate = candidates[candidates.length - 1];
    const scores = lastCandidate.scores;
    const dimensions = ["economy", "originality", "repairability"];
    let lowest = "economy";
    let lowestScore = 1;

    for (const dim of dimensions) {
      const score = scores[dim as keyof typeof scores];
      if (typeof score === "number" && score < lowestScore) {
        lowest = dim;
        lowestScore = score;
      }
    }

    return lowestScore < 0.7 ? lowest : null;
  };

  const lowestDimension = getLowestDimension();

  return (
    <div className="min-h-screen bg-bg-base p-6">
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-light tracking-wide text-gradient">
          HUMOR LAB
        </h1>
        <p className="text-fg-muted mt-2 italic text-sm">
          Understanding the mechanics of funny
        </p>
      </header>

      {/* Tab Navigation */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        className="mb-6"
      />

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="space-y-6">
          {/* Top Config Bar - 2 Column: Topic | Voice + Audience */}
          <div className="grid grid-cols-[320px_1fr] gap-6">
            {/* Left: Topic Input */}
            <Card padding="md">
              <CardTitle className="mb-2 text-xs uppercase tracking-wider">Topic / Seed</CardTitle>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="video calls, gym, dating apps..."
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleExtractBindings()}
                className="w-full min-h-[60px] px-3 py-2 rounded-md bg-bg-base/50 border border-border text-fg-primary placeholder:text-fg-muted text-sm resize-none focus:outline-none focus:border-accent"
                rows={2}
              />
              <Button
                fullWidth
                disabled={!topic || isExtractingBindings}
                onClick={handleExtractBindings}
                className="mt-3"
              >
                {isExtractingBindings ? "Extracting..." : "Extract Bindings →"}
              </Button>
              {extractError && (
                <p className="mt-2 text-xs text-error">{extractError}</p>
              )}
            </Card>

            {/* Right: Voice + Audience stacked */}
            <Card padding="md">
              <div className="flex flex-col h-full justify-between gap-4">
                {/* Voice Selection */}
                <div>
                  <CardTitle className="mb-2 text-xs uppercase tracking-wider">
                    <ConceptTooltip {...CONCEPTS.voice} onLearnMore={() => setActiveTab("theory")}>
                      Voice
                    </ConceptTooltip>
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {voiceOptions.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVoice(v.id as ComedyVoice)}
                        title={v.description}
                        className={`
                          px-2 py-1 rounded text-xs font-medium transition-all
                          ${voice === v.id
                            ? "bg-accent-faint border border-accent text-accent"
                            : "bg-bg-base/30 border border-border text-fg-muted hover:border-border-accent hover:text-fg-primary"
                          }
                        `}
                      >
                        <span className="mr-1">{v.icon}</span>
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audience Selection */}
                <div>
                  <CardTitle className="mb-2 text-xs uppercase tracking-wider">
                    <ConceptTooltip {...CONCEPTS.audience} onLearnMore={() => setActiveTab("theory")}>
                      Audience
                    </ConceptTooltip>
                  </CardTitle>
                  <div className="flex gap-1.5">
                    {audienceOptions.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setAudience(a.id)}
                        className={`
                          px-3 py-1.5 rounded text-xs font-medium transition-all
                          ${audience === a.id
                            ? "bg-accent-faint border border-accent text-accent"
                            : "bg-bg-base/30 border border-border text-fg-muted hover:border-border-accent hover:text-fg-primary"
                          }
                        `}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-[320px_1fr] gap-6">
            {/* Left Panel - Controls */}
            <div className="space-y-5">

              {/* Operation Weights */}
              <Card padding="lg">
                <CardTitle className="mb-4">
                  <ConceptTooltip {...CONCEPTS.operation} onLearnMore={() => setActiveTab("theory")}>
                    Operation Weights
                  </ConceptTooltip>
                </CardTitle>
                <SliderGroup
                  values={operationWeights}
                  onChange={updateOperationWeight}
                  tooltips={OPERATION_DESCRIPTIONS}
                />
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={randomizeWeights}
                  className="mt-4"
                >
                  🎲 Randomize
                </Button>
              </Card>

              {/* Style Dials - COMMENTED OUT for now */}
              {/* 
              <Card padding="lg">
                <CardTitle className="mb-4">Style Dials</CardTitle>
                <div className="space-y-5">
                  {(["violation", "abstraction", "verbosity", "meta", "darkness", "wordplay"] as const).map((key) => (
                    <Slider
                      key={key}
                      value={styleDials[key]}
                      onChange={(v) => updateStyleDial(key, v)}
                      leftLabel={STYLE_DIAL_LABELS[key].left}
                      rightLabel={STYLE_DIAL_LABELS[key].right}
                      showValue={false}
                    />
                  ))}
                </div>
              </Card>
              */}
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-5">
              {/* Bindings Panel */}
              {showBindings && (
                <Card padding="lg">
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle>
                      <ConceptTooltip {...CONCEPTS.binding} onLearnMore={() => setActiveTab("theory")}>
                        Extracted Bindings
                      </ConceptTooltip>
                    </CardTitle>
                    <span className="text-xs text-fg-muted">Click to select → then generate jokes</span>
                  </div>
                  {bindings.length > 0 ? (
                    <>
                      <BindingGrid
                        bindings={bindings}
                        selectedIds={selectedBindingIds}
                        onToggle={toggleBinding}
                      />
                      {selectedBindingIds.length > 0 && (
                        <Button
                          className="mt-4"
                          onClick={handleGenerateJokes}
                          disabled={isGeneratingJokes}
                        >
                          {isGeneratingJokes
                            ? "Generating..."
                            : `Generate from ${selectedBindingIds.length} binding${selectedBindingIds.length > 1 ? "s" : ""} →`}
                        </Button>
                      )}
                      {generateError && (
                        <p className="mt-2 text-xs text-error">{generateError}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-fg-muted text-sm">No bindings found for this topic.</p>
                  )}
                </Card>
              )}

              {/* Candidates */}
              {candidates.length > 0 && (
                <Card padding="lg">
                  <CardTitle className="mb-5">Generated Candidates</CardTitle>
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        id={candidate.id}
                        text={candidate.text}
                        operation={candidate.operation as "exposure" | "loading" | "emptying" | "reflection" | "reversal" | "overliteralization" | "categoryCrossing" | "compression"}
                        violationType={candidate.violationType as "semantic" | "pragmatic" | "causal" | "epistemic" | "normative" | "narrative"}
                        scores={candidate.scores}
                        mechanism={{
                          default: `${candidate.setup} → default interpretation`,
                          twist: candidate.twist,
                          repairPath: candidate.repairPath,
                          twistWord: candidate.twistWord,
                          benignness: candidate.benignessStrategy,
                        }}
                        onRate={(rating) => handleRate(candidate.id, rating)}
                        onMutate={(mutationType) => handleMutate(candidate, mutationType)}
                        onSave={() => handleSave(candidate)}
                        currentRating={ratings[candidate.id]}
                      />
                    ))}
                  </div>
                </Card>
              )}

              {/* Learning Panel - Smart suggestions based on lowest dimension */}
              {candidates.length > 0 && lowestDimension && (
                <LearningPanel
                  dimension={lowestDimension}
                  failureAnalysis={
                    lowestDimension === "economy" ? {
                      failureMode: "overexplained",
                      diagnosis: "Too many words for the payoff. The setup is doing too much work.",
                      suggestions: [
                        "Use the 🔪 Trim Setup mutation to cut ruthlessly",
                        "Remove adjectives that don't add to the misdirection",
                        "Trust the audience to fill in more context",
                      ],
                    } : lowestDimension === "snap" ? {
                      failureMode: "weak_snap",
                      diagnosis: "The default binding isn't strong enough—the twist doesn't land hard.",
                      suggestions: [
                        "Use the 🎭 More Misdirection mutation to strengthen the setup",
                        "Make the default interpretation more automatic/obvious",
                        "Consider a more universally recognized scenario",
                      ],
                    } : lowestDimension === "original" ? {
                      failureMode: "telegraphed",
                      diagnosis: "This territory has been well-covered. The twist is predictable.",
                      suggestions: [
                        "Use the 🔄 Swap Operation mutation to try a different approach",
                        "Subvert the expected twist with a further twist",
                        "Find a less obvious binding to work with",
                      ],
                    } : {
                      failureMode: "flatness",
                      diagnosis: "The violation magnitude could be higher for more impact.",
                      suggestions: [
                        "Use the 💥 Amplify mutation to push the violation harder",
                        "Find a more extreme alternative interpretation",
                        "Increase the gap between default and twist",
                      ],
                    }
                  }
                  principle={
                    lowestDimension === "economy"
                      ? "Economy: Maximum payoff per word. Cut everything that doesn't serve the snap."
                      : lowestDimension === "snap"
                        ? "Binding Strength: The stronger the default, the harder the fall."
                        : lowestDimension === "original"
                          ? "Originality: Subvert the expected twist. Go where others haven't."
                          : "Violation: Push the gap wider between default and alternative."
                  }
                  suggestions={[
                    "Click 🧬 Mutate on any candidate above",
                    `Try the recommended mutation for ${lowestDimension}`,
                    "Generate more candidates with different operation weights",
                  ]}
                  onTryFix={() => {
                    // Scroll to first candidate
                    const firstCard = document.querySelector('[class*="CandidateCard"]');
                    firstCard?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onSeeTheory={() => setActiveTab("theory")}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Theory Tab */}
      {activeTab === "theory" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Core Theory */}
          <Card padding="lg">
            <h2 className="text-xl font-light text-accent mb-4">
              The Mechanics of Funny
            </h2>
            <p className="text-fg-secondary leading-relaxed mb-6">
              Humor arises when you form a strong{" "}
              <span className="text-accent cursor-help border-b border-dashed border-accent" title="The automatic interpretation that forms in the listener's mind">
                default interpretation
              </span>
              , then experience a controlled{" "}
              <span className="text-accent cursor-help border-b border-dashed border-accent" title="The moment when the expected meaning is broken or replaced">
                detachment
              </span>{" "}
              that violates that interpretation—but can be quickly{" "}
              <span className="text-accent cursor-help border-b border-dashed border-accent" title="Finding a coherent alternative interpretation that makes sense">
                repaired
              </span>{" "}
              into a coherent alternative. The pleasure comes from the surplus cognitive energy released when the snap happens.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { title: "Setup", desc: "Build strong default binding", icon: "🎯" },
                { title: "Twist", desc: "Detach via operation", icon: "🔄" },
                { title: "Repair", desc: "Find coherent alternative", icon: "💡" },
                { title: "Payoff", desc: "Surplus from snap", icon: "✨" },
              ].map((stage) => (
                <div
                  key={stage.title}
                  className="p-4 rounded-lg bg-bg-base/50 border border-border text-center"
                >
                  <div className="text-2xl mb-2">{stage.icon}</div>
                  <h4 className="text-accent font-medium mb-1">{stage.title}</h4>
                  <p className="text-fg-muted text-xs">{stage.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Detachment Operations */}
          <Card padding="lg">
            <h3 className="text-lg font-light text-accent mb-4">
              The 8 Detachment Operations
            </h3>
            <p className="text-fg-muted text-sm mb-4">
              These are the tools for breaking default interpretations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Emptying",
                  desc: "Remove expected meaning or motive",
                  example: '"I went to the gym today." / "Just to use the bathroom."',
                  icon: "🕳️",
                },
                {
                  name: "Loading",
                  desc: "Attach unexpected meaning",
                  example: '"Nice weather" actually means "I have nothing to say to you"',
                  icon: "📦",
                },
                {
                  name: "Exposure",
                  desc: "Make the hidden binding visible",
                  example: '"You\'re on mute" = "We\'ve been watching you fail"',
                  icon: "👁️",
                },
                {
                  name: "Reflection",
                  desc: "Self-reference, meta-commentary",
                  example: "This is the part where I make a joke about making jokes",
                  icon: "🪞",
                },
                {
                  name: "Reversal",
                  desc: "Flip roles, status, or valence",
                  example: "Doctor: 'I have bad news...' Patient: 'I want a second opinion' Doctor: 'You're also ugly'",
                  icon: "🔃",
                },
                {
                  name: "Overliteralization",
                  desc: "Take figurative speech literally",
                  example: '"Break a leg" → Shows up in cast',
                  icon: "📏",
                },
                {
                  name: "Category Crossing",
                  desc: "Violate ontological boundaries",
                  example: "Treating emotions like objects, ideas like people",
                  icon: "🌀",
                },
                {
                  name: "Compression",
                  desc: "Collapse complex chains into tight lines",
                  example: "Maximum information density, every word earns its place",
                  icon: "🗜️",
                },
              ].map((op) => (
                <div
                  key={op.name}
                  className="p-4 rounded-lg bg-bg-base/40 border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{op.icon}</span>
                    <h4 className="text-accent font-medium">{op.name}</h4>
                  </div>
                  <p className="text-fg-secondary text-sm mb-2">{op.desc}</p>
                  <p className="text-fg-muted text-xs italic">"{op.example}"</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Benignness Strategies */}
          <Card padding="lg">
            <h3 className="text-lg font-light text-accent mb-4">
              Benignness: Why We Laugh Instead of Wince
            </h3>
            <p className="text-fg-secondary text-sm mb-4">
              Violations must feel safe to enjoy. These strategies provide distance:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Fictional Frame", desc: "It's not real", icon: "🎭" },
                { name: "Self-Inclusion", desc: "I'm guilty too", icon: "🙋" },
                { name: "Punching Up", desc: "Target has power", icon: "👆" },
                { name: "Hyperbole", desc: "Obviously exaggerated", icon: "📈" },
                { name: "Historical Distance", desc: "Long enough ago", icon: "📜" },
                { name: "Universal Truth", desc: "We all do this", icon: "🌍" },
                { name: "Absurdity", desc: "Too silly to hurt", icon: "🤪" },
                { name: "Consent", desc: "Target is in on it", icon: "🤝" },
              ].map((strategy) => (
                <div
                  key={strategy.name}
                  className="p-3 rounded-lg bg-bg-base/30 border border-border text-center"
                >
                  <div className="text-lg mb-1">{strategy.icon}</div>
                  <h5 className="text-xs font-medium text-fg-secondary">{strategy.name}</h5>
                  <p className="text-xs text-fg-muted">{strategy.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Reference */}
          <Card padding="md" className="bg-accent-faint/20 border-accent/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-accent font-medium">The Formula</h4>
                <p className="text-fg-secondary text-sm">
                  <strong>Strong default</strong> + <strong>Detachment operation</strong> + <strong>Quick repair</strong> + <strong>Benignness</strong> = Funny
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Library Tab */}
      {activeTab === "library" && (
        <div className="max-w-4xl mx-auto">
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-light text-accent">Your Library</h2>
                <p className="text-fg-muted text-sm mt-1">
                  {savedJokes.length} saved joke{savedJokes.length !== 1 ? "s" : ""}
                </p>
              </div>
              {savedJokes.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const dataStr = JSON.stringify(savedJokes, null, 2);
                      const blob = new Blob([dataStr], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `humor-lab-export-${new Date().toISOString().split("T")[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📥 Export JSON
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const text = savedJokes.map(j => j.text).join("\n\n---\n\n");
                      navigator.clipboard.writeText(text);
                      alert("All jokes copied to clipboard!");
                    }}
                  >
                    📋 Copy All
                  </Button>
                </div>
              )}
            </div>

            {savedJokes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-fg-muted mb-4">
                  No saved jokes yet. Generate some jokes and click 💾 Save to add them here.
                </p>
                <Button onClick={() => setActiveTab("generate")}>
                  Start Generating →
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJokes.map((joke, index) => (
                  <div
                    key={joke.id + index}
                    className="p-4 rounded-lg bg-bg-base/40 border border-border"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-fg-primary leading-relaxed flex-1">"{joke.text}"</p>
                      <div className="flex gap-2 ml-4">
                        {joke.rating && (
                          <span className={`text-sm ${joke.rating === "up" ? "text-success" : "text-error"}`}>
                            {joke.rating === "up" ? "👍" : "👎"}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(joke.text);
                            alert("Copied!");
                          }}
                          className="text-fg-muted hover:text-fg-primary text-sm"
                          title="Copy"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => {
                            const updated = savedJokes.filter((_, i) => i !== index);
                            setSavedJokes(updated);
                            localStorage.setItem(SAVED_JOKES_KEY, JSON.stringify(updated));
                          }}
                          className="text-fg-muted hover:text-error text-sm"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-fg-muted">
                      <span className="px-2 py-1 bg-bg-overlay rounded">{joke.operation}</span>
                      <span className="px-2 py-1 bg-bg-overlay rounded">Topic: {joke.topic}</span>
                      <span className="px-2 py-1 bg-bg-overlay rounded">Voice: {joke.voice}</span>
                      <span className="px-2 py-1 bg-bg-overlay rounded">
                        {new Date(joke.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
