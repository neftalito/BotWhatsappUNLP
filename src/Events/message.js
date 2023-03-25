const { Message } = require("whatsapp-web.js");
const Event = require("../structures/Event");

module.exports = new Event(
  "message",
  /**
   * @param {Message} msg
   * @param {Bot} client
   *
   * */
  async (client, message) => {
    let msg = message.body.toLowerCase();

    if (!msg.startsWith("/")) return;

    const params = msg.slice(1).trim().split(/ +/g);
    const commandName = params.shift().toLowerCase();
    const command = client.commands.get(commandName);

    console.log(commandName, params);

    if (command) command.execute(client, message, params);
  }
);
