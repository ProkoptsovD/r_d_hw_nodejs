FROM node:24-alpine

WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY src ./src
EXPOSE 3000
CMD ["node","src/server.js"]