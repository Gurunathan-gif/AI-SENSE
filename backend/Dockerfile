# 1. Official clean bullseye node base image
FROM node:20-bullseye

# 2. Prevent interactive prompt freezes inside docker build threads
ENV DEBIAN_FRONTEND=noninteractive

# 3. Install baseline operating system prerequisites and clear caches instantly
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# 4. Pull down the official compressed Arduino CLI tool package into /usr/local/bin
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/local/bin sh
ENV PATH="/usr/local/bin:${PATH}"

# 5. Connect to the official Arduino registry index
RUN arduino-cli config init && \
    arduino-cli config add board_manager.additional_urls https://downloads.arduino.cc/packages/package_index.json

# 6. Install the Zephyr compiler packages with forced memory optimizations
RUN arduino-cli core update-index && \
    (arduino-cli core install arduino:zephyr || true)

# 7. Wire the mandatory router dependencies used by the board core
RUN (arduino-cli lib install "Arduino_RouterBridge" || true)

# 8. Setup production isolation folders
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# 9. Bind host explicitly to port 10000 required by Render Docs
EXPOSE 10000
CMD ["node", "server.js"]
