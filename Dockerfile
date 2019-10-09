FROM node:10.15.3-alpine
RUN apk --no-cache --virtual build-dependencies add python make g++ && npm install && apk del build-dependencies
RUN apk add  --no-cache ffmpeg
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD npm start