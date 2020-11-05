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


client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});


const isDevChannel = (channel) => {
  return channel && process.env.NODE_ENV !== 'development' && channel.name === 'entrybot-development';
}

// Play for a user if they now enter the voice channels.
// Play only if someone has already asked entrybot to save their YT video.

// existing timeout ID in memory
let connections = {};

// if a variable is reassigned at the global scope
// it should technically garbage collect all the closures
const reassignConnections = () => {
  if (Object.keys(connections).length === 0) {
    connections = null;
  }
}

client.on('voiceStateUpdate', async (oldState, newState) => {
  // console.log(oldState.channelID, newState.channelID);
  if (isDevChannel(newState.member.voice.channel)) {
    return;
  }

  try {
    if(!oldState.channelID && newState.channelID && newState.member.user.id !== client.user.id) {
      const res = await pool.query(`select * from users where uid=$1;`, [newState.member.user.id]);
      if (res.rowCount === 0) return;

      if (connections === null) {
        connections = {};
      }

      let introState = connections[newState.guild.name] || {
        connection: await newState.member.voice.channel.join(),
        dispatcher: null,
        timeoutID: 0
      };

      if (introState.dispatcher) {
        console.log("Something is playing 🎵");
        introState.dispatcher = introState.connection.play('./record_scratch.mp3', {
          volume: 0.3
        });
        clearTimeout(introState.timeoutID);
      }

      try {
        setTimeout(() => {
          const YTSTREAM = ytdl(res.rows[0].url, {
            quality: 'lowestaudio'
          });
          introState.dispatcher = introState.connection.play(YTSTREAM, { volume: 0.1 });
          setTimeout(()=>{
            YTSTREAM.destroy();
          }, 12000);
          clearTimeout(introState.timeoutID);

          introState.timeoutID = setTimeout(()=> {
            introState.connection.disconnect();
            // connections[newState.guild.name].connection.disconnect();
            connections[newState.guild.name] = null;
            introState = null;
            delete connections[newState.guild.name];
            reassignConnections();
          }, 12000);

        }, introState.dispatcher ? 2000 : 0);

        connections[newState.guild.name] = introState;

      } catch (e) {
        console.log(e);
        introState.connection.disconnect();
        // connections[newState.guild.name].connection.disconnect();
        connections[newState.guild.name] = null;
        introState = null;
        delete connections[newState.guild.name];
        reassignConnections();
      }

    } else if(!newState.channelID){
      // User leaves a voice channel
    }
  } catch (e) {
    console.log("ERROR??", e);
    // const channel  = newState.guild.channels.find(ch => ch.name === 'entrybot-log');
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
    if (messageArray[0] !== '+test') return;

    switch (messageArray[1]){
      case 'save':
        if (messageArray.length === 3) {
          ytdl.getInfo(messageArray[2]).then((info) => {
            if (info.player_response && info.player_response.playabilityStatus && info.player_response.playabilityStatus.status) {
              save_url(pool, msg.author.id + '', messageArray[2]).then(c=>{
                msg.channel.send(c);
              });
            } else {
              console.log(err);
              msg.channel.send('I can\'t play whatever this shit is yo. 🤢');
            }
          }).catch(err => {
            console.log(err);
            msg.channel.send('I can\'t play whatever this shit is yo. 🤢');
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
