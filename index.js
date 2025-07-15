const { ReadableStream, Headers, Request, Response, Blob } = require('node:stream/web');
global.ReadableStream = ReadableStream;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.Blob = Blob;

require('dotenv').config();
process.traceDeprecation = true;

// --- Express Server Setup ---
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8080;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const BOT_TOKEN = process.env.TOKEN;
const ALEXFLIPNOTE_API_KEY = process.env.ALEXFLIPNOTE_API_KEY;
const YT_COOKIE = process.env.YT_COOKIE;
const ERROR_LOGS_CHANNEL = process.env.ERROR_LOGS_CHANNEL;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection
toBBotDB = require('mongoose');
toBBotDB.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' },
});

// Console log capture
const consoleLogs = [];
const originalConsoleLog = console.log;
console.log = (...args) => {
  const log = args.join(' ');
  consoleLogs.push(log);
  originalConsoleLog.apply(console, args);
};

// Web routes using EJS
app.get('/', (req, res) => {
  res.render('index', { time: new Date() });
});

app.get('/console', (req, res) => {
  res.render('console', { logs: consoleLogs });
});

app.get('/help', (req, res) => {
  res.render('help');
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));

// --- Discord Bot Setup ---
const fs = require('fs');
const chalk = require('chalk');
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { DiscordTogether } = require('discord-together');
const { Player } = require('discord-player');
const { loadCommands } = require('./handler/loadCommands');
const { loadEvents } = require('./handler/loadEvents');
const { loadSlashCommands } = require('./handler/loadSlashCommands');
const { loadPlayerEvents } = require('./handler/loadPlayerEvents');
const Enmap = require('enmap');
const Embeds = require('./functions/embeds/Embeds');
const Logger = require('./functions/Logger/Logger');
const Util = require('./functions/util/Util');

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

client.db = new Enmap({ name: 'musicdb', dataDir: './data' });

client.images = new (require('alexflipnote.js'))(ALEXFLIPNOTE_API_KEY);
client.discordTogether = new DiscordTogether(client);
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./Commands/');
client.setMaxListeners(0);
client.logger = Logger;
client.utils = Util;
client.say = Embeds;

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

loadCommands(client);
loadEvents(client);
loadPlayerEvents(client);

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

client.once('ready', async () => {
  console.log(chalk.bgBlueBright.black(` Logged in as ${client.user.tag} `));
  await loadSlashCommands(client);
});

client.login(BOT_TOKEN);


// client.once('ready', async () => {
//   console.log(`${client.user.tag} is online.`);

//   await client.application.commands.set([]);
//   console.log('✅ All global slash commands cleared.');

// });


// git add . && git commit -m "Update project" && git push
