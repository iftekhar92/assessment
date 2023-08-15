const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

require("./models").connect();
const schema = require("./schema");
const { tokenValidator } = require("./utils/utils");

const prodObj = {};
if (process.env.NODE_ENV !== "development") {
  prodObj.introspection = true;
}
let endpoint = "/graphql";
if (process.env.NODE_ENV === "production") {
  endpoint = "/university/graphql";
}

const app = express();
app.use(cors());
const apolloSetup = new ApolloServer({
  ...prodObj,
  schema,
  context: async ({ req }) => {
    let user = null;
    const token = req.headers?.authorization || "";
    if (token) {
      const { status, data } = tokenValidator(token);
      if (status) {
        user = data;
      }
    }
    return { user };
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        "editor.theme": "dark", // light
      },
      tabs: [
        {
          endpoint,
        },
      ],
    }),
  ],
});
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

(async () => {
  await apolloSetup.start();
  apolloSetup.applyMiddleware({ app });
  app.listen(process.env.PORT, process.env.HOST, () =>
    console.log(
      `🚀 Server ready at http://${process.env.HOST}:${process.env.PORT}${endpoint}`
    )
  );
})();
