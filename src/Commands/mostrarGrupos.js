const { Message } = require("whatsapp-web.js");
const Bot = require("../structures/Bot");
module.exports = {
  name: "mostrargrupos",
  desc: "Envía los links de todos los grupos.",

  /**
   * @param {Message} msg
   * @param {Bot} client
   *
   * */
  async execute(client, msg) {
    let contacto = await msg.getContact();
    console.log(`Enviando grupos a ${contacto.pushname}`);
    const grupos = client.grupos;

    let mensaje = "";
    for (let index = 0; index < grupos.length; index++) {
      mensaje += `*Grupo ${index + 1}:* ${grupos[index]}\n\n`;
    }
    mensaje += "Los links pueden estar caídos.";

    msg.reply(mensaje);
  },
};
