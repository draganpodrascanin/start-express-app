const Config = require("./Config");
const path = require("path");

class SetBoilerplate extends Config {
  constructor(pathTo, ts, db, auth) {
    //setting props
    super(pathTo, ts, db, auth);
    this.pathFrom = path.resolve(__dirname, "../templates");
  }
}

module.exports = SetBoilerplate;
