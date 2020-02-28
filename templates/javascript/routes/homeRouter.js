const homeControllers = require("../controllers/homeControllers.js");

const Router = require("express").Router();

Router.route("/").get(homeControllers.getHomeController);

module.exports = Router;
