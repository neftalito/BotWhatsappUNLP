// Basado en https://jagad.dev/posts/how-to-create-a-whatsapp-bot-with-node-js.

//Importamos la libreria de whatsapp-web.js para poder comunicarse con whatsapp y enviar mensajes.
//Documentacion de whatsapp-web.js: https://docs.wwebjs.dev/.
const { Client, LocalAuth } = require("whatsapp-web.js");
//Importamos la libreria de qrcode-terminal para poder mostrar el código QR que pide whatsapp al iniciar sesion.
const qrcode = require("qrcode-terminal");
//Importamos el modulo FileSystem de nodeJS: https://nodejs.org/api/fs.html.
const fs = require("fs");

//* Obtener usuarios registrados y por registrar
/**
 * @retorna Los usuarios registrados obtenidos del archivo "usuariosRegistrados.json". En el caso que haya un error, se retorna el error en consola.
 */
function obtenerUsuariosRegistrados() {
  try {
    const usuariosRegistrados = JSON.parse(
      fs.readFileSync("usuarios/usuariosRegistrados.json", "utf8")
    );
    return usuariosRegistrados;
  } catch (err) {
    return console.error(err);
  }
}
/**
 * @returns Los usuarios por registrar obtenidos del archivo "usuariosRegistrados.json". En el caso que haya un error, se retorna el error en consola.
 */
function obtenerUsuariosPorRegistrar() {
  try {
    const usuariosPorRegistrar = JSON.parse(
      fs.readFileSync("./usuarios/usuariosPorRegistrar.json", "utf8")
    );
    return usuariosPorRegistrar;
  } catch (err) {
    return console.error(err);
  }
}
//* Guardar los usuarios que quedan por registrar en un archivo
/**
 * @param {*} array : Es el arreglo que va a tener los usuarios por registrar para poder guardarlos (Podría hacerse sin pasar el arreglo como parámetro, pero me pareció más lindo así). 
 * @returns El error que dé en el caso de que no se haya podido guardar el archivo.
 */
function guardarUsuariosPorRegistrar(array) {
  let jsonContent = JSON.stringify(array);
  try {
    fs.writeFileSync(
      "./usuarios/usuariosPorRegistrar.json",
      jsonContent,
      "utf8"
    );
  } catch (err) {
    return console.error(err);
  }
}
/**
 * @param {*} array : Es el arreglo que va a tener los usuarios ya registrados para poder guardarlos.
 * @returns El error que dé en el caso de que no se haya podido guardar el archivo.
 */
function guardarUsuariosRegistrados(array) {
  let jsonContent = JSON.stringify(array);
  try {
    fs.writeFileSync(
      "./usuarios/usuariosRegistrados.json",
      jsonContent,
      "utf8"
    );
  } catch (err) {
    return console.error(err);
  }
}

//* Main
//Creamos el cliente de whatsapp y usamos authStrategy para poder guardar la sesión y no tener que volver a escanear el QR siempre que hagamos correr el código.
const client = new Client({
  authStrategy: new LocalAuth(),
});

console.log("Iniciando...");
client.initialize(); //Iniciamos el cliente.

//Usamos los disparadores para poder ver el progreso del cliente y mostrar en consola.
client.on("authenticated", () => {
  console.log("Sesion iniciada."); //Muestra en consola que inició sesión.
});
client.on("auth_failure", (error) => {
  console.error("Error", error); //En caso de error al iniciar sesión, muestra el error en consola.
});
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true }); //Generamos el código con el QR generado por Whatsapp y lo mostramos en pantalla más chico con el "small: true".
});
client.on("ready", () => {
  console.log("Bot iniciado. Esperando mensajes..."); //Al terminar de iniciar sesión, va a mostrar en consola que el bot ya está iniciado y espera por mensajes.
});

