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

  //routes to serve up any js files requested in the html pages
  app.get('/network.js', function(req, res){
      res.sendFile(__dirname + '/src/network.js');
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


 }).catch(err => {
  console.error('Error: Failed to connect to database! See datails below:')
  console.error(err)
  process.exit(1)
})
