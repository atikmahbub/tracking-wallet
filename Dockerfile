# Use Node.js 20-alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install all dependencies, including devDependencies
# The --frozen-lockfile ensures that the exact versions in yarn.lock are installed
RUN yarn install --frozen-lockfile --production=false

# Copy the rest of the application files
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Build the backend (tracking) and shared packages
RUN yarn build:shared && yarn build:backend

# Set the working directory to the backend (tracking)
WORKDIR /app/packages/tracking

# Expose the port on which the backend will run
EXPOSE 4000

# Start the backend (tracking)
CMD ["yarn", "start"]