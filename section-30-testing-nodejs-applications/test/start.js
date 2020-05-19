const expect = require('chai').expect;

it ('should add numbers correctly', function () {
  const num1 = 2;
  const num2 = 3;
  const result = 5;
  expect(num1 + num2).to.equal(result);
});