//Luego de iniciar sesión y que el bot esté funcionando, asignamos las variables para poder leer y modificar los usuarios registrados y por registrar.
var usuariosPorRegistrar = obtenerUsuariosPorRegistrar();
var usuariosRegistrados = obtenerUsuariosRegistrados();
console.log("Usuarios registrados: " + JSON.stringify(usuariosRegistrados, null, 2)); //Mostramos los usuarios en pantalla y con JSON.stringify() convertimos el dato en texto, haciéndolo más vistoso al añadir una indentacion de 2 espacios.

console.log(" "); //Un espacio para separar en consola los mensajes.

//Este disparador va a funcionar cuando llegue un mensaje.
client.on("message", async (msg) => {
  let chat = await msg.getChat(); //Obtenemos el chat del que llegó el mensaje.
  let contacto = await msg.getContact(); //Obtenemos el contacto del que llegó el mensaje.
  let contactoNum = contacto.number; //Obtenemos el número del contacto.

  //Para más seguridad, al llegar el comando "/r" en un grupo, enviamos un erro y abortamos con el return.
  if (chat.isGroup && msg.body.toLowerCase().startsWith("/r")) {
    msg.reply(
      "Por cuestiones de seguridad, para que los demás no vean tu nombre de usuario, sólo se puede registrar tu usuario por privado."
    );
    return;
  }
  //Cuando llegue el comando "/r" por privado va a ejecutar esto
  if (msg.body.toLowerCase().startsWith("/r")) {
    let usuario = msg.body.slice(3).toLowerCase(); //Separamos el "/r " del mensaje, así nos quedamos con el nombre de usuario y convertimos todo a minúscula.
    if (usuario.length === 0) { //Si llega un comando como "/r", que no tiene ningun nombre de usuario, se envía un error y se aborta con return.
      client.sendMessage(msg.from, "Error, el usuario no puede estar vacío.");
      return;
    }
    console.log(
      `Nombre recibido: ${usuario} de ${contacto.pushname}( ${contactoNum} )` //Mostramos en consola el nombre de usuario recibido, de quién llegó el mensaje y su número.
    );

    if (Object.values(usuariosRegistrados).includes(usuario)) { //Verificas si el usuario ya está registrado y en ese caso envías un error.
      client.sendMessage(msg.from, "Usuario ya registrado.");
      console.log(`Usuario ${usuario} ya registrado.`);
    } else if (Object.keys(usuariosRegistrados).includes(contactoNum)) { //Verificas si el número ya tiene un usuario r egistrado y envías un error más el usuario con el que se registró
      client.sendMessage(
        msg.from,
        `Su número ya está registrado con el usuario ${usuariosRegistrados[contactoNum]}.`
      );
    } else if (usuariosPorRegistrar.includes(usuario)) { //Si no hay problemas, se guarda el usuario
      client.sendMessage(msg.from, "Usuario encontrado. Registrando..."); //Mostras en consola que el usuario se encontró en la lista de usuarios por registrar y lo guardas.

      usuariosRegistrados[contactoNum] = usuario; //Guardamos el nombre de usuario con el número como la llave y el usuario como valor, ejemplo: "usuariosRegistrados["+5492216796844"] = Neftalí".

      guardarUsuariosRegistrados(usuariosRegistrados); //Guardamos los usuarios en el archivo
      usuariosRegistrados = obtenerUsuariosRegistrados(); //Actualizamos la variable de usuariosRegistrados para que no quede ningun usuario ya registrado marcado como sin registrar.

      let indice = usuariosPorRegistrar.indexOf(usuario); //Obtenemos el índice de la lista de usuarios por registrar en el que se encuentra el usuario.
      usuariosPorRegistrar.splice(indice, 1); //Borramos el usuario de la lista de usuarios por registrar.
      guardarUsuariosPorRegistrar(usuariosPorRegistrar); //Actualizamos el archivo con los usuarios por registrar.
      usuariosPorRegistrar = obtenerUsuariosPorRegistrar(); //Actualizamos la variable con los usuarios por registrar.

      console.log(`Usuario ${usuario} registrado.`); //Mostramos en consola el usuario registrado.
      client.sendMessage(
        msg.from,
        `Usuario "${usuario}" registrado correctamente.` //Enviamos al usuario que se registró el usuario
      );
    } else {
      client.sendMessage(
        msg.from,
        "Tu usuario no se ha encontrado ni ha sido registrado previamente. Si consideras que es un error, enviá una captura de la plataforma de IDEAS y esperá la respuesta del administrador."
      ); //En caso de que no se encuentre el usuario ni haya sido registrado. Se muestra un error.
      console.log(`${usuario} no encontrado.`); //Se avisa en consola de que no se encontró el usuario
    }
  }
  //Con el comando /ayuda enviamos el mensaje que diga toda la info del bot
  if (msg.body.toLowerCase() === "/ayuda") {
    console.log(`Ayuda enviada a ${contacto.pushname}( ${contactoNum} )`);
    client.sendMessage(msg.from,`Comandos:
    Los usuarios fueron obtenidos de la plataforma de IDEAS, puede que haya alguno que falte o algún error.
* "/r (usuario)": Registra tu usuario (el usuario debe ser el que usas en la plataforma de IDEAS),
* "/a" o "/añadime": Te añade al grupo de la UNLP.
* "/ayuda": Ves este mensaje

Para ver tu nombre de usuario:
* Hace click en tu nombre dentro de la plataforma de IDEAS. (Esquina superior derecha),
* Hace click en "Editar Perfil".
* Una vez cargue la página vas a poder ver que al principio de todo va a decir "Nombre de usuario" y abajo de eso va a estar tu usuario.`);
  }
  //Con el comando "/a" o "/añadime" añadimos al usuario al grupo de la facu
  if (msg.body.toLowerCase() === "/a" || msg.body.toLowerCase() === "/añadime") {
    if (Object.keys(usuariosRegistrados).includes(contactoNum)) { //Verificamos que el usuario ya esté registrado para añadirlo.
      const nombreGrupo = "Curso Ingreso 2023 UNLP"; //Asignamos el nombre del grupo a una variable.
      
      console.log(`Añadiendo ${contacto.pushname} a ${nombreGrupo}`); //Avisamos en consola que estamos añadiendo a un usuario.

      client.getChats().then((chats) => { //Obtenemos los chats del cliente.
        const grupo = chats.find(
          (chat) => chat.isGroup && chat.name === nombreGrupo
        ); //Filtramos entre los chats el que sea el grupo y tenga el mismo nombre que el de la variable asignada previamente.
        try {
          grupo
            .addParticipants([contacto.id._serialized]) //Añadimos el usuario al grupo.
            .then(() => {
              console.log(`${contacto.pushname} añadido correctamente.`);
              msg.reply("Se te ha añadido al grupo."); //Respondemos al usuario de que se le agregó al grupo.
            });
        } catch (err) { //En caso de que haya un error le mandamos al usuario que hubo un error y mostramos en consola qué error fue.
          msg.reply("Ha habido un error al añadirte al grupo.");
          console.error(err);
        }
      });
    } else {
      msg.reply(
        "Su usuario no está registrado o no tiene permitido acceder al grupo." //Si el usuario no está registrado le avisamos.
      );
    }
  }
  if (contactoNum === "Número admin") { //Esto es para administrar, el comando "/verusuarios" muestra qué usuarios estan registrados y el comando "/rm" añade manualmente a un usuario. 
    if (msg.body.toLowerCase() === "/verusuarios") {
      client.sendMessage(
        msg.from,
        JSON.stringify(usuariosRegistrados, null, 2)
      );
      console.log("Enviando usuarios al administrador.");
    }
    if(msg.body.toLowerCase() === "/rm"){
      let mensaje = msg.body.slice(4).toLowerCase;
      datos = mensaje.split(" ")

      usuariosRegistrados[datos[0]] = datos[1];
      guardarUsuariosRegistrados(usuariosRegistrados);
      usuariosRegistrados = obtenerUsuariosRegistrados();
      msg.reply(`${datos[0]} añadido correctamente.`)
    }
  }
  console.log(" "); //Espacio para separar entre mensajes recibidos.
  
  //Marcar chat como leído.
  await chat.sendSeen();
});