# syntax=docker/dockerfile:1

FROM node:lts-alpine

WORKDIR /app

COPY . .
RUN yarn install

EXPOSE 3000

CMD ["npm", "start"]
