FROM node:20-alpine

COPY    ./config/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN		chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app
#COPY ./src/index.js ./

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]
