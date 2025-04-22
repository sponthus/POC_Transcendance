FROM nginx:stable

RUN apt update -y \
	&& apt install -y \
	nginx \
	openssl

COPY	./conf/nginx.conf /etc/nginx/sites-available/localhost.conf
COPY	./tools/docker-entrypoint.sh /usr/local/bin/
RUN		chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE	443
EXPOSE	80

ENTRYPOINT	["docker-entrypoint.sh"]