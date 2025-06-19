FROM node:20-alpine

COPY ./config/entrypoint.sh /usr/local/bin/
RUN		chmod +x /usr/local/bin/entrypoint.sh

RUN mkdir app
WORKDIR /app
#COPY ./src/index.js ./
#RUN npm install fastify @fastify/http-proxy

EXPOSE 3001

ENTRYPOINT ["entrypoint.sh"]
