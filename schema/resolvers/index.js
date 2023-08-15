const { mergeResolvers } = require("@graphql-tools/merge");

const university = require("./University");
const course = require("./Course");
const academic = require("./Academic");
const authenticated = require("./Authenticated");
const fixture = require("./Fixture");

const resolvers = [university, course, academic, authenticated, fixture];

module.exports = mergeResolvers(resolvers);
