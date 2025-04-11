# Iceland Trip Diary

A Next.js application for documenting and sharing an Iceland travel experience. This app allows users to explore a day-by-day itinerary of an Iceland Ring Road trip.

## Features

- Interactive day-by-day travel itinerary
- Detailed information about each day's activities, driving routes, and accommodations
- Responsive design that works on mobile, tablet, and desktop 
- Swipe navigation on mobile devices
- Offline capability with static export

## Technical Details

### Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS
- **Deployment**: Static export compatible with GitHub Pages

### Architecture Highlights

- **App Router**: Uses Next.js App Router for routing and layout management
- **React Server Components**: For efficient server-side rendering and data loading
- **Static Site Generation**: Pre-renders pages at build time for fast loading and SEO
- **Responsive Design**: Mobile-first approach with swipe navigation
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: ARIA attributes and semantic HTML

## Development

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd iceland-trip-diary

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Static Export

```bash
# Generate a static export
npm run build
```

The static files will be generated in the `out` directory and can be deployed to any static hosting service like GitHub Pages.

## Project Structure

```
next-app/
├── app/                   # Next.js App Router
│   ├── day/[id]/          # Dynamic day pages
│   ├── error.tsx          # Root error component
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading component
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ActivityItem.tsx   # Activity component
│   ├── DayCard.tsx        # Day card component
│   ├── DayDetail.tsx      # Day detail component
│   ├── ScrollSpy.tsx      # Scroll detection component
│   ├── SwipeNavigation.tsx # Swipe navigation component
│   └── SwipeTutorial.tsx  # Swipe tutorial component
├── public/                # Static files
│   ├── data/              # JSON data files
│   └── ...                # Other assets (images, icons)
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── ...                    # Configuration files
```

## Best Practices Implemented

- **Performance Optimization**:
  - Component memoization
  - Image optimization
  - Code splitting
  - Static generation

- **Accessibility**:
  - Semantic HTML
  - ARIA attributes
  - Keyboard navigation
  - Screen reader support

- **Error Handling**:
  - Error boundaries
  - Loading states
  - Fallback UI

- **Code Quality**:
  - TypeScript for type safety
  - Clean component architecture
  - Consistent code style
  - Modern React patterns (hooks, memoization)

- **SEO**:
  - Metadata API
  - Semantic HTML
  - Static generation
