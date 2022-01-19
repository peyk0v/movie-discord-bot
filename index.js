require('dotenv').config()
const { Client, Intents, MessageEmbed } = require("discord.js")
const { COMMAND_REGEX, hasPermissions } = require("./utils")
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
  } else if (msg.content.match(COMMAND_REGEX.ADD_MOVIE) && hasPermissions(msg)) {
    addMovie(msg)
  } else if (msg.content.match(COMMAND_REGEX.EDIT_MOVIE) && hasPermissions(msg)) {
    editMovie(msg)
  } else if (msg.content.match(COMMAND_REGEX.DELETE_MOVIE) && hasPermissions(msg)) {
    deleteMovie(msg)
  } else if(msg.content.match(COMMAND_REGEX.LIST_ROLES) && hasPermissions(msg)) {
    listRoles(msg)
  } else if(msg.content.match(COMMAND_REGEX.ADD_PERMISSION_ROLE) && hasPermissions(msg)) {
    addPermisionRole(msg)
  } else if(msg.content.match(COMMAND_REGEX.REMOVE_PERMISSION_ROLE) && hasPermissions(msg)) {
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
