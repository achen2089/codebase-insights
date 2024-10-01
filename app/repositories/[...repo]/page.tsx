"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Github, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import InsightReport from "@/components/insight-report"
import ReportSkeleton from "@/components/report-skeleton"
import Link from 'next/link'

export default function RepoPage({ params }: { params: { repo: string[] } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [indexingStatus, setIndexingStatus] = useState<string>('Not started')
  const [insights, setInsights] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const repoFullName = params.repo.join('/')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    // Check if repository is already indexed
    checkIndexingStatus()
  }, [repoFullName])

  const checkIndexingStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/greptile?repository=${encodeURIComponent(repoFullName)}`)
      if (!response.ok) throw new Error('Failed to check indexing status')
      const data = await response.json()
      setIndexingStatus(data.status)
      if (data.status === 'completed') {
        // Load insights from localStorage if available
        const cachedInsights = localStorage.getItem(`insights_${repoFullName}`)
        if (cachedInsights) {
          setInsights(JSON.parse(cachedInsights))
        } else {
          // If no cached insights, fetch new ones
          getInsights()
        }
      } else if (data.status === 'Not started') {
        // Start indexing if not already started
        startIndexing()
      }
    } catch (error) {
      console.error('Error checking indexing status:', error)
      setIndexingStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const startIndexing = async () => {
    setIsLoading(true)
    setInsights(null) // Reset insights to show skeleton
    try {
      const response = await fetch('/api/greptile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'index', repository: repoFullName })
      })
      if (!response.ok) throw new Error('Failed to submit repository')
      const data = await response.json()
      setIndexingStatus('indexing')
      
      // Wait for 20 seconds before checking the indexing status again
      setTimeout(() => {
        checkIndexingStatus()
      }, 20000)

    } catch (error) {
      console.error('Error submitting repository:', error)
      setIndexingStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const getInsights = async () => {
    setIsLoading(true);
    setInsights(null); // Reset insights to show skeleton
    try {
      const response = await fetch('/api/greptile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insights', repository: repoFullName })
      });
      if (!response.ok) throw new Error('Failed to start insights job');
      
    } catch (error) {
      console.error('Error getting insights:', error);
      setInsights(null);
      setIsLoading(false);
    }
  };

  const updateInsights = async () => {
    // Clear the cached insights
    localStorage.removeItem(`insights_${repoFullName}`)
    // Call getInsights to fetch fresh data
    await getInsights()
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // This will prevent any flash of content before redirect
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold flex items-center">
        <Github className="w-8 h-8 mr-2" />
        <Link href={`https://github.com/${repoFullName}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
          {repoFullName}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Link>
      </h1>
      {indexingStatus === 'indexing' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 transition ease-in-out duration-150">
            Indexing repository...
          </div>
          <p className="text-sm text-gray-500">This may take a minute. Please check back later.</p>
        </div>
      )}
      {indexingStatus === 'error' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-red-700 bg-red-100">
            <AlertCircle className="w-4 h-4 mr-2" />
            Error occurred during indexing
          </span>
          <div className="flex space-x-4">
            <Button onClick={startIndexing} disabled={isLoading}>
              Try Again
            </Button>
          </div>
        </div>
      )}
      {indexingStatus === 'completed' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Repository Insights:</h2>
            <Button onClick={updateInsights} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Insights
            </Button>
          </div>
          {isLoading || insights === null ? (
            <>
              <div className="flex items-center justify-center space-x-2 my-8">
                <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
                <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
                <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
                <span className="text-sm text-gray-500">Loading insights...</span>
              </div>
              <ReportSkeleton />
            </>
          ) : (
            <InsightReport insights={insights} />
          )}
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-500">
            {indexingStatus === 'Not started' ? 'Starting indexing process...' : 'Loading...'}
          </span>
        </div>
      )}
    </div>
  )
}