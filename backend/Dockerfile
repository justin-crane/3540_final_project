FROM node:16-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001 3002
CMD ["npm", "run", "start"]
