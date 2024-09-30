"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { BarChart, Star, Code, Calendar, GitFork, ExternalLink, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Repository {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  forks_count: number;
  html_url: string;
}

export default function RepositoriesList({ initialData }: { initialData: Repository[] }) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredData, setFilteredData] = useState<Repository[]>(initialData)
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    const filtered = initialData.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchTerm, initialData])

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Your Repositories</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-11/12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-col gap-4">
        {getCurrentPageData().map((repo: Repository) => (
          <div key={repo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-grow mb-4 sm:mb-0 sm:mr-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                    {repo.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </h2>
                <Link href={`/repositories/${repo.full_name}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <BarChart className="w-4 h-4 mr-2" />
                    Insights
                    </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-2">{repo.description || "No description"}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {repo.language && (
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{repo.stargazers_count} stars</span>
                </div>
                <div className="flex items-center">
                  <GitFork className="w-4 h-4 mr-2 text-purple-500" />
                  <span>{repo.forks_count} forks</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                  <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next Page
        </Button>
      </div>
    </div>
  )
}