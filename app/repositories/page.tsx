import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserRepositories } from "@/lib/github"

interface Repository {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
}

export default async function RepositoriesPage() {
    const session = await auth()
    if (!session?.user) {
      redirect("/")
    }
  
    let repositories: Repository[] = []
    let error: string | null = null
  
    try {
      repositories = await getUserRepositories()
      repositories.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    } catch (e) {
      error = e instanceof Error ? e.message : "An unknown error occurred"
      console.error("Error fetching repositories:", e)
    }
  
    if (error) {
      return (
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Your Repositories</h1>
          <p className="text-red-500">Error: {error}</p>
          <p>Please try signing out and signing in again.</p>
        </div>
      )
    }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Your Repositories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map((repo: any) => (
          <div key={repo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold">{repo.name}</h2>
            <p className="text-sm text-gray-600">{repo.description}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-2">{repo.language}</span>
              <span>{repo.stargazers_count} stars</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}