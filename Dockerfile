FROM node:16-alpine
RUN apk --no-cache --virtual build-dependencies add python3 make g++
RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main
RUN rm -rf /var/cache/apk/*
ENV NODE_ENV production

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN JOBS=max npm install
RUN npm update -g

COPY . /app
RUN touch /app/.env

CMD ["npm", "start"]
