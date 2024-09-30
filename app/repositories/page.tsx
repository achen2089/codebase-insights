import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserRepositories } from "@/lib/github"
import RepositoriesList from "@/components/repositories-list"

export default async function RepositoriesPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/")
  }

  try {
    const initialData = await getUserRepositories()
    console.log(initialData)
    return <RepositoriesList initialData={initialData} />
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred"
    console.error("Error fetching repositories:", e)
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Your Repositories</h1>
        <p className="text-red-500">Error: {error}</p>
        <p>Please try signing out and signing in again.</p>
      </div>
    )
  }
}