# blurpledit
A reddit clone built with ExpressJS and MongoDB.

#### Installation Requirements
- NodeJS
- NPM
- MongoDB
- Docker and Docker-Compose

#### Installation Instructions
1. (Optional) Install Node and NPM
2. Install Docker and Docker-Compose
3. Clone repository to local folder
4. For development, run ```npm -D install``` or ```npm install``` for production
5. Set the database uri in ```./app.js``` to your MongoDB uri
6. Create a docker-compose.yaml file
7. Add the following to docker-compose.yaml, changing values as necessary:
```
version: "3"
services:
  node:
    image: "node:15.10.0-alpine3.12"
    user: "node"
    working_dir: /home/node/app
    environment:
      - NODE_ENV=development
      - ACCESS_TOKEN_SECRET=<your random code>
      - PORT=3000
      - DB_USER=<your database username>
      - DB_PASS=<your database password>
      - DB_NAME=<your database name>
    volumes:
      - ./:/home/node/app
    ports:
      - "3000:3000"
    command: "npm start"
```

#### How to Run
1. Run ```sudo docker-compose up -d``` or ```docker-compose up -d``` if running on Windows.
2. Visit ```http://localhost:3000``` and play around!