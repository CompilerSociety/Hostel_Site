# Hostel Application Plan

## Important Tech Stack Requirement

Build this application using the MERN stack.

### Frontend

- React
- Vite
- JavaScript or TypeScript
- Tailwind CSS
- React Router
- Axios
- Context API or an appropriate lightweight state-management solution

React is the frontend framework. Do not use Next.js or build the frontend as a server-rendered Next.js application.

### Backend

- Node.js
- Express.js
- REST API architecture
- MongoDB
- Mongoose

The backend and frontend must be separate applications, with the recommended structure:

```text
/client
/server
```

### Authentication

Implement authentication using JWT, HTTP-only cookies, secure password hashing, and role-based authorization.

Roles:

- STUDENT
- OWNER
- ADMIN

The backend must verify user roles on protected API routes. Never rely only on frontend route protection for security.

### API

Create clean REST API endpoints, including:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/hostels
GET    /api/hostels/:id
POST   /api/hostels
PUT    /api/hostels/:id
DELETE /api/hostels/:id

POST   /api/hostels/:id/favorite
DELETE /api/hostels/:id/favorite

GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages

GET    /api/admin/hostels
PATCH  /api/admin/hostels/:id/approve
PATCH  /api/admin/hostels/:id/reject
PATCH  /api/admin/hostels/:id/suspend

GET    /api/admin/users
GET    /api/admin/analytics
```

Keep controllers, routes, models, middleware, and services separated.

### Real-Time Chat

Use Socket.IO for real-time messaging between students and hostel owners. Support real-time messages, conversation lists, unread counts, timestamps, read status, online status where practical, and notifications.

Store messages in MongoDB. Use Socket.IO only for real-time communication; MongoDB remains the persistent database.

### Image Uploads

Use Cloudinary or another configurable cloud image-storage provider. Do not store large image files directly inside MongoDB.

Hostel owners must be able to upload multiple images, select a cover image, delete images, and reorder images. Validate file type, file size, and image count.

### Frontend Routing

Use React Router with role-protected routes:

```text
/                       → Landing page
/hostels                → Search hostels
/hostels/:id            → Hostel details
/favorites              → Student favorites
/messages               → Student messages
/profile                → Student profile

/owner                  → Owner dashboard
/owner/hostel           → Manage hostel
/owner/messages         → Owner messages
/owner/subscription     → Subscription
/owner/profile          → Owner profile

/admin                  → Admin dashboard
/admin/hostels          → Manage hostels
/admin/users            → Manage users
/admin/reports          → Reports
/admin/subscriptions    → Subscriptions
/admin/analytics        → Analytics
```

### React UI Requirements

The UI must be minimalist, modern, responsive, and commercial-quality. Use Tailwind CSS, reusable components, responsive layouts, clean cards and forms, simple navigation, consistent spacing, good typography, subtle animations, loading skeletons, empty states, error states, and toast notifications. Mobile responsiveness is mandatory.

### Environment Variables

Use environment variables for all secrets and provide a `.env.example` file.

```text
VITE_API_URL=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
```

Never hard-code secrets.

### Development Requirements

Create `/client` and `/server`, and provide `README.md` explaining:

1. Installing dependencies
2. Configuring MongoDB
3. Configuring Cloudinary
4. Configuring environment variables
5. Starting the backend
6. Starting the React frontend
7. Seeding demo data
8. Demo accounts
9. API architecture
10. Project structure

Add proper error handling, backend validation, frontend form validation, loading states, and error states. The complete application must work end-to-end. Do not create only static frontend pages; connect the React frontend to the Express API and MongoDB.

### Most Important User Flows

Build these three fully functional experiences before adding secondary features:

#### Student

Register/login → Search → Filter → View hostel → Save → Chat

#### Owner

Register/login → Create hostel → Upload images → Submit → Get approved → Receive messages → Reply

#### Admin

Login → Review listings → Approve/reject → Manage users → Manage hostels → View analytics
