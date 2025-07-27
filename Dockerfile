FROM node:20-alpine

WORKDIR /app

# Enable Yarn with corepack (Node 20+)
RUN corepack enable

# Copy dependencies and install
COPY package*.json ./
RUN yarn install

# Copy rest of the project
COPY . .

# Expose the app port (optional)
EXPOSE 3000

RUN yarn build

CMD ["sh", "-c", "yarn db:migrate:prod && yarn start:prod"]
