FROM stefanscherer/node-windows:10.14.1-nanoserver-1803 as node

WORKDIR /webapp
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD npm start