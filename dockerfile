from node:alpine

maintainer Sean Dyon

# Create app directory
WORKDIR /opt/4iq-demo

COPY package*.json ./

# some of the depends require node-gyp which means we need to setup build tools
# this is only required when using node:alpine
RUN apk add --no-cache make gcc g++ python && \
 npm install && \
 apk del make gcc g++ python
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
