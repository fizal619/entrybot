const ffmpeg = require('fluent-ffmpeg');



module.exports = async (channel) => {
  try {
    channel.send('Capturing Kookie... 📸');

    ffmpeg(process.env.CAMURL)
      .duration(5)
      .size('1280x720')
      .save('kookie.gif')
      .on('error', (e)=>{
        channel.send(`Something went wrong: ${e.message} 😭.`)
      })
      .on('end', ()=> {
        channel.send('Please open this in your browser.', {
          files: [{
            attachment: 'kookie.gif',
            name: 'kookie.gif'
          }]
        });
      });
    // console.log(check.rows);
  } catch (e) {
    console.log(`Something went wrong: ${e.message} 😭.`);
    channel.send(`Something went wrong: ${e.message} 😭.`);
  }
}