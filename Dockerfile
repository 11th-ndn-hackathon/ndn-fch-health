FROM node:19-alpine
WORKDIR /app
COPY package.json .npmrc ./
RUN ["corepack", "pnpm", "install", "--prod"]
COPY src ./src/
CMD ["src/main.js"]
EXPOSE 3000
