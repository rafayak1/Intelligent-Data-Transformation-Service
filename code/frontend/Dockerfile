FROM node:16-alpine as build

WORKDIR /app

# Install dependencies and build the app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]