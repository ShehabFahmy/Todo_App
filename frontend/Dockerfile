# Build stage
FROM node:18 AS build_stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV REACT_APP_API_URL=/api
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build

# Deploy stage
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy React build files to NGINX's public folder
COPY --from=build_stage /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
