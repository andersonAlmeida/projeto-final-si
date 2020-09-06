const assert = require('assert')

/** @param { import('express').Express} app */
const chatbotModel = (app) => ({
  insertData(objJSON, callback) {
    const collection = app.db.collection('chatbot')

    collection.insertOne(objJSON, (err, result) => {
      assert.equal(null, err)
      callback(result)
    })
  },
  updateData(objJSON, callback) {
    const collection = app.db.collection('chatbot')
    const code_current = objJSON.code_current

    collection.updateOne(
      { code_current: code_current },
      { $set: objJSON },
      (err, result) => {
        assert.equal(null, err)
        callback(result)
      }
    )
  },
  deleteData(objJSON, callback) {
    const collection = app.db.collection('chatbot')

    collection.deleteOne(objJSON, (err, result) => {
      assert.equal(null, err)
      callback(result)
    })
  },
  findData(objJSON, callback) {
    const collection = app.db.collection('chatbot')

    collection.find(objJSON).toArray((err, result) => {
      assert.equal(null, err)
      callback(result)
    })
  },
  findQuestionData(objJSON, callback) {
    const collection = app.db.collection('chatbot')

    collection.find(objJSON).toArray((err, result) => {
      assert.equal(null, err)

      callback(result)
    })
  },
  findAllQuestionData(objJSON, callback) {
    const collection = app.db.collection('chatbot')

    collection.find(objJSON).toArray((err, result) => {
      assert.equal(null, err)

      if (result.length <= 0) {
        collection
          .find({ code_user: objJSON.code_user })
          .toArray((err, result) => {
            callback(result)
          })
      } else {
        callback(result)
      }
    })
  },
})

module.exports = chatbotModel
