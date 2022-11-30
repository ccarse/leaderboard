FROM node:19-alpine as build

RUN apk add --no-cache --virtual .gyp python3 make g++

WORKDIR /usr/src

COPY package*.json ./

RUN set -ex && \
  npm install

RUN apk del .gyp

COPY . . 

RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/dist/ /usr/share/nginx/html/
