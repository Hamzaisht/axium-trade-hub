
# Axium: Creator Token Exchange Platform

Axium is a platform that allows fans to invest in their favorite creators through tokenized securities.

## Features

- Real-time token price tracking
- Live order book and trade execution
- Creator metrics and engagement data
- AI-powered valuation models
- Secure authentication and trading

## Getting Started

### Prerequisites

- Node.js 16+
- npm or Yarn

### Installation

1. Clone the repository
2. Install dependencies with `npm install` or `yarn`
3. Start the development server with `npm run dev` or `yarn dev`

## Environment Variables

To connect to real external APIs, create a `.env` file in the root directory with the following variables:

```
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_INSTAGRAM_API_KEY=your_instagram_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_TIKTOK_API_KEY=your_tiktok_api_key
VITE_SPOTIFY_API_KEY=your_spotify_api_key
VITE_APPLE_MUSIC_API_KEY=your_apple_music_api_key
VITE_GOOGLE_TRENDS_API_KEY=your_google_trends_api_key
```

Without these variables, the application will use mock data.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Project Structure

- `src/components`: UI components
- `src/hooks`: Custom React hooks
- `src/services`: API and data services
- `src/contexts`: React context providers
- `src/utils`: Utility functions
