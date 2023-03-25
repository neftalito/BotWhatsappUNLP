const { Message } = require("whatsapp-web.js");
const Bot = require("../structures/Bot");
module.exports = {
  name: "a",
  desc: "Te añade al grupo de la UNLP.",

  /**
   * @param {Message} msg
   * @param {Bot} client
   * @param {any[]?} params
   *
   * */
  async execute(client, msg, params) {
    let contacto = await msg.getContact();
    let contactoNum = contacto.number;

    if (!params)
      return msg.reply(
        "*ERROR*: El argumento de grupo está vacío o es incorrecto."
      );

    //Si el usuario no está registrado le avisamos.
    if (!Object.keys(client.registrados).includes(contactoNum))
      return msg.reply(
        "*ERROR*: Su usuario no está registrado o no tiene permitido acceder al grupo."
      );

    let nombreGrupo = "";

    switch (params[0]) {
      case "unlp":
        nombreGrupo = "Curso Ingreso 2023 UNLP";
        break;
      case "coc":
        nombreGrupo = "Consultas COC";
        break;
      case "epa":
        nombreGrupo = "Consultas Epa";
        break;
      case "mat":
        nombreGrupo = "UNLP 2023 Mat0";
        break;
    }

    let chats = await client.getChats();

    let grupo = chats.find((chat) => chat.isGroup && chat.name === nombreGrupo);

    try {
      console.log(`Añadiendo ${contacto.pushname} a ${nombreGrupo}`);
      //Añadimos el usuario al grupo.
      await grupo.addParticipants([contacto.id._serialized]);
      console.log(
        `${contacto.pushname} añadido correctamente al grupo ${grupo.name}.`
      );
      msg.reply("Se te ha añadido al grupo.");
    } catch (err) {
      //En caso de que haya un error le mandamos al usuario que hubo un error y mostramos en consola qué error fue.
      msg.reply(
        "*ERROR*: Ha ocurrido un error al añadirte al grupo. Por favor contacta un administrador."
      );
      console.error(err);
    }
  },
};
