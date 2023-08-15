const { university } = require("../../libs");

module.exports = {
  Mutation: {
    createUniversity: (_, args) =>
      new Promise((resolve) =>
        university.create(args?.input).then((response) => resolve(response))
      ),
    updateUniversity: (_, args) =>
      new Promise((resolve) =>
        university.update(args?.input).then((response) => resolve(response))
      ),
  },
  Query: {
    universities: () =>
      new Promise((resolve) =>
        university.universities().then((response) => resolve(response))
      ),
    findUniversityByID: (_, args) =>
      new Promise((resolve) =>
        university.findById(args?.input).then((response) => resolve(response))
      ),
  },
};
