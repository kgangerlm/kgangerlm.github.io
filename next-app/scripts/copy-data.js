const fs = require('fs');
const path = require('path');

// Define paths
const sourcePath = path.join(__dirname, '../../public');
const destPath = path.join(__dirname, '../public');

// Create directories if they don't exist
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

// Create data directory if it doesn't exist
const dataDestPath = path.join(destPath, 'data');
if (!fs.existsSync(dataDestPath)) {
  fs.mkdirSync(dataDestPath, { recursive: true });
}

// Function to copy a file
function copyFile(source, dest) {
  try {
    const data = fs.readFileSync(source);
    fs.writeFileSync(dest, data);
    console.log(`Copied: ${path.relative(process.cwd(), dest)}`);
  } catch (err) {
    console.error(`Error copying ${source} to ${dest}:`, err);
  }
}

// Copy favicon
const faviconSource = path.join(sourcePath, 'favicon.svg');
const faviconDest = path.join(destPath, 'favicon.svg');
if (fs.existsSync(faviconSource)) {
  copyFile(faviconSource, faviconDest);
} else {
  console.warn('favicon.svg not found in source directory');
}

// Copy all data files
const dataSourcePath = path.join(sourcePath, 'data');
if (fs.existsSync(dataSourcePath)) {
  const files = fs.readdirSync(dataSourcePath);
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const sourceFile = path.join(dataSourcePath, file);
      const destFile = path.join(dataDestPath, file);
      copyFile(sourceFile, destFile);
    }
  });
  
  console.log(`Copied ${files.filter(f => f.endsWith('.json')).length} data files`);
} else {
  console.error('Data directory not found in source path');
}

console.log('Data copying complete');
