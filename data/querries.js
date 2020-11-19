
class Querries{
     constructor(){
       const {MongoClient} = require('mongodb');
       const uri = "mongodb+srv://gordon:kj52Boss@cluster0.39ny6.mongodb.net/test?authSource=admin&replicaSet=atlas-ifegny-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"; // "mongodb+srv://gordon:kj52Boss@cluster0-shard-00-02.39ny6.mongodb.net/test?retryWrites=true&w=majority";
       this.client = new MongoClient(uri, {useUnifiedTopology: true});
     }


     async getDbContext(){
         return this.connection;
     }

     async listDatabasesQuery(){
       try{
          await this.client.connect();
          var databasesList = await this.client.db().admin().listDatabases();
         // console.log(databasesList);
         return databasesList;
        // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
          }
       catch (e){
          console.error(e);
       }
       finally {
         console.log("closing");
           await this.client.close();
        }

     }
}

module.exports.Querries = Querries;
