const { authenticated } = require("../../libs");

module.exports = {
  Mutation: {
    bookSession: (_, args, context) =>
      new Promise((resolve) =>
        authenticated
          .bookSession(args?.input, context)
          .then((response) => resolve(response))
      ),
    updateBookedSession: (_, args, context) =>
      new Promise((resolve) =>
        authenticated
          .updateBookedSession(args?.input, context)
          .then((response) => resolve(response))
      ),
  },
  Query: {
    availableSession: (_, args, context) =>
      new Promise((resolve) =>
        authenticated
          .availableSession(args?.input, context)
          .then((response) => resolve(response))
      ),
    meetings: (_, __, context) =>
      new Promise((resolve) =>
        authenticated.meetings(context).then((response) => resolve(response))
      ),
    academicList: (_, __, context) =>
      new Promise((resolve) =>
        authenticated
          .academicList(context)
          .then((response) => resolve(response))
      ),
  },
};
