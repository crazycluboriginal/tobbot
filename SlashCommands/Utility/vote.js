const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for the bot on top.gg and Discord Bot List'),

  async execute(client, interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Vote for toBBot 🎉')
        .setDescription('Support toBBot by voting! You can vote every 12 hours on both platforms:')
        .setURL('https://top.gg/bot/704185963483496506/')
        .addFields(
          { name: 'Top.gg', value: '[Vote here](https://top.gg/bot/704185963483496506/vote)', inline: true },
          { name: 'Discord Bot List', value: '[Vote here](https://discordbotlist.com/bots/tobbot/upvote)', inline: true }
        )
        .setThumbnail('https://cdn.discordapp.com/emojis/982309135494303804.png')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending vote embed:', error);
      await interaction.reply({
        content: 'Oops! Something went wrong while sending the vote embed.',
        ephemeral: true,
      });
    }
  }
};
