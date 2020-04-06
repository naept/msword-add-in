FROM node as build_js
WORKDIR /var/www
COPY . /var/www
RUN mkdir -p -m 755 node_modules
RUN npm install
RUN npm run build

FROM nginx:alpine
ADD vhost.conf /etc/nginx/conf.d/default.conf
COPY --from=build_js /var/www/dist/ /var/www/msword_addin
