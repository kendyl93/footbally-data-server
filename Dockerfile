FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (including production)
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose the necessary ports
EXPOSE 3001
EXPOSE 4001

# Run the production start script
CMD ["npm", "run", "start:all:prod"]
