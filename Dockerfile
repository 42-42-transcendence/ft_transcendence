FROM node:latest

ARG REACT_APP_HOST_DOMAIN
ARG POSTGRES_PORT
ARG HOST_PORT
ARG REACT_APP_HOST_PORT

ENV REACT_APP_HOST_DOMAIN $REACT_APP_HOST_DOMAIN
ENV POSTGRES_PORT $POSTGRES_PORT
ENV HOST_PORT $HOST_PORT
ENV REACT_APP_HOST_PORT $REACT_APP_HOST_PORT

RUN npm i -g npm@latest npm-check-updates@latest

COPY ./front /var/front

# COPY .env /var/frontend/.env

WORKDIR /var/front

RUN ncu

RUN ncu -u

RUN npm install

RUN npm run build

COPY ./backend /var/app

COPY .env /var/app/.env

WORKDIR /var/app

RUN mkdir client

RUN cp -r ../front/build ./client/build

RUN ncu

# 패키지 충돌 발생 reflect-metadata - @nestjs/common@10.2.10
# RUN ncu -u

RUN npm install

EXPOSE $HOST_PORT $POSTGRES_PORT

CMD ["npm", "start"]
