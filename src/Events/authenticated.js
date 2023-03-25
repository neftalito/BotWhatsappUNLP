const chalk = require("chalk");
const Event = require("../structures/Event");

module.exports = new Event("authenticated", () => {
  console.log(chalk.bold("Sesion iniciada."));
});
