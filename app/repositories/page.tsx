import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Header from "@/components/header"

export default async function RepositoriesPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Your Repositories</h1>
        <p className="text-lg">
        Here you can view and manage all your repositories.
        </p>
    </div>
  )
}
