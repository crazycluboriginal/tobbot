const { EmbedBuilder, ApplicationCommandOptionType, Colors } = require('discord.js');

module.exports = {
  name: 'watch',
  description: 'Watch YouTube together in voice',
  options: [
    {
      name: 'youtube',
      description: 'Start a YouTube Together session',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() !== 'youtube') return;
    const member = interaction.member;
    const channel = member.voice.channel;
    if (!channel) {
      return interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
    }
    try {
      const invite = await client.discordTogether.createTogetherCode(channel.id, 'youtube');
      const embed = new EmbedBuilder()
        .setTitle('YouTube Together')
        .setDescription(
          `[Click Here](${invite.code}) to start YouTube Together!
\`\`\`
Note: This feature is not available on mobile.\`\`\``
        )
        .setColor(Colors.Red)
        .setFooter({ text: `Requested by: ${interaction.user.tag}` });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error creating YouTube Together invite:', error);
      await interaction.reply({ content: 'Failed to start YouTube Together session.', ephemeral: true });
    }
  },
};
