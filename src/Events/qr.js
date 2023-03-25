const qr = require("qrcode-terminal");
const chalk = require("chalk");
const Bot = require("../structures/Bot");
const Event = require("../structures/Event");

module.exports = new Event(
  "qr",
  /**@param {Bot} client */ (client, code) => {
    qr.generate(code, { small: true });
    console.log(chalk.bold("Escanea el codigo qr para iniciar el bot."));
  }
);
