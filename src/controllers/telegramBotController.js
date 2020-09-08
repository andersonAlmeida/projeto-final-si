const { Telegraf } = require('telegraf')

/** @param { import('express').Express} app */
module.exports = (app) => ({
  startTelegramBot() {
    const bot = new Telegraf(process.env.BOT_TOKEN)

    bot.use(async (ctx, next) => {
      const start = new Date()
      await next()
      const ms = new Date() - start
      console.log('Response time: %sms', ms)
    })

    bot.on('text', async (ctx) => {
      // Dialogflow
      // const botResponse = await app.controllers.dialogflowController.sendChatMessage(
      //   ctx.message.text
      // )

      // NLP.js
      const botResponse = await app.controllers.nlpController.nlpProccessUtterance(
        ctx.message.text
      )

      return ctx.reply(botResponse)
    })
    bot.launch()
  },
})
