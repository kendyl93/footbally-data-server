FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the necessary ports
EXPOSE 3001
EXPOSE 4001

# Start both services with the "start:all" script
CMD ["npm", "run", "start:all:prod"]
