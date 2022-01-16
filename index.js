require('dotenv').config()
const { Client, Intents, MessageEmbed } = require("discord.js")
const { CREATE_FILE_REGEX, ADD_MOVIE_REGEX, EDIT_MOVIE_REGEX, hasPermissions, readTextFromAttachedFile } = require("./utils")
const { createEmptyFile, addMovie, editMovie } = require('./commandHandlers')
const { sendFinalMsg } = require('./channelEditor')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.BOT_DS_TOKEN);

client.on("ready", () => {
  console.log("The bot is ready");
});

client.on("messageCreate", msg => {
  if(msg.content.match(CREATE_FILE_REGEX)) {
    createEmptyFile(msg)
  }
})

client.on("messageCreate", (msg) => {
  if (msg.content.includes("testing")) {
    //const realMessage = msg;
    msg.channel.send('> \*tested correctly\*')
      .then(_msg => {
        msg.delete()
        setTimeout(() => _msg.delete(), 5000)
      })
  } else if (msg.content.match(ADD_MOVIE_REGEX) && hasPermissions(msg.member)) {
    console.log('TRYING TO ADD A MOVIE')
    addMovie(msg)
  } else if (msg.content.match(EDIT_MOVIE_REGEX) && hasPermissions(msg.member)) {
    editMovie(msg)
  } else if (msg.content.includes("attach")) {
    console.log('gettin messages...')
    msg.channel.messages.fetch({limit: 3}).then(data => {
      console.log(data)
    }).catch(e => console.log(e.messages))
  } else if (msg.content.includes("stack")) {
    readTextFromAttachedFile(msg)
    //uploadTextContent(msg)
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
