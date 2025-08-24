# Use x64 Node to avoid ARM build issues on M1
FROM --platform=linux/amd64 node:18

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Build the frontend
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose the port
EXPOSE 4173

# Start the production server
CMD ["serve", "-s", "dist", "-l", "4173"]

