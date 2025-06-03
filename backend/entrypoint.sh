#!/bin/sh

cd app

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

exec npx nodemon --watch  src src/app.js