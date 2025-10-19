FROM node:20-alpine

# Install basic development tools
RUN apk add --no-cache \
    git \
    postgresql-client \
    ca-certificates \
    curl \
    gnupg \
    && apk upgrade --no-cache

# Install global npm packages as root
RUN npm install -g \
    npm@latest \
    typescript \
    ts-node \
    drizzle-kit \
    expo-cli \
    @expo/ngrok@^4.1.0 \
    eas-cli

# Create a directory for global npm packages for the node user
RUN mkdir -p /home/node/.npm-global && \
    chown -R node:node /home/node/.npm-global

# Set up user
USER node

# Configure npm to use the user's directory for global packages
RUN npm config set prefix /home/node/.npm-global

# Add npm global bin to PATH
ENV PATH="/home/node/.npm-global/bin:${PATH}"

WORKDIR /workspace
