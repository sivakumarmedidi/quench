const { attributes } = require('structure');

const Number = attributes({
  id: Number,
  name: {
    type: String,
    required: true
  },
  age: Number
})(class User {
  isLegal() {
    return this.age >= User.MIN_LEGAL_AGE;
  }
});

Number.MIN_LEGAL_AGE = 21;

module.exports = Number;
