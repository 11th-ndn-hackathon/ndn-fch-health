FROM node:20-alpine3.19
WORKDIR /app
COPY package.json .npmrc ./
RUN ["corepack", "pnpm", "install", "--prod"]
COPY src ./src/
CMD ["src/main.js"]
EXPOSE 3000
