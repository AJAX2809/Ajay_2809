# SIH1615 Learning Path Dashboard

## Overview

This is a full-stack learning management platform designed for the SIH1615 project - "Learning Path Dashboard for Enhancing Skills". The application provides AI-powered, personalized learning experiences for students and instructors, featuring interactive dashboards, progress tracking, gamification elements, and community features. The platform helps users plan, track, and improve their skill-learning journeys through intelligent recommendations and comprehensive analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, utilizing a component-based architecture
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Context-based auth provider with protected routes
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Authentication**: Passport.js with local strategy and session-based auth
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API endpoints with structured error handling

### Database Design
- **Primary Database**: PostgreSQL with Neon Database integration
- **Schema Management**: Drizzle migrations for database versioning
- **Core Entities**: Users, Learning Paths, User Progress, Achievements, Forum Posts, Opportunities, Resources
- **Relationships**: Properly normalized schema with foreign key constraints
- **Data Types**: JSON fields for flexible content like skills arrays and module configurations

### Authentication & Authorization
- **Strategy**: Session-based authentication using Passport.js Local Strategy
- **Password Security**: Scrypt hashing with salt for secure password storage
- **Session Storage**: PostgreSQL session store for persistence
- **Role-based Access**: Student and instructor roles with appropriate permissions
- **Protected Routes**: Client-side route protection with authentication checks

### Component Structure
- **Layout Components**: Sidebar navigation, top navigation bar, and responsive grid layouts
- **Feature Components**: Dashboard widgets, learning path displays, progress charts, AI recommendations
- **UI Components**: Comprehensive shadcn/ui component library for forms, dialogs, cards, and interactive elements
- **Data Visualization**: Recharts integration for progress tracking and analytics

### API Architecture
- **Learning Paths**: CRUD operations for creating and managing personalized learning journeys
- **Progress Tracking**: Real-time progress updates and statistics aggregation
- **Community Features**: Forum posts, replies, and social learning functionality
- **Opportunities**: Integration for internships, hackathons, and job postings
- **AI Services**: Placeholder architecture for AI-powered recommendations and chatbot functionality

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter), TanStack React Query
- **UI Library**: Radix UI primitives with shadcn/ui components for accessible, customizable interface elements
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach

### Backend Dependencies  
- **Database**: Neon Database (PostgreSQL) with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod schema validation with drizzle-zod integration

### Development Tools
- **Build System**: Vite with TypeScript support and Replit-specific plugins
- **Code Quality**: ESBuild for production bundling with external package handling
- **Development**: TSX for TypeScript execution and hot reloading

### Planned Integrations
- **AI Services**: OpenAI or HuggingFace APIs for personalized learning path generation and chatbot functionality
- **External Resources**: Integration with YouTube, GeeksforGeeks, Coursera, and Udemy for curated learning content
- **Visualization**: Enhanced charting capabilities for detailed progress analytics and reporting

### Asset Management
- **Icons**: Font Awesome for consistent iconography throughout the application
- **Fonts**: Google Fonts integration with multiple font families for enhanced typography
- **Static Assets**: Vite-based asset handling with optimized bundling for production deployment