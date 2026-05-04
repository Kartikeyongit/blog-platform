#!/bin/bash

echo "🚀 Setting up Blog Platform..."

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed database
npx prisma db seed

# Build the project
npm run build

echo "✅ Setup complete! Run 'npm run dev' to start development server"