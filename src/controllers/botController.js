const { Telegraf } = require('telegraf')

const telegramBot = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN)

  bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time: %sms', ms)
  })

  bot.on('text', (ctx) => {
    // console.log(ctx.message.from)
    return ctx.reply(
      `Olá ${ctx.message.from.first_name}. Você está dizendo "${ctx.message.text}"`
    )
  })
  bot.launch()
}

module.exports = (app) => {
  telegramBot()
}
