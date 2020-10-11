const googleTTS = require("google-tts-api");
const axios = require('axios');

const isDevChannel = (voiceChannel) => {
  return voiceChannel && process.env.NODE_ENV !== 'development' && voiceChannel.name === 'entrybot-development';
}

module.exports = async (msg, text) => {
  if (isDevChannel(msg.member.voice ? msg.member.voice.channel : msg.channel)){
    return;
  }

  if (text.length > 160) {
    return "😎 I don't read shit that long 😎 160 characters limit.";
  }

  const urlSong = await googleTTS(`${msg.member.nickname} said ${text}. end of report. oowoo`, 'en', 0.6);

  if (!msg.member.voice.channel){
    return {
      files: [urlSong + '.mp3']
    }
  }

  const conn = await msg.member.voice.channel.join();

  const dispatch = conn.play(urlSong);
  dispatch.once('finish', async ()=>{
    await msg.member.voice.channel.leave();
  });

}
