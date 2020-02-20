const fs = require("fs");
const chalk = require("chalk");

const SetBoilerplate = require("./SetBoilerplate");

module.exports = function cli(options) {
  //getting directory name if specified
  const dirName = options._[0];

  //configure arguments and abstract methods
  const setBoilerplate = new SetBoilerplate(
    dirName,
    options.ts,
    options.db,
    options.auth
  );

  console.log(!fs.existsSync(setBoilerplate.pathTo));

  //if directory is specified and doesn't exist, make one
  if (!fs.existsSync(setBoilerplate.pathTo)) {
    try {
      console.log(chalk.green(`making directory ${dirName}`));
      fs.mkdirSync(setBoilerplate.pathTo);
    } catch (err) {
      //failed making a directory
      console.log(chalk.red(`failed creating directory ${dirName}`));
    }
  }
};
