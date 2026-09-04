# Custom Employee Portal with Zoho One Integration

A secure role-based employee portal built with React, Node.js, Express, PostgreSQL, Prisma, JWT authentication, and Zoho One service integrations.

The portal provides a centralized workspace where employees can access business services according to their assigned roles without requiring individual Zoho credentials.

---

## Live Demo

### Frontend
https://custom-employee-portal-seven.vercel.app

### Backend API
https://custom-employee-portal-i2xu.onrender.com

---

## Features

- Custom employee authentication
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Admin user management
- Role and permission management
- Audit logging
- Secure backend API
- Zoho OAuth 2.0 refresh-token authentication
- Centralized Zoho service access
- PostgreSQL database with Prisma ORM
- React frontend
- Express.js backend
- Responsive dashboard
- Production deployment using Vercel and Render

---

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
- bcrypt
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

---

# System Architecture

```text
                    ┌──────────────────────┐
                    │     React Frontend   │
                    │       (Vercel)       │
                    └──────────┬───────────┘
                               │
                         JWT Bearer Token
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend     │
                    │       (Render)        │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          Authentication      RBAC       Audit Logging
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ PostgreSQL Database   │
                    │      + Prisma        │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Zoho OAuth 2.0    │
                    │ Refresh Token Flow   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Zoho People       Zoho CRM        Zoho Desk
                               │
                               ▼
                          Zoho Books
