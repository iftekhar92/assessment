const { fixture } = require("../../libs");

module.exports = {
  Mutation: {
    fixture: () =>
      new Promise((resolve) =>
        fixture.create().then((response) => resolve(response))
      ),
  },
};
