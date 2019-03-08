const axios = require('axios');

module.exports = async text => {
  text.shift();
  text.shift();
  text = text.join(' ');
  if (text.length > 25) {
    return 'Sorry, that\'s to long for me to read 😂';
  }
  const scrambled = text.split('').map(letter=> {
    let rand = Math.ceil(Math.random() * 2);
    if (rand == 1) {
      return letter.toUpperCase();
    } else {
      return letter.toLowerCase();
    }
  }).join('');
  try {
    const res =  await axios.get(`https://api.imgflip.com/caption_image?template_id=102156234&username=${process.env.IMGFLIP_USERNAME}&password=${process.env.IMGFLIP_PASSWORD}&boxes%5B%5D%5Btext%5D=${scrambled}`);
    // console.log(res.data.data.url);
    return res.data.data.url;

  } catch (e) {
    console.log(e.message);
    return 'OOPS sorry. ☠';
  }
}