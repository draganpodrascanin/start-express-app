const Spinner = require("cli-spinner").Spinner;
const chalk = require("chalk");

const makeCliSpinner = (msg, fn) => {
  //create message with spinner
  let spinner = new Spinner(chalk.green(`%s ${msg} `));
  spinner.setSpinnerString(19);
  spinner.start();
  //call callback
  fn();
  //stop spinner
  spinner.stop();
  console.log("\n");
};

module.exports = makeCliSpinner;
