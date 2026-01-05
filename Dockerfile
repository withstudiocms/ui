FROM node:lts AS build

WORKDIR /app
COPY . .

RUN npm install --global corepack@latest
RUN corepack enable pnpm

RUN pnpm ci:install
RUN pnpm docs:build

FROM nginx:alpine AS runtime
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/docs/dist /usr/share/nginx/html
EXPOSE 8080