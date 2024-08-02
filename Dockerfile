FROM node:16

WORKDIR /app
COPY TTV-PROJECT/package*.json ./
RUN npm install
COPY TTV-PROJECT ./
EXPOSE 3000
CMD ["node", "server.js"]