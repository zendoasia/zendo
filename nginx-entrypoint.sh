#!/bin/sh
set -e

# Substitute env vars and generate actual nginx.conf
envsubst '${NGINX_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
exec nginx -g 'daemon off;'
