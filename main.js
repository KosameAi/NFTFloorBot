const Discord = require('discord.js');

require("dotenv").config()

const client = new Discord.Client({ 
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
 })

const prefix = '$'

client.once('ready', () => {
    console.log('NFTFloorBot is online!');
});

client.on('messageCreate', (message) =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'floor'){
        message.channel.send('pong!');
    }
});


client.login(process.env.TOKEN);