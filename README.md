# Plant Disease Backend API

A secure Node.js/Express backend API for plant disease detection with two-factor authentication (2FA) support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Application Flow](#application-flow)
- [Authentication System](#authentication-system)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Security Features](#security-features)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   Express API   │───▶│   MongoDB       │
│                 │    │                 │    │                 │
│ - React/Vue/etc │    │ - Routes        │    │ - User Data     │
│ - HTTP Requests │    │ - Controllers   │    │ - Auth Info     │
│ - Cookie Auth   │    │ - Services      │    │ - 2FA Secrets   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + 2FA (TOTP)
- **Security**: Helmet, CORS, bcrypt
- **Logging**: Winston
- **Validation**: Joi

## 🔄 Application Flow

### 1. Server Startup Flow

```mermaid
graph TD
    A[App Start] --> B[Load Environment Variables]
    B --> C[Connect to MongoDB]
    C --> D[Setup Middlewares]
    D --> E[Register Routes]
    E --> F[Start HTTP Server]
    F --> G[Server Ready on Port]
    
    C --> C1[Connection Success?]
    C1 -->|No| C2[Log Error & Exit]
    C1 -->|Yes| D
```

### 2. Request Processing Flow

```mermaid
graph TD
    A[Incoming Request] --> B[CORS Check]
    B --> C[Security Headers]
    C --> D[Parse JSON/Cookies]
    D --> E[Route Matching]
    E --> F{Protected Route?}
    F -->|No| G[Controller Handler]
    F -->|Yes| H[Auth Middleware]
    H --> I{Valid Token?}
    I -->|No| J[401 Unauthorized]
    I -->|Yes| K[Validate Auth Stage]
    K --> L{Correct Stage?}
    L -->|No| J
    L -->|Yes| G
    G --> M[Service Layer]
    M --> N[Database Operation]
    N --> O[Response]
    O --> P[Error Handling]
```

## 🔐 Authentication System

The app uses a **two-stage authentication system**:

### Stage 1: Password Authentication
```mermaid
graph LR
    A[Login Request] --> B[Validate Credentials]
    B --> C[Generate JWT with 'password' stage]
    C --> D[Set Cookie with 5min expiry]
    D --> E[Return 2FA Status]
```

### Stage 2: Two-Factor Authentication
```mermaid
graph LR
    A[2FA Setup Request] --> B[Generate TOTP Secret]
    B --> C[Create QR Code]
    C --> D[Generate Recovery Codes]
    D --> E[Return QR & Codes]
    
    F[2FA Verify Request] --> G[Validate TOTP]
    G --> H[Generate JWT with '2fa' stage]
    H --> I[Set Cookie with 1day expiry]
```

### Complete Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database
    participant Auth as Auth Service

    Note over C,Auth: Registration Flow
    C->>A: POST /api/v1/auth/register
    A->>DB: Check if user exists
    A->>Auth: Hash password
    A->>DB: Create new user
    A->>C: Success response

    Note over C,Auth: Login Flow
    C->>A: POST /api/v1/auth/login
    A->>DB: Find user by email
    A->>Auth: Compare passwords
    A->>Auth: Generate JWT (stage: password)
    A->>C: Set cookie + return 2FA status

    Note over C,Auth: 2FA Setup (if not activated)
    C->>A: POST /api/v1/auth/activate-2fa
    A->>Auth: Generate TOTP secret
    A->>Auth: Create QR code
    A->>Auth: Generate recovery codes
    A->>DB: Save secret & recovery codes
    A->>C: Return QR code & recovery codes

    Note over C,Auth: 2FA Verification
    C->>A: POST /api/v1/auth/verify-2fa
    A->>Auth: Validate TOTP token
    A->>DB: Activate 2FA (if first time)
    A->>Auth: Generate JWT (stage: 2fa)
    A->>C: Set cookie with full access

    Note over C,Auth: Protected Resource Access
    C->>A: GET /api/v1/auth/userInfo
    A->>Auth: Verify JWT & stage
    A->>DB: Fetch user data
    A->>C: Return user information
```

## 📡 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login with email/password |

### Protected Endpoints (Password Stage)
| Method | Endpoint | Description | Auth Stage |
|--------|----------|-------------|------------|
| `POST` | `/api/v1/auth/activate-2fa` | Setup 2FA | `password` |
| `POST` | `/api/v1/auth/verify-2fa` | Verify 2FA code | `password` |

### Protected Endpoints (Full Access)
| Method | Endpoint | Description | Auth Stage |
|--------|----------|-------------|------------|
| `GET` | `/api/v1/auth/userInfo` | Get user profile | `password` + `2fa` |
| `PUT` | `/api/v1/auth/logout` | Logout user | `password` + `2fa` |

### System Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status check |
| `GET` | `/health` | Health check |

## 📁 Project Structure

```
src/
├── app.ts                 # Main application entry point
├── config/
│   ├── index.ts          # Environment configuration
│   └── db.ts             # Database connection
├── controller/
│   └── auth.controller.ts # Request handlers
├── services/
│   └── auth.service.ts   # Business logic
├── repositories/
│   └── user.repository.ts # Database operations
├── middlewares/
│   ├── auth.middleware.ts # Authentication middleware
│   └── error.middleware.ts # Error handling
├── routes/
│   ├── index.ts          # Route aggregator
│   └── auth.routes.ts    # Authentication routes
├── models/               # Database schemas
├── validators/           # Input validation
├── helpers/              # Utility functions
├── utils/                # Common utilities
├── types/                # TypeScript type definitions
└── interfaces/           # TypeScript interfaces
```

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

# Database
MONGODB_URI=mongodb://localhost:27017/plant-disease-db

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Client Configuration
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info


```

## 🛡️ Security Features

### 1. Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Two-Factor Authentication**: TOTP-based 2FA with QR codes
- **Recovery Codes**: Backup codes for 2FA recovery
- **Password Hashing**: bcrypt with salt rounds
- **Cookie Security**: HttpOnly, Secure, SameSite cookies

### 2. Application Security
- **Helmet**: Security headers protection
- **CORS**: Cross-origin request protection
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Built-in Express rate limiting
- **Error Handling**: Centralized error management

### 3. Database Security
- **Connection Security**: Secure MongoDB connection
- **Data Validation**: Mongoose schema validation
- **Sensitive Data**: Excluded from responses by default

## 🚦 How It All Works Together

### 1. **Startup Process**
   - App loads environment variables
   - Connects to MongoDB database
   - Sets up security middlewares (CORS, Helmet)
   - Registers API routes
   - Starts HTTP server

### 2. **Request Lifecycle**
   ```
   Request → Security Checks → Route Matching → Auth Check → Controller → Service → Database → Response
   ```

### 3. **Authentication Stages**
   - **Stage 1 (password)**: Basic login, limited access (5 min)
   - **Stage 2 (2fa)**: Full access after 2FA verification (1 day)

### 4. **Error Handling**
   - All errors are caught and processed by error middleware
   - Consistent error response format
   - Detailed logging for debugging

### 5. **Data Flow**
   ```
   Client Request → Controller (validation) → Service (business logic) → Repository (database) → Response
   ```

## 🔍 Key Components Explained

### Controllers
Handle HTTP requests, validate input, and coordinate responses.

### Services
Contain business logic, authentication, and data processing.

### Repositories
Manage database operations and data access patterns.

### Middlewares
Process requests before they reach controllers (auth, validation, etc.).

### Helpers & Utils
Provide reusable functions for encryption, JWT, logging, etc.

---

This backend provides a solid foundation for secure user authentication with modern security practices. The two-stage authentication system ensures both security and user experience are optimized.