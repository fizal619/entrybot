const googleTTS = require("google-tts-api");
const fs = require("fs");
const path = require('path');
const axios = require('axios');

const isDevChannel = (voiceChannel) => {
  return voiceChannel && process.env.NODE_ENV !== 'development' && voiceChannel.name === 'entrybot-development';
}


module.exports = async (msg, text) => {
  if (text.length > 160) {
    return "😎 I don't read shit that long 😎 160 characters limit.";
  }
  const urlSong = await googleTTS(`${msg.member.nickname} said ${text}. end of report. wo`, 'en', 0.6);

  if (!msg.member.voiceChannel){
    return {
      files: [urlSong + '.mp3']
    }
  }

  if(isDevChannel(msg.member.voiceChannel)) {
    return;
  }

  
  const songData = await axios({
    method:'get',
    url: urlSong,
    responseType:'stream'
  });

  const conn = await msg.member.voiceChannel.join();

  const dispatch = conn.playStream(urlSong);
  dispatch.once('end', async ()=>{
    await msg.member.voiceChannel.leave();
  });

}