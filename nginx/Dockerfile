#FROM node:20-alpine AS build
#
#WORKDIR /app

FROM nginx:stable

RUN apt update -y \
	&& apt install -y \
	nginx \
	openssl

#COPY    ./static/index.html /usr/share/nginx/html/index.html
#COPY    ./static/favicon.ico /usr/share/nginx/html/favicon.ico
#COPY    --from=build /app/dist/index.js /usr/share/nginx/html/dist/index.js
COPY    ./config/nginx.conf /etc/nginx/nginx.conf
COPY    ./config/entrypoint.sh /usr/local/bin/
RUN		chmod +x /usr/local/bin/entrypoint.sh

EXPOSE	443
EXPOSE	80

ENTRYPOINT ["entrypoint.sh"]