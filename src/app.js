const express = require('express')
const consign = require('consign')

const app = express()
const port = 3000

consign({ cwd: __dirname })
  .then('./config/database.js')
  .then('./middlewares')
  .then('./models')
  .then('./controllers')
  .then('./routes')
  .into(app)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
