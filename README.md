# MediCare - Medical Appointment Booking System

A comprehensive medical appointment booking system built with modern web technologies.

## 🚀 Features

- **Multi-Role Authentication**: Patients, Doctors, and Admin dashboards
- **Real-time Dashboard**: Live data from MongoDB Atlas
- **Doctor Verification**: Admin approval system for medical professionals  
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Secure API**: JWT authentication with bcrypt password hashing
- **Production Ready**: Deployed on Vercel + Render + MongoDB Atlas

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limiting** for security

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📦 Project Structure

```
MediCare/
├── med-sky-appointment/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   └── services/           # API services
│   ├── public/                 # Static assets
│   └── package.json
│
├── backend/                     # Backend (Node.js + Express)
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── utils/                  # Utility functions
│   └── server.js              # Main server file
│
└── DEPLOYMENT.md              # Deployment guide
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/medicare-appointment-system.git
   cd medicare-appointment-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd med-sky-appointment
   npm install
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

## 🔐 User Roles

### Patient
- Register and login
- View dashboard with health metrics
- Book appointments with doctors
- Manage personal health records

### Doctor
- Register with medical credentials
- Wait for admin verification
- Manage patient appointments
- Access patient information

### Admin
- System administration dashboard
- Verify doctor credentials
- Manage all users and doctors
- Monitor system statistics

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/doctors` - All doctors
- `PUT /api/admin/verify/:id` - Verify doctor
- `DELETE /api/admin/user/:id` - Delete user

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy
1. **Backend to Render**: Connect GitHub repo, set environment variables
2. **Frontend to Vercel**: Connect GitHub repo, set `VITE_API_URL`
3. **Database**: MongoDB Atlas (already configured)

## 🔧 Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:8080
```

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input sanitization
- XSS protection
- MongoDB injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **MediCare Team** - Initial work

## 🙏 Acknowledgments

- Shadcn/ui for the beautiful component library
- Lucide for the icon set
- MongoDB Atlas for cloud database hosting
- Vercel and Render for hosting platforms
