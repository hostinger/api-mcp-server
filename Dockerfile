FROM node:24.4.1-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production

RUN chmod +x server.js

CMD ["node", "server.js"]
