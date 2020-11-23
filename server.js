const express = require('express')
const querries = require("./data/querries.js")
const path = require('path');
const initializeDatabases = require('./data/db_context.js');
const routes = require('./routes/db_routes.js');

const app = express();

const PORT = 8080;

//start server and handle dependancy injection of the database connection
initializeDatabases().then(dbo => {

  // Initialize the application once database connections are ready.
  routes(app, dbo).listen(PORT, () => console.log('Listening on port ' + PORT +":"))

  app.use(express.static(__dirname + '/lib'));

  //routes to serve up any js files requested in the html pages
  app.get('/network.js', function(req, res){
      res.sendFile(__dirname + '/src/network.js');
  });

  app.get('/graph.js', function(req, res){
      res.sendFile(__dirname + '/src/graph.js');
  });

  app.get('/vis.js', function(req, res){
      res.sendFile(__dirname + '/lib/vis.js');
  });

  app.get('/vis.cs', function(req, res){
      res.sendFile(__dirname + '/lib/vis.cs');
  });


  //loats the network.html page into the browser
  app.get('/network', function(req, res) {
      res.sendFile(path.join(__dirname + '/views/network.html'));
  });

  //route to query for the list of subject areas
  app.get("/subjectAreas",  async function(req, res){
    var subjectAreas = await querries.getSubjectAreas(dbo)
    await res.json({subjectAreas});
  });

  app.get("/majorOptions", async function(req, res){
      var majorOptions = await querries.getMajorOptions(dbo, req.query.subjectArea);
      await res.json({majorOptions});
  });


  app.get("/subjectAreaNetworkData", async function(req, res){
      var courses = await querries.getSubjectAreaNetworkData(dbo, req.query.subjectArea)
      await res.json({courses});
  });


  app.get("/majorOptionNetworkData", async function(req, res){
     var data = await querries.getMajorOptionNetworkData(dbo, req.query.subjectArea, req.query.majorOption);
     await res.json({data});
  });


  app.get("/networkForCourse", async function(req, res){
     var courses = await querries.getNetworkForCourse(dbo, req.query.subjectArea, req.query.course);
     await res.json({courses});
  });

  //route for getting course data for a single course in the specified subjec area
/*  app.get("/getCourseDataAjax", async function(req, res){
     var course = await querries.getCourseData(dbo, req.query.subjectArea, req.query.course)
  })*/

  app.get("/subjectAreaCoursesList", async function(req, res){
      var courses = await querries.getSubjectAreaCoursesList(dbo, req.query.subjectArea)
      await res.json({courses});
  });


  app.get("/majorOptionCoursesList", async function(req, res){
      var courses = await querries.getMajorOptionCoursesList(dbo, req.query.subjectArea, req.query.majorOption);
      await res.json({courses});
  });

 }).catch(err => {
  console.error('Error: Failed to connect to database! See datails below:')
  console.error(err)
  process.exit(1)
})
