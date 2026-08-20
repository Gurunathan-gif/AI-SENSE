# Production Dockerfile for AI SENSE Backend Web Service
FROM node:20-bullseye

WORKDIR /app/backend

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]
