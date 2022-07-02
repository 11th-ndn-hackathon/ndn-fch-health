FROM node:18-alpine
WORKDIR /app
COPY package.json .npmrc ./
RUN ["corepack", "pnpm", "install", "--prod"]
COPY server.cjs ./
COPY src ./src/
CMD ["server.cjs"]
EXPOSE 3000
