# FROM node:18 AS build 
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --force 
# COPY . .
# RUN npm run build
# FROM nginx:stable-alpine
# COPY --from=build /app/dist/browser/ /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY scripts/entrypoint.sh /entrypoint.sh  
# ENTRYPOINT ["/entrypoint.sh"]
# EXPOSE 84
 


FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build --configuration=production

FROM nginx:stable-alpine
COPY --from=builder /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh  
ENTRYPOINT ["/entrypoint.sh"]

CMD ["/bin/sh", "-c", "echo 'Entrypoint finished.  If you see this, Nginx failed to start.'"] 