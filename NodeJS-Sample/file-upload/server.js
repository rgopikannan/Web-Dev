var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

console.log('__dirname...  '+__dirname);

app.use("/", express.static(__dirname));
//app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer({ dest: '/tmp/'}));

var upload = multer({ dest: 'uploads/' });

var type = upload.single('refFile');

app.get('/index.htm', function (req, res) {
   //res.sendFile( __dirname + "/" + "upload/index.html" );
   res.sendFile( __dirname + "/" + "index.html" );
});

app.post('/file_upload', type, function (req, res) {
   console.log(req.file);
   //console.log(req.file.path);
   //console.log(req.file.mimetype);
   var file = __dirname + "/" + req.file.fieldname;

   //res.end( "success...");

   fs.readFile( req.file.path, function (err, data) {
      console.log('data...   '+data);
      fs.writeFile(file, data, function (err) {
         if( err ){
            console.log( err );
            }else{
               response = {
                  message:'File uploaded successfully--- ',
                  filename:req.file.fieldname
               };
            }
         //console.log( response.filename );
         res.end( JSON.stringify( response ) );
      });
   });
});

var server = app.listen(8082, '138.12.195.27', function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});
