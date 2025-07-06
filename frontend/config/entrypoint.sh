#!/bin/sh

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  npm install @babylonjs/loaders
fi

# Copy every static file in dist/ to be served by nginx
cp public/favicon.ico dist/favicon.ico
echo copy done

exec npm run dev