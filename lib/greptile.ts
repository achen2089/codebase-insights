import { auth } from "@/auth"
import { GreptileError, handleApiResponse } from './greptile-utils'

// Constants
const API_BASE_URL = 'https://api.greptile.com/v2'

// Types
interface RepositoryPayload {
  remote: string
  repository: string
  branch: string
}

interface QueryPayload {
  messages: { content: string; role: string }[]
  repositories: RepositoryPayload[]
  sessionId: string
}

// API functions
export async function submitRepositoryForIndexing(repository: string): Promise<any> {
  return makeGreptileRequest(`${API_BASE_URL}/repositories`, 'POST', {
    remote: "github",
    repository,
    branch: "main"
  })
}

export async function checkRepositoryIndexingProgress(repository: string): Promise<any> {
  const repositoryIdentifier = encodeURIComponent(`github:main:${repository}`)
  return makeGreptileRequest(`${API_BASE_URL}/repositories/${repositoryIdentifier}`, 'GET')
}

export async function queryRepository(repository: string, query: string): Promise<any> {
  const payload: QueryPayload = {
    messages: [{ content: query, role: "user" }],
    repositories: [{ remote: "github", repository, branch: "main" }],
    sessionId: generateSessionId()
  }
  return makeGreptileRequest(`${API_BASE_URL}/query`, 'POST', payload)
}

export async function getInsights(repository: string): Promise<any> {
    const insightPrompts = [
        "Code Structure Visualization: Provide an accurate description detailing the overall structure and relationships between different parts of the codebase.",
        "Complexity Analysis: Identify and highlight all of the most complex and relevant areas of the code (AT LEAST 5 areas!), providing suggestions for potential refactoring.",
        "Documentation Coverage: Determine which parts of the codebase are well-documented and which need more attention.",
        "Dependency Tracker: Summarize and manage external and internal dependencies within the project.",
        "Code Health Metrics: Display various metrics including code quality, test coverage, potential security vulnerabilities (provide at least 5), cyclomatic complexity, code duplication, maintainability index, and code churn. Please provide numbers and percentages where possible"
    ];

    let combinedInsights = '';
    for (const prompt of insightPrompts) {
        const insight = await queryRepository(repository, prompt);
        combinedInsights += insight.message + '\n\n';
    }

    return makeGreptileRequest(`${API_BASE_URL}/query`, 'POST', {
        messages: [{ content: combinedInsights, role: "user" }],
        repositories: [{ remote: "github", repository, branch: "main" }],
        sessionId: generateSessionId()
    });
}

// Helper functions
async function makeGreptileRequest(url: string, method: string, body?: any): Promise<any> {
  const session = await auth()
  if (!session?.accessToken) {
    throw new GreptileError("No access token found")
  }

  const headers = {
    'Authorization': `Bearer ${process.env.GREPTILE_API_KEY}`,
    'X-Github-Token': session.accessToken,
    'Content-Type': 'application/json'
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })

    return handleApiResponse(response)
  } catch (error) {
    console.error(`Error in Greptile API request to ${url}:`, error)
    throw new GreptileError(`Failed to ${method} ${url}`)
  }
}

function generateSessionId(): string {
  // Implement a function to generate a unique session ID
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}