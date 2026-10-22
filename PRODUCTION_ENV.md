# MediCare Production Environment Variables
# Set these values directly in Render/Vercel secret settings.
# Do not commit real credentials to this file.

## Backend Environment Variables (For Render)
NODE_ENV=production
MONGODB_URI=<set-in-render>
JWT_SECRET=<generate-a-long-random-secret>
CORS_ORIGIN=<frontend-production-url>

## Additional Backend Variables
PORT=10000
ADMIN_EMAIL=admin@medicare.com
ADMIN_PASSWORD=<set-in-render-and-use-only-for-provisioning>
ADMIN_PHONE=<set-in-render-and-use-only-for-provisioning>

## Frontend Environment Variables (For Vercel)
VITE_API_URL=<render-backend-url>

## Security Notes
# - Rotate any credentials that were previously committed to Git.
# - Store secrets only in Render/Vercel environment settings.
# - Never paste database URIs, JWT secrets, or admin passwords into this file.
