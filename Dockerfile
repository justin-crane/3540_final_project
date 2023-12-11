FROM node:18-alpine
WORKDIR /3540_Final_Project/backend
COPY /backend .
RUN npm install
WORKDIR /3540_Final_Project/frontend
COPY /frontend .
COPY ./package*.json ./
RUN npm install
COPY . ./
RUN npm run build
RUN mv ./build ../backend
WORKDIR /3540_Final_Project/backend
EXPOSE 3000 3001 3002 
CMD ["npm", "run", "start"]
