// const fs = require("fs");
// const chalk = require("chalk");

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

  // creating package.json in target directory
  setBoilerplate.createPackageJson();

  //setting .gitignore
  setBoilerplate.settingGitignore();

  //setting eslint config
  setBoilerplate.settingEslintConfig();

  //creating app.js in root of target directory
  if (!options.auth) setBoilerplate.createAppFileNoAuth();

  //create server file in root of target directory
  setBoilerplate.createServerFile();

  //setting up config.env file in root of target directory
  setBoilerplate.settingEnvFile();

  //creating public/stylesheet/style.css boilerplate
  setBoilerplate.creatingPublicBoilerplate();

  //creating routes directory and boilerplate route file
  setBoilerplate.creatingRoutesDirAndBoilerplateRouteFile();

  //creating views directory and home.pug boilerplate view
  setBoilerplate.creatingViewDirAndFile();

  //creating controllers directory with errorController.js
  //and boilerplate homeControllers.js
  setBoilerplate.creatingControllersDirAndBoilerControllers();

  //creating handler factory in controller directory
  if (setBoilerplate.db === "mongo") {
    setBoilerplate.creatingHanderFactory();
  }

  //creating util directory with boilerplate functions and classes
  setBoilerplate.creatingUtilDirAndFuncs();
};
