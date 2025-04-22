#!/bin/sh

# Generating a self signed certificate
# -x509 = self signed 
# -out = certificate file
# -key = key file
# -subj = mandatory, subject describes ID that emits certificate
#  CN (Common Name) is mandatory because checked by the client when establishing HTTPS
#  O (Operation) name of structure or entity
#  ST (state)
#  C (country)
# -nodes = no passphrase

mkdir -p /etc/nginx/sites-enabled

if [ ! -f /etc/ssl/localhost.key ]; then
    openssl genpkey -algorithm RSA -out /etc/ssl/localhost.key
	echo "Key generated"
fi

if [ ! -f /etc/ssl/transcendance.crt ]; then
    openssl req -newkey rsa:4096 \
	-nodes \
	-x509 \
	-key /etc/ssl/localhost.key \
	-out /etc/ssl/localhost.crt \
	-subj "/C=FR/ST=Lyon/O=42/UID=transcendance/CN=localhost"
	echo "Self-signed certificate generated"
	echo "include /etc/nginx/sites-available/localhost.conf;" > /etc/nginx/sites-enabled/localhost.conf
fi

# Daemon : Nginx would launch in daemon mode, in the background
# but he is the main process and should stay front otherwise the container would stop
# -g : Allow ability to give global directions in command lines, taking over nginx.conf

echo "Launching nginx"

nginx -g "daemon off;"
