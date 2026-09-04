# ===================================================
# Stage 1: Build React/Vite Frontend
# ===================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies using lockfile
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build static bundle
COPY frontend/ ./
RUN npm run build

# ===================================================
# Stage 2: Production Node.js Server & Static Runner
# ===================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set default production environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    RAZORPAY_MODE=test

# Install production dependencies for backend only
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy backend application source
COPY backend/ ./

# Copy compiled frontend assets from Stage 1 into /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Use non-root user for security
USER node

# Expose backend port
EXPOSE 5000

# Docker native container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the Express server
CMD ["node", "server.js"]
