FROM node:20

WORKDIR /app

RUN npm install --save-dev nodemon

#EXPOSE 3000

CMD ["npx", "nodemon", "--watch", "src", "src/app.js"]

#CMD ["sh", "-c", "tail -f /dev/null"]
