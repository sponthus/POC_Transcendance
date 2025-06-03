#!/bin/sh

cd app

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

ln index.html dist/index.html
ln styles.css dist/styles.css

exec npm run build