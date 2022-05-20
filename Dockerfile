FROM node:18-alpine
WORKDIR /app
COPY package.json .npmrc ./
RUN ["corepack", "pnpm", "install", "--prod"]
COPY server.js ./
COPY src ./src/
CMD ["server.js"]
EXPOSE 3000
