const { Message } = require("whatsapp-web.js");
const Bot = require("../structures/Bot");

module.exports = {
  name: "ayuda",
  desc: "Ves este mensaje",
  /**
   * @param {Message} msg
   * @param {Bot} client
   * */
  async execute(client, msg) {
    let contacto = await msg.getContact();
    client.sendMessage(
      msg.from,
      `Comandos:
      Los usuarios fueron obtenidos de la plataforma de IDEAS, puede que haya alguno que falte o algún error.
  * "/r <usuario>": Registra tu usuario (el usuario debe ser el que usas en la plataforma de IDEAS). Ejemplo: "/r neftali"
  * "/a <UNLP|COC|MAT|EPA>": Te añade al grupo de la UNLP.
  * "/ayuda": Ves este mensaje.
  * "/grupo <numero>": Obtiene el link para unirse al grupo de WhatsApp del grupo N. 
  * "/mostrargrupos": Envía los links de todos los grupos.
  * "/github": Manda el link del repositorio de GitHub.
  
  Para ver tu nombre de usuario:
  1. Hace click en tu nombre dentro de la plataforma de IDEAS. (Esquina superior derecha).
  2. Hace click en "Editar Perfil".
  3. Una vez cargue la página vas a poder ver que al principio de todo va a decir "Nombre de usuario" y abajo de eso va a estar tu usuario.`
    );
    console.log(`Ayuda enviada a ${contacto.pushname}( ${contacto.number} )`);
  },
};
