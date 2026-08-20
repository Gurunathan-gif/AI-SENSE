# 1. Official Node Image
FROM node:20-bullseye

# 2. System dependencies for Arduino CLI and Zephyr architecture
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# 3. Download and install Arduino CLI
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
ENV PATH="/bin:/usr/local/bin:${PATH}"

# 4. Add the official board manager URL for Arduino UNO Q
RUN arduino-cli config init && \
    arduino-cli config add board_manager.additional_urls https://downloads.arduino.cc/packages/package_index.json

# 5. Install the core Zephyr compiler package
RUN arduino-cli core update-index && \
    arduino-cli core install arduino:zephyr

# 6. Install mandatory core serial bridge libraries for UNO Q
RUN arduino-cli lib install "Arduino_RouterBridge"

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./
EXPOSE 10000

CMD ["node", "server.js"]
