FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

EXPOSE 3000

USER root

RUN npm install

RUN npm run build

CMD npm run start

#docker build -t nextjs15-app .
#docker run -p 3003:3000 nextjs15-app
#docker tag nextjs15-app:latest evenoahchoi/nextjs15:v1.0
#docker push evenoahchoi/nextjs15:v1.0
