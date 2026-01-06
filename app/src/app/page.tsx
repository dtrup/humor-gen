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
  SAMPLE_BINDINGS,
  SAMPLE_CANDIDATES,
} from "@/lib/constants";
import type { OperationWeights, StyleDials, Binding } from "@/lib/types";

type TabId = "generate" | "theory" | "library";

export default function HumorLab() {
  // Core state
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState("observational");
  const [audience, setAudience] = useState("general");
  const [activeTab, setActiveTab] = useState<TabId>("generate");

  // Bindings state
  const [showBindings, setShowBindings] = useState(false);
  const [selectedBindingIds, setSelectedBindingIds] = useState<string[]>([]);
  const [bindings, setBindings] = useState<Binding[]>([]);

  // Generation controls
  const [operationWeights, setOperationWeights] = useState<OperationWeights>(DEFAULT_OPERATION_WEIGHTS);
  const [styleDials, setStyleDials] = useState<StyleDials>(DEFAULT_STYLE_DIALS);

  // Results
  const [candidates, setCandidates] = useState<typeof SAMPLE_CANDIDATES>([]);

  // Get bindings for current topic
  const getBindingsForTopic = () => {
    const key = Object.keys(SAMPLE_BINDINGS).find((k) =>
      topic.toLowerCase().includes(k)
    );
    return key ? SAMPLE_BINDINGS[key] : SAMPLE_BINDINGS["video calls"];
  };

  // Handle extract bindings
  const handleExtractBindings = () => {
    if (!topic) return;

    const topicBindings = getBindingsForTopic();
    setBindings(topicBindings);
    setShowBindings(true);

    // Auto-show candidates for video calls demo
    if (
      topic.toLowerCase().includes("video") ||
      topic.toLowerCase().includes("call") ||
      topic.toLowerCase().includes("zoom")
    ) {
      setCandidates(SAMPLE_CANDIDATES);
    } else {
      setCandidates([]);
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
              />
              <Button
                fullWidth
                disabled={!topic}
                onClick={handleExtractBindings}
                className="mt-3"
              >
                Extract Bindings →
              </Button>
            </Card>

            {/* Voice Selection */}
            <Card padding="lg">
              <CardTitle className="mb-3">Comedic Voice</CardTitle>
              <SelectCard
                options={voiceOptions}
                value={voice}
                onChange={setVoice}
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
                <BindingGrid
                  bindings={bindings}
                  selectedIds={selectedBindingIds}
                  onToggle={toggleBinding}
                />
                {selectedBindingIds.length > 0 && (
                  <Button className="mt-4">
                    Generate from {selectedBindingIds.length} binding
                    {selectedBindingIds.length > 1 ? "s" : ""} →
                  </Button>
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
                      operation={candidate.operation}
                      violationType={candidate.violationType}
                      scores={candidate.scores}
                      mechanism={candidate.mechanism}
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
            {candidates.length > 0 && (
              <LearningPanel
                dimension="economy"
                failureAnalysis={{
                  failureMode: "overexplained",
                  diagnosis:
                    'The setup ("having technical difficulties") is explained rather than implied, which reduces the snap. The audience should discover the euphemism, not be told it exists.',
                  suggestions: [
                    "Trust the audience",
                    "Don't explain the mechanism—let them experience the repair",
                  ],
                }}
                principle="Trust the audience. Don't explain the mechanism—let them experience the repair."
                suggestions={[
                  "Use a more accessible alternative meaning",
                  "Add a subtle cue that hints at the needed knowledge",
                  "Try a different binding from this topic",
                ]}
                onTryFix={() => console.log("Try fix")}
                onSeeTheory={() => console.log("See theory")}
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
