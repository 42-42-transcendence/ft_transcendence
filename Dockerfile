FROM node:latest

# ENV REACT_APP_HOST_DOMAIN 10.12.9.6

COPY ./frontend /var/frontend

COPY .env /var/frontend/.env

WORKDIR /var/frontend

RUN npm install

RUN npm run build

COPY ./backend /var/app

COPY .env /var/app/.env

WORKDIR /var/app

RUN mkdir client

RUN cp -r ../frontend/build ./client/build

RUN npm install

EXPOSE 3000 5432

CMD ["npm", "start"]
