const { Message } = require("whatsapp-web.js");
const Bot = require("../structures/Bot");

module.exports = {
  name: "r",
  desc: 'Registra tu usuario (el usuario debe ser el que usas en la plataforma de IDEAS). Ejemplo: "/r neftali"',
  /**
   * @param {Message} msg
   * @param {Bot} client
   * @param {any[]?} params
   * */
  async execute(client, msg, params) {
    let chat = await msg.getChat();
    let contacto = await msg.getContact();
    let contactoNum = contacto.number;

    if (chat.isGroup)
      return msg.reply(
        "*ERROR*: Por cuestiones de seguridad, para que los demás no vean tu nombre de usuario, sólo se puede registrar tu usuario por privado."
      );

    if (!params)
      return client.sendMessage(
        msg.from,
        "*ERROR*: El usuario no puede estar vacío."
      );
    if (params.length > 1)
      return client.sendMessage(
        msg.from,
        "*ERROR*: El usuario no puede contener espacios."
      );

    let usuario = params[0];

    if (Object.keys(client.registrados).includes(contactoNum))
      return client.sendMessage(
        msg.from,
        `*ERROR*: Su número ya está registrado con el usuario ${client.registrados[contactoNum]}.`
      );
    if (client.porRegistrar.includes(usuario)) {
      console.log(
        `Nombre recibido: ${usuario} de ${contacto.pushname}( ${contactoNum} )`
      );
      client.sendMessage(msg.from, "Usuario encontrado. Registrando...");
      client.registrados[contactoNum] = usuario; //Guardamos el nombre de usuario con el número como la llave y el usuario como valor, ejemplo: "usuariosRegistrados["+5492216796844"] = Neftalí".
      client.guardarUsuariosRegistrados(client.registrados);

      let indice = client.porRegistrar.indexOf(usuario); //Obtenemos el índice de la lista de usuarios por registrar en el que se encuentra el usuario.
      client.porRegistrar.splice(indice, 1); //Borramos el usuario de la lista de usuarios por registrar.
      client.guardarUsuariosPorRegistrar(client.porRegistrar); //Actualizamos el archivo con los usuarios por registrar.

      console.log(`Usuario ${usuario} registrado.`); //Mostramos en consola el usuario registrado.
      client.sendMessage(
        msg.from,
        `Usuario "${usuario}" registrado correctamente.` //Enviamos al usuario que se registró el usuario
      );
    } else {
      //En caso de que no se encuentre el usuario ni haya sido registrado. Se muestra un error.
      client.sendMessage(
        msg.from,
        "*ERROR*: Tu usuario no se ha encontrado ni ha sido registrado previamente. Si consideras que es un error, enviá una captura de la plataforma de IDEAS y esperá la respuesta del administrador."
      );
      console.log(`${usuario} no encontrado.`); //Se avisa en consola de que no se encontró el usuario
    }
  },
};
