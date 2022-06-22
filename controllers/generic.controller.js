const GenericModel = require("../model/generic.model");

function dataforModel(tableName, req) {
  let data = { body: {}, queryUpdate: "" };
  switch (tableName) {
    case "profils":
      data = {
        body: {
          nom: req.body.nom,
          prenom: req.body.prenom,
          active: req.body.active,
        },
        queryUpdate: `UPDATE ${tableName} SET nom = '${req.body.nom}' , prenom = '${req.body.prenom}', active = '${req.body.active}' WHERE id = '${req.params.id}'`,
      };
      break;
    case "projet_references":
      data = {
        body: {
          description_projet: req.body.description_projet,
          techno_utilise: req.body.techno_utilise,
        },
        queryUpdate: `UPDATE ${tableName} SET description_projet='${req.body.description_projet}',techno_utilise='${req.body.techno_utilise}' WHERE id = '${req.params.id}'`,
      };
      break;
    case "presentation":
      data = {
        body: {
          nom: req.body.nom,
          prenom: req.body.prenom,
          date_de_naissance: req.body.date_de_naissance,
          situation_familiale: req.body.situation_familiale,
          nationalite: req.body.nationalite,
          telephone: req.body.telephone,
          email: req.body.email,
          imageProfil: req.body.imageProfil,
          posteOccupe: req.body.posteOccupe,
        },
        queryUpdate: `UPDATE ${tableName} SET nom='${req.body.nom}', prenom='${req.body.prenom}',date_de_naissance='${req.body.date_de_naissance}',situation_familiale='${req.body.situation_familiale}',nationalite='${req.body.nationalite}',telephone='${req.body.telephone}', email='${req.body.email}',imageProfil='${req.body.imageProfil}',posteOccupe='${req.body.posteOccupe}' WHERE id = '${req.params.id}'`,
      };
      break;
    case "connaisances":
      data = {
        body: {
          logo_techno: req.body.logo_techno,
          nom_techno: req.body.nom_techno,
          description: req.body.description,
          note: req.body.note,
          categorie: req.body.categorie,
        },
        queryUpdate: `UPDATE ${tableName} SET logo_techno='${req.body.logo_techno}',nom_techno='${req.body.nom_techno}',description='${req.body.description}',note='${req.body.note}',categorie='${req.body.categorie}' WHERE id = '${req.params.id}'`,
      };
      break;
    case "experiences":
      data = {
        body: {
          logo_societe: req.body.logo_societe,
          poste_occupe: req.body.poste_occupe,
          date_debut: req.body.date_debut,
          date_fin: req.body.date_fin,
          duree: req.body.duree,
          poste_actuel: req.body.poste_actuel,
        },
        queryUpdate: `UPDATE ${tableName} SET logo_societe='${req.body.logo_societe}', poste_occupe='${req.body.poste_occupe}',date_debut='${req.body.date_debut}',date_fin='${req.body.date_fin}',duree='${req.body.duree}', poste_actuel='${req.body.logo_techno}' WHERE id = '${req.params.id}'`,
      };
      break;
    case "formations":
      data = {
        body: {
          date_debut: req.body.date_debut,
          date_fin: req.body.date_fin,
          description: req.body.description,
        },
        queryUpdate: `UPDATE ${tableName} SET date_debut='${req.body.date_debut}',date_fin='${req.body.date_fin}',description='${req.body.description}' WHERE id = '${req.params.id}'`,
      };
      break;
    default:
      break;
  }
  return data;
}

function validateRequest(req) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
}

function finalResult(err, res, data, messageError) {
  if (err) {
    res.status(500).send({
      message: err.message || messageError,
    });
  } else {
    res.send(data);
  }
}

exports.create = (req, res) => {
  validateRequest(req);
  const tableName = req.baseUrl.split("/")[2];
  const generic = new GenericModel({
    tableName,
    body: dataforModel(tableName, req).body,
  });
  GenericModel.create(generic, (err, data) => {
    const message = "Some error occurred while creating " + generic.table;
    finalResult(err, res, data, message);
  });
};

exports.findAll = (req, res) => {
  const table = req.baseUrl.split("/")[2];
  getAll(table, res);
};

function getAll(tableName, res, filter = {}) {
  const genericFind = {
    tableName,
    filter,
  };
  GenericModel.getAll(genericFind, (err, data) => {
    const messageIfError =
      "Some error occurred while retrieving " + genericFind.table;
    finalResult(err, res, data, messageIfError);
  });
}

exports.findOne = (req, res) => {
  const find = {
    tableName: req.baseUrl.split("/")[2],
    id: req.params.id,
  };
  GenericModel.findById(find, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found " + find.tableName + " with id " + find.id,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving " + find.tableName + " with id " + find.id,
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  validateRequest(req);
  const tableName = req.baseUrl.split("/")[2];
  const id = req.params.id;
  const model = dataforModel(tableName, req);
  const querry = model.queryUpdate;
  const data = model.body;
  GenericModel.updateById(id, querry, data, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found " + tableName + "  with id " + id,
        });
      } else {
        res.status(500).send({
          message: "Error updating " + tableName + " with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  const remove = {
    tableName: req.baseUrl.split("/")[2],
    id: req.params.id,
  };
  GenericModel.remove(remove, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found " + remove.tableName + " with id ." + remove.id,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete " + remove.tableName + " with id " + remove.id,
        });
      }
    } else
      res.send({ message: remove.tableName + " was deleted successfully!" });
  });
};

exports.deleteAll = (req, res) => {
  const tableName = req.baseUrl.split("/")[2];
  GenericModel.removeAll(tableName, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all " + tableName,
      });
    else
      res.send({ message: "All " + tableName + " were deleted successfully!" });
  });
};
