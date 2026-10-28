import { z } from "zod";

export const EvaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  dimensions: z.object({
    correctness: z.number().min(0).max(100),
    relevance: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
    conceptualUnderstanding: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100),
    practicalApplication: z.number().min(0).max(100)
  }),
  strengths: z.array(z.string().min(1)).min(1),
  missingConcepts: z.array(z.string()),
  mistakes: z.array(z.string()),
  improvements: z.array(z.string().min(1)).min(1),
  suggestedAnswer: z.string().min(10),
  verdict: z.string().min(3)
});

/**
 * Weights for deterministic overall score computation:
 * Correctness: 30%
 * Conceptual Understanding: 25%
 * Relevance: 15%
 * Completeness: 15%
 * Practical Application: 10%
 * Clarity: 5%
 */
export function calculateWeightedScore(dimensions) {
  const weighted =
    dimensions.correctness * 0.30 +
    dimensions.conceptualUnderstanding * 0.25 +
    dimensions.relevance * 0.15 +
    dimensions.completeness * 0.15 +
    dimensions.practicalApplication * 0.10 +
    dimensions.clarity * 0.05;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}
