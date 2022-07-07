const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilterAll } = require("./sql");
describe("sqlForPartialUpdate", function () {
  test("given valid data", function () {
    const result = sqlForPartialUpdate(
      {
        numEmployees: 5,
        logoUrl: "test.com",
      },
      {
        numEmployees: "num_employees",
        //logoUrl: "logo_url",
      }
    );

    expect(result).toEqual({
      setCols: '"num_employees"=$1, "logoUrl"=$2',
      values: [5, "test.com"],
    });
  });

  test("given invalid data", function () {
    try {
      const result = sqlForPartialUpdate(
        {},
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        }
      );
      throw new Error("Should not run this line of code");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("sqlforFilterAll", function () {
  test("given valid inputs", function () {
    const result = sqlForFilterAll(
      {
        name: "dan",
        minEmployees: 4,
        maxEmployees: 40,
      },
      {
        maxEmployees: "num_employees",
        minEmployees: "num_employees",
      },
      {
        name: "ILIKE",
        maxEmployees: "<=",
        minEmployees: ">=",
      }
    );
    expect(result).toEqual({
      setCols:
        '"name" ILIKE $1 AND "num_employees" >= $2 AND "num_employees" <= $3',
      values: ["%dan%", 4, 40],
    });
  });

  test("given partially valid inputs", function () {
    try {
      const result = sqlForFilterAll(
        {
          name: "dan",
          minEmployees: 4,
          maxEmployees: 40,
          coupon: "hello",
        },
        {
          maxEmployees: "num_employees",
          minEmployees: "num_employees",
        },
        {
          name: "ILIKE",
          maxEmployees: "<=",
          minEmployees: ">=",
        }
      );
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
//TODO: test greater than min max throws error, expectation set in string
  test("if min is bigger than max", function () {
    try {
      result = sqlForFilterAll(
        { maxEmployees: 1, minEmployees: 4 },
        {
          maxEmployees: "num_employees",
          minEmployees: "num_employees",
        },
        {
          name: "ILIKE",
          maxEmployees: "<=",
          minEmployees: ">=",
        }
      );
      throw new Error("Should not run this line of code");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("given only invalid inputs", function () {
    try {
      result = sqlForFilterAll(
        { handle: "hello" },
        {
          maxEmployees: "num_employees",
          minEmployees: "num_employees",
        },
        {
          name: "ILIKE",
          maxEmployees: "<=",
          minEmployees: ">=",
        }
      );
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
