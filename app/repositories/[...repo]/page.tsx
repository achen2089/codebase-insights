import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RepoPage({ params }: { params: { repo: string[] } }) {
  const session = await auth()
  if (!session?.user) {
    redirect("/")
  }

  const repoFullName = params.repo.join('/')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Repository: {repoFullName}</h1>
      <p>This is a basic dynamic component for the repository page.</p>
      <p>You can add more details and functionality here as needed.</p>
    </div>
  )
}

