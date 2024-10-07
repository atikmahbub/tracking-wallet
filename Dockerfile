# Use a Node.js LTS image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install dependencies for the whole monorepo using Yarn workspaces
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the backend (tracking) and shared packages
RUN yarn build:shared && yarn build:backend

# Set the working directory to the backend (tracking)
WORKDIR /app/packages/tracking

# Expose the port on which the backend will run
EXPOSE 3000

# Start the backend (tracking)
CMD ["yarn", "start"]