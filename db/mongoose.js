const mongoose = require('mongoose')

const URI_DB = process.env.NODE_ENV == 'development' ? process.env.DB_ACCESS_TEST : process.env.DB_ACCESS

const openDatabaseConection = () =>
  mongoose
    .connect(URI_DB)
    .then(() => console.log("The bot has connected to database successfully"))
    .catch((e) => console.error("The bot couldn't connect to db:", e.message))

module.exports = openDatabaseConection