FROM node:18

WORKDIR /server

COPY package.json ./

# Install dependencies
RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
