import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { BarChart, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignIn, SignOut } from "@/components/auth-components"



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
        Get comprehensive insights on all your repositories. Analyze code quality, track performance metrics, and optimize your development workflow.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          "Code Quality Analysis",
          "Performance Metrics",
          "Dependency Management",
          "Security Vulnerabilities",
          "Collaboration Insights",
          "Custom Reports"
        ].map((feature, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{feature}</h3>
            <p>Gain valuable insights into your {feature.toLowerCase()} across all your repositories.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
