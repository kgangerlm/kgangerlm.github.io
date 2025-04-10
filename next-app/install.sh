#!/bin/bash
# Installation script with improved registry handling

# Switch to the official npm registry
echo "Setting registry to official npmjs.org..."
npm config set registry https://registry.npmjs.org/

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Create a temporary package.json with exact versions
echo "Creating temporary package.json file with exact versions..."
cat > temp-package.json << EOL
{
  "name": "iceland-trip-diary",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "12.3.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-intersection-observer": "9.4.3"
  },
  "devDependencies": {
    "@types/node": "18.15.11",
    "@types/react": "18.0.28",
    "@types/react-dom": "18.0.11",
    "autoprefixer": "10.4.14",
    "postcss": "8.4.21",
    "tailwindcss": "3.3.1",
    "typescript": "4.9.5"
  }
}
EOL

# Install dependencies using the temporary package.json
echo "Installing all dependencies in a single operation..."
npm install --no-fund --no-audit --prefer-offline --legacy-peer-deps

# Alternative installation methods if the above fails
echo ""
echo "If the installation failed, try these alternatives:"
echo ""
echo "Option 1: Use Yarn instead of npm:"
echo "  npm install -g yarn"
echo "  yarn install"
echo ""
echo "Option 2: Install directly from GitHub:"
echo "  npm install --save https://github.com/vercel/next.js/tarball/v12.3.1"
echo "  npm install --save https://github.com/facebook/react/tarball/v18.2.0"
echo ""
echo "Option 3: Create a fresh Next.js project and copy files:"
echo "  npx create-next-app@12.3.1 iceland-next-app --typescript"
echo "  cp -r app components types utils public iceland-next-app/"
echo "  cp next.config.js tailwind.config.js postcss.config.js iceland-next-app/"
echo ""
echo "Installation script completed."
