const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojiid')
    .setDescription('Get the ID of a custom Discord emoji')
    .addStringOption(opt =>
      opt.setName('emoji')
         .setDescription('Paste a custom emoji here')
         .setRequired(true)
    ),

  async execute(interaction) {
    const emojiString = interaction.options.getString('emoji');
    // Match <a:name:id> or <:name:id>
    const match = emojiString.match(/<a?:(\w+):(\d+)>/);
    if (!match) {
      return interaction.reply('Please provide a valid custom emoji.');
    }
    const emojiId = match[2];
    // Wrap in backticks for code formatting
    return interaction.reply(`\`${emojiId}\``);
  },
};
