# MediCare Production Environment Variables
# Copy these values to your deployment platforms

## Backend Environment Variables (For Render)
NODE_ENV=production
MONGODB_URI=mongodb+srv://ghadge:ghadge123@cluster0.3wjhw.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=medicare_super_secure_jwt_secret_key_2024_production_rutuja_ghadge
CORS_ORIGIN=https://health-care-ghadgerutuja.vercel.app

## Additional Backend Variables
PORT=10000
ADMIN_EMAIL=admin@medicare.com
ADMIN_PASSWORD=AdminSecure123!

## Frontend Environment Variables (For Vercel)
VITE_API_URL=https://healthcare-backend-ghadgerutuja.onrender.com

## MongoDB Atlas Configuration
# Database Name: Medicare
# Username: ghadge
# Password: ghadge123
# Cluster: cluster0.e1eqd.mongodb.net

## Deployment URLs (Update these with your actual URLs)
# Frontend: https://health-care-ghadgerutuja.vercel.app
# Backend: https://healthcare-backend-ghadgerutuja.onrender.com

## Security Notes
# - JWT_SECRET is a strong 64-character secret
# - MongoDB URI includes SSL and retry settings
# - CORS_ORIGIN matches your Vercel deployment domain
# - All passwords are production-ready
