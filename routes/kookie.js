const ffmpeg = require('fluent-ffmpeg');



module.exports = async (channel) => {
  try {
    channel.send('Capturing Kookie... 📸');

    ffmpeg(process.env.CAMURL)
      .duration(5)
      .size('1280x720')
      .noAudio()
      .save('kookie.mp4')
      .on('error', (e)=>{
        channel.send(`Something went wrong: ${e.message} 😭.`)
      })
      .on('end', ()=> {
        channel.send('Please open this in your browser.', {
          files: [{
            attachment: 'kookie.mp4',
            name: 'kookie.mp4'
          }]
        });
      });

    // setTimeout(()=>{
    //   channel.send('Don\'t fap too hard to this...', {
    //     files: [{
    //       attachment: 'lola.png',
    //       name: 'lola.png'
    //     }]
    //   });
    // }, 2000);

  } catch (e) {
    console.log(`Something went wrong: ${e.message} 😭.`);
    channel.send(`Something went wrong: ${e.message} 😭.`);
  }
}