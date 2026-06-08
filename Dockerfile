FROM node:22-alpine AS build-deps

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

# Snapshot .env from the build context so the nginx stage can load API origins at runtime
# without --env-file (CI builds without .env get a placeholder; inject vars at deploy or use BuildKit secrets).
RUN if [ -f .env ]; then :; else \
  printf '%s\n' \
    '# No .env was present in the Docker build context.' \
    '# Set VITE_API_SYMFONY_BASE_URL and VITE_API_CRAFT_BASE_URL at runtime, or rebuild with .env next to the Dockerfile.' \
    > /app/.env; \
  fi

RUN npm run build

# Run a server 
FROM nginx:1.26.0-alpine

RUN apk add --no-cache gettext

COPY --from=build-deps /app/dist /usr/share/nginx/html
COPY --from=build-deps /app/.env /etc/patient-portal/.env

COPY devops/nginx.conf.template /etc/nginx/nginx.conf.template
COPY devops/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]