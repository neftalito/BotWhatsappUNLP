const { Message } = require("whatsapp-web.js");
const Bot = require("../structures/Bot");
module.exports = {
  name: "github",
  desc: "Te añade al grupo de la UNLP.",

  /**
   * @param {Message} msg
   * @param {Bot} client
   *
   * */
  async execute(client, msg) {
    msg.reply("https://github.com/neftalito/BotWhatsappUNLP");
  },
};
