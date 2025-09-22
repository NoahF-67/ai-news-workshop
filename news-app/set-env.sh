#!/bin/bash

# Set environment variables for Vercel
echo "Setting up environment variables..."

# MONGODB_URI
echo "mongodb+srv://dal800028_db_user:D8NgsrXhAj2EPIja@67.tkcbttd.mongodb.net/news-app?retryWrites=true&w=majority&appName=67" | npx vercel env add MONGODB_URI

# NEWS_API_KEY  
echo "3fd164b63bf84c958ce5bde99a5dc2b9" | npx vercel env add NEWS_API_KEY

# GOOGLE_API_KEY
echo "AIzaSyDi7Fet7Quu0KDNbiymg_qsEgM2ckjvvK0" | npx vercel env add GOOGLE_API_KEY

# NEXT_PUBLIC_APP_URL
echo "https://news-fgpan02rj-noah-fortenberrys-projects.vercel.app" | npx vercel env add NEXT_PUBLIC_APP_URL

echo "Environment variables set! Now redeploying..."
npx vercel --prod



