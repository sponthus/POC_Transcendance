FROM node:20-alpine AS build

#WORKDIR /app

#COPY package*.json ./

#RUN ls -la && cat package.json

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
#RUN npm install

#COPY . .

#EXPOSE 5173

#CMD ["sh", "-c", "tail -f /dev/null"]
#CMD ["sh", "-c", "cp index.html dist && cp styles.css dist"]
#CMD ["npm", "run", "build"]

#Now : tsc --watch to compile during dev
#TODO : Make it a multi-stage docker with compilation, then become a nginx container

ENTRYPOINT ["/entrypoint.sh"]