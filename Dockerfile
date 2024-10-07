# Use Node.js 20-alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json and yarn.lock for caching
COPY package.json yarn.lock ./

# Copy the root tsconfig.json to ensure TypeScript can find it
COPY tsconfig.json ./

# Copy the rest of the monorepo files, including packages folder
COPY packages ./packages

# Install all dependencies using Yarn Workspaces
RUN yarn install --frozen-lockfile --production=false

# Generate Prisma Client (can be done during build)
RUN yarn workspace tracking run prisma generate

# Build the shared and tracking workspaces
RUN yarn workspace shared run build
RUN yarn workspace tracking run build

# Set the working directory to the backend (tracking)
WORKDIR /app/packages/tracking

# Expose the port on which the backend will run
EXPOSE 3000

# Start the backend (tracking), and run migrations before starting the server
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start"]