# Northline Roofing Estimator

A full-stack dynamic roofing cost estimator for Northline Roofing & Exteriors.

## Features

### Public Estimator

- Multi-step roofing estimator
- Dynamic questions from MongoDB
- Roof area validation
- Material selection
- Roof pitch selection
- Layer selection
- Stories selection
- Server-side estimate calculation
- Estimate range
- Lead capture

### Owner Dashboard

- JWT authentication
- Protected owner routes
- View submitted leads
- Edit business information
- Edit estimator questions
- Edit question labels
- Edit options
- Edit pricing
- Enable/disable questions
- Save configuration without redeploying the frontend

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
client/
server/
README.md
DECISIONS.md
AI_LOG.md
```

## Local Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

## Local URLs

### Public Estimator

```text
http://localhost:5173
```

### Owner Login

```text
http://localhost:5173/admin/login
```

### Owner Dashboard

```text
http://localhost:5173/admin/dashboard
```

## Owner Test Credentials

```text
Email: admin@northline.com
Password: Northline@123
```

## API Endpoints

### Public

```text
GET  /api/config
POST /api/leads
POST /api/auth/login
```

### Owner

```text
GET /api/owner/test
GET /api/owner/leads
GET /api/owner/config
PUT /api/owner/config
```

Owner endpoints require JWT authentication.

## Architecture

The estimator configuration is stored in MongoDB and retrieved through the backend API.

The frontend does not hardcode estimator questions, labels, options or pricing.

The owner can update the estimator configuration through the protected owner dashboard.

Estimate calculations are performed on the server using the stored configuration.

## Security

- JWT authentication for owner routes
- bcrypt password hashing
- Protected backend endpoints
- Environment variables for secrets
- `.env` files excluded from Git

## Testing

The following were tested:

- Public estimator flow
- Multi-step form
- Form validation
- Estimate generation
- Lead submission
- Owner login
- Protected owner APIs
- Leads dashboard
- Configuration editing
- Dynamic pricing changes
- Question enable/disable
- Responsive/mobile layout

## Deployment

The application is deployed as separate frontend and backend services.

### Frontend

```text
https://northline-roofing-estimator-five.vercel.app/
```

### Backend

```text
YOUR_BACKEND_URL
```

The production URLs will be added after deployment.

## Future Improvements

- Lead status management
- CSV export
- Configuration history
- Audit logging
- Automated calculation tests
- Additional estimator question types
