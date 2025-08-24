FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (force to avoid esbuild version issues)
RUN npm install --force

# Copy the rest of the source code
COPY . .

# Rebuild esbuild for container
RUN npm rebuild esbuild --force

# Build Vite frontend
RUN npm run build

# Install serve to serve the built files
RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
