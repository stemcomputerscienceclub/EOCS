# Egyptian Olympiad in Computational Science Website

## Overview
Web platform for the Egyptian Olympiad in Computational Science (EOCS), featuring competition management, team registration, and participant tracking.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Prerequisites
- Node.js >= 14.0.0
- MongoDB
- npm or yarn

## Local Development Setup

1. Clone the repository
```bash
git clone [repository-url]
cd eocs-website
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```
Then edit `.env` with your local configuration.

4. Start development server
```bash
npm run dev
```

## Production Deployment (Vercel)

### Pre-deployment Steps

1. Configure Environment Variables in Vercel:
   - Set all variables from `.env.example` in Vercel's project settings
   - Ensure `NODE_ENV` is set to "production"
   - Configure MongoDB connection string
   - Set up email service credentials

2. Database Setup:
   - Create MongoDB Atlas cluster
   - Configure network access and database user
   - Update `MONGODB_URI` in Vercel environment variables

### Deployment Steps

1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

2. Deploy to Vercel
```bash
# Using Vercel CLI
vercel

# Or using Git integration
git push to your connected repository
```

### Post-deployment Verification

1. Check API Health
```
[your-domain]/api/health
```

2. Verify Environment Variables
- Confirm all required environment variables are set
- Test authentication flow
- Verify email service configuration

3. Monitor Logs
- Check Vercel deployment logs
- Monitor MongoDB Atlas metrics
- Set up error tracking (recommended)

## Project Structure

```
├── frontend/           # Static frontend files
│   ├── assets/        # Images and other assets
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   └── pages/        # HTML pages
├── src/               # Backend source code
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Express middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
├── .env.example       # Example environment variables
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies
├── server.js         # Express app entry point
└── vercel.json       # Vercel deployment config
```

## Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster]/eocs
JWT_SECRET=[secure-random-string]
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[email]
EMAIL_PASS=[app-specific-password]
```

## Security Considerations

1. Environment Variables
   - Use strong JWT secret in production
   - Use secure MongoDB connection string
   - Enable MongoDB Atlas network security

2. API Security
   - CORS is configured
   - Helmet.js is implemented
   - Rate limiting is enabled
   - Input validation on all routes

3. Database Security
   - Indexes are properly configured
   - Sensitive data is encrypted
   - Regular backups are enabled

## Maintenance

1. Regular Updates
   - Keep dependencies updated
   - Monitor security advisories
   - Update SSL certificates if custom domain

2. Monitoring
   - Set up uptime monitoring
   - Configure error tracking
   - Monitor database performance

3. Backup
   - Regular database backups
   - Automated backup verification
   - Backup restoration testing

## Git Workflow & Conflict Resolution

### Handling Merge Conflicts

1. Fetch the latest changes
```bash
git fetch origin
```

2. Check your current branch and status
```bash
git branch
git status
```

3. If you're on a feature branch, merge main/master
```bash
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main
```

4. Resolve conflicts:
   - Look for conflict markers (<<<<<<, =======, >>>>>>>)
   - Choose correct changes or combine them
   - Remove conflict markers
   - Save files
   - Test the changes

5. Complete the merge
```bash
git add .
git commit -m "Resolved merge conflicts"
git push origin your-feature-branch
```

### Best Practices

1. Before starting work:
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature
```

2. Regular commits:
```bash
git add .
git commit -m "Clear description of changes"
git push origin feature/your-feature
```

3. Before merging:
   - Pull latest main
   - Resolve any conflicts
   - Test thoroughly
   - Create pull request

4. After merging:
   - Delete feature branch
   - Deploy if needed
   - Verify changes in production

## Support

For issues or questions, please contact the development team or create an issue in the repository.