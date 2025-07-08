const { ReadableStream, Headers, Request, Response, Blob } = require('node:stream/web');
// polyfill Web Streams globally
global.ReadableStream = ReadableStream;
global.Headers        = Headers;
global.Request        = Request;
global.Response       = Response;
global.Blob           = Blob;

require('dotenv').config();
process.traceDeprecation = true;

// --- Express Server Setup ---
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const BOT_TOKEN            = process.env.TOKEN;
const ALEXFLIPNOTE_API_KEY = process.env.ALEXFLIPNOTE_API_KEY;
const YT_COOKIE            = process.env.YT_COOKIE;
const ERROR_LOGS_CHANNEL   = process.env.ERROR_LOGS_CHANNEL;
const MONGO_URI            = process.env.MONGO_URI;

// MongoDB connection
toBBotDB = require('mongoose');
toBBotDB.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' },
});

// Simple web UI
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>toBBot</title></head>
      <body>
        <h1>toBBot Slash Command Directory</h1>
        <p>Server time: ${new Date()}</p>
        <a href="/help">Help</a> |
        <a href="/console">Console Logs</a>
      </body>
    </html>
  `);
});

const consoleLogs = [];
const originalConsoleLog = console.log;
console.log = (...args) => {
  const log = args.join(' ');
  consoleLogs.push(log);
  originalConsoleLog.apply(console, args);
};

app.get('/console', (req, res) => {
  const logsList = consoleLogs.map(l => `<li>${l}</li>`).join('');
  res.send(`
    <html>
      <head><title>Console Logs</title></head>
      <body>
        <h1>Console Logs</h1>
        <ul>${logsList}</ul>
        <a href="/">Home</a>
      </body>
    </html>
  `);
});

app.get('/help', (req, res) => {
  res.send(`<html><body><h1>toBBot Help Menu</h1><p>Commands list here.</p></body></html>`);
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));

// --- Discord Bot Setup ---
const fs    = require('fs');
const chalk = require('chalk');
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { DiscordTogether } = require('discord-together');
const { Player } = require('discord-player');
const { loadCommands }      = require('./handler/loadCommands');
const { loadEvents }        = require('./handler/loadEvents');
const { loadSlashCommands } = require('./handler/loadSlashCommands');
const { loadPlayerEvents }  = require('./handler/loadPlayerEvents');
const Enmap                = require('enmap');
const Embeds               = require('./functions/embeds/Embeds');
const Logger               = require('./functions/Logger/Logger');
const Util                 = require('./functions/util/Util');

const client = new Client({
  allowedMentions: { parse: ['users', 'roles'] },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildPresences,
  ],
});

// Initialize Enmap
client.db = new Enmap({ name: 'musicdb', dataDir: './data' });

// Custom properties
client.images          = new (require('alexflipnote.js'))(ALEXFLIPNOTE_API_KEY);
client.discordTogether = new DiscordTogether(client);
client.commands        = new Collection();
client.slash           = new Collection();
client.aliases         = new Collection();
client.categories      = fs.readdirSync('./Commands/');
client.setMaxListeners(0);
client.logger          = Logger;
client.utils           = Util;
client.say             = Embeds;

// Music player setup
client.player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: false,
  leaveOnEmpty: false,
  leaveOnEmptyCooldown: 60000,
  autoSelfDeaf: true,
  initialVolume: 130,
  ytdlDownloadOptions: { requestOptions: { headers: { cookie: YT_COOKIE } } }
});

(async () => {
  await client.player.extractors.loadDefault();
})();

// Load classical commands & events
loadCommands(client);
loadEvents(client);
loadPlayerEvents(client);
// Slash commands will register after ready

// Error handling & channel logging
process.on('uncaughtException', async err => {
  console.error('Uncaught Exception:', err);
  const embed = new EmbedBuilder()
    .setTitle('Uncaught Exception')
    .setDescription(`\`${err.stack}\``)
    .setColor(0xFF0000);

  try {
    let channel = await client.channels.fetch(ERROR_LOGS_CHANNEL).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ embeds: [embed] });
    else console.error(`Error logs channel ${ERROR_LOGS_CHANNEL} not found or not text-based.`);
  } catch (e) {
    console.error('Error sending to error channel:', e);
  }
});

// On ready: register slash commands
client.once('ready', async () => {
  console.log(chalk.bgBlueBright.black(` Logged in as ${client.user.tag} `));
  await loadSlashCommands(client);
});

// Login
client.login(BOT_TOKEN);