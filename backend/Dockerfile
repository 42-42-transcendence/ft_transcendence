FROM node:latest As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development
RUN npm install --save-dev @types/multer

COPY . .

RUN npm run build

# migration 스크립트 추가
CMD ["npm", "run", "migration:run"]

FROM node:latest as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main"]
