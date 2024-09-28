import { auth } from "@/auth"

export async function getUserRepositories() {
  const session = await auth()
  if (!session || !session.accessToken) {
    throw new Error("No access token found")
  }

  const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch repositories')
  }

  return response.json()
}