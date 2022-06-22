const sql = require("./db.js");

const GenericModel = function (generic) {
  this.tableName = generic.tableName;
  this.body = generic.body;
};

GenericModel.create = (newData, result) => {
  sql.query(
    "INSERT INTO " + newData.tableName + " SET ?",
    newData.body,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("Created " + newData.tableName + ":", {
        id: res.insertId,
        ...newData.body,
      });
      result(null, { id: res.insertId, ...newData.body });
    }
  );
};

GenericModel.getAll = (genericGetAll, result) => {
  const table = genericGetAll.tableName;
  const filter = genericGetAll.filter;
  let query = "SELECT * FROM " + table;
  if (filter.nom) {
    query += ` WHERE nom LIKE '%${filter.nom}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log(table + ":", res);
    result(null, res);
  });
};

GenericModel.findById = (find, result) => {
  sql.query(
    "SELECT * FROM " + find.tableName + " WHERE id =" + find.id,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("found " + find.tableName + ": ", res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

GenericModel.remove = (remove, result) => {
  sql.query(
    "DELETE FROM " + remove.tableName + " WHERE id = ?",
    remove.id,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("deleted " + remove.tableName + " with id: ", remove.id);
      result(null, res);
    }
  );
};

GenericModel.removeAll = (tableName, result) => {
  sql.query("DELETE FROM " + tableName, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log(`deleted ${res.affectedRows} ` + tableName);
    result(null, res);
  });
};

GenericModel.updateById = (id, query, data, result) => {
  sql.query(query,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated", { id: id, ...data });
      result(null, { id: id, ...data });
    }
  );
};

module.exports = GenericModel;
