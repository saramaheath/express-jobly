const { BadRequestError } = require("../expressError");
//TODO:what does this func do, explicitly
/**reformats javascript, inorder to be inserted into SQL query
 * takes object like: { name, description, numEmployees, logoUrl },
 * takes object like:
 * {numEmployees: "num_employees", logoUrl: "logo_url",}
 * returns object like: { setCols: "first_name=$1, age=$2", values: ["dan", "23"] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/**reformats javascript, inorder to be inserted into SQL query where clause
 * takes queryData like: {name: "Bauer-Son", ..,}
 * takes jsToSql like:{maxEmployees: "num_employees"}changes colName to match DB
 * takes operator like:{name: "ILIKE"}inserts correct operator into setCols
 * returns object with string of subconditions for WHERE clause and
 * parameterized query inputs (sqlInjection).
 */
//TODO: operator varialbe name- colname to operator, moved into model method '_'
//already converted to min and max convertions, up in route instead, that is where
//query is, separate concerns there
function sqlForFilterAll(queryData, jsToSql, operator) {
  const keys = Object.keys(queryData);
  if (keys.includes("name")) {
    queryData["name"] = `%${queryData["name"]}%`;
  }
  if (keys.includes("minEmployees") && keys.includes("maxEmployees")) {
    if (Number(queryData.minEmployees) > Number(queryData.maxEmployees)) {
      throw new BadRequestError(
        "min employess cannot be greater than max employees"
      );
    }
  }
  cols = keys.map(
    (colName, idx) =>
      `"${jsToSql[colName] || colName}" ${operator[colName]} $${idx + 1}`
  );

  return {
    setCols: cols.join(" AND "),
    values: Object.values(queryData),
  };
}

module.exports = { sqlForPartialUpdate, sqlForFilterAll };
