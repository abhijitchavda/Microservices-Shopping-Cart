#### Mongo db

I have used the docker container from dockerhub.

> docker run --name mongodb -d mongo:latest

Verification

> docker ps -a 
> docker logs mongodb


To enter the shell

> docker exec -it mongodb



#### Robo Mongo client

1. Download and extract RoboMongo GUI client for mongodb.
   [here](https://robomongo.org/download)
   
2. Go to Extract the file
  > $ tar -xvzf robomongo-0.9.0-linux-x86_64-0xxxxx.tar.gz
  
3. Go to the robo../bin and run the .sh file.


