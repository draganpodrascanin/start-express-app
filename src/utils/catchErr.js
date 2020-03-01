const chalk = require("chalk");

//apstracting try catch blocks a bit

const catchErr = (msg, fn) => {
  try {
    fn();
  } catch (err) {
    console.log(chalk.red(`${msg} \n`), err);
    process.exit(1);
  }
};

module.exports = catchErr;
