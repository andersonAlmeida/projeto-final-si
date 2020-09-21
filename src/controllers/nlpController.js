const dialogflow = require('@google-cloud/dialogflow')
const { response } = require('express')
const uuid = require('uuid')

const projectId = process.env.DIALOGFLOW_PROJECT_ID
const displayName = 'The display name of the intent, e.g. MAKE_RESERVATION'
const trainingPhrasesParts =
  'Training phrases, e.g. How many people are staying?'
const messageTexts =
  'Message texts for the agents response when the intent is detected, e.g. Your reservation has been confirmed'

/** @param { import('express').Express} app */
module.exports = (app) => ({
  sessionPath: null,
  sessionClient: null,
  /**
   * Cria uma sessão para o dialogflow
   * @param {string} projectId The project to be used
   */
  startSession() {
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

  async getIntents(req, res) {
    // Instantiates the Intent Client
    const intentsClient = new dialogflow.IntentsClient()
    const projectAgentPath = intentsClient.agentPath(projectId)

    const request = {
      parent: projectAgentPath,
      intentView: 'INTENT_VIEW_FULL', // necessário para trazer todos os dados das intents
    }

    // Send the request for listing intents.
    const [response] = await intentsClient.listIntents(request)

    res.json(response)
  },

  async createIntent(req, res) {
    const intentsClient = new dialogflow.IntentsClient()
    const agentPath = intentsClient.agentPath(projectId)

    const trainingPhrases = []

    // pega o array de frases
    req.body.intents.forEach((trainingPhrasesPart) => {
      const part = {
        text: trainingPhrasesPart,
      }

      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: 'EXAMPLE',
        parts: [part],
      }

      trainingPhrases.push(trainingPhrase)
    })

    // respostas para as frases
    const messageText = {
      text: req.body.responses, // array de respostas
    }

    const message = {
      text: messageText,
    }

    const intent = {
      displayName: req.body.intentsName, // nome da intent
      trainingPhrases: trainingPhrases,
      messages: [message],
    }

    const createIntentRequest = {
      parent: agentPath,
      intent: intent,
    }

    // Create the intent
    const [response] = await intentsClient.createIntent(createIntentRequest)
    console.log(`Intent ${response.name} created`)

    res.json(response)
  },

  async updateIntent(req, res) {
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient()
    const intent = existingIntent //intent that needs to be updated

    const trainingPhrases = []
    let previousTrainingPhrases =
      existingIntent.trainingPhrases.length > 0
        ? existingIntent.trainingPhrases
        : []

    previousTrainingPhrases.forEach((textdata) => {
      newTrainingPhrases.push(textdata.parts[0].text)
    })

    newTrainingPhrases.forEach((phrase) => {
      const part = {
        text: phrase,
      }

      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: 'EXAMPLE',
        parts: [part],
      }
      trainingPhrases.push(trainingPhrase)
    })
    intent.trainingPhrases = trainingPhrases
    const updateIntentRequest = {
      intent,
      languageCode: 'en-US',
    }

    // Send the request for update the intent.
    const result = await intentsClient.updateIntent(updateIntentRequest)

    return result
  },

  async deleteIntent(req, res) {
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient()
    const request = { name: req.query.intent }

    try {
      // Send the request for deleting the intent.
      const result = await intentsClient.deleteIntent(request)
      return res.json({ result: result })
    } catch (e) {
      res.status(400).json(e)
    }
  },
})
