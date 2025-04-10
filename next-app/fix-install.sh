#!/bin/bash
# One-click solution for npm registry issues
# This script tries multiple approaches to fix the 409 Conflict errors

set -e # Exit on error

echo "=== Iceland Trip Diary - Installation Fix Script ==="
echo "This script will attempt multiple methods to resolve npm registry issues."
echo ""

# Make install.sh executable
chmod +x ./install.sh

# Create a directory for the new project if needed
ICELAND_NEXT_DIR="../iceland-next-app"

# Function to try npm installation with official registry
try_npm_install() {
  echo "=== Method 1: Using npm with official registry ==="
  npm config set registry https://registry.npmjs.org/
  npm cache clean --force
  npm install --no-fund --no-audit --prefer-offline --legacy-peer-deps
  
  if [ $? -eq 0 ]; then
    echo "✅ SUCCESS! npm installation completed successfully."
    return 0
  else
    echo "❌ npm installation failed. Trying next method..."
    return 1
  fi
}

# Function to try yarn installation
try_yarn_install() {
  echo "=== Method 2: Using Yarn instead of npm ==="
  
  if ! command -v yarn &> /dev/null; then
    echo "Installing Yarn globally..."
    npm install -g yarn
  fi
  
  yarn install
  
  if [ $? -eq 0 ]; then
    echo "✅ SUCCESS! Yarn installation completed successfully."
    return 0
  else
    echo "❌ Yarn installation failed. Trying next method..."
    return 1
  fi
}

# Function to create a new Next.js project and copy over files
try_create_next_app() {
  echo "=== Method 3: Creating a fresh Next.js project ==="
  
  # Check if the directory already exists
  if [ -d "$ICELAND_NEXT_DIR" ]; then
    echo "Directory $ICELAND_NEXT_DIR already exists."
    read -p "Do you want to remove it and create a new one? (y/n): " answer
    if [ "$answer" != "y" ]; then
      echo "Skipping this method."
      return 1
    fi
    rm -rf "$ICELAND_NEXT_DIR"
  fi
  
  echo "Creating new Next.js project with TypeScript..."
  npx create-next-app@latest $ICELAND_NEXT_DIR --typescript
  
  if [ $? -ne 0 ]; then
    echo "❌ Failed to create new Next.js project."
    return 1
  fi
  
  echo "Copying over files to the new project..."
  # Create directories if they don't exist
  mkdir -p "$ICELAND_NEXT_DIR/app" "$ICELAND_NEXT_DIR/types" "$ICELAND_NEXT_DIR/utils"
  
  # Copy directories and files
  cp -r app/* "$ICELAND_NEXT_DIR/app/" 2>/dev/null || true
  cp -r components "$ICELAND_NEXT_DIR/" 2>/dev/null || true
  cp -r types/* "$ICELAND_NEXT_DIR/types/" 2>/dev/null || true
  cp -r utils/* "$ICELAND_NEXT_DIR/utils/" 2>/dev/null || true
  cp -r public "$ICELAND_NEXT_DIR/" 2>/dev/null || true
  
  # Copy config files
  cp next.config.js "$ICELAND_NEXT_DIR/" 2>/dev/null || true
  cp tailwind.config.js "$ICELAND_NEXT_DIR/" 2>/dev/null || true
  cp postcss.config.js "$ICELAND_NEXT_DIR/" 2>/dev/null || true
  
  # Install additional dependencies
  echo "Installing additional dependencies in the new project..."
  cd "$ICELAND_NEXT_DIR"
  npm install react-intersection-observer
  
  if [ $? -eq 0 ]; then
    echo "✅ SUCCESS! New Next.js project created and files copied successfully."
    echo "Your project is now available in: $ICELAND_NEXT_DIR"
    echo "To run it:"
    echo "  cd $ICELAND_NEXT_DIR"
    echo "  npm run dev"
    return 0
  else
    cd -
    echo "❌ Failed to install dependencies in the new project."
    return 1
  fi
}

# Function to try GitHub URLs for dependencies
try_github_install() {
  echo "=== Method 4: Installing packages directly from GitHub ==="
  
  npm install --save https://github.com/vercel/next.js/tarball/v12.3.1
  npm install --save https://github.com/facebook/react/tarball/v18.2.0
  npm install --save https://github.com/thebuilder/react-intersection-observer/tarball/v9.4.3
  
  # Install dev dependencies locally
  npm install --save-dev typescript@4.9.5 @types/react@18.0.28 @types/node@18.15.11 @types/react-dom@18.0.11
  npm install --save-dev autoprefixer@10.4.14 postcss@8.4.21 tailwindcss@3.3.1
  
  if [ $? -eq 0 ]; then
    echo "✅ SUCCESS! GitHub-based installation completed successfully."
    return 0
  else
    echo "❌ GitHub-based installation failed."
    return 1
  fi
}

# Try each method in sequence
echo "Starting installation attempts..."

if try_npm_install; then
  echo "Installation successful using npm with official registry."
elif try_yarn_install; then
  echo "Installation successful using Yarn."
elif try_create_next_app; then
  echo "Installation successful by creating a fresh Next.js project."
elif try_github_install; then
  echo "Installation successful using GitHub URLs."
else
  echo "====================================================="
  echo "❌ All automatic installation methods failed."
  echo ""
  echo "Please check INSTALLATION_FIX.md for manual troubleshooting steps."
  echo "====================================================="
  exit 1
fi

echo ""
echo "====================================================="
echo "✅ Installation process completed successfully!"
echo ""
echo "You can now run the development server with:"
echo "  npm run dev"
echo ""
echo "Or if using the new project location:"
echo "  cd $ICELAND_NEXT_DIR"
echo "  npm run dev"
echo "====================================================="
