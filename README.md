# JobTrack — Job Application Tracker

A full-stack MERN application designed to help job seekers organize applications, track recruitment progress, and manage their job search through a centralized dashboard.

## Overview

JobTrack provides a structured way to manage job applications throughout the recruitment lifecycle. Users can securely create an account, maintain their own application records, update application statuses, and monitor their progress using dashboard statistics, search, filters, and sorting.

The project emphasizes practical full-stack development, REST API design, authentication, database modeling, and frontend–backend integration.

## Key Features

### Authentication and Security
- User registration and login.
- Password hashing using `bcryptjs`.
- JWT-based authentication with token expiration.
- Protected application-management endpoints.
- User-specific data access to prevent users from accessing other users' application records.

### Job Application Management
- Create, view, update, and delete job applications.
- Track application statuses: Applied, Interview, Offer, Rejected, and Withdrawn.
- Store company name, job title, employment type, location, application URL, application date, salary, and notes.
- Associate each application with its owning user.

### Dashboard and Productivity
- Dashboard statistics for total applications and individual application statuses.
- Search applications by company, position, or location.
- Filter by application status and job type.
- Sort applications by newest, oldest, or company name.
- Edit existing application details through the dashboard.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Integration | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| Development Tools | Git, GitHub, npm |

## Architecture

JobTrack follows a separated frontend–backend architecture.

- **Client:** Handles the user interface, navigation, forms, dashboard rendering, and API integration.
- **Server:** Exposes REST APIs, processes requests, validates input, handles authentication, and enforces application ownership.
- **Database:** Stores user and job application documents using MongoDB and Mongoose.
- **Authentication Middleware:** Verifies JWTs before allowing access to protected application routes.
- **API Services:** Centralize frontend requests and attach authentication tokens through an Axios request interceptor.

### Project Structure

```text
jobtrack/
├── client/
│   └── src/
│       ├── api/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
|_ .gitignore
```

## API Overview

All application-management endpoints require a valid JWT access token in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check API availability |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/applications` | Retrieve applications with search, filters, and sorting |
| `POST` | `/api/applications` | Create an application |
| `GET` | `/api/applications/stats` | Retrieve dashboard statistics |
| `GET` | `/api/applications/:id` | Retrieve a specific application |
| `PUT` | `/api/applications/:id` | Update an application |
| `DELETE` | `/api/applications/:id` | Delete an application |

## Getting Started

### Prerequisites

Install the following before running JobTrack:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Yogeshwar2601/jobTracker
cd jobTracker
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd server
npm install
```

The backend dependencies include:

| Package | Purpose |
|---|---|
| `express` | HTTP server and REST API |
| `mongoose` | MongoDB object modeling |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable configuration |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `nodemon` | Automatically restarts the server during development |

These packages are installed automatically through `npm install`, based on the backend's `package.json`.

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```dotenv
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholders with your actual MongoDB connection string and a strong JWT secret. Keep this file private and never commit it to GitHub.

### 4. Start the Backend

From the `server` directory, run:

```bash
npm run dev
```

The API should start at `http://localhost:5000`.

To verify it is running, open:

```text
http://localhost:5000/api/health
```

### 5. Install Frontend Dependencies

Open a **second terminal** from the project root:

```bash
cd client
npm install
```

The frontend dependencies include:

| Package | Purpose |
|---|---|
| `react` | UI components |
| `react-dom` | Renders React in the browser |
| `react-router-dom` | Client-side routing and protected pages |
| `axios` | HTTP requests to the backend |
| `tailwindcss` | Utility-first CSS styling |
| `@tailwindcss/vite` | Tailwind CSS integration with Vite |
| `vite` | Development server and production build |
| `@vitejs/plugin-react` | React support for Vite |

These packages are installed automatically from the frontend's `package.json`.

### 6. Configure the Frontend

Create a `.env` file inside the `client` directory:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where the backend API is running. Restart the Vite development server after changing environment variables.

### 7. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

Keep both the backend and frontend terminals running while using the application.

### 8. Build for Production

To verify and build the frontend for production, run this from the `client` directory:

```bash
npm run build
```

The optimized output is generated in `client/dist/`.

### Troubleshooting

- **MongoDB connection error:** Verify `MONGO_URI`, your database credentials, and MongoDB Atlas network access.
- **Frontend cannot reach the API:** Check that the backend is running and `VITE_API_URL` points to the correct address.
- **Missing package errors:** Run `npm install` in the affected `client` or `server` directory.
- **Authentication errors:** Check that `JWT_SECRET` is configured and that you are logged in with a valid token.


## AI-Assisted Development

**AI Tool: Code0 (CodeZero)**

Code0 is a coding-agent interface that can connect a development environment to a supported coding CLI. In an AI-assisted workflow, it can support repository analysis, implementation planning, code generation, debugging, and code review.

For a project like JobTrack, practical Code0-assisted tasks include:

1. **Codebase Analysis and Planning:** Understand the existing project structure, identify dependencies, and plan changes before implementation.
2. **Backend Development:** Assist with Express routes, controller logic, Mongoose models, request validation, and REST API implementation.
3. **Authentication and Authorization:** Review JWT handling, password hashing, protected routes, and user-level access controls.
4. **Frontend–Backend Integration:** Assist with Axios services, token interceptors, protected navigation, and API error handling.
5. **Debugging and Quality Checks:** Investigate errors, propose targeted fixes, review code changes, and run available build or test commands.

### AI Development Practices

A disciplined AI-assisted development workflow should follow these principles:

- **Context before code:** Analyze the relevant files and existing conventions before proposing changes.
- **Plan before implementation:** Define expected behavior, affected files, and edge cases.
- **Small, focused changes:** Implement features incrementally instead of rewriting unrelated parts of the application.
- **Human review:** Review generated code for correctness, readability, security, and maintainability.
- **Verification:** Test important user flows and run relevant build or test commands before accepting changes.
- **Version control:** Use descriptive Git commits to keep changes reviewable and make regressions easier to investigate.

AI should accelerate development while the developer remains responsible for understanding, reviewing, testing, and maintaining the resulting code.

> **Tool attribution:** The Code0 capabilities and workflow above describe how the tool can be applied to this project. Only report specific tasks as completed using Code0 if you actually performed or verified them with Code0. Attribute work completed with other tools accurately.

## Engineering Highlights

- Separation of frontend and backend responsibilities.
- RESTful API design with dedicated routes, controllers, models, and middleware.
- JWT-protected endpoints and password hashing.
- User-scoped database queries for application ownership.
- Reusable frontend API services and centralized token attachment.
- Dashboard data retrieval, search, filtering, sorting, and statistics.
- Environment-based configuration to separate secrets from source code.

## Future Enhancements

- Pagination for large application lists.
- Interview scheduling and application reminders.
- Resume and document attachments using cloud storage.
- Automated API tests and continuous integration.
- Deployment with a hosted frontend and backend.

## Author

**Yogeshwar**

GitHub: [Yogeshwar2601](https://github.com/Yogeshwar2601)

Project Repository: [JobTrack](https://github.com/Yogeshwar2601/jobTracker)

