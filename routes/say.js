const txtomp3 = require("text-to-mp3");
const fs = require("fs");



module.exports = (msg, text) => {
  if (text.length > 250) {
    return "😎 I don't read shit that long 😎";
  }
  txtomp3.getMp3(`${msg.member.nickname} said ${text}`, (err, binaryStream) => {
    if (err) {
      throw err;
    }

    msg.member.voiceChannel.join().then(connection =>{
      connection.playStream(binaryStream);
    });
    
  });
}