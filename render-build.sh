#!/bin/bash

echo "📦 Installing backend deps..."
npm install --prefix backend

echo "📦 Installing frontend deps..."
npm install --prefix frontend

echo "🔧 Fixing vite permission..."
chmod +x frontend/node_modules/.bin/vite

echo "⚙️ Building frontend..."
npm run build --prefix frontend
