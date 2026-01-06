"use client";

import { useState } from "react";
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
} from "@/components/ui";
import { BindingGrid, CandidateCard, LearningPanel } from "@/components/generation";
import {
  VOICES,
  AUDIENCES,
  DEFAULT_OPERATION_WEIGHTS,
  DEFAULT_STYLE_DIALS,
  STYLE_DIAL_LABELS,
} from "@/lib/constants";
import { useExtractBindings, useGenerateJokes } from "@/lib/hooks/use-humor-api";
import type { OperationWeights, StyleDials, Binding, ComedyVoice } from "@/lib/types";

type TabId = "generate" | "theory" | "library";

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
  } = useGenerateJokes();

  // Handle extract bindings
  const handleExtractBindings = async () => {
    if (!topic) return;

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
        <div className="grid grid-cols-[320px_1fr] gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-5">
            {/* Topic Input */}
            <Card padding="lg">
              <CardTitle className="mb-3">Topic / Seed</CardTitle>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="video calls, gym, dating apps..."
                onKeyDown={(e) => e.key === "Enter" && handleExtractBindings()}
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

            {/* Voice Selection */}
            <Card padding="lg">
              <CardTitle className="mb-3">Comedic Voice</CardTitle>
              <SelectCard
                options={voiceOptions}
                value={voice}
                onChange={(v) => setVoice(v as ComedyVoice)}
                columns={2}
              />
            </Card>

            {/* Audience */}
            <Card padding="lg">
              <CardTitle className="mb-3">Audience</CardTitle>
              <SelectButtonGroup
                options={audienceOptions}
                value={audience}
                onChange={setAudience}
              />
            </Card>

            {/* Operation Weights */}
            <Card padding="lg">
              <CardTitle className="mb-4">Operation Weights</CardTitle>
              <SliderGroup
                values={operationWeights}
                onChange={updateOperationWeight}
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

            {/* Style Dials */}
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
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-5">
            {/* Bindings Panel */}
            {showBindings && (
              <Card padding="lg">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle>Extracted Bindings</CardTitle>
                  <span className="text-xs text-fg-muted">Click to target</span>
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
                      onRate={(rating) => console.log(`Rated ${candidate.id}: ${rating}`)}
                      onEdit={() => console.log(`Edit ${candidate.id}`)}
                      onVariations={() => console.log(`Variations for ${candidate.id}`)}
                      onSave={() => console.log(`Save ${candidate.id}`)}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Learning Panel */}
            {candidates.length > 0 && lowestDimension && (
              <LearningPanel
                dimension={lowestDimension}
                failureAnalysis={{
                  failureMode: "overexplained",
                  diagnosis: `This joke could be stronger on ${lowestDimension}. Consider tightening the setup or finding a sharper twist.`,
                  suggestions: [
                    "Trust the audience more",
                    "Cut unnecessary setup words",
                    "Move the twist word later",
                  ],
                }}
                principle="Economy matters. Maximum payoff per word."
                suggestions={[
                  "Try a different operation",
                  "Sharpen the twist word",
                  "Consider a different binding",
                ]}
                onTryFix={() => console.log("Try fix")}
                onSeeTheory={() => setActiveTab("theory")}
              />
            )}
          </div>
        </div>
      )}

      {/* Theory Tab */}
      {activeTab === "theory" && (
        <div className="max-w-3xl mx-auto">
          <Card padding="lg">
            <h2 className="text-xl font-light text-accent mb-4">
              The Mechanics of Funny
            </h2>
            <p className="text-fg-secondary leading-relaxed mb-6">
              Humor arises when you form a strong default interpretation, then
              experience a controlled detachment that violates that
              interpretation—but can be quickly repaired into a coherent
              alternative.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { title: "Setup", desc: "Build strong default binding" },
                { title: "Twist", desc: "Detach via operation" },
                { title: "Repair", desc: "Find coherent alternative" },
                { title: "Payoff", desc: "Surplus from snap" },
              ].map((stage) => (
                <div
                  key={stage.title}
                  className="p-5 rounded-lg bg-bg-base/50 border border-border"
                >
                  <h4 className="text-accent font-medium mb-2">{stage.title}</h4>
                  <p className="text-fg-muted text-sm">{stage.desc}</p>
                </div>
              ))}
            </div>
            <Button variant="secondary">Read full theory →</Button>
          </Card>
        </div>
      )}

      {/* Library Tab */}
      {activeTab === "library" && (
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-light text-accent mb-2">Your Library</h2>
          <p className="text-fg-muted">
            Saved jokes, successful patterns, and learning notes will appear
            here.
          </p>
        </div>
      )}
    </div>
  );
}
