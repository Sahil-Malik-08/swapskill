# Skill Swap Platform

A minimal platform where users can trade skills with each other. Built with React, Node.js, Express, and MongoDB.

## Team Members
1. Aryan Pandey - aryanpandey4526@gmail.com
2. Aditya Maurya  - mauryaaditya7405@gmail.com
3. Anuj Kumar  - anujkeshri449@gmail.com
4. Bholu Yadav  - vasu02062001@gmail.com

## Oddo Hackathon
This project was developed as part of the Oddo Hackathon.

## Video Link
https://drive.google.com/file/d/1zk2k2n25zNZPOWgFI_KUat9MDYQn23hO/view?usp=sharing

## Features

### Public Features
- **Landing Page**: Public discovery of users without registration
- **Browse Users**: View public profiles and skills without logging in
- **Search & Filter**: Find users by skills or names
- **Call-to-Action**: Encourages signup for full functionality

### User Features
- **User Profile Management**: Create and manage profiles with skills offered/wanted
- **Skill Discovery**: Browse and search users by skills
- **Swap Requests**: Send and manage skill swap requests
- **Rating System**: Rate and review completed swaps
- **Public/Private Profiles**: Control profile visibility

### Admin Features
- **User Management**: View, ban/unban users
- **Swap Monitoring**: Monitor all swap requests
- **Statistics**: View platform statistics
- **Data Export**: Export user and swap data as CSV
- **Privacy Protection**: Admin accounts are hidden from public discovery

## Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Custom grayscale theme**

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `config.env` and update the values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret key for JWT tokens
     - `PORT`: Backend server port (default: 5000)

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install additional dependencies:**
   ```bash
   npm install react-router-dom
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/discover` - Discover public users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/skills/offered` - Add offered skill
- `DELETE /api/users/skills/offered/:skill` - Remove offered skill
- `POST /api/users/skills/wanted` - Add wanted skill
- `DELETE /api/users/skills/wanted/:skill` - Remove wanted skill

### Swap Requests
- `POST /api/swaps/request` - Send swap request
- `GET /api/swaps/my-requests` - Get user's requests
- `PUT /api/swaps/accept/:requestId` - Accept request
- `PUT /api/swaps/reject/:requestId` - Reject request
- `PUT /api/swaps/complete/:requestId` - Complete swap
- `DELETE /api/swaps/cancel/:requestId` - Cancel request

### Ratings
- `POST /api/ratings/submit` - Submit rating
- `GET /api/ratings/user/:userId` - Get user ratings
- `GET /api/ratings/my-ratings` - Get user's given ratings

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/ban` - Ban/unban user
- `GET /api/admin/stats/swaps` - Get swap statistics
- `GET /api/admin/swaps` - Get all swap requests
- `DELETE /api/admin/swaps/:requestId` - Delete swap request
- `GET /api/admin/export/:type` - Export data
- `GET /api/admin/logs` - Get admin logs

## Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Complete Profile**: Add your skills and preferences
3. **Discover**: Browse other users and their skills
4. **Send Requests**: Initiate skill swaps with other users
5. **Manage Requests**: Accept, reject, or complete swap requests
6. **Rate & Review**: Provide feedback after completed swaps

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (admin users only)
2. **User Management**: View and manage user accounts
3. **Monitor Swaps**: Track all swap requests and activities
4. **View Statistics**: Monitor platform usage and metrics
5. **Export Data**: Download user and swap data as CSV

## Database Schema

### User Model
- Basic info (name, email, password)
- Profile details (location, availability, isPublic)
- Skills (offered and wanted arrays)
- Admin flags (isAdmin, isBanned)
- Rating system (rating, totalRatings)

### SwapRequest Model
- Users (fromUser, toUser)
- Request details (message, skillsOffered, skillsRequested)
- Status tracking (pending, accepted, rejected, completed, cancelled)
- Timestamps

### Rating Model
- Rating details (fromUser, toUser, swapRequest)
- Rating value (1-5) and feedback
- Timestamps

### AdminLog Model
- Admin actions tracking
- Action types and metadata
- Timestamps

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: express-validator for request validation
- **CORS**: Configured for cross-origin requests
- **Admin Authorization**: Protected admin routes
- **Admin Privacy**: Admin accounts hidden from public discovery

## Styling

The application uses a clean grayscale theme with:
- **Colors**: Black, white, and gray variations
- **Typography**: Clean, readable fonts
- **Layout**: Responsive grid system
- **Components**: Consistent card and button styles
- **No animations or gradients**: Focus on functionality

## Development

### Running in Development Mode
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
npm run dev
```

### Building for Production
```bash
# Frontend
npm run build

# Backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
