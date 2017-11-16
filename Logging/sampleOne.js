const express = require('express');
const request = require('superagent');
//const PORT = process.env.PORT;

const redis = require('redis');
//const REDIS_PORT = process.env.REDIS_PORT;
//const REDIS_PORT = 6379;
//const client = redis.createClient(6379, 'redis')
//client.on('connect', () => console.log('Connected to Redis') )

const app = express();
const client = redis.createClient(6379, 'redisDB');



function respond(org, numberOfRepos) {
    return `Organization "${org}" has ${numberOfRepos} public repositories.`;
}

function getNumberOfRepos(req, res, next) {
    const org = req.query.org;
   request.get(`https://api.github.com/orgs/${org}/repos`, function (err, response) {
        if (err) throw err;

        // response.body contains an array of public repositories
        var repoNumber = response.body.length;
        client.setex(org, 5, repoNumber);
        res.send(respond(org, repoNumber));
    });
};

app.get('/repos', cache, getNumberOfRepos);

function cache(req, res, next){
  const org = req.query.org;
  client.get(org, function(err,data){
    if(err) throw err;

    if(data !=null){
      res.send(respond(org, data));
    }else{
      next();
    }
  });
}

app.listen(5000, function () {
    console.log('app listening on port', 5000);
});
