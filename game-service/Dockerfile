FROM node:20-alpine

COPY    ./config/entrypoint.sh /usr/local/bin/
RUN		chmod +x /usr/local/bin/entrypoint.sh

RUN mkdir app
WORKDIR /app

EXPOSE 3002
EXPOSE 4000

ENTRYPOINT ["entrypoint.sh"]
