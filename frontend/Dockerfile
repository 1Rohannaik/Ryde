FROM node:18

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies and force esbuild to rebuild
RUN npm install --force

# Copy rest of the frontend code
COPY . .

# Optional: rebuild esbuild binary for Linux container
RUN npm rebuild esbuild

# Build the Vite frontend
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
