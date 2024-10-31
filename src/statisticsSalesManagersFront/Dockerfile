FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
# RUN npm run build
# RUN npm install -g serve
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
