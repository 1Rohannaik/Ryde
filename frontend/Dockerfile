# Use a lightweight Node image compatible with ARM (M1/M2)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (use legacy-peer-deps to avoid conflicts)
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Build the frontend
RUN npm run build

# Install serve globally to serve the production build
RUN npm install -g serve

# Expose the port for the container
EXPOSE 4173

# Start the production server
CMD ["serve", "-s", "dist", "-l", "4173"]
