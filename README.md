# BharatMart E-Commerce

## 1. Project Overview
BharatMart is an Indian e-commerce demonstration application featuring a complete shopping experience. It includes product catalogs, categorized browsing, a shopping cart, wishlists, customer reviews, and secure user authentication.

## 2. Technology Stack
- **Frontend Framework:** React (bootstrapped with Create React App and customized with Craco)
- **Backend Framework:** Python with FastAPI
- **Database:** MongoDB
- **Programming Languages:** JavaScript, Python
- **Package Managers:** Yarn (Frontend), Pip (Backend)
- **Important Libraries:** Uvicorn, Motor (Async MongoDB Driver), Tailwind CSS, Radix UI

## 3. Prerequisites
To run this project on a Windows environment, you must have the following installed:
- **Node.js** (v18 or higher recommended)
- **Yarn** (Install via `npm install -g yarn`)
- **Python** (v3.12 or compatible)
- **MongoDB Community Server** (v8.3.11 compatible)
- **MongoDB Shell / mongosh** (v2.10.0, optional but helpful for database inspection)
- **VS Code** (Recommended IDE)

## 4. Project Structure
```text
E-Commerce_Website/
├── backend/            # Python FastAPI backend server
│   ├── server.py       # Main application entry point and API routes
│   ├── seed_data.py    # Database initial seed data configuration
│   ├── requirements.txt# Python package dependencies
│   └── .env            # Backend environment configuration
├── frontend/           # React frontend application
│   ├── src/            # React source code and components
│   ├── public/         # Static assets and index.html
│   ├── craco.config.js # Craco configuration for Webpack/Tailwind
│   ├── package.json    # Frontend dependencies and yarn scripts
│   └── .env            # Frontend environment configuration
└── README.md           # Project documentation
```

## 5. Installation

### Backend Dependencies
Open a PowerShell terminal and run:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend Dependencies
Open a new PowerShell terminal and run:
```powershell
cd frontend
yarn install
```

## 6. Environment Variables

You need two `.env` files, one in the `frontend` folder and one in the `backend` folder.

**`backend/.env`**
Contains the database connection and security configurations.
```env
MONGO_URL="mongodb://127.0.0.1:27017/"
DB_NAME="test_database"
CORS_ORIGINS="http://localhost:3000"
JWT_SECRET="your_secure_random_string_here"
ADMIN_EMAIL="admin@bharatmart.in"
ADMIN_PASSWORD="admin123"
TEST_USER_EMAIL="test@bharatmart.in"
TEST_USER_PASSWORD="test123"
```

**`frontend/.env`**
Contains the URL used to communicate with the backend.
```env
REACT_APP_BACKEND_URL=http://localhost:8000
ENABLE_HEALTH_CHECK=false
```

*Note: Never commit real production secrets to version control. Use `.env.example` templates if collaborating.*

## 7. Database Setup — MongoDB

The project uses a local MongoDB instance. 
1. Ensure the **MongoDB Service** is running on your Windows machine (you can check Windows Services for "MongoDB").
2. The expected local connection URL is: `mongodb://127.0.0.1:27017/`
3. The database name is: `test_database`

**Do I need to manually create the database or insert seed data?**
No. The FastAPI backend is configured to automatically create the database, collections, and insert all required seed products and test users when the server starts up.

## 8. Backend Setup

1. Open a PowerShell terminal in VS Code.
2. Navigate to the `backend` folder.
3. Activate the virtual environment.
4. Start the Uvicorn server.

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn server:app --reload --port 8000
```
- **Backend/API URL:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs`

## 9. Frontend Setup

1. Open a **second** PowerShell terminal in VS Code.
2. Navigate to the `frontend` folder.
3. Start the React development server.

```powershell
cd frontend
yarn start
```
- **Frontend URL:** `http://localhost:3000`

## 10. Running Frontend + Backend + Database Together

To run the complete application locally:
- **Database:** Ensure the Windows MongoDB service is running in the background.
- **Terminal 1 (Backend):** Run `uvicorn server:app --reload --port 8000` from the `backend` directory.
- **Terminal 2 (Frontend):** Run `yarn start` from the `frontend` directory.

## 11. API Configuration

The frontend communicates with the backend via the `REACT_APP_BACKEND_URL` environment variable defined in `frontend/.env`. The backend permits these requests by checking the `CORS_ORIGINS` environment variable in `backend/.env`. If the frontend port changes (e.g., to 3001), you must update the backend CORS list accordingly.

## 12. Testing the Application

- **Verify MongoDB:** Open PowerShell and type `mongosh "mongodb://127.0.0.1:27017/"` to verify the shell connects successfully.
- **Verify Backend:** Open a browser and navigate to `http://localhost:8000/docs`. You should see the interactive Swagger UI API documentation.
- **Verify Frontend & Connection:** Open `http://localhost:3000`. If you see products displayed on the homepage, it means the frontend successfully fetched data from the backend, which successfully read from MongoDB.

## 13. Common Errors and Solutions

- **`Activate.ps1 cannot be loaded because running scripts is disabled on this system.`**
  - **Solution:** Open PowerShell as Administrator and run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **MongoDB Connection Refused / Timeout**
  - **Solution:** Ensure the MongoDB Windows service is running. If `localhost` fails to resolve properly on Windows, make sure `MONGO_URL` in `backend/.env` is strictly set to `mongodb://127.0.0.1:27017/`.
- **`yarn : The term 'yarn' is not recognized`**
  - **Solution:** Install Yarn globally via npm by running `npm install -g yarn`.
- **Port already in use (3000 or 8000)**
  - **Solution:** Another process is running. Identify and close the terminal using the port, or restart VS Code.

## 14. How to Stop the Application

To stop either the frontend or backend server, click inside the respective terminal window and press **`Ctrl + C`**. If prompted to "Terminate batch job (Y/N)?", type `Y` and press Enter.

## 15. How to Restart the Application

1. Press `Ctrl + C` to stop the currently running server.
2. Press the `Up Arrow` on your keyboard to recall the start command (`yarn start` or `uvicorn...`).
3. Press `Enter`.

## 16. Production / Deployment Preparation

Before deploying this application to a live server:
- **Environment Variables:** Change local URLs to actual production domain names. Generate strong, unique `JWT_SECRET` and admin passwords.
- **Backend:** Do not use `--reload`. Use a production ASGI server setup, such as `gunicorn -k uvicorn.workers.UvicornWorker server:app`.
- **Frontend:** Run `yarn build` to generate static, optimized HTML/CSS/JS bundles for hosting on platforms like Vercel, Netlify, or Nginx.
- **Database:** Provision a secure, authenticated MongoDB Atlas or managed cluster and update the `MONGO_URL`.

## 17. Quick Start

For experienced developers:

```powershell
# 1. Start Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# 2. Start Frontend (New Terminal)
cd frontend
yarn install
yarn start
```
