#!/bin/sh
set -e

# Load API proxy vars from the image .env file. Does not override variables
# already set by the runtime (docker run -e, ECS task env, etc.).
load_image_env() {
  f=/etc/patient-portal/.env
  [ ! -r "$f" ] && return 0
  while IFS= read -r line || [ -n "$line" ]; do
    line=$(printf '%s' "$line" | tr -d '\r')
    case "$line" in
      '' | \#*) continue ;;
      VITE_API_SYMFONY_BASE_URL=*|VITE_API_CRAFT_BASE_URL=*|SYMFONY_API_ORIGIN=*|CRAFT_API_ORIGIN=*)
        key=${line%%=*}
        eval "test \"\${$key+x}\" = x" && continue
        export "$line" || true
        ;;
    esac
  done <"$f"
}

load_image_env

SYMFONY_API_ORIGIN="${SYMFONY_API_ORIGIN:-$VITE_API_SYMFONY_BASE_URL}"
CRAFT_API_ORIGIN="${CRAFT_API_ORIGIN:-$VITE_API_CRAFT_BASE_URL}"

if [ -z "$SYMFONY_API_ORIGIN" ] || [ -z "$CRAFT_API_ORIGIN" ]; then
  echo "error: nginx needs API origins. Bake a .env into the image (build with .env in context), or set at runtime:"
  echo "       VITE_API_SYMFONY_BASE_URL / VITE_API_CRAFT_BASE_URL or SYMFONY_API_ORIGIN / CRAFT_API_ORIGIN"
  exit 1
fi

export SYMFONY_API_ORIGIN CRAFT_API_ORIGIN
envsubst '${SYMFONY_API_ORIGIN} ${CRAFT_API_ORIGIN}' </etc/nginx/nginx.conf.template >/etc/nginx/nginx.conf

exec "$@"
