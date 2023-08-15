const { mergeTypeDefs } = require("@graphql-tools/merge");

const Common = require("./Common");
const University = require("./University");
const Course = require("./Course");
const Academic = require("./Academic");
const Authenticated = require("./Authenticated");
const Fixture = require("./Fixture");

const types = [Common, University, Course, Academic, Authenticated, Fixture];

module.exports = mergeTypeDefs(types);
