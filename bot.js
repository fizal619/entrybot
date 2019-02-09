require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const stream = require('youtube-audio-stream');
const { Pool } = require('pg');
const connectionString = process.env.DB_URL;

const pool = new Pool({ connectionString: connectionString });
const {save_url, show_url} = require('./message_handlers');

client.login(process.env.DISCORD_TOKEN);



// Allow a user to mention bot and supply a url.
// Messsage should have two words when trimmed and split.
// second word should be a url.

client.on('message', msg => {
  console.log(msg);
  try {
    const messageArray = msg.content.split(' ');
    console.log(messageArray);
    if (messageArray[0] !== '+entry') return;

    switch (messageArray[1]){
      case 'save':
        if (messageArray.length === 3) {
          save_url(pool, msg.author.id + '', messageArray[2]).then(c=>{
            msg.reply(c);
          });
        }
        break;
      case 'show':
        show_url(pool, msg.author.id + '').then(c=>{
          msg.reply(c);
        });
        break;
      default:
        msg.reply('*Commands:* \n\`+entry save <url>\`\n\`+entry show\`\n Please complain to fizal if I fuck up. ');
    }
  } catch (e) {
    const channel = msg.guild.channels.find(ch => ch.name === 'entrybot-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`🚨*ERROR*🚨 \n \`\`\`${e}\`\`\` `);
  }
});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

const getAndSave = (url, name) => {
  return new Promise(resolve => {
    try {
      console.log('trying to read stream.')
      resolve(stream(url));
    } catch (exception) {
      console.log(exception);
      resolve(null);
    }
  });
}

// Play for a user if they now enter the voice channels.
// Play only if someone has already asked entrybot to save their YT video.
client.on('voiceStateUpdate', async (old, nextChannel) => {
  let newUserChannel = nextChannel.voiceChannel
  let oldUserChannel = old.voiceChannel

  try {
    if(oldUserChannel === undefined && newUserChannel !== undefined && nextChannel.user.id !== client.user.id) {
      console.log(nextChannel.user.username, 'joined.');
      const tmpName = Date.now() + '';
      const res = await pool.query(`select * from users where uid=$1;`, [nextChannel.user.id]);
      if (res.rowCount === 0) return;

      const connection = await newUserChannel.join();

      const YTfileStream = await getAndSave( res.rows[0].url, tmpName);
      if (YTfileStream) {
        // console.log(err);
        const dispatch = connection.playStream(YTfileStream);
        dispatch.setVolume(0.2);
        setTimeout(()=> {
          dispatch.end();
        }, 12000);

        dispatch.on('end', () => newUserChannel.leave());

      } else {
        newUserChannel.leave();
      }
    } else if(newUserChannel === undefined){
      // User leaves a voice channel
    }
  } catch (e) {
    const channel = nextChannel.guild.channels.find(ch => ch.name === 'entrybot-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`🚨*ERROR*🚨 \n \`\`\`${e}\`\`\` `);
  }

});
