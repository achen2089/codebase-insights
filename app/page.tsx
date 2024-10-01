import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Index() {
  const session = await auth()
  if (session?.user) {
    redirect("/repositories")
  }

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold text-blue-500">Codebase Insights</h1>
      </div>
      <p className="text-xl max-w-2xl">
        Get comprehensive insights on all your repositories. Analyze code structure, complexity, health metrics, documentation coverage, and dependencies to optimize your development workflow.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          "Code Structure Analysis",
          "Complexity Assessment",
          "Code Health Metrics",
          "Documentation Coverage",
          "Dependency Tracking",
          "Refactoring Suggestions"
        ].map((feature, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{feature}</h3>
            <p>
              {feature === "Code Structure Analysis" && "Understand your codebase architecture and organization."}
              {feature === "Complexity Assessment" && "Identify complex areas and get refactoring suggestions."}
              {feature === "Code Health Metrics" && "Track code quality, test coverage, and security vulnerabilities."}
              {feature === "Documentation Coverage" && "Evaluate well-documented areas and those needing attention."}
              {feature === "Dependency Tracking" && "Monitor internal and external dependencies in your projects."}
              {feature === "Refactoring Suggestions" && "Get actionable advice to improve code maintainability."}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
