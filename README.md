# BharatMart

A full-stack Indian e-commerce application featuring a complete shopping experience, from browsing product catalogs to secure checkout and order management.

## Features

- User registration and secure login
- JWT authentication
- Product browsing and categorized views
- Shopping cart functionality
- Wishlist management
- Secure checkout and order management
- Product reviews and ratings
- Administrative functionality

## Technology Stack

**Frontend:**
- React (bootstrapped with Create React App)
- CRACO for Webpack customization
- Axios for API requests
- Tailwind CSS and Radix UI for styling

**Backend:**
- Python with FastAPI
- Uvicorn (ASGI server)
- Motor (Async MongoDB Driver)

**Database:**
- MongoDB (Atlas for production, Community Server for local development)

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

- frontend/: React frontend application source code and configuration.
- ackend/: FastAPI backend server, including routes, models, and dependencies.
- tests/: Project testing suite.

## Local Development

### 1. Clone repository
`ash
git clone https://github.com/priyanshuranjan-1104/BharatMart.git
cd E-Commerce_Website
`

### 2. Configure environment variables
Create .env files in both the frontend and backend directories using the provided .env.example templates.

### 3. Install backend dependencies
`powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
`

### 4. Install frontend dependencies
Open a new terminal:
`powershell
cd frontend
yarn install
`

### 5. Start backend
`powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn server:app --reload --port 8000
`

### 6. Start frontend
`powershell
cd frontend
yarn start
`

## Environment Variables

### Backend (ackend/.env)
Contains database connections, CORS settings, and security credentials (e.g., MONGO_URL, CORS_ORIGINS, JWT_SECRET).

### Frontend (frontend/.env)
Configures the API connection (e.g., REACT_APP_BACKEND_URL).

## Production Deployment

- **Vercel** hosts the React frontend.
- **Render** hosts the FastAPI backend.
- **MongoDB Atlas** serves as the production database.

Production secrets must be securely configured through the respective hosting provider's environment variable settings.

## Authentication

The frontend handles authentication by retrieving a JWT from the backend during login and persisting it locally. All subsequent API requests send this token via the Authorization: Bearer <token> header, ensuring reliable cross-origin authentication.

## Demo Credentials

- **Admin credentials:** Configured securely through environment variables.
- **Test account:** Automatically provisioned if using the local seed script.
