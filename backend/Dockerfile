# 1. Use official Node 20 Bullseye image as base
FROM node:20-bullseye

# 2. Install necessary system dependencies for Arduino CLI and Zephyr
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# 3. Install official Arduino CLI tool
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# 4. Set up environment paths so system locates arduino-cli binary
ENV PATH="/bin:/usr/local/bin:${PATH}"

# 5. Initialize configuration
RUN arduino-cli config init

# 6. Install AVR and Zephyr board platforms for Arduino UNO & UNO Q
RUN arduino-cli core update-index && \
    arduino-cli core install arduino:avr || true

# 7. Establish working application directory
WORKDIR /usr/src/app

# 8. Copy package configurations and install production node packages
COPY package*.json ./
RUN npm ci --only=production

# 9. Copy remaining Node.js backend code
COPY . .

# Expose Express port
EXPOSE 10000

# Start Express server application
CMD ["node", "server.js"]
