require('dotenv').config();
const { exec } = require("child_process");
const Discord = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus
} = require('@discordjs/voice');

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
  ]
});

const play = require('play-dl');
const { Pool } = require('pg');

const connectionString = process.env.DB_URL;

const pool = new Pool({ connectionString: connectionString });
const save = require('./routes/save'),
  show = require('./routes/show_url'),
  say = require('./routes/say');
// clear_url = require('./routes/clear_url'),
// kookie = require('./routes/kookie'),
// spongebob = require('./routes/spongebob'),
// animeSearch = require('./routes/animeSearch'),
// cardOfTheDay = require('./routes/cardOfTheDay'),
// duel = require('./routes/duel');
// play = require('./routes/play');
const fns = {
  save,
  say,
  show
}

const CMD = process.env.NODE_ENV == "production" ? "+entry" : "+test";

client.once('ready', () => {
  console.log('Bot Ready!', CMD);
});

client.login(process.env.DISCORD_TOKEN)
  .catch(e => exec("kill 1"));


// MESSAGE STUFF
client.on("messageCreate", async (message) => {
  const msgArr = message.content.split(" ");
  // console.log(msgArr);
  if (msgArr[0] != CMD) return;
  msgArr.shift();
  const func = msgArr.shift();
  console.log(func, msgArr);
  const res = await fns[func]
    ?.({ pool, client, message, msgArr });
  if (res && res !== "noreply") {
    message.reply(res);
  } else if (res == "noreply") {
    console.log(">> tts no reply");
  } else {
    message.reply(`Sorry dunno that, I know [${Object.keys(fns).join("|")}] though.`)
  }
});

// VOICE STUFF

// To persist one connection per guild
const connections = {
  'guildID': {
    connection: null,
    timeoutId: null,
    player: null
  }
}

client.on("voiceStateUpdate", async (oldState, newState) => {
  // stop function if the bot joins a channel
  if (newState.member.user.id == client.user.id) return;
  // stop the bot if someone is leaving
  if (oldState.channel && !newState.channel) return;
  // stop the bot if voicestate changes but the user did not disconnect
  if (oldState.channel && newState.channel) return;

  // for dev mode
  // if (newState.channel.name != "entrybot-development" ) return;

  if (connections[newState.guild.id]?.connection) return;

  console.log('newState :>> ', newState.member.user.id, newState.member.nickname);

  const db = await pool.connect();
  const res = await db.query(`select * from users where uid=$1;`, [newState.member.user.id]);
  await db.release();
  if (res.rowCount === 0) return;
  console.log('res.rows[0]?.url :>> ', res.rows[0]?.url);

  console.log("Setting up stream...");
  console.time("stream setup");
  let stream = await play.stream(res.rows[0]?.url, {
    quality: 0,
    discordPlayerCompatibility: true
  });
  let resource = createAudioResource(stream.stream, {
    inputType: stream.type,
    inlineVolume: true
  });
  resource.volume.setVolume(0.1);
  let player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });

  console.timeEnd("stream setup");
  console.log("Setting up bot connection...");
  connections[newState.guild.id] = {
    connection: joinVoiceChannel({
      channelId: newState.channel.id,
      guildId: newState.guild.id,
      adapterCreator: newState.guild.voiceAdapterCreator,
    }),
    player
  }
  connections[newState.guild.id]
    .connection
    .subscribe(player);

  player.play(resource);

  player.on(AudioPlayerStatus.Playing, () => {
    connections[newState.guild.id]["timeout"] = setTimeout(() => {
      connections[newState.guild.id].player.stop();
      connections[newState.guild.id].connection.destroy();
      delete connections[newState.guild.id];
    }, parseInt(res.rows[0]?.duration) * 1000);
  });

});

