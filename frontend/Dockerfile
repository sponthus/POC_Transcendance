FROM node:20-alpine AS build

COPY    ./config/entrypoint.sh /usr/local/bin/
RUN		chmod +x /usr/local/bin/entrypoint.sh

RUN mkdir app
WORKDIR /app

ENTRYPOINT ["entrypoint.sh"]

#In prod, becomes the 1st step of a multistep docker with nginx