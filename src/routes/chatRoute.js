/** @param { import('express').Express} app */
module.exports = (app) => {
  const chatbot = app.controllers.chatbotController
  const nlp = app.controllers.nlpController

  app.get('/chat/question', chatbot.question)

  app.get('/nlp/intents', nlp.getIntents)
  app.post('/nlp/intents', nlp.createIntent)
  app.delete('/nlp/intent', nlp.deleteIntent)
  app.put('/nlp/intent', nlp.updateIntent)
}
