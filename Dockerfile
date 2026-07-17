FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY drizzle ./drizzle
COPY src ./src

CMD ["npx", "tsx", "src/scrapers/costco_gas.js"]
