# MediCare Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (already set up)

## 1. Push Code to GitHub

```bash
# Navigate to your project root
cd "c:\Users\ghadg\OneDrive\Desktop\MediCare"

# Initialize git repository if not already done
git init
git add .
git commit -m "Initial commit - MediCare application"

# Create GitHub repository and push
git remote add origin https://github.com/your-username/medicare-app.git
git branch -M main
git push -u origin main
```

## 2. Deploy Backend to Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: medicare-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/Medicare?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-jwt-secret-here
   CORS_ORIGIN=https://your-medicare-app.vercel.app
   PORT=10000
   ```

6. Click "Create Web Service"

## 3. Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: med-sky-appointment
   - **Build Command**: npm run build
   - **Output Directory**: dist

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

6. Click "Deploy"

## 4. Update Configuration

After deployment, update these files with your actual URLs:

### Frontend (.env.production)
```
VITE_API_URL=https://medicare-backend-xyz.onrender.com
```

### Backend (.env.production on Render)
```
CORS_ORIGIN=https://medicare-app-xyz.vercel.app
```

## 5. Post-Deployment Steps

1. **Test the application**: Visit your Vercel URL
2. **Create admin account**: Register as admin using the configured admin email
3. **Verify all features**: Test login, registration, dashboard functionality
4. **Monitor logs**: Check Render logs for any backend issues

## 6. Custom Domains (Optional)

### Vercel Custom Domain
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain

### Render Custom Domain  
1. Go to your service dashboard
2. Settings → Custom Domains
3. Add your custom domain

## 7. Environment Variables Reference

### Frontend (Vercel)
- `VITE_API_URL`: Your Render backend URL

### Backend (Render)
- `NODE_ENV`: production
- `PORT`: 10000 (Render default)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong secret for JWT tokens
- `CORS_ORIGIN`: Your Vercel frontend URL

## 8. Monitoring and Maintenance

- **Render**: Monitor your service at https://dashboard.render.com
- **Vercel**: Monitor deployments at https://vercel.com/dashboard
- **MongoDB Atlas**: Monitor database at https://cloud.mongodb.com

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure CORS_ORIGIN matches your Vercel URL exactly
2. **API Connection**: Verify VITE_API_URL points to your Render service
3. **Database Connection**: Check MongoDB Atlas IP whitelist (0.0.0.0/0 for all IPs)
4. **Environment Variables**: Ensure all variables are set correctly on both platforms

### Free Tier Limitations:
- **Render**: Service sleeps after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth per month
- **MongoDB Atlas**: 512MB storage limit

Your application will be accessible at:
- Frontend: https://your-medicare-app.vercel.app
- Backend: https://your-backend-name.onrender.com
