FROM node:20

WORKDIR /app

COPY tools/backend/package*.json ./
RUN npm install

COPY ../../tools/backend ./
COPY ../../tools/shared /shared

EXPOSE 3000

RUN npm install

CMD ["npm", "run", "server"]
