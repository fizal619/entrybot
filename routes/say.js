const googleTTS = require("google-tts-api");
const fs = require("fs");
const path = require('path');

const isDevChannel = (voiceChannel) => {
  return voiceChannel && process.env.NODE_ENV !== 'development' && voiceChannel.name === 'entrybot-development';
}


module.exports = async (msg, text) => {
  if (text.length > 200) {
    return "😎 I don't read shit that long 😎";
  }

  if(isDevChannel(msg.member.voiceChannel)) {
    return;
  }

  const url = await googleTTS(`${msg.member.nickname} said ${text}`, 'en', 1);
  const conn = await msg.member.voiceChannel.join();

  const dispatch = conn.playFile(url);
  dispatch.once('end', ()=>{
    msg.member.voiceChannel.leave();
  });

}