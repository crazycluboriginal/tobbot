const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ComponentType
} = require('discord.js');

const IDS = {
  bibleverse: '1386873373300363395',
  meme: '1142547598734000229',
  news: '1141543845692190782',
  joke: '1142055867273990144',
  fact: '1141548618130657331',
  say: '1141876999883853874',
  dm: '1141813350339203194',
  poll: '1386723289258393894',
  trivia: '1142107999293419660',
  animal: '1141880520171602063',
  quote: '1141541044694024254',
  advice: '1141553141314244609',
  randomword: '1141544575027126362',
  rhyme: '1141795244191514674',
  thesaurus: '1141892817480843325',
  convertcurrency:'1141799379255169044',
  define: '1141809483547414608',
  imagetotext: '1391849943337140306',
  weather: '1141808447344611408',
  forecast: '1141809483547414609',
  inflation: '1141796874643312721',
  history: '1141785080151412897',
  random: '1141549422895964180',
  bucketlist: '1386726850516090910',
  vote: '1142059137820266537'
};

const mention = name => `</${name}:${IDS[name]}>`;

const sections = {
  all: {
    name: '📋 All Commands',
    fields: Object.entries({
      '📌 General Entertainment': ['bibleverse','meme','news','joke','fact'],
      '⚙️ Configuration': ['say','dm','poll'],
      'ℹ️ Informational': [
        'trivia','animal','quote','advice','randomword','rhyme','thesaurus','convertcurrency','define','imagetotext','weather','forecast','inflation','history'
      ],
      '🎲 Abstract': ['random','bucketlist','vote']
    }).map(([title, cmds]) => ({
      name: title,
      value: cmds.map(n => `${mention(n)} — description`).join('\n')
    }))
  },
  general: {
    name: '📌 General Entertainment',
    value:
      `${mention('bibleverse')} — Sends a daily bible verse.\n` +
      `${mention('meme')} — Get some memes!\n` +
      `${mention('news')} — Stay connected with current events.\n` +
      `${mention('joke')} — Get a random joke.\n` +
      `${mention('fact')} — Learn a fun fact.`
  },
  config: {
    name: '⚙️ Configuration',
    value:
      `${mention('say')} — Make the bot say something.\n` +
      `${mention('dm')} — DM any member anonymously.\n` +
      `${mention('poll')} — Create a custom poll.`
  },
  info: {
    name: 'ℹ️ Informational',
    value:
      `${mention('trivia')} — Test your knowledge.\n` +
      `${mention('animal')} — Learn about animals.\n` +
      `${mention('quote')} — Get a motivational quote.\n` +
      `${mention('advice')} — Receive advice.\n` +
      `${mention('randomword')} — Get a random word.\n` +
      `${mention('rhyme')} — Find rhymes.\n` +
      `${mention('thesaurus')} — Find synonyms.\n` +
      `${mention('convertcurrency')} — Convert currencies.\n` +
      `${mention('define')} — Define any word.\n` +
      `${mention('imagetotext')} — Extract text from images.\n` +
      `${mention('weather')} — Check current weather.\n` +
      `${mention('forecast')} — 5-day forecast.\n` +
      `${mention('inflation')} — Check inflation rates.\n` +
      `${mention('history')} — Look up historical events.`
  },
  abstract: {
    name: '🎲 Abstract',
    value:
      `${mention('random')} — Random Reddit post.\n` +
      `${mention('bucketlist')} — Bucket list ideas.\n` +
      `${mention('vote')} — Vote for the bot.`
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows the help menu')
    .addSubcommand(sub =>
      sub.setName('menu')
         .setDescription('Display the help categories dropdown')
    ),

  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() !== 'menu') return;

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('help_menu')
        .setPlaceholder('Select a category')
        .addOptions([
          { label: 'All', value: 'all', description: 'List every command' },
          { label: 'General Entertainment', value: 'general', description: 'Fun commands' },
          { label: 'Configuration', value: 'config', description: 'Setup commands' },
          { label: 'Informational', value: 'info', description: 'Info commands' },
          { label: 'Abstract', value: 'abstract', description: 'Misc commands' }
        ])
    );

    const embed = new EmbedBuilder()
      .setTitle('Help Menu')
      .setDescription('Choose a category from the dropdown below.')
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true });
    const msg = await interaction.fetchReply();

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 120_000,
      filter: i => i.customId === 'help_menu' && i.user.id === interaction.user.id
    });

    collector.on('collect', async i => {
      try {
        const choice = i.values[0];
        if (choice === 'all') {
          embed.setTitle(sections.all.name).setDescription(null).setFields(sections.all.fields);
        } else {
          const sec = sections[choice];
          embed.setTitle(sec.name).setDescription(null).setFields({ name: sec.name, value: sec.value });
        }
        await i.update({ embeds: [embed], components: [menu] });
      } catch (error) {
        console.error('Interaction update failed:', error);
      }
    });

    collector.on('end', async () => {
      try {
        await msg.edit({ components: [] });
      } catch (err) {
        console.error('Failed to disable menu:', err);
      }
    });
  }
};
