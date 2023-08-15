const { course } = require("../../libs");

module.exports = {
  Mutation: {
    createCourse: (_, args) =>
      new Promise((resolve) =>
        course.create(args?.input).then((response) => resolve(response))
      ),
    updateCourse: (_, args) =>
      new Promise((resolve) =>
        course.update(args?.input).then((response) => resolve(response))
      ),
  },
  Query: {
    courses: () =>
      new Promise((resolve) =>
        course.courses().then((response) => resolve(response))
      ),
    findCourseByID: (_, args) =>
      new Promise((resolve) =>
        course.findById(args?.input).then((response) => resolve(response))
      ),
  },
};
