const googleTTS = require("google-tts-api");
const axios = require('axios');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus
} = require('@discordjs/voice');

module.exports = async ({pool, client, message, msgArr}) => {
  // console.log('message.guild :>> ', message.guild);
  // console.log('message.member.voice.channel.id :>> ', message.member.voice.channel.id);
  const text = msgArr.join(" ");
  if (text.length > 160) {
    return "😎 I don't read shit that long 😎 \n160 characters limit.";
  }

  let urlSong;

  try {
    urlSong = await googleTTS.getAudioUrl(`${message.member.nickname} said ${text}...`, 'en', 0.6);
  } catch {
    return "Sorry, I had trouble turning that into audio."
  }

  if (!message.member.voice.channel){
    return {
      files: [urlSong + '.mp3']
    }
  }

  let resource = createAudioResource(urlSong, {
    inlineVolume: true
  });
  resource.volume.setVolume(0.5);
  let player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  connection.subscribe(player);

  player.play(resource);

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });

  return "noreply";

}
