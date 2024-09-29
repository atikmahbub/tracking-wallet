# TrackWallet Project

## Project Overview

TrackWallet is a personal finance management application that helps users track their daily expenses and set monthly financial limits. The project is built using a monorepo structure that includes separate packages for the backend, frontend, and shared code.

### Key Features

- **Expense Tracking**: Track daily expenses with descriptions and dates.
- **Monthly Limit**: Set monthly spending limits and get alerts when exceeded.
- **Authentication**: OAuth 2.0 with Gmail using Auth0 for authentication.
- **Cross-Platform**: Frontend built with React and backend built with Node.js (Express).

---

## Project Structure

The project is organized into three main packages:

1. **Backend**: (Located in `packages/tracking`)

   - Built with **Node.js** and **Express.js**
   - Handles API requests and database operations.
   - Uses **Prisma ORM** for database management.

2. **Frontend**: (Located in `packages/trackingPortal`)

   - Built with **React** using Material-UI for design.
   - Manages user interface and interaction with the backend API.

3. **Shared**: (Located in `packages/shared`)
   - Contains shared types, interfaces, and utility functions used across both backend and frontend.
   - Ensures consistency and reusability of code between packages.

---

## Tech Stack

### Backend (tracking)

- **Node.js** (Express.js)
- **TypeScript** (for type safety)
- **Prisma** (for database management)
- **MySQL** (database)
- **Auth0** (for authentication)

### Frontend (trackingPortal)

- **React** (JavaScript library for building user interfaces)
- **TypeScript**
- **Material-UI** (React component library)

### Shared (shared)

- **TypeScript** (Shared types and utilities)
- **ts-brand** (For branded types)

---

## Setup and Installation

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (>= v14)
- **Yarn** (Package manager)
- **MySQL** (For database)

### Cloning the repository

```bash
git clone https://github.com/atikmahbub/tracking-wallet.git
cd tracking-wallet
```

### Installing Dependencies

The project uses **Yarn workspaces**. You can install all dependencies at once by running:

```bash
yarn install
```

### Environment Variables

Make sure you create the necessary **`.env`** files for both backend and frontend:

#### Backend (`packages/tracking/.env`)

```plaintext
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
PORT=5050
AUTH0_DOMAIN="your-auth0-domain"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
```

#### Frontend (`packages/trackingPortal/.env`)

```plaintext
REACT_APP_API_URL="http://localhost:5050/api"
REACT_APP_AUTH0_DOMAIN="your-auth0-domain"
REACT_APP_AUTH0_CLIENT_ID="your-client-id"
```

### Running the Development Environment

#### Backend

To run the backend API:

```bash
cd packages/tracking
yarn dev
```

#### Frontend

To run the frontend:

```bash
cd packages/trackingPortal
yarn start
```

### Building the Project

To build both backend and frontend, you can run:

```bash
yarn build:all
```

This will compile the TypeScript code and create the necessary build files for both packages.

---

## Database Migration (Prisma)

The project uses **Prisma** as the ORM for database management. To apply any schema changes or run migrations, use the following command:

```bash
cd packages/tracking
yarn prisma migrate dev
```

---

## Testing

To run tests (if applicable), you can use the following command for both frontend and backend:

```bash
yarn test
```

---

## Deployment

### Deploying to Railway (Backend)

1. Create a new project in **Railway**.
2. Add the necessary environment variables (same as in `.env`).
3. Push your backend code to the Railway Git repository for automatic deployment.

### Deploying to Vercel (Frontend)

1. Create a new project in **Vercel**.
2. Add the environment variables (from `.env`).
3. Deploy your frontend by connecting the repository to Vercel.

---

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. Ensure that your code follows the existing conventions and passes all tests.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions or support, please contact Atik Mahbub at atikmahbub100@gmail.com.

---
