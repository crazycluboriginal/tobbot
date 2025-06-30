const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about the server'),

  async execute(client, interaction) {
    try {
      const guild = interaction.guild;
      const owner = await guild.fetchOwner();

      const embed = new EmbedBuilder()
        .setTitle(`Server Information for ${guild.name}`)
        .setColor(Colors.Blue)
        .addFields(
          { name: 'Owner', value: owner.user.tag, inline: true },
          { name: 'Locale', value: guild.preferredLocale, inline: true },
          { name: 'Members', value: guild.memberCount.toString(), inline: true },
          { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
          { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true }
        )
        .setThumbnail(guild.iconURL({ dynamic: true }));

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('An error occurred:', error);
      await interaction.reply({ content: 'Oops! Something went wrong.', ephemeral: true });
    }
  }
};
