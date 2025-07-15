# 🔐 MongoDB Atlas User Setup Guide

## Current Issue: Authentication Failed
The cluster `rutuja.2jshv.mongodb.net` exists, but the user `ghadge:ghadge123` authentication is failing.

## Solution Options:

### Option 1: Fix Existing User (Recommended)
1. Go to MongoDB Atlas → Database Access
2. Find user `ghadge` and edit it
3. Set password to `ghadge123`
4. Ensure privileges: "Read and write to any database"

### Option 2: Create New User
If the user doesn't exist:
1. Database Access → Add New Database User
2. Username: `ghadge`
3. Password: `ghadge123`
4. Privileges: "Read and write to any database"

### Option 3: Alternative Credentials
Create a new user with different credentials:

**New User Option:**
- Username: `rutuja`
- Password: `Medicare123!`

**Updated Connection String:**
```
mongodb+srv://rutuja:Medicare123!@rutuja.2jshv.mongodb.net/Medicare?retryWrites=true&w=majority&appName=Rutuja
```

## Steps to Implement:

### A) Check Current Users
1. MongoDB Atlas → Database Access
2. See what users exist
3. Note their usernames and privileges

### B) Create/Update User
1. Ensure user exists with correct password
2. Verify "Read and write to any database" privilege
3. Save changes

### C) Update Render Environment
1. Go to Render dashboard
2. Update MONGODB_URI with correct credentials
3. Save and redeploy

## 🚨 Important Notes:
- MongoDB Atlas users are different from your Atlas account login
- Database users need "Read and write" privileges
- Password must match exactly (case-sensitive)
- Wait 1-2 minutes after creating user before testing

## Common Issues:
❌ User doesn't exist
❌ Wrong password
❌ Insufficient privileges
❌ Special characters in password (use simple passwords)

## Test Connection:
After fixing user, you should see:
```
✅ MongoDB Connected: rutuja-shard-00-01.2jshv.mongodb.net
📊 Database: Medicare
```

Instead of:
```
❌ Database connection failed: bad auth : Authentication failed.
```
