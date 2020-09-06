const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

/** @param { import('express').Express} app */
module.exports = (app) => {
  const url = 'mongodb://localhost:27017'
  const dbName = 'chatbotdb'

  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      // se o erro não for igual a null, gera uma exceção
      assert.equal(null, err)
      console.log('Mongo conectado com sucesso')

      app.db = client.db(dbName)
    }
  )
}
