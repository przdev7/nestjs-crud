FROM node:24-alpine

WORKDIR /src

COPY ./package*.json .

RUN npm ci

COPY . .

ENV port=8080

EXPOSE 3000

CMD [ "npm", "start" ]
