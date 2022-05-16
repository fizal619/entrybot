FROM node:12-alpine3.10
RUN apk --no-cache --virtual build-dependencies add python3 make g++ ffmpeg chromium
RUN rm -rf /var/cache/apk/*
ENV NODE_ENV production

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install

COPY . /app
RUN touch /app/.env

CMD ["npm", "start"]
