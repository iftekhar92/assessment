module.exports = {
  apps: [
    {
      name: "UniversityAssessment",
      script: "./server.js",
      env_development: {
        NODE_ENV: "development",
        HOST: "127.0.0.1",
        PORT: 3500,
        // DB_CONNECTION: "mongodb://localhost:27017/universityAssessmentDB",
        DB_CONNECTION:
          "mongodb+srv://iphtekhar:iphtekhar321@cluster0.qcujyoi.mongodb.net/uaDB?retryWrites=true&w=majority",
      },
      env_production: {
        NODE_ENV: "production",
        HOST: "localhost",
        PORT: 3800,
        DB_CONNECTION:
          "mongodb+srv://iphtekhar:iphtekhar321@cluster0.qcujyoi.mongodb.net/universityAssessmentProdDB?retryWrites=true&w=majority",
      },
    },
  ],
};
