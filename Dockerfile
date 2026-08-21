FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    build-essential \
    python3 \
    git \
    wget \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh -s 1.1.1 && \
    mv bin/arduino-cli /usr/local/bin/

RUN arduino-cli config init && \
    arduino-cli core update-index && \
    arduino-cli core install arduino:avr || true

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

EXPOSE 10000

ENV PORT=10000

CMD ["node", "server.js"]
