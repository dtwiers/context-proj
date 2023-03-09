FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN npm run build
COPY ./site/ ./site

FROM caddy:alpine
RUN apk 
COPY ./site/ /srv/
COPY ./Caddyfile /etc/caddy/Caddyfile