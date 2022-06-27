const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "floor",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args, Discord}) => {
      const errEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor({ name: 'NFT Floor Bot',
        url: 'https://twitter.com/KosameAi' })
        .setThumbnail('https://i.imgur.com/vhk97dph.jpg')
        .addFields(
          { name: "$eth", value: "Get floor price off Open Sea,"},
          { name: "$sol", value: "Get floor price off Magic Eden ", inline: true }
          )
        .setTimestamp()
        .setFooter({ text: 'Made by @KosameAi', iconURL: 'https://i.imgur.com/vhk97dph.jpg'});
        
        message.reply({embeds : [errEmbed]});
      }
    }