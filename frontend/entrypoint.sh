#!/bin/sh

cd app

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -d "dist/index.html"]; then
  ln index.html dist/index.html
fi

if [ ! -d "dist/styles.css" ]; then
  ln styles.css dist/styles.css
fi

if [ ! -d "dist/favicon.io" ]; then
  cp public/favicon.ico dist/favicon.ico
fi

if [ ! -d "dist/avatars/default-avatar.jpg" ]; then
   cp -r public/avatars dist/avatars
fi

exec npm run build