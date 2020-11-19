var express = require('express');
var app = express();
var path = require('path');

var pathToViews = path.join(__dirname + '/views/');

//loads the index page into the browser
app.get('/', function(req, res) {
    res.sendFile(path.join(pathToViews + 'index.html'));
});

//loads the index page into the browser
app.get('/index', function(req, res) {
    res.sendFile(path.join(pathToViews + 'index.html'));
});

//loats the network.html page into the browser
app.get('/network', function(req, res) {
    res.sendFile(path.join(pathToViews + 'network.html'));
});

//returns the network data for the specified subject area
app.get('/subjectAreaCourses', function(req, res) {
   var organization = req.query.organization;
   if(organization != null){
     res.json({ organization: organization });
   }

});



app.listen(8080);
