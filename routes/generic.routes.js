module.exports = (app) => {
  const genericController = require("../controllers/generic.controller.js");
  generateRoot(app, genericController, "profils");
  generateRoot(app, genericController, "projet_references");
  generateRoot(app, genericController, "presentation");
  generateRoot(app, genericController, "experiences");
  generateRoot(app, genericController, "connaisances");
  generateRoot(app, genericController, "formations");
};

function generateRoot(app, controller, rootPath) {
  var router = require("express").Router();
  router.post("/", controller.create);
  router.get("/", controller.findAll);
  router.get("/:id", controller.findOne);
  router.delete("/:id", controller.delete);
  router.delete("/", controller.deleteAll);
  router.put("/:id", controller.update);
  app.use("/api/" + rootPath, router);
}
