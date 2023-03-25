const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");

class Bot extends Client {
  constructor() {
    super({ authStrategy: new LocalAuth() });
    this.commands = new Map();
    this.registrados;
    this.porRegistrar;
    this.grupos;
    this.start();
  }

  start() {
    // Carga los comandos dentro de la carpeta Commands
    fs.readdirSync("./src/Commands")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const command = require(`../Commands/${file}`);
        console.log(`Comando ${command.name} cargado`);
        this.commands.set(command.name, command);
      });

    // Carga los eventos dentro de la carpeta Events
    fs.readdirSync("./src/Events")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const event = require(`../Events/${file}`);
        console.log(`Evento ${event.event} cargado`);

        this.on(event.event, event.run.bind(null, this));
      });

    // Carga los grupos
    this.grupos = JSON.parse(fs.readFileSync("src/grupos.json", "utf8"));

    // Guarda los usuarios registrados y por registrar en el cliente
    this.registrados = JSON.parse(
      fs.readFileSync("usuarios/usuariosRegistrados.json", "utf8")
    );
    this.porRegistrar = JSON.parse(
      fs.readFileSync("./usuarios/usuariosPorRegistrar.json", "utf8")
    );

    console.log("Iniciando bot...");
  }

  guardarUsuariosRegistrados(usuarios) {
    let jsonContent = JSON.stringify(usuarios);
    try {
      fs.writeFileSync(
        "./usuarios/usuariosRegistrados.json",
        jsonContent,
        "utf8"
      );
      console.log("Usuarios guardados.");
    } catch (err) {
      return console.error(err);
    }
  }

  guardarUsuariosPorRegistrar(usuarios) {
    let jsonContent = JSON.stringify(usuarios);
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
}

module.exports = Bot;
