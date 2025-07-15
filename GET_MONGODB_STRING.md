# 🔍 Get Your MongoDB Atlas Connection String

## Step 1: Access MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Sign in with your credentials
3. Select your project/organization

## Step 2: Find Your Cluster
- Look for your active cluster in the dashboard
- If you don't see any clusters, you'll need to create one

## Step 3: Get Connection String
1. Click the "Connect" button on your cluster
2. Choose "Drivers" 
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string

## Expected Format:
```
mongodb+srv://ghadge:<password>@cluster0.XXXXX.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Cluster0
```

## Step 4: Replace Password
Replace `<password>` with: `ghadge123`

## Final Connection String Should Look Like:
```
mongodb+srv://ghadge:ghadge123@cluster0.XXXXX.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Cluster0
```

Where `XXXXX` is your actual cluster identifier (like `abc12`, `xyz34`, etc.)

---

## 🚨 If No Cluster Exists:

### Create New Cluster:
1. Click "+ Create Cluster" in MongoDB Atlas
2. Choose "M0 Sandbox" (Free tier)
3. Select a cloud provider and region
4. Name your cluster (default is fine)
5. Click "Create Cluster"

### Create Database User:
1. Go to "Database Access" in left sidebar
2. Click "+ Add New Database User"
3. Username: `ghadge`
4. Password: `ghadge123`
5. Select "Read and write to any database"
6. Click "Add User"

### Whitelist IP Addresses:
1. Go to "Network Access" in left sidebar
2. Click "+ Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

Then get the connection string as described above.
