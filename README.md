# Egyptian Olympiad in Computational Science (EOCS)

A full-stack website for managing the Egyptian Olympiad in Computational Science competition, featuring user authentication, team management, and competition rounds.

## Features

- **User Authentication System**
  - Email/password registration and login
  - JWT-based authentication
  - Email verification
  - Password reset functionality

- **Team Management**
  - Create and join teams
  - Team leader functionality
  - Auto-matching system for individual applicants
  - Team size limits and category restrictions

- **Competition System**
  - Multiple competition rounds
  - Online qualification exams
  - Team-based national competition
  - Finals with live problem-solving
  - Automated and expert grading

- **Modern UI/UX**
  - Egyptian heritage-inspired design
  - Responsive layout
  - Interactive animations
  - Dark mode
  - Parallax scrolling effects

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Responsive Design
- Modern Animations

## Getting Started

### Prerequisites
- Node.js (>= 14.0.0)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/eocs-website.git
cd eocs-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eocs
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
eocs-website/
├── frontend/                # Frontend static files
│   ├── assets/             # Images, fonts, etc.
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
├── src/                    # Backend source code
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
├── README.md              # Project documentation
└── server.js              # Application entry point
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/verify/:token` - Verify email
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password/:token` - Reset password

### Teams
- POST `/api/teams/create` - Create new team
- POST `/api/teams/join` - Join existing team
- POST `/api/teams/leave` - Leave current team
- GET `/api/teams/details` - Get team details
- PUT `/api/teams/update` - Update team information

### Competition
- GET `/api/competition/current` - Get current competition
- GET `/api/competition/rounds/:roundNumber/questions` - Get round questions
- POST `/api/competition/rounds/:roundNumber/submit` - Submit solution
- GET `/api/competition/statistics` - Get competition statistics
- GET `/api/competition/leaderboard/:roundNumber` - Get round leaderboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Egyptian Ministry of Communications
- Electronics Research Institute (ERI)
- All participating schools and universities