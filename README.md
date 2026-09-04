# Custom Employee Portal with Zoho One Integration

A secure role-based employee portal built with React, Node.js, Express, PostgreSQL, Prisma, JWT authentication, and Zoho One service integrations.

## Live Demo

- Frontend: https://custom-employee-portal-seven.vercel.app
- Backend API: https://custom-employee-portal-i2xu.onrender.com

## Features

- Custom employee authentication
- JWT-based authentication
- bcrypt password hashing
- Role-Based Access Control (RBAC)
- Admin user management
- Role and permission management
- Audit logging
- Server-side permission validation
- Zoho OAuth 2.0 refresh-token authentication
- Backend-managed Zoho API access
- PostgreSQL database with Prisma ORM
- React + Vite frontend
- Express.js backend
- HTTPS deployment

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- Axios
- Prisma ORM

### Database
- PostgreSQL
- Prisma

### External Services
- Zoho People
- Zoho CRM
- Zoho Desk
- Zoho Books

### Deployment
- Vercel - Frontend
- Render - Backend
- Render PostgreSQL - Database

## Architecture

```text
React Frontend (Vercel)
          |
          | JWT Bearer Token
          v
Express Backend (Render)
          |
    +-----+------+----------------+
    |            |                |
Authentication  RBAC        Audit Logging
    |            |                |
    +------------+----------------+
                 |
                 v
        PostgreSQL + Prisma
                 |
                 v
          Zoho OAuth 2.0
                 |
       +---------+---------+---------+
       |         |         |         |
       v         v         v         v
   People      CRM       Desk      Books
```

## Role-Based Access Control

| Role | Zoho People | Zoho CRM | Zoho Desk | Zoho Books |
|------|-------------|----------|-----------|------------|
| Admin | Yes | Yes | Yes | Yes |
| HR | Yes | No | No | No |
| Sales | No | Yes | No | No |
| Support | No | No | Yes | No |
| Finance | No | No | No | Yes |

The frontend displays services according to the user's role, while the backend independently validates permissions on every protected API request.

## Permissions

```text
PEOPLE_ACCESS
CRM_ACCESS
DESK_ACCESS
BOOKS_ACCESS
USER_MANAGE
ROLE_MANAGE
AUDIT_VIEW
```

Database relationship:

```text
User -> UserRole -> Role -> RolePermission -> Permission
User -> AuditLog
```

## Authentication

The application uses JWT-based authentication.

Login flow:

```text
User
  |
  v
POST /api/auth/login
  |
  v
Validate credentials
  |
  +--> bcrypt password verification
  |
  +--> active user check
  |
  +--> load roles
  |
  v
JWT token
  |
  v
Frontend
```

Protected requests use:

```text
Authorization: Bearer <JWT>
```

JWT expiration is configured to one hour.

## Authorization

Protected requests follow this flow:

```text
Request
  |
  v
JWT Authentication
  |
  v
User lookup
  |
  v
Role lookup
  |
  v
Permission lookup
  |
  +--> Permission exists -> Continue
  |
  +--> Permission missing -> 403 Access Denied
```

This means users cannot bypass the frontend and directly call unauthorized backend APIs.

## Admin Console

Administrators can:

- View users
- Create users
- Activate/deactivate users
- View roles
- View audit logs

Audit logs include:

- User
- Action
- Resource
- IP address
- Timestamp

## Audit Logging

Service access is recorded through audit middleware.

Example:

```text
User: HR User
Action: VIEW
Resource: Zoho People
IP Address: <client IP>
Timestamp: <timestamp>
```

## Zoho OAuth Integration

The backend uses Zoho OAuth 2.0 with a refresh token.

Employees do not need individual Zoho credentials.

```text
Employee
   |
   v
Employee Portal
   |
   v
Backend
   |
   v
Zoho Refresh Token
   |
   v
Temporary Access Token
   |
   v
Zoho API
```

Zoho credentials are stored as backend environment variables and are never sent to the React frontend.

## Zoho Service Endpoints

```http
GET /api/services/people
GET /api/services/crm
GET /api/services/desk
GET /api/services/books
```

Each endpoint requires JWT authentication and its corresponding permission.

### Zoho People

```http
GET /api/services/people
```

Requires:

```text
PEOPLE_ACCESS
```

### Zoho CRM

```http
GET /api/services/crm
```

Requires:

```text
CRM_ACCESS
```

### Zoho Desk

```http
GET /api/services/desk
```

Requires:

```text
DESK_ACCESS
```

### Zoho Books

```http
GET /api/services/books
```

Requires:

```text
BOOKS_ACCESS
```

## Current Zoho People Status

The OAuth flow and API communication are implemented. The connected Zoho account currently returns Zoho People error code `7008`:

```text
No Organization Account exists for this user in Zoho People
```

This is a Zoho People account configuration issue rather than an OAuth authentication failure.

