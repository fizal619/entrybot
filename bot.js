const Discord = require('discord.js');
const client = new Discord.Client();
const stream = require('youtube-audio-stream');
const fs = require('fs');

const getAndSave = (url, name) => {
  return new Promise(resolve => {
    const file = fs.createWriteStream(`./${name}.mp3`);
    try {
      console.log('trying to read stream.')
      resolve(stream(url).pipe(file));
    } catch (exception) {
      console.log(exception)
    }
  });
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('voiceStateUpdate', async (old, nextChannel) => {
  let newUserChannel = nextChannel.voiceChannel
  let oldUserChannel = old.voiceChannel


  if(oldUserChannel === undefined && newUserChannel !== undefined && nextChannel.user.id !== client.user.id) {
    console.log(nextChannel.user.username, 'joined.');

    const connection = await newUserChannel.join();
    const tmpName = Date.now() + '';
    const YTfileStream = await getAndSave('https://www.youtube.com/watch?v=-LGHwFanLX4', tmpName);

    if (YTfileStream) {
      YTfileStream.on('close', (file)=> {
        const dispatch = connection.playFile(`./${tmpName}.mp3`);
        setTimeout(()=> {
          fs.unlinkSync(`./${tmpName}.mp3`);
          dispatch.end();
          newUserChannel.leave();
        }, 10000);
      });
    }



  } else if(newUserChannel === undefined){

    // User leaves a voice channel

  }
});

client.login('NTQzMzA3NjM4NjEyNTU3ODI0.Dz6qXQ.tHjzMLdro47pi517T9iORcAcoF0');