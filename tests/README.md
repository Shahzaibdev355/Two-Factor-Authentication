# Test Suite for Plant Disease Backend

This test suite covers the core functionality of the Plant Disease Backend application with 5 comprehensive test files.

## Test Structure

### 1. **Encryption Helper Tests** (`tests/helpers/encryption.helper.test.ts`)
- Tests password hashing functionality using bcrypt
- Validates that passwords are properly hashed and compared
- Ensures security best practices are followed

### 2. **Cookie Helper Tests** (`tests/helpers/cookie.helper.test.ts`)
- Tests cookie configuration for different environments (dev/prod)
- Validates security settings (httpOnly, secure, sameSite)
- Tests different cookie types (auth, logout) with proper expiration

### 3. **Date-Time Helper Tests** (`tests/helpers/date-time.helper.test.ts`)
- Tests time conversion utilities (minutes/days to seconds/milliseconds)
- Validates calculations used for JWT token expiration and cookie maxAge
- Ensures accurate time-based functionality

### 4. **Auth Service Tests** (`tests/services/auth.service.test.ts`)
- Tests user registration and login functionality
- Validates authentication flow and error handling
- Tests user information retrieval and logout
- Mocks external dependencies for isolated testing

### 5. **App Integration Tests** (`tests/integration/app.integration.test.ts`)
- Tests the main Express application setup
- Validates middleware configuration (CORS, security headers, JSON parsing)
- Tests health check endpoints
- Ensures proper error handling for the entire application

## Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:helpers      # Helper function tests
npm run test:services     # Service layer tests
npm run test:integration  # Integration tests
npm run test:unit         # All unit tests (helpers + services)

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Coverage

These tests cover:
- ✅ Password encryption and validation
- ✅ Cookie security configuration
- ✅ Time calculation utilities
- ✅ User authentication flow
- ✅ Application middleware and routing
- ✅ Error handling
- ✅ Security headers and CORS
- ✅ Health check endpoints

## Dependencies

The tests use:
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library for integration tests
- **MongoDB Memory Server** - In-memory MongoDB for testing
- **ts-jest** - TypeScript support for Jest