FROM node:24.0.1-alpine3.21

WORKDIR /src

COPY ./package*.json .

RUN npm install

COPY . .

ENV port=8080

EXPOSE 8080


CMD [ "npm", "start" ]





