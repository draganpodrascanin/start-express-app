const chalk = require("chalk");
class Config {
  constructor(pathTo, ts, db, auth) {
    //pathTo config undefined or . = current directory,
    //any other string need to be added on current directory
    if (pathTo !== undefined && pathTo !== ".")
      pathTo = `${process.cwd()}/${pathTo}`;
    if (pathTo === ".") pathTo = process.cwd();

    //setting props
    this.pathTo = pathTo || process.cwd();
    this.ts = ts || false;
    this.db = db || "mongo";
    this.auth = auth || false;

    //if ts gets parameter thats not boolean console error and finish
    if (typeof this.ts !== "boolean") {
      console.error(
        chalk.red("no parametar needed for ts, it must be boolean value")
      );
      process.exit(1);
    }

    //if db gets wrong paramater console error adn finish
    if (this.db !== "mongo" /*|| db !== 'mysql'*/) {
      console.error(
        chalk.red(
          'only mongo is available as db in "start-express-app" package, for now'
        )
      );
      process.exit(1);
    }

    //if auth gets parametar thats not boolean console error and finish
    if (typeof this.auth !== "boolean") {
      console.error(
        chalk.red("no parametar needed for auth, it must be boolean value")
      );
      process.exit(1);
    }
  }
}

module.exports = Config;
