FROM node:19-alpine
WORKDIR /app
COPY package.json .npmrc ./
RUN ["corepack", "pnpm", "install", "--prod"]
COPY src ./src/
CMD ["src/main.cjs"]
EXPOSE 3000
