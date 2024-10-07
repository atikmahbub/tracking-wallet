FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the backend (tracking) and shared packages
RUN yarn build:shared && yarn build:backend

# Set the working directory to the backend (tracking)
WORKDIR /app/packages/tracking

# Expose the port on which the backend will run
EXPOSE 4000

# Start the backend (tracking)
CMD ["yarn", "start"]