module.exports = function(app, dbs) {

  app.get('/test', (req, res) => {
    dbs.test.collection('test').find({}).toArray((err, docs) => {

      if (err) {
        console.log(err)
        res.error(err)
      } else {
        res.json(docs)
      }
    })
  })

  return app;
}
