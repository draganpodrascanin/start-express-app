const fs = require("fs");
const cathErr = require("./catchErr");
const makeCliSpinner = require("./makeCliSpinner");

const copyPasteSync = (cliMsg, failMsg, pathFrom, pathTo) => {
  cathErr(failMsg, () => {
    makeCliSpinner(cliMsg, () => {
      fs.copyFileSync(pathFrom, pathTo);
    });
  });
};

module.exports = copyPasteSync;
