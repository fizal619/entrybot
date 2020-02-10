const URI = "https://api.jikan.moe/v3/search/anime?limit=2&q=";
const axios = require("axios");

module.exports = async (text = ["", "", "naruto"]) => {
  text.shift();
  text.shift();
  text = text.join(' ');

  const res = await axios.get(URI + text);

  const message = `It's either this \n \n**${res.data.results[0].title}** \n${res.data.results[0].synopsis} \n${res.data.results[0].url}  \nor \n\n**${res.data.results[1].title}** \n${res.data.results[1].synopsis} \n${res.data.results[1].url}`;
  return message;
}