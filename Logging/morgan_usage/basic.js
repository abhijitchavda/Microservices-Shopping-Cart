//Creating a basic nodejs server using core nodejs functions.
//Using morgan middleware to logg the http requests.

var finalhandler = require('finalhandler')
var http = require('http')
var morgan = require('morgan')

// create "middleware"
var logger = morgan('combined')

http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  logger(req, res, function (err) {
    if (err) return done(err)

    // respond to request
    res.setHeader('content-type', 'text/plain')
    res.end('hello, world!')
  })
})
