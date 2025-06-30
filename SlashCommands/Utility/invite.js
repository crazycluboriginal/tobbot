const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription("Get the bot's invite link"),

  async execute(client, interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#0088cc')
        .setTitle('Add toBBot to your server!')
        .setDescription('[Click here to invite toBBot](https://dsc.gg/tobbot)')
        .setFooter({ text: 'Thank you for using toBBot!' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending invite:', error);
      await interaction.reply({
        content: 'Oops! Something went wrong while sending the invite link.',
        ephemeral: true
      });
    }
  }
};
