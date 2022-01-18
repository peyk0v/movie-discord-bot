require('dotenv').config()
const { Client, Intents, MessageEmbed } = require("discord.js")
const { CREATE_FILE_REGEX, ADD_MOVIE_REGEX, DELETE_MOVIE_REGEX, EDIT_MOVIE_REGEX, hasPermissions, LIST_ROLES } = require("./utils")
const { createEmptyFile, addMovie, editMovie, deleteMovie, listRoles } = require('./commandHandlers')
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
    //console.log(msg.guild.channels.commands)
   /*console.log('GUILD')
    console.log(msg.guild)
    console.log('CACHE')
    msg.guild.channels.cache.each(c => {
      if(c.isText()) {
        console.log(c.id)
        console.log(c.name)
      }
    })*/
    //console.log(msg.guild.channels.cache.values())
    console.log('ROLES DEL SV')
    console.log(msg.guild.roles.cache.values())
    console.log('ROLES DEL USUARIO')
    console.log(msg.member.roles.cache)
  } else if (msg.content.match(ADD_MOVIE_REGEX) && hasPermissions(msg.member)) {
    addMovie(msg)
  } else if (msg.content.match(EDIT_MOVIE_REGEX) && hasPermissions(msg.member)) {
    editMovie(msg)
  } else if (msg.content.match(DELETE_MOVIE_REGEX) && hasPermissions(msg.member)) {
    deleteMovie(msg)
  } else if(msg.content.match(LIST_ROLES) && hasPermissions(msg.member)) {
    listRoles(msg)
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
