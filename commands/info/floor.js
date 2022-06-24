const axios = require('axios');
const cheerio = require('cheerio')
const { MessageEmbed } = require('discord.js');
require("dotenv").config();

//Takes discord message array and outputs a string in format of underscored and lowercased 'okay_bears'
const underscoreCollectionName = (discordInput) => {
  if (discordInput.length > 1) {
    outputName = discordInput.join("_").toLowerCase();
} else {
    outputName = discordInput[0].toLowerCase()
} return outputName
}

//Takes collection name with underscores and outputs a collection page URL
const generateCollectionUrl = (collectionName) => {
  return `https://magiceden.io/marketplace/${collectionName}`
};

//Takes collection name with underscores and outputs a collection/stats API URL for MagicEden
const generateStatsApiUrl = (collectionName) => {
return `https://api-mainnet.magiceden.dev/v2/collections/${collectionName}/stats?api_key=${process.env.MAGIC_EDEN_API_KEY}`
};

//Takes collection url and gets collection image URL
async function generateCollectionImageUrl (CollectionUrl) {
  await axios.get(CollectionUrl)
  .then((response) => {
      if(response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          const imageUrl = $('meta[property="og:image"]').attr('content');
          return imageUrl
} else {
   (error) => console.log(err)
}
})};

//Takes discord message array and returns MagicEden API data
// name comes in array (ex. ['okay','bears'])
async function magicEdenStats(discordInput) {

  const collection = underscoreCollectionName(discordInput)

  try {
    const collectionApiUrl = generateStatsApiUrl(collection)
    const response = await axios.get(collectionApiUrl);
    const stringFloor = JSON.stringify(response.data.floorPrice);
    const stringListedCount = JSON.stringify(response.data.listedCount);
      if (stringFloor === undefined) {
        return undefined;
    } else {
      const meAPIData ={
        collection : (collection.replace(/_/g, " "))
        .replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
        floor : (parseInt(stringFloor)/1000000000).toString(),
        listed : stringListedCount,
        url : generateCollectionUrl(collection)
    }
        return meAPIData;
    }
    
  } catch (error) {
      console.error("Fix spelling / Maybe ME is shitting itself");
  }}

module.exports = {
    name: "floor",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args, Discord}) => {
      
        const returnApiData = await magicEdenStats(args)
        //const iconUrl = await generateCollectionImageUrl(generateCollectionUrl(underscoreCollectionName(args))

        if (returnApiData === undefined) { 
          const errEmbed = new MessageEmbed(returnApiData)
          .setColor('#0099ff')
          .setAuthor({ name: 'NFT Floor Bot', iconURL: 
          'https://substackcdn.com/image/fetch/w_256,h_256,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fdbf53918-04a8-40cf-b063-0769309bc98b_800x800.png', 
          url: 'https://twitter.com/KosameAi' })
          .setThumbnail('https://i.imgur.com/vhk97dph.jpg')
          .addFields(
            { name: "Error", 
              value: "Please fix spelling of collection,"},
            { name: "Formatting", value: "Formatting must match Magic Eden collection name \n (ex. magicticket, not magic_ticket)", inline: true }
          )
          //.setImage(iconUrl)
          .setTimestamp()
          .setFooter({ text: 'Made by @KosameAi', iconURL: 'https://i.imgur.com/vhk97dph.jpg'});
          message.reply({embeds : [errEmbed]});
        } else {

        const embed = new MessageEmbed(returnApiData)
          .setColor('#0099ff')
          .setAuthor({ name: 'NFT Floor Bot', iconURL: 
          'https://substackcdn.com/image/fetch/w_256,h_256,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fdbf53918-04a8-40cf-b063-0769309bc98b_800x800.png', 
          url: 'https://twitter.com/KosameAi' })
          .setThumbnail('https://i.imgur.com/vhk97dph.jpg')
          .addFields(
            { name: returnApiData.collection, 
              value: "Collection Data from MagicEden",
              url: returnApiData.url},
            { name: "Floor", value: returnApiData.floor + ' SOL', inline: true },
            { name: 'Listing Count', value: returnApiData.listed, inline: true },
          )
          //.setImage(iconUrl)
          .setURL(returnApiData.url)
          .setTimestamp()
          .setFooter({ text: 'Made by @KosameAi', iconURL: 'https://i.imgur.com/vhk97dph.jpg'});

        message.reply({embeds : [embed]});
      }
    }
}