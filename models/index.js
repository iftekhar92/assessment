const  Database = require('../dbconnection');

module.exports.connect = (dbURI = '') => {
  Database.connect(dbURI || process.env.DB_CONNECTION);
};
