import { auth } from "@/auth"
import { 
  submitRepositoryForIndexing, 
  checkRepositoryIndexingProgress, 
  queryRepository,
  getInsights
} from "@/lib/greptile"
import { processInsights } from "@/lib/process-insights"
import { z } from 'zod'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { action, ...data } = await req.json()

  switch (action) {
    case 'index':
      return handleIndexing(data.repository)
    case 'query':
      return handleQuery(data.repository, data.query)
    case 'insights':
      return handleInsights(data.repository)
    default:
      return Response.json({ error: "Invalid action" }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const repository = searchParams.get('repository')
  
  if (!repository) {
    return Response.json({ error: "Repository parameter is required" }, { status: 400 })
  }

  return handleProgress(repository)
}

async function handleIndexing(repository: string) {
  try {
    const result = await submitRepositoryForIndexing(repository)
    return Response.json(result)
  } catch (error) {
    console.error("Error submitting repository for indexing:", error)
    return Response.json({ error: "Failed to submit repository" }, { status: 500 })
  }
}

async function handleProgress(repository: string) {
  try {
    const result = await checkRepositoryIndexingProgress(repository)
    return Response.json(result)
  } catch (error) {
    console.error("Error checking repository indexing progress:", error)
    return Response.json({ error: "Failed to check indexing progress" }, { status: 500 })
  }
}

async function handleQuery(repository: string, query: string) {
  try {
    const result = await queryRepository(repository, query)
    return Response.json(result["message"])
  } catch (error) {
    console.error("Error querying repository:", error)
    return Response.json({ error: "Failed to query repository" }, { status: 500 })
  }
}

async function handleInsights(repository: string) {
  try {
    const result = await getInsights(repository)
    const processedInsights = await processInsights(result["message"])
    return Response.json(processedInsights)
  } catch (error) {
    console.error("Error getting or processing insights:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Failed to process insights: Invalid data structure" }, { status: 422 })
    }
    return Response.json({ error: "Failed to get or process insights" }, { status: 500 })
  }
}
