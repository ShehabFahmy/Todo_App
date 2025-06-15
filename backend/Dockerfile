FROM node:alpine

WORKDIR /app

# Copy only the package files first to cache `npm install`
COPY package*.json ./
RUN npm install

# Now copy the rest of your source code
COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
