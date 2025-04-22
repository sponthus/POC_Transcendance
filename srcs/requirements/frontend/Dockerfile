FROM node:20-alpine AS build

WORKDIR /app

# RUN apt upgrade -y \
# 	&& apt install -y \
# 	tsc

COPY tools/frontend/package*.json ./
RUN npm install

COPY ../../tools/frontend ./
COPY ../../tools/shared /shared

# RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]

# VITE server for dev, otherwise will compile static files on a volume that will be served directly by nginx
