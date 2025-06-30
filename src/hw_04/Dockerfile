FROM node:24-alpine

WORKDIR /usr

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY src ./src
EXPOSE 3000
ENV APP_ROOT=/usr
ENV HOST=0.0.0.0

CMD ["node", "src/server.ts"]
