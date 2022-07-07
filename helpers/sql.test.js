const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilterAll } = require("./sql");
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

  test("given invalid data", function() {
    try{
      const result = sqlForPartialUpdate({},
        {
       numEmployees: "num_employees",
       logoUrl: "logo_url",
     });
     throw new Error("Should not run this line of code");

    }catch(err){

      expect(err instanceof BadRequestError).toBeTruthy();

    }
  });

});

describe("sqlforFilterAll", function () {
  test("given valid information", function (){
    const result = sqlForFilterAll({name:"dan",minEmployees:4,maxEmployees:40});
    expect(result).toEqual("name=dan AND numEmployees>=3 AND numEmployees<=40");
  })

  test("if min is bigger than max", function() {
    try{
      result = sqlForFilterAll({maxEmployees:1 ,minEmployees:4});
    }catch(err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })

  test("given invalid information", function() {
    try{
      result = sqlForFilterAll({handle:"hello"});
    }catch(err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })

})
