const axios = require('axios')
let statsByNameUrl = (name) => `https://api-mainnet.magiceden.dev/v2/collections/${name}/stats`

async function magicEdenStats(name) {
    try {
      const response = await axios.get(statsByNameUrl(name));
      const stringFloor = JSON.stringify(response.data.floorPrice);
      return (parseInt(stringFloor)/1000000000).toString()
    } catch (error) {
      console.error(error);
    }
  }


module.exports = {
    name: "floor",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        let floorPriceValue = await magicEdenStats(args);
        message.reply(floorPriceValue);
    }
}