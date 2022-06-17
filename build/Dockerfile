# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --include=dev --ignore-scripts

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build/nginx /etc/nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]