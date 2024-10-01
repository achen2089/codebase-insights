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
      // Start the insights generation process
      const jobId = await startInsightsJob(repository);
      
      // Return the job ID immediately
      return Response.json({ jobId });
    } catch (error) {
      console.error("Error starting insights job:", error);
      return Response.json({ error: "Failed to start insights job" }, { status: 500 });
    }
  }
  
  async function startInsightsJob(repository: string) {
    // In a real implementation, you would add this job to a queue
    // For now, we'll just generate a unique job ID
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Start the job in the background
    processInsightsJob(jobId, repository);
    
    return jobId;
  }
  
  async function processInsightsJob(jobId: string, repository: string) {
    try {
      const result = await getInsights(repository);
      const processedInsights = await processInsights(result["message"]);
      
      // In a real implementation, you would store the result in a database
      // For now, we'll just log it
      console.log(`Job ${jobId} completed:`, processedInsights);
    } catch (error) {
      console.error(`Error processing job ${jobId}:`, error);
    }
  }

