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
 * takes object like: {name: "Bauer-Son", ..,}
 * returns string of subconditions for where clause
 */
function sqlForFilterAll(queryData) {
  const keys = Object.keys(queryData);


  //WHERE 'name ILIKE $1, min_employee >= $2 AND max_employee <= $2'
  //['%name%', '%num_employees%']

  let whereConditions = [];
  if (keys.includes("name")) {
    whereConditions.push(`ILIKE'%${queryData["name"]}%'`);
  }
  if (keys.includes("minEmployees")) {
    whereConditions.push(`>=${queryData["minEmployees"]}`);
  }
  if (keys.includes("maxEmployees")) {
    whereConditions.push(`<=${queryData["maxEmployees"]}`);
  }

  cols = keys.map(
    (colName,idx)=>`"${colName}"=$${idx + 1}`);
  console.log(cols)
  whereConditions = whereConditions.join(" AND ");


  return {
    setCols: cols.join(", "),
    values:whereConditions
  }


}

module.exports = { sqlForPartialUpdate, sqlForFilterAll };
