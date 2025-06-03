FROM node:20

#WORKDIR /app

#COPY package*.json ./
COPY entrypoint.sh ./
#RUN npm install

RUN chmod +x entrypoint.sh

#EXPOSE 3000

#COPY . .

#CMD ["npx", "nodemon", "--watch", "src", "src/app.js"]

#CMD ["sh", "-c", "tail -f /dev/null"]

ENTRYPOINT ["/entrypoint.sh"]