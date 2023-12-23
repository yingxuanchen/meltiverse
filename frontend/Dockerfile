FROM node:18-alpine3.18
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY [host machine] [container] (first path is relative to the Dockerfile, second is relative to root on the container)
COPY package.json .
COPY package-lock.json .
RUN npm install
# RUN npm install # -g npm @10.2.3
COPY . .
# EXPOSE 3000
CMD ["npm", "start"]
# RUN npm run build