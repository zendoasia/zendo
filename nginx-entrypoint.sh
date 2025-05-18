#!/bin/sh
set -e
envsubst '${NGINX_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'