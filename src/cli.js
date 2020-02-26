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
  setBoilerplate.setGitignore();

  //setting eslint config
  setBoilerplate.setEslintConfig();

  //creating app.js in root of target directory
  //======there might not be difference later, so refactor might be needed======
  if (!options.auth) setBoilerplate.createAppFileNoAuth();
  else setBoilerplate.createAppFileNoAuth(); //temporary

  //create server file in root of target directory
  setBoilerplate.createServerFile();

  //setting up config.env file in root of target directory
  setBoilerplate.setEnvFile();

  //creating public/stylesheet/style.css boilerplate
  setBoilerplate.createPublicBoilerplate();

  //creating routes directory and boilerplate route file
  setBoilerplate.createRoutesDirAndBoilerplateRouteFile();

  //creating views directory and home.pug boilerplate view
  setBoilerplate.createViewDirAndFile();

  //creating boilerplate email directory and template files in views dir
  setBoilerplate.createEmailTemplatesDirAndFiles();

  //creating controllers directory with errorController.js
  //and boilerplate homeControllers.js
  setBoilerplate.createControllersDirAndBoilerControllers();

  //if auth is true, create auth controllers
  if (options.auth) setBoilerplate.createAuthControllers();

  //create models directory
  setBoilerplate.createModelsDirectory();

  //if auth is true, create basic user model
  if (options.auth) setBoilerplate.createUserModel();

  //creating handler factory in controller directory
  if (setBoilerplate.db === "mongo") {
    setBoilerplate.createHanderFactory();
  }

  //creating util directory with boilerplate functions and classes
  setBoilerplate.createUtilDirAndFuncs();
};
