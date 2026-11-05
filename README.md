# Hostel Complaint Management System (MERN Stack)

A simple, functional, and beginner-friendly **Hostel Complaint Management System** built using **MongoDB, Express.js, React.js (Vite), and Node.js**.

Designed with a clean UI featuring a white background and blue accents, sidebar navigation, status badges, and role-based permissions.

---

## 🚀 Key Features

### 🎓 Student Features
- **Register & Login**: Simple authentication with JWT and hashed passwords.
- **Student Dashboard**: Displays live counts for **Total Complaints**, **Pending**, **In Progress**, and **Resolved**, plus a list of recent submissions.
- **Submit Complaint**: Form with department category selection (`Electricity`, `Water`, `Cleaning`, `Wi-Fi`, `Other`), title, room number, and detailed description.
- **My Complaints Page**: Filterable view (All / Pending / In Progress / Resolved) of all submitted grievances.
- **Conditional Deletion**: Students can **only delete complaints while status is "Pending"**. Once marked "In Progress" or "Resolved", deletion is protected.

### 🛡️ Admin / Hostel Warden Features
- **Admin Dashboard**: Overview of all complaints, department-wise distribution, and real-time statistics.
- **Manage Complaints Page**:
  - Filter by category and status.
  - Search by student name, email, or complaint title.
  - Inspect student details (name, email, room number, date, description).
  - Update complaint status directly (`Pending` ➔ `In Progress` ➔ `Resolved`).
  - Delete inappropriate or invalid complaints.
- **Route Protection**: Students cannot access admin endpoints or view other students' complaints.

---

## 📁 Project Structure

```text
hostel_complain_managment/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   └── complaintController.js# CRUD operations & status updates
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & Admin authorization
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   └── Complaint.js          # Complaint schema (category, status, etc.)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── complaintRoutes.js    # /api/complaints routes
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example environment template
│   ├── package.json              # Backend dependencies & scripts
│   ├── seed.js                   # Database seeder with sample accounts
│   ├── server.js                 # Express server entry point
│   └── test_api.js               # Automated test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx        # Sidebar + Navbar shell layout
│   │   │   ├── Navbar.jsx        # Top header with user profile & logout
│   │   │   ├── ProtectedRoute.jsx# Auth & role-based route guard
│   │   │   ├── Sidebar.jsx       # Navigation drawer with icons
│   │   │   └── StatusBadge.jsx   # Color-coded badge (Pending/Progress/Resolved)
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # User auth state provider & useAuth hook
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx       # Warden overview & category stats
│   │   │   ├── LoginPage.jsx            # Sign in with 1-click demo buttons
│   │   │   ├── ManageComplaintsPage.jsx # Admin management, filters & status update
│   │   │   ├── MyComplaintsPage.jsx     # Student complaints history
│   │   │   ├── RegisterPage.jsx         # Student registration form
│   │   │   ├── StudentDashboard.jsx     # Student stats & recent complaints
│   │   │   └── SubmitComplaintPage.jsx  # Lodge complaint form
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Routes setup
│   │   ├── index.css             # Clean modern stylesheet
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** installed and running locally on port `27017` (or MongoDB Atlas connection URI)

---

### 2. Backend Setup

1. Open your terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in `backend/` (or use the provided `.env`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hostel_complaint_db
   JWT_SECRET=supersecret_hostel_jwt_key_2026
   ```

4. Seed Sample Data (Optional but recommended):
   Populate initial student, admin, and demo complaints:
   ```bash
   npm run seed
   ```

5. Start the Backend Server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   The backend will be running at: **`http://localhost:5000`**

---

### 3. Frontend Setup

1. Open a new terminal window and navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
   The frontend will be running at: **`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

The project includes pre-configured demo credentials with one-click autofill buttons on the login page:

| Role | Email | Password |
|---|---|---|
| **Hostel Warden (Admin)** | `admin@hostel.com` | `admin123` |
| **Student (Rahul)** | `rahul@hostel.com` | `student123` |
| **Student (Priya)** | `priya@hostel.com` | `student123` |

You can also click **"Register as Student"** on the login page to create your own student account.

---

## 📡 Backend API Reference

### Authentication Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new student |
| `POST` | `/api/auth/login` | Public | Log in user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |

### Complaint Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/complaints` | Student | Submit a new complaint |
| `GET` | `/api/complaints/my` | Student | Get all complaints submitted by the logged-in student |
| `GET` | `/api/complaints` | Admin | Get all hostel complaints (with student info) |
| `GET` | `/api/complaints/:id` | Owner / Admin | Get specific complaint details |
| `PATCH` | `/api/complaints/:id/status` | Admin | Update status (`Pending`, `In Progress`, `Resolved`) |
| `DELETE` | `/api/complaints/:id` | Student (Pending only) / Admin | Delete a complaint |

---

## 🧪 Testing the APIs

You can run the built-in automated test suite at any time from the `backend/` folder:
```bash
node test_api.js
```
This tests all 11 scenarios including registration, login, complaint submission, status transitions, role permission guards, and the rule restricting student deletion to pending complaints only.
