var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.post('/signin', function(req, res) {
    var user_pwd = req.body.pwd;
    console.log('user_pwd... '+user_pwd)
    if(user_pwd == 'test'){      
      res.redirect(301, '/sucess_template.html');
    }else{
      res.send("Invalid pwd");
      // res.redirect(301, 'http://example.com');      
    }   
});


// macip:  http://138.12.195.27:3000/index.html#

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
