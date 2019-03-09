const txtomp3 = require("text-to-mp3");
const fs = require("fs");
const path = require('path');


module.exports = async (msg, text) => {
  if (text.length > 250) {
    return "😎 I don't read shit that long 😎";
  }
  txtomp3.getMp3(`${msg.member.nickname} said ${text}`, async (err, binaryStream) => {
    if (err) {
      throw err;
    }

    const conn = await msg.member.voiceChannel.join();
    const tmpName = ""+Date.now()+".mp3";
    const file = fs.createWriteStream(path.join(__dirname,tmpName));
    file.write(binaryStream);
    file.end();
    const dispatch = conn.playFile(path.join(__dirname,tmpName));
 
    
  });
}