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
  if (!options.auth) setBoilerplate.createAppFileNoAuth();
  else setBoilerplate.createAppFileAuth();

  //create server file in root of target directory
  setBoilerplate.createServerFile();

  //setting up config.env file in root of target directory
  setBoilerplate.setEnvFile();

  //creating public/stylesheet/style.css boilerplate
  setBoilerplate.createPublicBoilerplate();

  //creating client js files for authentication
  if (options.auth) setBoilerplate.createAuthClientJsFiles();

  //creating routes directory and boilerplate route file
  if (options.auth) setBoilerplate.createRoutesDirAndBoilerplateRouteFileAuth();
  else setBoilerplate.createRoutesDirAndBoilerplateRouteFileNoAuth();

  //creating views directory and home.pug boilerplate view
  setBoilerplate.createViewDirAndFile();

  //creating auth views signup and login
  if (options.auth) setBoilerplate.creatingLoginAndSignupViews();

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
