var express = require("express");
var multer = require('multer');
var fs = require("fs");

var app = express();

console.log('__dirname... '+__dirname);

//app.use("/", express.static(__dirname));

app.use('/uploads', express.static(__dirname + '/uploads'));

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now()+'-' +file.fieldname);
    }
});
var upload = multer({
    storage: storage
}).single('userPhoto');



app.get('/index.htm', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo', function(req, res) {
    upload(req, res, function(err) {
        console.log(req.file);
        if (err) {
            return res.end("Error uploading file.");
        } else {
            var obj = {};
            obj.file = req.file;
            res.writeHead(200, {"Content-Type": "application/json"});
            if (req.file.mimetype == 'text/plain') {
                fs.readFile(req.file.path,'utf8', function(err, data) {
                    console.log(data);
                    obj.data = data;
                      return res.end(JSON.stringify(obj));
                    //return res.end("File is uploaded");
                });
            }else{
                return res.end(JSON.stringify(obj));
            }
        }
    });
});

app.listen(3000, function() {
    console.log("Working on port 3000");
});
