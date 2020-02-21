const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;
const makeCliSpinner = require("./util/makeCliSpinner");
const catchErr = require("./util/catchErr");
const copyPasteSync = require("./util/copyPasteSync");

class SetBoilerplates {
  constructor(pathTo, ts, db, auth) {
    this.dirName = pathTo;

    //pathTo config undefined or . = current directory,
    //any other string need to be added on current directory
    if (pathTo !== undefined && pathTo !== ".")
      pathTo = `${process.cwd()}/${pathTo}`;
    if (pathTo === ".") pathTo = process.cwd();

    //setting props
    this.ts = ts || false;
    this.pathFrom = ts
      ? path.resolve(__dirname, "../templates/typescript")
      : path.resolve(__dirname, "../templates/javascript");

    this.pathTo = pathTo || process.cwd();
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

    //if directory is specified and doesn't exist, make one
    if (!fs.existsSync(pathTo)) {
      try {
        //create message with spinner
        let spinner = new Spinner(
          chalk.green(`%s making directory ${this.dirName} `)
        );
        spinner.setSpinnerString(19);
        spinner.start();

        //create directory
        fs.mkdirSync(pathTo);

        //stop spinner
        spinner.stop();
      } catch (err) {
        //failed making a directory
        console.log(
          chalk.red(`failed creating directory ${this.dirName} \n`, err)
        );
        process.exit(1);
      }
    }
  }

  //setting right packageJson
  createPackageJson = () => {
    catchErr("failed creating package.json", () => {
      if (this.auth) {
        //if auth needed few more dependencies like bcrypt and jwt
        makeCliSpinner("making package json", () =>
          fs.copyFileSync(
            `${this.pathFrom}/packageWithAuth.json`,
            `${this.pathTo}/package.json`
          )
        );
      } else {
        makeCliSpinner("making package json", () => {
          fs.copyFileSync(
            `${this.pathFrom}/package.json`,
            `${this.pathTo}/package.json`
          );
        });
      }
    });
  };

  //create server.js and app.js in root of target directory
  createServerAndAppFilesNoAuth = () => {
    copyPasteSync(
      "creating server.js file",
      "failed to create server.js file",
      `${this.pathFrom}/server.js`,
      `${this.pathTo}/server.js`
    );
    copyPasteSync(
      "creating app.js file",
      "failed to create app.js file",
      `${this.pathFrom}/app.js`,
      `${this.pathTo}/app.js`
    );
  };

  //setting config.env in root of target directory
  settingEnvFile = () => {
    copyPasteSync(
      "setting config.env file",
      "failed to set config.env file",
      `${this.pathFrom}/config.env`,
      `${this.pathTo}/config.env`
    );
  };

  //creating public/stylesheet directory and style.css
  creatingPublicBoilerplate = () => {
    //public
    catchErr("failed making public directory", () => {
      fs.mkdirSync(`${this.pathTo}/public`);
    });
    //stylesheet
    catchErr("failed making stylesheet directory", () => {
      fs.mkdirSync(`${this.pathTo}/public/stylesheet`);
    });
    //icons
    catchErr("failed making icons directory", () => {
      fs.mkdirSync(`${this.pathTo}/public/icons`);
    });

    //style.css
    copyPasteSync(
      "creating style.css file",
      "failed to create style.css file",
      `${this.pathFrom}//public/stylesheet/style.css`,
      `${this.pathTo}//public/stylesheet/style.css`
    );

    //favicon.png
    copyPasteSync(
      "creating favicon.png file",
      "failed to create favicon.png file",
      `${this.pathFrom}//public/icons/favicon.png`,
      `${this.pathTo}//public/icons/favicon.png`
    );
  };

  //creating routes directory and homeRoutes.js
  creatingRoutesDirAndBoilerplateRouteFile = () => {
    catchErr("failed making routes directory", () => {
      fs.mkdirSync(`${this.pathTo}/routes`);
    });

    copyPasteSync(
      "creating homeRoutes.js routes file",
      "failed to create homeRoutes.js routes file",
      `${this.pathFrom}/routes/homeRoutes.js`,
      `${this.pathTo}/routes/homeRoutes.js`
    );
  };

  //creating views directory in root of target directory with home.pug view
  creatingViewDirAndFile = () => {
    catchErr("failed making views directory", () => {
      fs.mkdirSync(`${this.pathTo}/views`);
    });

    copyPasteSync(
      "creating home.pug view file",
      "failed to create home.pug view file",
      `${this.pathFrom}/views/home.pug`,
      `${this.pathTo}/views/home.pug`
    );
  };

  //creating controllers directory in root of target directory
  //with errorController.js and homeController.js
  creatingControllersDirAndBoilerControllers = () => {
    catchErr("failed making controllers directory", () => {
      fs.mkdirSync(`${this.pathTo}/controllers`);
    });

    copyPasteSync(
      "creating errorController.js controller file",
      "failed to create errorController controller file",
      `${this.pathFrom}/controllers/errorController.js`,
      `${this.pathTo}/controllers/errorController.js`
    );

    copyPasteSync(
      "creating homeControllers.js controller file",
      "failed to create homeControllers controller file",
      `${this.pathFrom}/controllers/homeControllers.js`,
      `${this.pathTo}/controllers/homeControllers.js`
    );
  };

  //creating util directory and boilerplate util functions/classes
  creatingUtilDirAndFuncs = () => {
    catchErr("failed making util directory", () => {
      fs.mkdirSync(`${this.pathTo}/util`);
    });

    copyPasteSync(
      "creating catchAsync util function",
      "failed to create catchAsync util function",
      `${this.pathFrom}/util/catchAsync.js`,
      `${this.pathTo}/util/catchAsync.js`
    );

    copyPasteSync(
      "creating AppError util class",
      "failed to create AppError util class",
      `${this.pathFrom}/util/AppError.js`,
      `${this.pathTo}/util/AppError.js`
    );
  };

  //setting config for eslint
  settingEslintConfig = () => {
    copyPasteSync(
      "setting .eslintrc.json",
      "failed setting .eslintrc.json",
      `${this.pathFrom}/.eslintrc.json`,
      `${this.pathTo}/.eslintrc.json`
    );

    copyPasteSync(
      "setting .prettierrc",
      "failed setting .prettierrc",
      `${this.pathFrom}/.prettierrc`,
      `${this.pathTo}/.prettierrc`
    );
  };

  //setting gitignore
  settingGitignore = () => {
    copyPasteSync(
      "setting .gitignore",
      "failed setting .gitignore",
      `${this.pathFrom}/.gitignore`,
      `${this.pathTo}/.gitignore`
    );
  };
}

module.exports = SetBoilerplates;
