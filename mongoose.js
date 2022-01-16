const mongoose = require('mongoose')

const openDatabaseConection = () =>
  mongoose
    .connect(process.env.DB_ACCESS)
    .then(() => console.log("The bot has connected to database successfully"))
    .catch((e) => console.error("The bot couldn't connect to db:", e.message))

module.exports = openDatabaseConection