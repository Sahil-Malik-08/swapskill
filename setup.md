# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
```

Update `backend/config.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/skill_swap
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
# From the root directory
npm install react-router-dom
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## First Steps

1. **Register a new account** at http://localhost:5173/register
2. **Add skills** to your profile (both offered and wanted)
3. **Browse other users** in the Discover section
4. **Send swap requests** to other users
5. **Manage your requests** in the Requests section

## Admin Access

To create an admin user, you can either:
1. Manually update the user document in MongoDB to set `isAdmin: true`
2. Or use MongoDB Compass/Shell to update the user

## Testing the API

Test the backend health endpoint:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"message":"Skill Swap Platform API is running"}`

## Common Issues

### MongoDB Connection
- Make sure MongoDB is running
- Check your connection string in `config.env`
- For local MongoDB: `mongodb://localhost:27017/skill_swap`

### CORS Issues
- Backend is configured to accept requests from `http://localhost:5173`
- If using a different frontend port, update CORS settings in `backend/server.js`

### JWT Issues
- Make sure `JWT_SECRET` is set in `config.env`
- Use a secure, random string for production

## Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
npm run build
# Serve the dist folder with your preferred web server
```

## Database Backup

To backup your data:
```bash
mongodump --db skill_swap --out ./backup
```

To restore:
```bash
mongorestore --db skill_swap ./backup/skill_swap
``` 