"use client";

import { useState, useCallback } from "react";
import type {
  Binding,
  ComedyVoice,
  OperationWeights,
  StyleDials,
  JokeFormat,
  ExtractBindingsResponse,
  JokeScores,
  FailureAnalysis,
} from "../types";

interface GeneratedCandidate {
  id: string;
  text: string;
  format: JokeFormat;
  setup: string;
  twist: string;
  twistWord: string;
  targetBindingId: string;
  operation: string;
  violationType: string;
  alternativeModel: string;
  repairPath: string;
  benignessStrategy: string;
  scores: JokeScores;
  voice: ComedyVoice;
  created: string;
}

interface AnalysisResult {
  mechanism: {
    default: string;
    twist: string;
    twistWord: string;
    alternative: string;
    repairPath: string;
    benignessStrategy: string;
  };
  scores: JokeScores;
  failureAnalysis: FailureAnalysis;
  strengths: string[];
  improvements: string[];
}

export function useExtractBindings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractBindingsResponse | null>(null);

  const extractBindings = useCallback(
    async (topic: string, voice: ComedyVoice, audienceId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/extract-bindings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, voice, audienceId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to extract bindings");
        }

        const data: ExtractBindingsResponse = await response.json();
        setResult(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { extractBindings, isLoading, error, result };
}

export function useGenerateJokes() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<GeneratedCandidate[]>([]);

  const generateJokes = useCallback(
    async (
      selectedBindings: Binding[],
      operationWeights: OperationWeights,
      styleDials: StyleDials,
      voice: ComedyVoice,
      audienceId: string,
      format: JokeFormat = "one_liner"
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-jokes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedBindings,
            operationWeights,
            styleDials,
            voice,
            audienceId,
            format,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to generate jokes");
        }

        const data = await response.json();
        setCandidates(data.candidates);
        return data.candidates;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearCandidates = useCallback(() => {
    setCandidates([]);
  }, []);

  return { generateJokes, isLoading, error, candidates, clearCandidates };
}

export function useAnalyzeJoke() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const analyzeJoke = useCallback(
    async (
      jokeText: string,
      intendedMechanism?: {
        defaultBinding: string;
        operation: string;
        alternative: string;
      }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jokeText, intendedMechanism }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to analyze joke");
        }

        const data: AnalysisResult = await response.json();
        setAnalysis(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { analyzeJoke, isLoading, error, analysis };
}

type MutationType =
  | "sharpen_twist"
  | "increase_misdirection"
  | "trim_setup"
  | "swap_operation"
  | "change_format"
  | "amplify_violation";

interface MutationResult {
  mutatedJoke: string;
  changes: string[];
  newTwistWord: string;
  explanation: string;
  scores: JokeScores;
  mutationType: MutationType;
  originalJoke: string;
}

export function useMutateJoke() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MutationResult | null>(null);

  const mutateJoke = useCallback(
    async (
      jokeText: string,
      mutationType: MutationType,
      currentMechanism: {
        operation: string;
        twistWord: string;
        setup: string;
        alternative: string;
      },
      voice: ComedyVoice,
      format: JokeFormat = "one_liner"
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/mutate-joke", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jokeText,
            mutationType,
            currentMechanism,
            voice,
            format,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to mutate joke");
        }

        const data: MutationResult = await response.json();
        setResult(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { mutateJoke, isLoading, error, result };
}

