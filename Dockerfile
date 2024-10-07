# Use Node.js 20-alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json, yarn.lock, and .yarnrc.yml files (for Yarn Workspaces)
COPY package.json yarn.lock ./

# Copy the rest of the monorepo files, including packages folder
COPY packages ./packages

# Install all dependencies using Yarn Workspaces
# --frozen-lockfile ensures that the exact versions in yarn.lock are installed
RUN yarn install --frozen-lockfile --production=false

# Generate Prisma Client in case you're using Prisma
RUN yarn workspace @tracking run prisma generate

# Build the backend (tracking) and shared packages
RUN yarn workspace shared run build && yarn workspace tracking run build

# Set the working directory to the backend (tracking)
WORKDIR /app/packages/tracking

# Expose the port on which the backend will run
EXPOSE 4000

# Start the backend (tracking)
CMD ["yarn", "start"]