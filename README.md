# Property Map Application

A modern web application built with Next.js that allows users to view, manage, and interact with property listings on an interactive map.

## Features

- 🗺️ Interactive Google Maps integration
- 🔐 Secure authentication with Supabase Magic Links
- 💼 Property management (CRUD operations)
- 💰 Price range filtering
- 🎨 Modern UI with shadcn/ui components
- 📱 Responsive design

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api) - Google Maps integration
- [Supabase](https://supabase.com/) - Authentication and database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Maps API key
- Supabase account and project

### Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── components/     # Reusable components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Next.js pages
└── styles/        # Global styles
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

