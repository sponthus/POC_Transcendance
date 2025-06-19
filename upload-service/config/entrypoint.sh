#!/bin/sh

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

mkdir -p uploads

cp assets/default.jpg uploads/default.jpg
chmod 644 uploads/default.jpg

exec npm run dev