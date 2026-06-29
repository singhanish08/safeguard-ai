# SafeGuard AI — AI-Powered Safety Incident Management System

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Industrial Safety, Reimagined with AI** — A production-grade MERN stack application for managing workplace safety incidents with AI-powered analysis, real-time tracking, and comprehensive reporting.

---

## Features

- **AI-Powered Analysis** — Gemini AI automatically analyzes every incident for severity, root causes, and preventive measures
- **Role-Based Access** — Three-tier access (Employee, Manager, Admin) with dedicated dashboards and permissions
- **Real-Time Tracking** — Full incident lifecycle tracking from report to resolution with status history
- **Image Evidence Upload** — Upload and store incident photos via Cloudinary
- **Analytics Dashboard** — Interactive charts for safety trends, department performance, and risk analysis
- **PDF Reports** — Generate monthly safety reports, department analyses, and high-risk incident reports
- **Notification System** — Automatic notifications on status changes, new incidents, and manager remarks
- **Mobile Responsive** — Fully responsive design that works on desktop and mobile devices

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with httpOnly cookies
- **AI:** Google Gemini AI (`gemini-1.5-flash`)
- **File Storage:** Cloudinary
- **Validation:** express-validator
- **File Upload:** Multer

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS 4
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@safeguard.com | demo1234 |
| Manager | manager@safeguard.com | demo1234 |
| Admin | admin@safeguard.com | demo1234 |

## Screenshots

> *Screenshots coming soon*

## Project Structure

```
safeguard-ai/
├── backend/
│   ├── config/          # Database and Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, role, error, upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Gemini AI and Cloudinary services
│   ├── validators/      # Request validation
│   ├── utils/           # Utility classes and seed data
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # API client modules
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   ├── App.jsx          # Root app with routing
│   └── main.jsx         # Entry point
├── .gitignore
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd safeguard-ai
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/safeguard-ai
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Install dependencies and seed data:

```bash
npm install
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start:

```bash
npm install
npm run dev
```

### 4. Open the App

Visit [http://localhost:5173](http://localhost:5173) and log in with the demo credentials.

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incidents` | Create incident (employee) |
| GET | `/api/incidents` | List all incidents (manager/admin) |
| GET | `/api/incidents/my` | My incidents (employee) |
| GET | `/api/incidents/:id` | Get incident by ID |
| PUT | `/api/incidents/:id/status` | Update status |
| PUT | `/api/incidents/:id/remarks` | Update manager remarks |
| PUT | `/api/incidents/:id/assign` | Assign incident |
| DELETE | `/api/incidents/:id` | Delete incident (admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (admin) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user (admin) |
| PUT | `/api/users/:id/toggle-status` | Toggle user active status |
| PUT | `/api/users/profile` | Update own profile |

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List departments |
| POST | `/api/departments` | Create department (admin) |
| PUT | `/api/departments/:id` | Update department (admin) |
| DELETE | `/api/departments/:id` | Delete department (admin) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/employee` | Employee dashboard stats |
| GET | `/api/dashboard/manager` | Manager dashboard stats |
| GET | `/api/dashboard/admin` | Admin dashboard stats |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/monthly` | Monthly incident report |
| GET | `/api/reports/department` | Department-wise report |
| GET | `/api/reports/high-risk` | High-risk incidents report |

## Deployment

### Backend (Vercel)
```bash
cd backend
vercel --prod
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Set environment variables in your Vercel dashboard.

## License

MIT

## Author

Built as an enterprise-grade MERN stack demonstration.
