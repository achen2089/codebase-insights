import { generateObject } from 'ai'
import { openai } from "@ai-sdk/openai"
import { z } from 'zod'

export const insightSchema = z.object({
  codeStructure: z.object({
    description: z.string().describe("Explanation of the code structure")
  }),
  complexityAnalysis: z.object({
    complexAreas: z.array(z.object({
      area: z.string(),
      complexity: z.number(),
      refactoringSuggestions: z.array(z.string())
    })),
    overallComplexity: z.number()
  }),
  documentationCoverage: z.object({
    wellDocumented: z.array(z.string()),
    needsAttention: z.array(z.string()),
    overallCoverage: z.number().min(0).max(100)
  }),
  dependencyTracker: z.object({
    external: z.array(z.string()),
    internal: z.array(z.string()),
    dependencyRelations: z.string().describe("Relationships between dependencies")
  }),
  codeHealthMetrics: z.object({
    codeQuality: z.number().min(0).max(100),
    testCoverage: z.number().min(0).max(100),
    securityVulnerabilities: z.array(z.object({
      severity: z.enum(["low", "medium", "high", "critical"]),
      description: z.string()
    })),
    cyclomaticComplexity: z.number().min(0),
    codeDuplication: z.number().min(0).max(100),
    maintainabilityIndex: z.number().min(0).max(100),
    codeChurn: z.number().min(0)
  })
})

export async function processInsights(information: string) {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: insightSchema,
    prompt: `Process the following information to generate insights: ${information}`,
  });
  console.log(object)
  return object;
}

