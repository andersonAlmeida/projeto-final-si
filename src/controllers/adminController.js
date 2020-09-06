/** @param { import('express').Express} app */
const adminController = (app) => ({
  insert(req, res) {
    let objJSON = {}

    // verifica se o usuário existe
    if (req.body.code_user) objJSON.code_user = req.body.code_user
    else objJSON.code_user = 0

    // controla a sessão do usuário que está interagingo com o chatbot
    // if (req.body.code_session) objJSON.code_session = req.body.code_session
    // else objJSON.code_session = 0

    // armazena o código com a resposta que será cadastrada
    if (req.body.code_current) objJSON.code_current = req.body.code_current
    else objJSON.code_current = app.controllers.adminController.cod()

    if (req.body.code_relation) objJSON.code_relation = req.body.code_relation
    else objJSON.code_relation = 0

    // verifica se existe o código da última pergunta feita
    if (req.body.code_before) objJSON.code_before = req.body.code_before
    else objJSON.code_before = 0

    // verifica se existe uma pergunta
    if (req.body.input) objJSON.input = req.body.input
    else objJSON.input = ''

    // verifica se existe uma resposta
    if (req.body.output) objJSON.output = req.body.output
    else objJSON.output = 'Desculpe, mas não encontrei uma resposta adequada.'

    app.models.chatbot.insertData(objJSON, (result) => {
      res.send(result)
    })
  },

  update(req, res) {
    let objJSON = {}

    // verifica se o usuário existe
    if (req.body.code_user) objJSON.code_user = req.body.code_user

    // controla a sessão do usuário que está interagingo com o chatbot
    // if (req.body.code_session) objJSON.code_session = req.body.code_session

    // armazena o código com a resposta que será cadastrada
    if (req.body.code_current) objJSON.code_current = req.body.code_current

    if (req.body.code_relation) objJSON.code_relation = req.body.code_relation

    // verifica se existe o código da última pergunta feita
    if (req.body.code_before) objJSON.code_before = req.body.code_before

    // verifica se existe uma pergunta
    if (req.body.input) objJSON.input = req.body.input

    // verifica se existe uma resposta
    if (req.body.output) objJSON.output = req.body.output

    app.models.chatbot.updateData(objJSON, (result) => {
      res.send(result)
    })
  },

  delete(req, res) {
    let objJSON = {}

    // verifica se o usuário existe
    if (req.body.code_user) objJSON.code_user = req.body.code_user

    // controla a sessão do usuário que está interagingo com o chatbot
    // if (req.body.code_session) objJSON.code_session = req.body.code_session

    // armazena o código com a resposta que será cadastrada
    if (req.body.code_current) objJSON.code_current = req.body.code_current

    if (req.body.code_relation) objJSON.code_relation = req.body.code_relation

    // verifica se existe o código da última pergunta feita
    if (req.body.code_before) objJSON.code_before = req.body.code_before

    // verifica se existe uma pergunta
    if (req.body.input) objJSON.input = req.body.input

    // verifica se existe uma resposta
    if (req.body.output) objJSON.output = req.body.output

    app.models.chatbot.deleteData(objJSON, (result) => {
      res.send(result)
    })
  },

  find(req, res) {
    let objJSON = {}

    // verifica se o usuário existe
    if (req.body.code_user) objJSON.code_user = req.body.code_user

    // controla a sessão do usuário que está interagingo com o chatbot
    // if (req.body.code_session) objJSON.code_session = req.body.code_session

    // armazena o código com a resposta que será cadastrada
    if (req.body.code_current) objJSON.code_current = req.body.code_current

    if (req.body.code_relation) objJSON.code_relation = req.body.code_relation

    // verifica se existe o código da última pergunta feita
    if (req.body.code_before) objJSON.code_before = req.body.code_before

    // verifica se existe uma pergunta
    if (req.body.input) objJSON.input = req.body.input

    // verifica se existe uma resposta
    if (req.body.output) objJSON.output = req.body.output

    app.models.chatbot.findData(objJSON, (result) => {
      res.send(result)
    })
  },

  /**
   * Gera um código único
   * @returns {Number} result - código gerado
   */
  cod() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const seconds = date.getSeconds()
    const mileseconds = date.getMilliseconds()

    return +parseFloat(
      Number(`${year}${month}${day}${hour}${minute}${seconds}${mileseconds}`) /
        2
    ).toFixed(0)
  },
})

module.exports = adminController
