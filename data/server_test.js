const express = require('express')
const app = express();

const initializeDatabases = require('././db_context.js');
const routes = require('../routes/index.js');

//start server and handle dependancy injection of the database connection
initializeDatabases().then(dbs => {
  // Initialize the application once database connections are ready.
  routes(app, dbs).listen(8080, () => console.log('Listening on port 3000'))
 }).catch(err => {
  console.error('Failed to make all database connections!')
  console.error(err)
  process.exit(1)
})
