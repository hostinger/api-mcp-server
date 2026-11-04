FROM node:24.22.1-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

CMD ["node", "src/servers/all.js"]
