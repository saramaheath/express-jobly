const { BadRequestError } = require("../expressError");

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
function sqlForFilterAll(queryData, jsToSql, operator) {
  const keys = Object.keys(queryData);
  if (keys.includes("name")) {
    queryData["name"] = `%${queryData["name"]}%`;
  }
  cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}" ${operator[colName]} $${idx + 1}`);


  return {
    setCols: cols.join(" AND "),
    values: Object.values(queryData)
  };


}

module.exports = { sqlForPartialUpdate, sqlForFilterAll };
