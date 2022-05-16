const URI = "https://db.ygoprodeck.com/api/v7/randomcard.php";
const DEFAULT_IMG = "https://static.wikia.nocookie.net/yugioh/images/9/94/Back-Anime-2.png/revision/latest/scale-to-width-down/250?cb=20110624090942";
const axios = require("axios");

module.exports = async (channel) => {
  const res = await axios.get(URI);

  const message = `
**Card of the Day**
${res.data.name || ""}
${res.data.card_prices[0] ? "*$" + res.data.card_prices[0].amazon_price + "*" : ""}
  `;

  channel.send(
    message,
    {
      files: [
        res.data.card_images[0] ? res.data.card_images[0].image_url : DEFAULT_IMG
      ]
    }
  );
}