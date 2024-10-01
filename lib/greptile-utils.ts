export class GreptileError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'GreptileError'
    }
  }
  
  export async function handleApiResponse(response: Response): Promise<any> {
    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`)
      throw new GreptileError(`HTTP error! status: ${response.status}`)
    }
  
    const data = await response.json()
    console.log('API response:', data)
    return data
  }