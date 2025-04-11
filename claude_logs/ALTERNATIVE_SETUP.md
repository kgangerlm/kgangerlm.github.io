# Alternative Setup Instructions for Iceland Trip Diary

Due to the npm registry issues (409 Conflict errors), here is an alternative approach that avoids dependency installation entirely. This will give you a working template that you can implement when npm is more stable.

## Manual Setup Approach

### 1. Create a new Next.js project

When npm is working again, create a new Next.js project with:

```bash
npx create-next-app@12.1.6 iceland-next-app --use-npm
cd iceland-next-app
```

### 2. Copy the component files

Copy these JavaScript files from the `next-app` directory in this repo:

- `components/DayCard.js` (converted from TypeScript)
- `components/DayDetail.js` (converted from TypeScript)
- `components/ActivityItem.js` (converted from TypeScript)
- `components/ScrollSpy.js` (converted from TypeScript)
- `components/SwipeNavigation.js` (converted from TypeScript)
- `components/SwipeTutorial.js` (converted from TypeScript)
- `utils/data.js` (converted from TypeScript)

### 3. Copy the data files

Run the copy-data.js script or manually copy:

```bash
mkdir -p public/data
cp ../kgangerlm.github.io/public/data/*.json public/data/
cp ../kgangerlm.github.io/public/favicon.svg public/
```

### 4. Copy the page files

Copy and convert the page files:

- `pages/index.js` (from app/page.tsx)
- `pages/day/[id].js` (from app/day/[id]/page.tsx)

### 5. Copy the styling

Copy the CSS file from `app/globals.css` to `styles/globals.css`.

### 6. Configure Next.js

Use this minimal config in `next.config.js`:

```javascript
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  }
};
```

## Converting TypeScript Files

Here's how to convert the TypeScript components to JavaScript:

1. Remove all type annotations (`: string`, `: number`, etc.)
2. Remove interface definitions
3. Remove React.FC type annotations
4. Remove type imports
5. Keep all the actual functionality intact

Example conversion:
```typescript
// TypeScript
interface DayCardProps {
  day: DayData;
  isActive?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ day, isActive = false }) => {
  // component code
}
```

Becomes:
```javascript
// JavaScript
const DayCard = ({ day, isActive = false }) => {
  // component code
}
```

## JavaScript Alternative Files

I've created JavaScript versions of all the TypeScript components in this repository. You can find them with ".js" extensions instead of ".tsx" extensions.

## Simple Testing Approach

To verify all the components and styling work correctly with a minimal setup:

1. Create a simple HTML file that includes the components as static content
2. Add the CSS styles inline
3. Test the static version before integrating with Next.js

This approach allows you to verify the UI and structure without dealing with npm registry issues.
