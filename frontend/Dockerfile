FROM node:20-alpine AS build

WORKDIR /app

# RUN apt upgrade -y \
# 	&& apt install -y \
# 	tsc

RUN npm install -g npm@11.4.1

#EXPOSE 5173

CMD ["npm", "run", "build"]
#CMD ["sh", "-c", "cp index.html dist && tail -f /dev/null"]

#Now : tsc --watch to compile during dev
#TODO : Make it a multi-stage docker with compilation, then become a nginx container