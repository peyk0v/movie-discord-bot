require('dotenv').config()
const { Client, Intents } = require("discord.js")
const { COMMAND_REGEX } = require("./utils")
const openDatabaseConection = require('./db/mongoose')
const { 
  createEmptyFile, 
  addMovie, 
  editMovie, 
  deleteMovie, 
  listRoles, 
  addPermisionRole, 
  removePermissionRole,
	listCommands
} = require('./commandHandlers')


const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.BOT_DS_TOKEN);

client.on("ready", () => {
  openDatabaseConection()
  console.log("The bot is ready");
});

client.on("messageCreate", (msg) => {
	if(msg.member.user.bot) return;
  if(msg.content.match(COMMAND_REGEX.CREATE_FILE)) {
    createEmptyFile(msg)
  } else if (msg.content.match(COMMAND_REGEX.ADD_MOVIE)) {
    addMovie(msg)
  } else if (msg.content.match(COMMAND_REGEX.EDIT_MOVIE)) {
    editMovie(msg)
  } else if (msg.content.match(COMMAND_REGEX.DELETE_MOVIE)) {
    deleteMovie(msg)
  } else if(msg.content.match(COMMAND_REGEX.LIST_ROLES)) {
    listRoles(msg)
  } else if(msg.content.match(COMMAND_REGEX.ADD_PERMISSION_ROLE)) {
    addPermisionRole(msg)
  } else if(msg.content.match(COMMAND_REGEX.REMOVE_PERMISSION_ROLE)) {
    removePermissionRole(msg)
  } else if(msg.content.match(COMMAND_REGEX.SEE_COMMANDS)) {
		listCommands(msg)
	}
});
