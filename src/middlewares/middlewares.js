const bodyParser = require('body-parser')
const cors = require('cors')

/** @param { import('express').Express} app */
module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cors())
}
