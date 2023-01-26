FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 3020

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
EXPOSE 3020
CMD ["node", "bin/www"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /
EXPOSE 3020
CMD ["nodemon", "bin/www"]
