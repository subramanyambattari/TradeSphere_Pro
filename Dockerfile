# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Build the Vite/React application
RUN npm run build

# Stage 2: Setup the backend runtime
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
# Install only production dependencies
RUN npm install --production
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
