# Use official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (you can override at runtime)
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]