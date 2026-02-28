FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose the API port
EXPOSE 8000

# Start the server
CMD [ "node", "server.js" ]
