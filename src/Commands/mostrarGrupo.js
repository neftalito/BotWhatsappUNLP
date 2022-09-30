const { Message } = require("whatsapp-web.js");
const Bot = require("../structures/Bot");

module.exports = {
  name: "grupo",
  desc: "Obtiene el link para unirse al grupo de WhatsApp del grupo N.",

  /**
   * @param {Bot} client
   * @param {Message} msg
   */
  async execute(client, msg, params) {
    // Si no recibimos ningun parametro retornamos un mensaje de error
    if (!params)
      return msg.reply("*ERROR*: El número del grupo no puede estar vacío.");
    let numeroGrupo = params[0];
    console.log(client.grupos);
    console.log(numeroGrupo);
    let grupo = client.grupos[numeroGrupo - 1];

    if (!grupo)
      return msg.reply(`*ERROR*: Link del grupo ${numeroGrupo} no encontrado.`);
    msg.reply(`*Grupo ${numeroGrupo}*: ${grupo}`);
  },
};
