# Iceland Trip Diary - Next.js App

This is a refactored version of the Iceland Trip Diary, converting it from Svelte to Next.js.

## Setup Instructions

1. Copy data files from the original project (automated script)
   ```
   node scripts/copy-data.js
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Install additional dependencies
   ```
   npm install react-intersection-observer
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Build for production
   ```
   npm run build
   ```

6. Deploy to GitHub Pages
   ```
   npm run deploy
   ```

## Project Structure

- `/app` - Next.js app directory with pages
- `/components` - React components
- `/public` - Static assets and data files
- `/types` - TypeScript type definitions
- `/utils` - Utility functions

## Components

- `DayCard` - Card component for displaying day summaries
- `DayDetail` - Detailed view for each day
- `ActivityItem` - Individual activity items
- `ScrollSpy` - Tracks scroll position for navigation
- `SwipeNavigation` - Mobile swipe navigation
- `SwipeTutorial` - Tutorial for mobile users

## Data Structure

Data is loaded from JSON files:
- `trip-overview.json` - Overall trip information
- `day1.json`, `day2.json`, etc. - Individual day data

## Styling

The application uses a combination of:
- CSS variables for theming
- Component-specific CSS
- Custom styling for interactive elements
