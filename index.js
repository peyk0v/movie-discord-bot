require('dotenv').config()
const { Client, Intents, MessageEmbed } = require("discord.js")
const { CREATE_FILE_REGEX, ADD_MOVIE_REGEX, DELETE_MOVIE_REGEX, EDIT_MOVIE_REGEX, hasPermissions, LIST_ROLES, ADD_PERMISSION_ROLE, REMOVE_PERMISSION_ROLE } = require("./utils")
const { createEmptyFile, addMovie, editMovie, deleteMovie, listRoles, addPermisionRole, removePermissionRole } = require('./commandHandlers')
const openDatabaseConection = require('./db/mongoose')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.BOT_DS_TOKEN);

client.on("ready", () => {
  openDatabaseConection()
  console.log("The bot is ready");
});

client.on("messageCreate", msg => {
  if(msg.content.match(CREATE_FILE_REGEX)) {
    createEmptyFile(msg)
  }
})

client.on("messageCreate", (msg) => {
  if (msg.content.includes("testing")) {
    //console.log(msg.member.roles.cache.hasAny())
  } else if (msg.content.match(ADD_MOVIE_REGEX) && hasPermissions(msg)) {
    addMovie(msg)
  } else if (msg.content.match(EDIT_MOVIE_REGEX) && hasPermissions(msg)) {
    editMovie(msg)
  } else if (msg.content.match(DELETE_MOVIE_REGEX) && hasPermissions(msg)) {
    deleteMovie(msg)
  } else if(msg.content.match(LIST_ROLES) && hasPermissions(msg)) {
    listRoles(msg)
  } else if(msg.content.match(ADD_PERMISSION_ROLE) && hasPermissions(msg)) {
    addPermisionRole(msg)
  } else if(msg.content.match(REMOVE_PERMISSION_ROLE) && hasPermissions(msg)) {
    removePermissionRole(msg)
  }
});

client.on("messageCreate", (msg) => {
  if (msg.content.toLowerCase().startsWith("!clearchat")) {
    msg.channel
      .bulkDelete(20)
      .then((messages) => console.log(`Bulk deleted ${messages.size} messages`))
      .catch(console.error);
  }
});
