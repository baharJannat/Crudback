# Use Node.js 18 Alpine as the base image
FROM registry.morsa.local:5001/node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port defined in .env (default 5000)
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]