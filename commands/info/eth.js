const axios = require('axios');
const cheerio = require('cheerio')
const { MessageEmbed } = require('discord.js');
//require("dotenv").config();

//Takes discord message array and outputs a string in format of dashed(-) and lowercased 'llamaverse-genesis'
const dashCollectionName = (discordInput) => {
  if (discordInput.length > 1) {
    outputName = discordInput.join("-").toLowerCase();
} else {
    outputName = discordInput[0].toLowerCase()
} return outputName
}

//Takes collection name with dashes and outputs a collection page URL
const generateCollectionUrl = (collectionName) => {
  return `https://opensea.io/collection/${collectionName}`
};

//Takes collection name with dashes and outputs a collection/stats API URL for OpenSea
const generateStatsApiUrl = (collectionName) => {
return `https://api.opensea.io/api/v1/collection/${collectionName}`
};


//Takes discord message array and returns OpenSea API data
// name comes in array (ex. ['okay','bears'])
async function openSeaStats(discordInput) {

  const collection = dashCollectionName(discordInput)

  try {
    const collectionApiUrl = generateStatsApiUrl(collection)
    const response = await axios.get(collectionApiUrl);
    const stringFloor = JSON.stringify(response.data.collection.stats.floor_price);
    const stringSevenDaySales = JSON.stringify(response.data.collection.stats.seven_day_sales);
      if (response === undefined) {
        console.log("response undefined")
        return undefined;
    } else {
      const osAPIData ={
        collection : (collection.replace(/_/g, " "))
        .replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
        floor : stringFloor.toString(),
        sevenDaySales : stringSevenDaySales,
        imgUrl : response.data.collection.image_url,
        url : generateCollectionUrl(collection),
        description : response.data.collection.description
    }
        return osAPIData;
    }
    
  } catch (error) {
      console.error("api call response error");
  }}

module.exports = {
    name: "eth",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args, Discord}) => {
      
        const returnApiData = await openSeaStats(args)

        if (returnApiData === undefined) { 
          const errEmbed = new MessageEmbed(returnApiData)
          .setColor('#0099ff')
          .setAuthor({ name: 'NFT Floor Bot', iconURL: 
          'https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.png', 
          url: 'https://twitter.com/KosameAi' })
          .setThumbnail('https://i.imgur.com/vhk97dph.jpg')
          .addFields(
            { name: "Error", 
              value: "Please fix spelling of collection,"},
            { name: "Formatting", value: "Formatting must match Open Sea collection name \n (ex. llamaverse-genesis, not llamaversegenesis)", inline: true }
          )
          .setTimestamp()
          .setFooter({ text: 'Made by @KosameAi', iconURL: 'https://i.imgur.com/vhk97dph.jpg'});
          message.reply({embeds : [errEmbed]});

        } else {

        const embed = new MessageEmbed(returnApiData)
          .setColor('#0099ff')
          .setAuthor({ name: 'NFT Floor Bot', iconURL: 
          'https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.png', 
          url: 'https://twitter.com/KosameAi' })
          .setThumbnail('https://i.imgur.com/vhk97dph.jpg')
          .setTitle(returnApiData.collection)
          .setURL(returnApiData.url)
          .setDescription(returnApiData.description)
          .addFields(
            { name: "Floor", value: returnApiData.floor + ' ETH', inline: true },
            { name: 'Sales in last 7 days', value: returnApiData.sevenDaySales, inline: true },
          )
          .setImage(returnApiData.imgUrl)
          .setURL(returnApiData.url)
          .setTimestamp()
          .setFooter({ text: 'Made by @KosameAi', iconURL: 'https://i.imgur.com/vhk97dph.jpg'});

        message.reply({embeds : [embed]});
      }
    }
}