var express = require('express');
const querries = require("./data/querries.js");
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
    getSubjectAreas();
});

//returns the network data for the specified subject area
const uri = "mongodb+srv://gordon:kj52Boss@cluster0.39ny6.mongodb.net/test?authSource=admin&replicaSet=atlas-ifegny-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
var MongoClient = require('mongodb').MongoClient;


async function getSubjectAreas(){

  var subjectAreas = [];
   await MongoClient.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true}, async function(err, db) {
     console.log(db)
    if (err) throw err;
    var dbo = db.db("prv_test");
//    console.log(db)
      return await dbo.collection("courses").findOne({}, async function(err, result) {
      if (err) throw err;
      //console.log(result)
    //  return result;
    //  return await result.subjectAreas.forEach(async function(item){
      //  return item;
    //    subjectAreas.push(item.name);
  //      await console.log(item.name)

    //  })


      db.close();
    });

  });

}


async function getDbo(){
  var dbo;

   await MongoClient.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true}, async function(err, db) {
     var dbo = await db.db("prv_test");
    //  console.log(db)
  });
}

async function getSubjectAreas2 (){
   var dbo = await getDbo();

/*  var result;
  result= (async () => { result = await dbo.collection("courses").findOne({})
    .then(
            (d)=>{
              console.log(d)
              result=d;
            }
        )}
   )();
   console.log(result)
   return result;
*/
  }

app.get("/subjectAreas", async function(req, res){
   const subjectAreas = await getSubjectAreas2();
  // console.log(subjectAreas)
  // querries.getSubjectAreas().then(function(stuff){
  //    console.log(stuff)
//   });

   await res.json({subjectAreas:subjectAreas})
});

app.get('/subjectAreaCourses', function(req, res) {
   var organization = req.query.organization;
   if(organization != null){
     res.json({ organization: organization });
   }

});

//routes to serve up any js files requested in the html pages
app.get('/network.js', function(req, res){
    res.sendFile(__dirname + '/src/network.js');
});



app.listen(8080);
