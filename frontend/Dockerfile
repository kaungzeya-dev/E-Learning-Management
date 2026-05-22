# =======================
# Build Stage
# =======================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Railway service variables are available at build time (set VITE_API_BASE_URL there)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN if [ -z "$VITE_API_BASE_URL" ]; then \
      echo "ERROR: VITE_API_BASE_URL is not set. Add it to Railway frontend variables before deploy."; \
      exit 1; \
    fi && \
    echo "Building with VITE_API_BASE_URL=$VITE_API_BASE_URL" && \
    npm run build

# =======================
# Production Stage
# =======================
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway injects PORT at runtime; avoid a separate .sh file (CRLF on Windows breaks deploy)
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "sed -i \"s/listen 8080;/listen ${PORT};/\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
