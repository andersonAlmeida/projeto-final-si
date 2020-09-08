// const { dockStart } = require('@nlpjs/basic')
const { NlpManager } = require('node-nlp')
const fs = require('fs')

/** @param { import('express').Express} app */
module.exports = (app) => ({
  nlp: new NlpManager({
    languages: ['pt'],
    // forceNER: true,
    extractEntities: true,
  }),
  async startNlp() {
    const nlp = app.controllers.nlpController.nlp
    const data = await fs.readFileSync('./src/dictionaries/model.nlp', 'utf8')

    if (!data) {
      nlp.import(data)
    } else {
      console.log('>>>>> Treinando a budega')
      /**
       * addDocument(locale, utterance, intent) {
       */
      nlp.addDocument('pt', 'até mais', 'despedida')
      nlp.addDocument('pt', 'obrigado por enquanto', 'despedida')
      nlp.addDocument('pt', 'vejo você depois', 'despedida')
      nlp.addDocument('pt', 'tchau', 'despedida')
      nlp.addDocument('pt', 'tenho que ir', 'despedida')

      nlp.addDocument('pt', 'olá', 'saudacao')
      nlp.addDocument('pt', 'oi', 'saudacao')
      nlp.addDocument('pt', 'oie', 'saudacao')

      nlp.addDocument('pt', 'tem horário?', 'agendamento')
      nlp.addDocument('pt', 'quais são os horários disponíveis?', 'agendamento')
      nlp.addDocument('pt', 'Posso agendar?', 'agendamento')
      nlp.addDocument(
        'pt',
        'gostaria de um agendamento para %date%',
        'agendamento'
      )

      nlp.addDocument('pt', 'qual o valor?', 'orcamento')
      nlp.addDocument('pt', 'quanto custa?', 'orcamento')

      // Train also the NLG
      /**
       * addAnswer(locale, intent, answer, opts) {
       */
      nlp.addAnswer('pt', 'despedida', 'Até mais')
      nlp.addAnswer('pt', 'despedida', 'vejo você em breve!')

      nlp.addAnswer('pt', 'saudacao', 'olá!')
      nlp.addAnswer('pt', 'saudacao', 'oii!')
      nlp.addAnswer('pt', 'saudacao', 'oie!')
      nlp.addAnswer('pt', 'saudacao', 'oi!')
      nlp.addAnswer('pt', 'saudacao', 'oi, seja bem-vinda(o)!')

      nlp.addAnswer('pt', 'orcamento', 'O valor é R$ 300,00')

      nlp.addAnswer('pt', 'agendamento', 'Para quando gostaria?')

      // await nlp.addCorpus('./corpus-en.json')
      await nlp.train()
      nlp.save('./src/dictionaries/model.nlp', true)
    }
  },
  async nlpProccessUtterance(utterance) {
    const nlp = app.controllers.nlpController.nlp
    const response = await nlp.process('pt', utterance)
    console.log(JSON.stringify(response))

    if (response.answer) {
      return response.answer
    } else {
      return 'Desculpe. Não consegui compreender. Poderia repetir de uma outra forma?'
    }
  },
})
