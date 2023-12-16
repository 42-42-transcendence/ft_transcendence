FROM node:latest

ARG REACT_APP_HOST_DOMAIN
ARG POSTGRES_PORT
ARG HOST_PORT
ARG REACT_APP_HOST_PORT
ARG REACT_APP_HOST_REDIRECT_URI

ENV REACT_APP_HOST_DOMAIN $REACT_APP_HOST_DOMAIN
ENV POSTGRES_PORT $POSTGRES_PORT
ENV HOST_PORT $HOST_PORT
ENV REACT_APP_HOST_PORT $REACT_APP_HOST_PORT
ENV REACT_APP_HOST_REDIRECT_URI $REACT_APP_HOST_REDIRECT_URI

RUN npm i -g npm@latest npm-check-updates@latest

COPY ./front /var/front

WORKDIR /var/front

RUN ncu > ncu_frontend.log

RUN npm install

RUN npm run build

COPY ./backend /var/app

COPY .env /var/app/.env

WORKDIR /var/app

RUN mkdir client

RUN cp -r ../front/build ./client/build

RUN ncu > ncu_backend.log

RUN npm install

EXPOSE $HOST_PORT $POSTGRES_PORT

CMD ["npm", "start"]
