FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN ["npm", "install", "--production"]
COPY server.js ./
COPY src/ ./src/
CMD ["server.js"]
EXPOSE 3000
