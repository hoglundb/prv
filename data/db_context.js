const MongoClient = require('mongodb').MongoClient

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
const TEST_URI = "mongodb+srv://gordon:kj52Boss@cluster0.39ny6.mongodb.net/test?authSource=admin&replicaSet=atlas-ifegny-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"


//returns a promise to the database object
function connect(url) {
  return MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}).then(client => client.db("prv_test"))
}


//function to init databases
module.exports = async function() {
  let databases = await connect(TEST_URI);
  return databases;
  console.log(databases)
}
