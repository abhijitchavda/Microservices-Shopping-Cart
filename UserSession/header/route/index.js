var express = require('express');
var router = express.Router();
var csrf = require('csurf');


var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
});

router.get('/user/signup'), function(req,res,next){
    res.render('user/signup',{csrfTaken:req.csrfToken()});
}

module.exports = router;
