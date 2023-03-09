FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY index.html ./
COPY src ./src
RUN npm ci
RUN npm run build

FROM caddy:alpine
COPY --from=0 /app/site/ /srv/
COPY ./Caddyfile /etc/caddy/Caddyfile