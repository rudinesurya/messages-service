FROM node:18
RUN mkdir -p /var/www/messages-service
WORKDIR /var/www/messages-service
ADD . /var/www/messages-service
RUN npm install
CMD npm run build && npm run start:prod