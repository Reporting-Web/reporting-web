#!/bin/bash
cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak  # Backup (optional)
nginx -g "daemon off;"