const Imports = require("./querries.js");
var querries = new Imports.Querries();






async function foo(){
  var data = await querries.listDatabasesQuery();
  console.log(data);
}


foo();
