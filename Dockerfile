FROM node:22 AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy lockfile and package.json
COPY pnpm-lock.yaml* ./
COPY package.json ./
COPY prisma ./prisma/
COPY .env* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy rest of the application source code
COPY . .

# Build the project
RUN pnpm run build

# Production image
FROM node:22

# Install pnpm globally again (needed in prod container too)
RUN npm install -g pnpm 

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./ 

EXPOSE ${PORT}
CMD [ "pnpm", "run", "start:prod" ]
