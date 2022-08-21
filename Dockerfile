FROM node:16-alpine3.12
RUN apk --no-cache --virtual build-dependencies add python3 make g++
RUN rm -rf /var/cache/apk/*
ENV NODE_ENV production

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN JOBS=max npm install

COPY . /app
RUN touch /app/.env

CMD ["npm", "start"]
