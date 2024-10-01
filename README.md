# Codebase Insights 

Codebase Insights is a powerful tool designed to provide comprehensive analysis and insights into your GitHub repositories. 

## Built with

- Next.js
- Greptile
- Shadcn
- Auth.js
- Vercel AI SDK

## Getting Started

To get started with Codebase Insights, follow these steps:

1. Clone the repository:
   
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory based on the `.env.local.example` file. Fill in the required values:

   ```
   AUTH_SECRET="" # Generate a secret using `openssl rand -base64 32`
   AUTH_GITHUB_ID="" # Your GitHub OAuth App Client ID
   AUTH_GITHUB_SECRET="" # Your GitHub OAuth App Client Secret
   GREPTILE_API_KEY="" # Your Greptile API key
   OPENAI_API_KEY="" # Your OpenAI API key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Code Structure Analysis**: Visualize and understand the overall structure of your codebase.
- **Complexity Assessment**: Identify complex areas of your code and get refactoring suggestions.
- **Documentation Coverage**: Evaluate which parts of your codebase are well-documented and which need attention.
- **Dependency Tracking**: Monitor and manage both external and internal dependencies.
- **Code Health Metrics**: Get insights into code quality, test coverage, potential security vulnerabilities, and more.

## Usage

1. Sign in with your GitHub account.
2. Select a repository you want to analyze.
3. Wait for the indexing process to complete.
4. Explore the various insights and metrics provided for your codebase.


## TODO

- Make calling github api repos with pagination
- Fix some issues and user experience with initial repo indexing 
- Add more robust insights into the report