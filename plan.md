# Hostel Application Plan

## Implementation Status (2026-09-24)

The backend phase is implemented locally. The full application is **not yet connected end-to-end**: both React frontends still display dummy/mock data. The requirements below remain the target product specification; the checklist here tracks actual progress.

### Architecture and Branches

- `main`: student/admin frontend.
- `master`: standalone owner frontend.
- Both branches have the same shared Express/Mongoose backend in `/server`. Keep backend changes synchronized; do not split admin and user APIs into separate branch-specific services.
- Deploy one shared backend and MongoDB database for both Vercel frontend projects. Backend roles and ownership checks control access.
- The current backend targets a single persistent Node process. Configure both frontend origins in `CLIENT_URL` and point both clients to the same API.
- Setup, endpoint payloads, deployment constraints, and security details are documented in [server/README.md](server/README.md).

### Implemented Backend

- [x] Express REST API with separate configuration, routes, controllers, models, middleware, and services.
- [x] MongoDB/Mongoose persistence and indexes.
- [x] Registration/login, bcrypt password hashing, HTTP-only JWT cookies, database-backed session revocation, logout, and current-user/profile endpoints.
- [x] Server-side STUDENT, OWNER, and ADMIN authorization; public registration cannot create admins.
- [x] Request validation, centralized errors, exact-origin CORS, CSRF protection for writes, and rate limits.
- [x] Public approved-listing search/filtering, owner listing management, and favorites.
- [x] Draft submission and admin approval, rejection, suspension, and restoration; listing/image edits require fresh review.
- [x] Cloudinary upload integration, image limits and file-signature validation, ordering, cover selection, and deletion.
- [x] Persistent private conversations/messages, pagination, unread counts, read receipts, and Socket.IO delivery.
- [x] Admin user listing/suspension and analytics based on stored data.
- [x] Environment examples, demo seed script, admin provisioning command, and setup/API documentation.
- [x] Backend integration tests and a GitHub Actions workflow for both branches.
- [x] Shared client API helper with credentials and required request headers. It currently uses native fetch; the original frontend specification below calls for Axios.

### Verification and Limits

- Four backend integration tests passed against an isolated MongoDB instance, including real Socket.IO delivery and authorization/moderation checks.
- Production builds passed for both existing React frontends; this does not verify frontend/API integration.
- Shared backend and client helper files were verified identical across the two worktrees.
- Successful live Cloudinary uploads still need verification with configured credentials.
- Backend implementation is present in both branch worktrees. A live backend deployment and frontend/API integration remain outstanding; Git publication alone does not complete deployment.

### Next Phase: Replace Dummy Data and Connect Both Frontends

Complete these in order, preserving the existing UI designs:

1. **Authentication foundation on both branches**
   - Add login/registration forms, session context, initial `/api/auth/me` loading, logout, and role-protected routes.
   - Use one shared request layer; reconcile the fetch helper with the planned Axios requirement before wiring screens.
   - Handle expired sessions, validation errors, loading states, and access-denied responses.
2. **Student flow on main**
   - Replace mock listings and filters with API search, pagination, and listing details.
   - Persist favorites and profile changes through the API.
   - Create conversations from approved hostel listings and load real conversation/message history.
3. **Owner flow on master**
   - Load the signed-in owner's actual listings and profile.
   - Connect listing creation/editing, Cloudinary image upload/order/cover/delete controls, and submission/status feedback.
   - Replace dashboard placeholders with actual supported data; add scoped endpoints if needed for owner-specific summaries.
   - Connect incoming conversations and replies.
4. **Admin flow on main**
   - Connect listing review queues and approve/reject/suspend/restore actions.
   - Connect user management and real analytics; enforce role guards in addition to backend checks.
5. **Real-time UI on both branches**
   - Connect authenticated Socket.IO clients to message notifications and read receipts.
   - Reload persistent history on reconnection and mark only displayed messages as read.
   - Show empty states and errors instead of fabricated messages or fallback dummy records.
6. **End-to-end verification and deployment**
   - Verify student registration -> search -> favorite -> chat, owner creation -> upload -> submit -> reply, and admin review -> approval -> user management through the actual UIs.
   - Verify cross-portal data consistency, mobile behavior, session expiry, and forbidden access.
   - Configure MongoDB, Cloudinary, API origins, and secure cookie settings. Prefer frontend/API custom subdomains under one site to avoid third-party-cookie restrictions.
   - Verify live image uploads, then deploy the shared API and configure/rebuild both Vercel frontends.

### Deferred Features

Subscriptions/payments, reports, password reset/email verification, online presence, persistent moderation audit history, and distributed backend operation remain unimplemented. Any existing UI for these features is a placeholder and must not imply live functionality. Multiple backend replicas require shared Socket.IO coordination, shared rate limits, and cross-process session revocation.



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
