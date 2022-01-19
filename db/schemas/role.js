const mongoose = require('mongoose')

const role_schema = new mongoose.Schema({
  name: { type : String, required : true },
  id: { type : String , unique : true, required : true, dropDups: true },
  server_id: { type: String, required: true }
});

const Role = mongoose.model('Role', role_schema)

module.exports = Role