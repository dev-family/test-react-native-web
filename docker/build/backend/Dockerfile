FROM node:20.13.1-alpine as base

RUN corepack enable

# RUN mkdir /app && chown node:node /app

# RUN apk add --update --no-cache libc6-compat && \
#   npm install -g yarn

USER node

###

FROM base as dev

COPY --chown=node ./apps/mobile /mobile

WORKDIR /mobile

RUN pnpm install 

RUN pnpm run web:build




COPY --chown=node ./apps/backend /back

WORKDIR /back

RUN pnpm install

RUN mkdir public

RUN mv /mobile/dist /back/public/webapp

RUN touch text.txt

RUN sed -i -e 's/assets/webapp\/assets/g' /back/public/webapp/index.html 

CMD ["pnpm" , "run", "dev"]

# ###

# FROM dev as build

# RUN yarn build

# ##

# FROM build as prod

# CMD ["yarn", "start"]


FROM nginx:1.25-alpine as nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/build/backend/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/build/backend/server.conf /etc/nginx/templates/nginx.conf.template

CMD ["nginx", "-g", "daemon off;"]