# Job Tracking Application

A modern, interactive job application tracking system built with Next.js and MongoDB. Organize your job hunt using a Kanban-style board with drag-and-drop functionality, track applications, and manage your job search journey efficiently.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Key Features Documentation](#key-features-documentation)
- [API Routes](#api-routes)
- [Contributing](#contributing)

## 🎯 Overview

This is a full-stack job tracking application designed to help users manage their job search process. Users can create boards to organize job applications, move applications between different columns (e.g., Applied, Interview Scheduled, Rejected), and track important details like salary, location, and application dates.

**Built with:**
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Better Auth
- **UI Components**: Radix UI, shadcn/ui
- **Drag & Drop**: dnd-kit

## ✨ Features

- **User Authentication**: Secure login and sign-up with Better Auth
- **Kanban Board**: Intuitive drag-and-drop interface to manage job applications
- **Job Application Tracking**: Store comprehensive job details including:
  - Position title and company name
  - Salary information
  - Job location
  - Application date
  - Job description and URL
  - Custom notes and tags
- **Multiple Boards**: Create and manage multiple job hunting boards
- **Customizable Columns**: Organize applications with custom status columns
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant UI updates as you manage applications

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 16 |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI + shadcn/ui |
| **Drag & Drop** | dnd-kit |
| **Database** | MongoDB 7.2 |
| **ODM** | Mongoose 9.6 |
| **Authentication** | Better Auth 1.6 |
| **Package Manager** | pnpm |
| **Linting** | ESLint 9 |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (package manager)
- **MongoDB**: Local instance or MongoDB Atlas account
- **Git**: For version control

### Verify Installation

```bash
node --version
pnpm --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/makiweeb13/job-tracking-app.git
cd job-tracking-app/app
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies specified in `package.json`.

## 🔧 Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local  # if .env.example exists
# or create manually
touch .env.local
```

### 2. Configure Environment Variables

Add the following variables to `.env.local`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/job-tracker
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-tracker?retryWrites=true&w=majority

# Authentication Configuration
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

#### Important Notes:
- **MONGODB_URI**: Update based on your MongoDB setup (local or Atlas)
- **BETTER_AUTH_SECRET**: Generate a secure 32+ character string for production
- **BETTER_AUTH_URL**: Must match your application URL

### 3. Generate Auth Secret (Optional)

To generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ▶️ Running the Application

### Development Server

Start the development server:

```bash
pnpm dev
```

The application will be available at: **http://localhost:3000**

The server will automatically reload when you make changes to the code.

### Production Build

Create an optimized production build:

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Run Linter

Check for code quality issues:

```bash
pnpm lint
```

## 🗄️ Database Setup

### 1. MongoDB Local Setup (Optional)

If running MongoDB locally:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

Verify connection:

```bash
mongosh  # MongoDB Shell
```

### 2. MongoDB Atlas Setup (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add IP to whitelist (or allow all: 0.0.0.0/0)
4. Create database user with username and password
5. Copy connection string and update `MONGODB_URI` in `.env.local`

### 3. Database Seeding

Seed the database with sample job applications:

```bash
pnpm run seed:jobs
```

This command will:
- Connect to MongoDB using `MONGODB_URI`
- Create sample job applications across different board columns
- Seed realistic Philippine salary data

**Note**: Seeding only works in development environment (`NODE_ENV=development`)

### 4. Database Models

The application uses three main models:

#### Board
- Represents a job hunting board (e.g., "Tech Jobs 2024")
- Contains multiple columns for organizing applications

#### Column
- Represents a status column (e.g., "Applied", "Interview", "Rejected")
- Stores job applications in order

#### JobApplication
- Individual job application record
- Fields: position, company, salary, location, status, notes, tags, etc.

## 📁 Project Structure

```
app/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── (auth)/                  # Auth routes group
│   │   ├── login/               # Login page
│   │   └── sign-up/             # Sign-up page
│   ├── (main)/                  # Main app routes group
│   │   └── dashboard/           # Dashboard page
│   └── api/                     # API routes
│       └── auth/[...all]/       # Better Auth routes
├── components/                  # React components
│   ├── common/                  # Shared components
│   │   ├── navbar.tsx           # Navigation bar
│   │   └── sign-out-btn.tsx     # Sign-out button
│   └── ui/                      # UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── kanbanboard.tsx      # Main Kanban board
│       ├── job-application-card.tsx
│       └── ...other UI components
├── lib/                         # Utility functions & configs
│   ├── db.ts                    # Database connection
│   ├── utils.ts                 # Helper utilities
│   ├── init-board.ts            # Board initialization
│   ├── actions/                 # Server actions
│   │   └── job-applications.ts  # Job app mutations
│   ├── auth/                    # Authentication
│   │   ├── auth.ts              # Auth configuration
│   │   └── auth-client.ts       # Client-side auth
│   ├── hooks/                   # React hooks
│   │   └── useBoards.ts         # Board data hook
│   └── models/                  # MongoDB models
│       ├── board.ts
│       ├── column.ts
│       ├── job-application.ts
│       └── models.type.ts       # TypeScript types
├── public/                      # Static assets
├── scripts/                     # Utility scripts
│   └── seed.ts                  # Database seeding script
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

## 🎨 Key Features Documentation

### Authentication Flow

The application uses **Better Auth** for secure authentication:

1. User signs up with email/password
2. Better Auth validates and stores credentials
3. Session is created and stored in user's browser
4. Protected routes check for valid session

**Protected Routes**: Dashboard and main app
**Public Routes**: Login, Sign-up, Home page

### Kanban Board

The Kanban board feature uses **dnd-kit** for drag-and-drop:

- **Drag Jobs Between Columns**: Move job applications between status columns
- **Reorder Jobs**: Change the order within a column
- **Real-time Updates**: Changes persist to MongoDB immediately
- **Responsive Layout**: Works on desktop and tablet devices

### Server Actions

Located in `lib/actions/job-applications.ts`, these functions handle:
- Creating new job applications
- Updating application details
- Moving applications between columns
- Deleting applications
- Fetching board data

## 🔌 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...all]` | ALL | Better Auth endpoint (handles login, signup, session) |

**Note**: Most data operations use Next.js Server Actions instead of traditional API routes.


## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Better Auth Docs](https://www.better-auth.com/)
- [dnd-kit Documentation](https://docs.dnd-kit.com/)
- [Tailwind CSS](https://tailwindcss.com/)