The backend detects the API-level error and returns an appropriate error response to the frontend instead of reporting a successful request.

Zoho CRM, Zoho Desk, and Zoho Books have role-based service access implemented and are marked as pending configuration in the current demo where live service configuration is unavailable.

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Admin

```http
GET   /api/admin/users
POST  /api/admin/users
PATCH /api/admin/users/:id/status
GET   /api/admin/audit-logs
```

### Zoho Services

```http
GET /api/services/people
GET /api/services/crm
GET /api/services/desk
GET /api/services/books
```

## Database Models

```text
User
Role
Permission
UserRole
RolePermission
AuditLog
```

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
ZOHO_CLIENT_ID="your-zoho-client-id"
ZOHO_CLIENT_SECRET="your-zoho-client-secret"
ZOHO_REFRESH_TOKEN="your-zoho-refresh-token"
ZOHO_ACCOUNTS_URL="https://accounts.zoho.in"
PORT=5000
```

Never commit real secrets to GitHub.

Keep the following private:

- Database connection strings
- Database passwords
- JWT secret
- Zoho Client ID
- Zoho Client Secret
- Zoho Refresh Token

## Local Development

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
node src/server.js
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Demo Accounts

The seed script creates:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin@123 |
| HR | hr@example.com | HR@123 |
| Sales | sales@example.com | Sales@123 |
| Support | support@example.com | Support@123 |
| Finance | finance@example.com | Finance@123 |

These credentials are for demonstration only.

## Security

- Passwords are hashed using bcrypt.
- Protected APIs require valid JWT authentication.
- JWTs expire after one hour.
- Permissions are checked server-side.
- Zoho OAuth secrets remain on the backend.
- Audit logging provides activity traceability.
- Production frontend and backend use HTTPS.

## Project Structure

```text
custom-employee-portal/
|
+-- backend/
|   +-- src/
|   |   +-- config/
|   |   |   +-- prisma.js
|   |   +-- controllers/
|   |   |   +-- adminController.js
|   |   |   +-- authController.js
|   |   |   +-- zohoController.js
|   |   +-- middleware/
|   |   |   +-- authMiddleware.js
|   |   |   +-- permissionMiddleware.js
|   |   |   +-- auditMiddleware.js
|   |   +-- routes/
|   |   |   +-- adminRoutes.js
|   |   |   +-- authRoutes.js
|   |   |   +-- serviceRoutes.js
|   |   +-- services/
|   |   |   +-- zohoAuthService.js
|   |   +-- server.js
|   +-- prisma/
|   |   +-- schema.prisma
|   |   +-- seed.js
|   +-- prisma.config.ts
|   +-- package.json
|
+-- frontend/
|   +-- src/
|   |   +-- context/
|   |   |   +-- AuthContext.jsx
|   |   +-- pages/
|   |   |   +-- Login.jsx
|   |   |   +-- Dashboard.jsx
|   |   |   +-- Admin.jsx
|   |   +-- services/
|   |   |   +-- api.js
|   |   +-- App.jsx
|   |   +-- main.jsx
|   |   +-- styles.css
|   +-- package.json
|
+-- README.md
```

## Deployment

### Frontend

Deployed on Vercel:

https://custom-employee-portal-seven.vercel.app

### Backend

Deployed on Render:

https://custom-employee-portal-i2xu.onrender.com

### Database

PostgreSQL is hosted using Render PostgreSQL.

```text
Vercel Frontend
      |
      v
Render Express API
      |
      v
Prisma
      |
      v
Render PostgreSQL
```

## Assignment Requirements Coverage

| Requirement | Status |
|-------------|--------|
| Custom authentication | Implemented |
| JWT authentication | Implemented |
| Role-based access control | Implemented |
| Admin role | Implemented |
| HR role | Implemented |
| Sales role | Implemented |
| Support role | Implemented |
| Finance role | Implemented |
| User management | Implemented |
| Role/permission model | Implemented |
| Audit logs | Implemented |
| Zoho OAuth 2.0 | Implemented |
| Backend-managed Zoho credentials | Implemented |
| PostgreSQL | Implemented |
| React frontend | Implemented |
| Node/Express backend | Implemented |
| HTTPS deployment | Implemented |
| Public deployment | Implemented |

## Future Improvements

For a production deployment, the following could be added:

- HTTP-only secure cookies
- Redis-backed sessions/token management
- Rate limiting
- Account lockout after repeated failed logins
- More granular permissions
- Automated service health checks
- Complete CRUD operations for Zoho CRM, Desk and Books
- Production secret management
- CI/CD tests
- Expanded audit event coverage

## Conclusion

This project demonstrates a centralized employee portal with custom authentication, server-side RBAC, administrative controls, audit logging, PostgreSQL persistence, and backend-managed Zoho OAuth integration.

The architecture separates employee authentication from Zoho authentication while ensuring that access to business services is controlled through application-level roles and permissions.
