const dialogflow = require('@google-cloud/dialogflow')
const uuid = require('uuid')

/** @param { import('express').Express} app */
module.exports = (app) => ({
  sessionPath: null,
  sessionClient: null,
  /**
   * Cria uma sessão para o dialogflow
   * @param {string} projectId The project to be used
   */
  startSession(projectId = process.env.DIALOGFLOW_PROJECT_ID) {
    // A unique identifier for the given session
    const sessionId = uuid.v4()

    // Create a new session
    app.controllers.nlpController.sessionClient = new dialogflow.SessionsClient()
    app.controllers.nlpController.sessionPath = app.controllers.nlpController.sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    )
  },
  async sendChatMessage(message) {
    // The text query request.
    const request = {
      session: app.controllers.nlpController.sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: message,
          // The language used by the client (en-US)
          languageCode: 'pt-BR',
        },
      },
    }

    // Send request and log result
    const responses = await app.controllers.nlpController.sessionClient.detectIntent(
      request
    )
    console.log('Detected intent')
    const result = responses[0].queryResult
    console.log(`  Query: ${result.queryText}`)
    console.log(`  Response: ${result.fulfillmentText}`)
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`)
    } else {
      console.log(`  No intent matched.`)
    }

    return result.fulfillmentText
  },
})
