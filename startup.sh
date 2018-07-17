#!/usr/bin/env bash
cp /etc/nginx/nginx-base.conf /etc/nginx/conf.d/default.conf

cp -r ./dist/* /usr/share/nginx/html/
nginx -g 'daemon off;'