const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("given valid data", function () {
    const result = sqlForPartialUpdate({
      numEmployees: 5,
      logoUrl: "test.com",
    }, {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    });

    expect(result).toEqual({
      setCols: '"num_employees"=$1, "logo_url"=$2',
      values: [5, "test.com"],
    });
  });
});
