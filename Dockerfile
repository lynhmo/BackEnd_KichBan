FROM node:20.10.0-slim

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]