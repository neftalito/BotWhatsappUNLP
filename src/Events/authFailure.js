const chalk = require("chalk");
const Event = require("../structures/Event");

module.exports = new Event(
  "auth_failure",
  /**@param {Bot} client */ (client, error) => {
    console.log(chalk.bgRed(chalk.black("Error: ")), error);
  }
);
