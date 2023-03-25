const Event = require("../structures/Event");

module.exports = new Event("ready", () => {
  console.log(`Bot listo, esperando mensajes...`);
});
