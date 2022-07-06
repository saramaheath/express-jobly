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

module.exports = { sqlForPartialUpdate };
