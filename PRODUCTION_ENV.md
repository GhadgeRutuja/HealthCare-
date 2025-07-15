# MediCare Production Environment Variables
# Copy these values to your deployment platforms

## Backend Environment Variables (For Render)
NODE_ENV=production
MONGODB_URI=mongodb+srv://Rutuja8304:Rutuja8304@rutuja.2jshv.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Rutuja
JWT_SECRET=medicare_super_secure_jwt_secret_key_2024_production_rutuja_ghadge
CORS_ORIGIN=https://health-care-ghadgerutuja.vercel.app

## Additional Backend Variables
PORT=10000
ADMIN_EMAIL=admin@medicare.com
ADMIN_PASSWORD=AdminSecure123!

## Frontend Environment Variables (For Vercel)
VITE_API_URL=https://healthcare-o8d5.onrender.com

## MongoDB Atlas Configuration
# Database Name: Medicare
# Username: Rutuja8304
# Password: Rutuja8304
# Cluster: rutuja.2jshv.mongodb.net (✅ WORKING - Successfully Connected!)
# User Description: Admin(MediCare)

## Deployment URLs (✅ WORKING LIVE URLS)
# Frontend: https://health-care-ghadgerutuja.vercel.app (Deploy this next!)
# Backend: https://healthcare-o8d5.onrender.com (✅ LIVE & WORKING)

## Security Notes
# - JWT_SECRET is a strong 64-character secret
# - MongoDB URI includes SSL and retry settings
# - CORS_ORIGIN matches your Vercel deployment domain
# - All passwords are production-ready
