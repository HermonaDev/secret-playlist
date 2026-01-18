# Vibe Architect - Secret Playlist Generator

## Overview
A Next.js web application that creates themed playlists where the first letter of each song title spells out a hidden message. Powered by Google's Gemini AI.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini API (requires GEMINI_API_KEY secret)
- **Runtime**: Node.js 20

## Project Structure
```
/app
  /api
    /generate
      route.ts     # API endpoint for Gemini playlist generation
  globals.css      # Tailwind imports and base styles
  layout.tsx       # Root layout
  page.tsx         # Main app UI
/public            # Static assets
```

## Environment Variables
- `GEMINI_API_KEY` - Required. Google Gemini API key for AI playlist generation.

## Development
Run `npm run dev` to start the development server on port 5000.

## Deployment
Uses Next.js build and start for production.
