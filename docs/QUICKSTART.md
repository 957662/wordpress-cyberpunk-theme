# 🚀 CyberPress Platform - Quick Start Guide

This guide will help you get up and running with CyberPress Platform in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.17
- **Python** >= 3.11
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform
```

### 2. Run Setup Script

We've provided a convenient setup script that handles all configurations:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:
- Check all prerequisites
- Install frontend dependencies
- Set up Python virtual environment
- Install backend dependencies
- Create necessary configuration files

### 3. Start Development Servers

#### Option A: Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option B: Manual Startup

**Backend (Terminal 1):**

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Frontend (Terminal 2):**

```bash
cd frontend
npm run dev
```

### 4. Access the Application

Once the servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Admin Panel**: http://localhost:3000/admin

## Initial Setup

### Create Admin User

1. Navigate to http://localhost:3000/register
2. Create your admin account
3. Or use the default credentials (if created during setup):
   - Username: `admin`
   - Password: `admin123` (⚠️ Change this immediately!)

### Configure WordPress (if using)

If you're using WordPress as the CMS backend:

1. Access WordPress at http://localhost:8080/wp-admin
2. Login with credentials from `docker-compose.yml`
3. Install and activate REST API plugin
4. Update frontend `.env.local` with WordPress URL

## Project Structure

```
cyberpress-platform/
├── frontend/               # Next.js frontend application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and services
│   └── styles/            # Global styles
│
├── backend/               # FastAPI backend application
│   ├── app/               # Application code
│   │   ├── api/          # API routes
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── alembic/          # Database migrations
│   └── tests/            # Test files
│
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── docker-compose.yml    # Docker configuration
```

## Common Tasks

### Running Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
pytest
```

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
# Build Docker image
docker build -t cyberpress-backend .

# Or run directly
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Configuration

### Environment Variables

**Frontend (`.env.local`):**
```bash
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend (`.env`):**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/cyberpress
SECRET_KEY=your-secret-key
DEBUG=true
```

## Troubleshooting

### Port Already in Use

If ports 3000, 8000, or 8080 are already in use:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

Ensure PostgreSQL is running:

```bash
docker ps | grep postgres
```

Or if running locally:

```bash
sudo service postgresql status
sudo service postgresql start
```

### Frontend Build Errors

Clear the cache and rebuild:

```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. **Explore Components**: Check out the available UI components in `frontend/components/`
2. **Customize Theme**: Modify the color scheme in `frontend/tailwind.config.ts`
3. **Add Features**: Extend the functionality by adding new API routes and pages
4. **Deploy**: Follow the deployment guide in `/docs/DEPLOYMENT.md`

## Resources

- **Documentation**: `/docs`
- **API Docs**: http://localhost:8000/api/docs
- **Component Gallery**: http://localhost:3000/components-demo
- **Examples**: http://localhost:3000/examples

## Support

- **Issues**: https://github.com/your-username/cyberpress-platform/issues
- **Discussions**: https://github.com/your-username/cyberpress-platform/discussions
- **Email**: support@cyberpress.dev

---

**Happy coding! 🚀**
