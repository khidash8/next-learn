# Online Examination System made for Machine Test

## Features

- User authentication (login/register)
- Timed exams with countdown timer
- Question navigation and review system
- Real-time progress tracking
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Server-side rendering with Next.js
- Secure API routes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI + Shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-learn
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   REMOTE_API_URL=https://nexlearn.noviindusdemosites.in
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/                    # App router pages and layouts
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected routes (require auth)
│   └── api/               # API routes
├── components/            # Reusable UI components
│   └── ui/                # Shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── public/                # Static files
├── schemas/               # Validation schemas
├── services/              # API service functions
├── store/                 # State management stores
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint