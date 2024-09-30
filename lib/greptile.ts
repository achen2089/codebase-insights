import { auth } from "@/auth"

export async function submitRepositoryForIndexing(
  repository: string
): Promise<any> {
  const repositoryPayload = {
    remote: "github",
    repository: repository
  };

  const session = await auth()
  if (!session || !session.accessToken) {
    throw new Error("No access token found")
  }

  try {
    const response = await fetch('https://api.greptile.com/v2/repositories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GREPTILE_API_KEY}`,
        'X-Github-Token': session.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(repositoryPayload)
    });

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Repository indexing submission result:', data);
    return data;
  } catch (error) {
    console.error('Error submitting repository for indexing:', error);
    throw error;
  }
}

export async function checkRepositoryIndexingProgress(
  repository: string
): Promise<any> {
  const session = await auth()
  if (!session || !session.accessToken) {
    throw new Error("No access token found")
  }

  const repositoryIdentifier = encodeURIComponent(`github:main:${repository}`);

  try {
    const response = await fetch(`https://api.greptile.com/v2/repositories/${repositoryIdentifier}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GREPTILE_API_KEY}`,
        'X-Github-Token': session.accessToken
      }
    });

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Repository indexing progress:', data);
    return data;
  } catch (error) {
    console.error('Error checking repository indexing progress:', error);
    throw error;
  }
}