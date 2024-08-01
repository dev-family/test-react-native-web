FROM node:20.3.0-alpine as base

RUN mkdir /app && chown node:node /app

USER node

WORKDIR /app

###

FROM base as dev

COPY --chown=node ./apps/admin /app

RUN npm i

ARG VITE_API_URL

CMD ["npm" , "run", "dev"]

###

FROM base as assets

COPY --chown=node ./apps/admin /app

RUN npm i

ARG VITE_API_URL
RUN npm run build

###

FROM nginx:1.25-alpine as nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/build/admin/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/build/admin/server.conf /etc/nginx/templates/nginx.conf.template

COPY --from=assets /app/dist /app

CMD ["nginx", "-g", "daemon off;"]