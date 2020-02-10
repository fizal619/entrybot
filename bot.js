require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const { Pool } = require('pg');
const connectionString = process.env.DB_URL;

const pool = new Pool({ connectionString: connectionString });
const save_url = require('./routes/save_url'),
      show_url = require('./routes/show_url'),
      clear_url = require('./routes/clear_url'),
      say = require('./routes/say'),
      kookie = require('./routes/kookie'),
      spongebob = require('./routes/spongebob'),
      animeSearch = require('./routes/animeSearch');
      // play = require('./routes/play');

const queue = [];

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});


const isDevChannel = (voiceChannel) => {
  return voiceChannel && voiceChannel.name === 'entrybot-development' && process.env.NODE_ENV !== 'development';
}

const isDevEnv = (voiceChannel) => {
  return voiceChannel && voiceChannel.name !== 'entrybot-development' && process.env.NODE_ENV === 'development';
}
// Play for a user if they now enter the voice channels.
// Play only if someone has already asked entrybot to save their YT video.

// existing timeout ID in memory
let timeoutID = 0;

client.on('voiceStateUpdate', async (old, nextChannel) => {
  let newUserChannel = nextChannel.voiceChannel;
  let oldUserChannel = old.voiceChannel;

  if (isDevChannel(newUserChannel)) {
    return;
  }

  if (isDevEnv(newUserChannel)) {
    return;
  }

  try {
    if(oldUserChannel === undefined && newUserChannel !== undefined && nextChannel.user.id !== client.user.id) {

      const tmpName = Date.now() + '';
      const res = await pool.query(`select * from users where uid=$1;`, [nextChannel.user.id]);
      if (res.rowCount === 0) return;

      const connection = await newUserChannel.join();

      try {
        const YTSTREAM = ytdl(res.rows[0].url, {quality: 'highestaudio'});
        const dispatch = connection.playStream(YTSTREAM);
        dispatch.setVolume(0.4);

        clearTimeout(timeoutID);

        timeoutID = setTimeout(()=> {
          dispatch.end();
        }, 12000);

        dispatch.on('end', () => {
          newUserChannel.leave();
          YTSTREAM.destroy();
        });

      } catch (e) {
        console.log(e);
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


// MESSAGE HANDLERS

client.on('message', msg => {
  try {
    const messageArray = msg.content.split(' ');
    if (messageArray[0] !== '+entry') return;

    switch (messageArray[1]){
      case 'save':
        if (messageArray.length === 3) {
          ytdl.getInfo(messageArray[2], (err, info) => {
            if (!err && info.player_response && info.player_response.playabilityStatus && info.player_response.playabilityStatus.status) {
              save_url(pool, msg.author.id + '', messageArray[2]).then(c=>{
                msg.channel.send(c);
              });
            } else {
              msg.channel.send('I can\'t play whatever this shit is yo. 🤢');
            }
          });
        }
        break;

      case 'show':
        show_url(pool, msg.author.id + '').then(c=>{
          msg.channel.send(c);
        });
        break;

      case 'clear':
        clear_url(pool, msg.author.id + '').then(c=>{
          msg.channel.send(c);
        });
        break;

      case 'spongebob':
        let bobText = messageArray.concat([]);
        spongebob(bobText).then(c => {
          msg.channel.send(c);
        });
        break;

      case 'anime':
        let animeText = messageArray.concat([]);
        animeSearch(animeText).then(c => {
          msg.channel.send(c);
        });
        break;

      case 'kookie':
        kookie(msg.channel);
      break;

      case 'say':
        let textArr = messageArray.concat([]);
        textArr.shift();
        textArr.shift();
        say(msg, textArr.join(' ')).then(c => {
          if (c) msg.channel.send(c);
        });
        break;

      default:
        msg.channel.send('\nHi! I will play the first 10 seconds of any youtube video whenever you join a voice channel.\nThink WWE intro music style!\n**Commands:** \n`+entry save <url>`\n`+entry show`\n`+entry spongebob <less than 25 characters of text>` \n`+entry say <stuff>` \n \n Please complain to fizal if I fuck up. ');
    }
  } catch (e) {
    const channel = msg.guild.channels.find(ch => ch.name === 'entrybot-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`🚨*ERROR*🚨 \n \`\`\`${e}\`\`\` `);
  }
});