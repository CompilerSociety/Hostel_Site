# HostelHub

HostelHub is a full-stack hostel discovery and management platform built with the MERN stack. Students can search, filter, save, and message hostel owners. Owners can publish and manage listings, while administrators review listings, manage users, and monitor platform analytics.

## Core user experiences

### Student

Register or log in → search and filter hostels → view details → save favorites → chat with owners.

### Owner

Register or log in → create a hostel listing → upload and organize images → submit for review → receive approval → receive and reply to messages.

### Admin

Log in → review listings → approve, reject, or suspend hostels → manage users and hostels → view analytics.

## Technology

### Frontend

- React with Vite
- JavaScript or TypeScript
- React Router
- Tailwind CSS
- Axios
- Context API or another lightweight state manager

### Backend

- Node.js
- Express.js
- REST API
- MongoDB with Mongoose
- JWT authentication with HTTP-only cookies
- Secure password hashing
- Role-based authorization
- Socket.IO for real-time chat
- Cloudinary or another configurable cloud image provider

The frontend and backend are separate applications in `/client` and `/server`.

## Project structure

```text
.
├── client/                    # React/Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Authentication and application state
│   │   ├── layouts/           # Student, owner, and admin layouts
│   │   ├── pages/             # Route-level pages
│   │   ├── services/          # Axios clients and API services
│   │   └── App.*
│   └── package.json
├── server/                    # Express/MongoDB backend
│   ├── src/
│   │   ├── config/            # Database and service configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Authentication, roles, errors, uploads
│   │   ├── models/            # Mongoose models
│   │   ├── routes/             # REST route definitions
│   │   ├── services/          # Business logic and integrations
│   │   ├── sockets/            # Socket.IO events and rooms
│   │   ├── seed/               # Demo data and seed scripts
│   │   └── app.*
│   └── package.json
├── .env.example
├── plan.md
└── readme.md
```

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A MongoDB database, local or hosted through MongoDB Atlas
- A Cloudinary account, or credentials for another supported image provider

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone <repository-url>
cd Hostel

cd server
npm install

cd ../client
npm install
```

## Environment configuration

Create `server/.env` from the server example and `client/.env` from the client example.

### `server/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hostelhub
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files or hard-code secrets. Use `.env.example` as the shareable template.

## MongoDB setup

1. Start a local MongoDB server, or create a MongoDB Atlas cluster.
2. Create a database named `hostelhub` or use another database name in `MONGODB_URI`.
3. If using Atlas, allow the development IP address and create a database user.
4. Put the complete connection string in `server/.env`.

## Cloudinary setup

1. Create or sign in to a Cloudinary account.
2. Find the cloud name, API key, and API secret in the dashboard.
3. Add them to `server/.env`.
4. Configure upload validation in the server so file type, size, and maximum image count are enforced.

Images are stored in Cloudinary. MongoDB stores only the image URLs and their metadata, including order and cover-image selection.

## Running the application

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The default development URLs are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api`

For production, build the client and start the server using the scripts defined in each package's `package.json`.

## Demo data and accounts

After configuring the server environment, run:

```bash
cd server
npm run seed
```

The seed command should create demo users, approved and pending hostel listings, favorites, conversations, and messages.

Recommended demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@example.com` | `Password123!` |
| Owner | `owner@example.com` | `Password123!` |
| Admin | `admin@example.com` | `Password123!` |

Change demo credentials before deploying to a shared or production environment.

## Authentication and authorization

The API authenticates users with JWTs stored in HTTP-only cookies. Passwords are hashed before storage. Protected backend routes verify both authentication and role permissions.

Supported roles:

- `STUDENT`
- `OWNER`
- `ADMIN`

Frontend route guards improve the user experience, but backend middleware is the source of truth for access control.

## REST API architecture

The backend separates routes, controllers, services, models, and middleware.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Hostels

```text
GET    /api/hostels
GET    /api/hostels/:id
POST   /api/hostels
PUT    /api/hostels/:id
DELETE /api/hostels/:id
POST   /api/hostels/:id/favorite
DELETE /api/hostels/:id/favorite
```

### Conversations and messages

```text
GET  /api/conversations
POST /api/conversations
GET  /api/conversations/:id/messages
POST /api/conversations/:id/messages
```

### Administration

```text
GET   /api/admin/hostels
PATCH /api/admin/hostels/:id/approve
PATCH /api/admin/hostels/:id/reject
PATCH /api/admin/hostels/:id/suspend
GET   /api/admin/users
GET   /api/admin/analytics
```

All API responses should use consistent JSON structures and centralized error handling. Validation is required on both incoming request data and frontend forms.

## Real-time chat

Socket.IO provides live communication between students and owners. The server persists every message in MongoDB and uses Socket.IO for delivery, read-status updates, unread counts, notifications, and optional online presence.

The client should load conversation history from the REST API, then join the appropriate Socket.IO conversation room for live updates.

## Frontend routes

```text
/                       Landing page
/hostels                Search hostels
/hostels/:id            Hostel details
/favorites              Student favorites
/messages               Student messages
/profile                Student profile

/owner                  Owner dashboard
/owner/hostel           Manage hostel
/owner/messages         Owner messages
/owner/subscription     Subscription
/owner/profile          Owner profile

/admin                  Admin dashboard
/admin/hostels          Manage hostels
/admin/users            Manage users
/admin/reports          Reports
/admin/subscriptions    Subscriptions
/admin/analytics        Analytics
```

## UI standards

The interface should remain minimalist and mobile-responsive, with reusable Tailwind components, consistent spacing, clear typography, clean cards and forms, subtle animations, loading skeletons, empty states, error states, and toast notifications.

## Quality checklist

- Frontend and backend run as separate applications.
- MongoDB is used for persistent data.
- Secrets are loaded through environment variables.
- Passwords are securely hashed.
- JWTs use HTTP-only cookies.
- Backend routes enforce roles.
- Hostel image files are stored outside MongoDB.
- File type, size, and image-count limits are validated.
- Chat messages persist in MongoDB and update in real time.
- Forms include validation and useful error states.
- Student, owner, and admin core flows work end-to-end.
- Mobile layouts are tested.

## License

Add the project's chosen license here before public distribution.
