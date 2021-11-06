# Entrybot

<img src="https://media.giphy.com/media/etZn8y8XlSCOc/giphy.gif" alt="entry batista"/>

A discord bot to play 10s of a song when you join a discord voice channel.

## Features

- Intro music
- Can text-to-speech in your current voice channel
- Generate a spongebob meme
- Generate a duel links duel room
- Search for anime (WIP)

## How to run locally

- Install `nvm`: https://github.com/nvm-sh/nvm.

- Install and make sure ffmpeg is in your path: [Windows](https://windowsloop.com/install-ffmpeg-windows-10/) or [Linux](https://www.tecmint.com/install-ffmpeg-in-linux/).

- First off you need a discord bot set up in your developer account. [Read more about how to set that up here.](https://dev.to/fizal619/so-you-want-to-make-a-discord-bot-4f0n)

- You will also need an [elephantsql account](https://www.elephantsql.com/), this is the easiest way to get a postgres database. Feel free to use postgres locally if you have it already. The application expects 1 table ("users") with the following schema:


```ini
uid=text
url=text
duration=int (default 12)
```

- Create a `.env` file with the following contents:

```ini
DISCORD_TOKEN=...
DB_URL=...
NODE_ENV=development

```

- `nvm use` and `npm install`.

- Finally `npm run start-bot`.


