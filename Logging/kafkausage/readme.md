### Description.

This is a simple Nodejs login app which is wired to output user activity(login, logout) to a Kafka topic.
Members can use this code for testing and reference to update their modules accordingly.


### Setup

1. install nodejs
2. install npm
3. install kafka.
3. download folder and execute the app on local machine.
4. The app allows to Register New user/ Login / Logout existing user.
5. Create a Kafka consumer to listen to the activty topics.


### Observations.

1. User activity is captured in the Kafka topic.
2. This capture is realtime and can be used for further analysis.
3. Multiple topics can be setup to log various kinds of data.
