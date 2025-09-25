FROM node:22.19 AS build
WORKDIR /app
COPY . .
RUN npm install --global corepack@latest
RUN corepack enable pnpm
RUN pnpm ci:install
RUN pnpm docs:build

FROM httpd:2.4 AS runtime
COPY --from=build /app/docs/dist /usr/local/apache2/htdocs/
EXPOSE 80