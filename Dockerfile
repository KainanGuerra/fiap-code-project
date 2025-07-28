FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

RUN yarn install --production=true

EXPOSE 3000

CMD ["yarn", "start:prod"]
