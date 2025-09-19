# Learning Platform

A full-stack learning platform built with React and Express.js.

## Project Structure

```
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared schemas and utilities
└── package.json     # Root workspace configuration
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Installation

The project uses npm workspaces. All dependencies are installed from the root directory:

```bash
npm install --legacy-peer-deps
```

## Development

Start both frontend and backend development servers:

```bash
npm run dev
```

This will start:
- Backend server on port 5000
- Frontend development server (typically on port 5173)

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run build` - Build both frontend and backend for production
- `npm start` - Start the production server

## Technology Stack

### Frontend
- React 18
- Vite
- React Router
- React Query
- Tailwind CSS
- Lucide React (icons)
- Recharts (charts)
- React Hook Form
- Zod (validation)

### Backend
- Express.js
- Passport.js (authentication)
- Express Session
- Multer (file uploads)
- Mongoose (MongoDB)
- CORS
- Helmet (security)
- Compression

## Features

- User authentication and authorization
- Learning path management
- Progress tracking
- Community features
- Resource marketplace
- AI recommendations
- Achievement system
- Opportunities board

## Environment Variables

Create a `.env` file in the root directory:

```
SESSION_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
PORT=5000
```

## Troubleshooting

If you encounter dependency conflicts, use:

```bash
npm install --legacy-peer-deps
```

This project was set up to work around Windows-specific compilation issues with native modules.
