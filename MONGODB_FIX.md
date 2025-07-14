# 🔧 MongoDB Atlas Connection Fix

## Problem
The MongoDB connection is failing with DNS error: `querySrv ENOTFOUND _mongodb._tcp.cluster0.e1eqd.mongodb.net`

## Solution
You need to get the correct connection string from your MongoDB Atlas dashboard.

## Steps to Get Correct Connection String:

### 1. Go to MongoDB Atlas
1. Visit [cloud.mongodb.com](https://cloud.mongodb.com)
2. Log in to your MongoDB Atlas account
3. Select your project

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" as driver
4. Copy the connection string

### 3. Expected Format
Your connection string should look like this:
```
mongodb+srv://ghadge:<password>@cluster0.xxxxx.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Cluster0
```

## Common Issues:
- ❌ Old cluster URL (e1eqd) - cluster might have been recreated
- ❌ Incorrect password
- ❌ Database user not created
- ❌ IP whitelist not configured

## Quick Fix:
1. **Check if your cluster exists** in MongoDB Atlas
2. **Verify database user credentials**:
   - Username: `ghadge`
   - Password: `ghadge123`
3. **Whitelist all IPs**: Add `0.0.0.0/0` to IP whitelist
4. **Update connection string** with the new one from Atlas

## Alternative: Create New Cluster
If cluster doesn't exist:
1. Create new cluster in MongoDB Atlas
2. Create database user: `ghadge` / `ghadge123`
3. Get new connection string
4. Update environment variables in Render

## Update Render Environment Variables:
After getting the correct connection string, update in Render:
```
MONGODB_URI=mongodb+srv://ghadge:ghadge123@cluster0.XXXXX.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Cluster0
```

Replace `XXXXX` with your actual cluster identifier from Atlas.
