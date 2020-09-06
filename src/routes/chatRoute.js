/** @param { import('express').Express} app */
module.exports = (app) => {
  const chatbot = app.controllers.chatbotController

  app.get('/chat/question', chatbot.question)
}
