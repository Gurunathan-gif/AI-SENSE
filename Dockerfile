# Production Dockerfile for AI SENSE Backend Web Service
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm install --production

# Copy remaining application source code
WORKDIR /app
COPY . .

# Expose server port
EXPOSE 10000

# Start Express Backend Server
WORKDIR /app/backend
CMD ["node", "server.js"]
