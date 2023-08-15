const { academic } = require("../../libs");

module.exports = {
  Mutation: {
    createAcademic: (_, args) =>
      new Promise((resolve) =>
        academic.create(args?.input).then((response) => resolve(response))
      ),
  },
  Query: {
    login: (_, args) =>
      new Promise((resolve) =>
        academic.login(args?.input).then((response) => resolve(response))
      ),
  },
};
