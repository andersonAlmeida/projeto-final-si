const helpers = require('../helpers/helpers')

/** @param { import('express').Express} app */
const chatbotController = (app) => ({
  question(req, res) {
    let objJSON = {}

    if (req.query.code_user) objJSON.code_user = +req.query.code_user
    else objJSON.code_user = 0

    // if (req.query.code_session) objJSON.code_session = +req.query.code_session
    // else objJSON.code_session = 0

    if (req.query.code_before) objJSON.code_before = +req.query.code_before
    else objJSON.code_before = 0

    if (req.query.input) objJSON.input = req.query.input
    else objJSON.input = ''

    app.models.chatbot.findQuestionData(objJSON, (result) => {
      /**
       * Verifica se não retornou resultado e realiza uma nova consulta
       * buscando todos os cadastros com o mesmo código de usuário
       */
      if (result.length <= 0) {
        let code_before = +objJSON.code_before
        let objFind = {}

        /**
         * Se existe o código da pergunta anterior na url, utiliza esse código na busca
         * para buscar registro relacionados a pergunta feita anteriormente
         */
        if (code_before > 0) {
          objFind = {
            code_user: objJSON.code_user,
            code_relation: objJSON.code_before,
          }
        } else {
          objFind = {
            code_user: objJSON.code_user,
          }
        }

        app.models.chatbot.findAllQuestionData(objFind, (result) => {
          result = app.controllers.chatbotController.nlp(objJSON.input, result)
          res.send(result)
        })
      } else {
        res.send(result)
      }
    })
  },
  /**
   * Função de processamento de linguagem natural
   * @param {String} question - pergunta inserida pelo usuário
   * @param {Array} array - todas as perguntas e respostas, de um cliente específico, cadastradas
   */
  nlp(question, array) {
    let originalQuestion = `${question}`.trim()

    let findInput = 0 // armazena a quantidade de ocorrências encontradas para a pergunta que foi feita, nas respostas que estiverem sendo consultadas
    let findIndex = 0 // armazena o indice do objeto que contém a resposta da pergunta que foi feita

    // percorre o array de objetos
    for (let i = 0; i < array.length; i++) {
      question = `${question}`.trim()
      let input = `${array[i].input}`.trim()

      // se não existem perguntas cadastradas, utiliza a própria resposta da consulta
      if (input.length <= 0) {
        input = `${array[i].output}`.trim()
      }
      /**
       * Remove os caracteres da string e transforma a string para caixa baixa, a fim
       * de aumentar a acertividade do algoritmo
       * os caracteres são passados em código ascii para remover apenas a acentuação
       */
      question = helpers.strNormalize(question)
      input = helpers.strNormalize(input)
      /**
       * Remove qualquer caracter que não seja alfa-numérico, para aumentar o
       * espectro de busca e diminuir a sensibilidade das palavras digitadas
       */
      question = question.replace(/[^a-zA-Z0-9\s]/g, '')
      input = input.replace(/[^a-zA-Z0-9\s]/g, '')

      /**
       * Tokenização da string
       */
      let tokenizationQuestion = helpers.tokenization(question)
      let tokenizationInput = helpers.tokenization(input)

      // aramazena as ocorrências das palavras
      let words = 0
      for (let x = 0; x < tokenizationQuestion.length; x++) {
        /**
         * Se a palavra da pergunta do usuário está contida em uma das perguntas
         * cadastradas pelo cliente encrementa words
         */
        if (tokenizationInput.indexOf(tokenizationQuestion[x]) >= 0) words++
      }

      // se existem ocorrências
      if (words > findInput) {
        findInput = words
        findIndex = i
      }
    } // end of for

    /**
     * Se encontrou ocorrências retorna um array com o objeto referente a resposta
     */
    if (findInput > 0) {
      return [
        {
          _id: array[findIndex._id],
          code_user: array[findIndex].code_user,
          // code_session: array[findIndex].code_session,
          code_current: array[findIndex].code_current,
          code_relation: array[findIndex].code_relation,
          code_before: array[findIndex].code_before,
          input: originalQuestion,
          output: array[findIndex].output,
        },
      ]
    } else {
      return [
        {
          _id: '0',
          code_user: array[findIndex].code_user,
          // code_session: array[findIndex].code_session,
          code_current: array[findIndex].code_current,
          code_relation: array[findIndex].code_relation,
          code_before: array[findIndex].code_before,
          input: originalQuestion,
          output: 'Desculpe, mas não encontrei uma resposta adequada.',
        },
      ]
    }
  },
})

module.exports = chatbotController
