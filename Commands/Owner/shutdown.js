const { SlashCommandBuilder } = require('@discordjs/builders');
const OWNER_ID = process.env.OWNER_ID;

module.exports = {
  name: 'shutdown',
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Shut down the bot (owner only)'),

  async execute(interaction, client) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: '⛔ Developer only command.', ephemeral: true });
    }

    await interaction.reply({ content: '🔌 Shutting down...', ephemeral: true });
    setTimeout(() => {
      client.destroy();
      process.exit(0);
    }, 1000);
  },

  run: async (client, interaction) => {
    await module.exports.execute(interaction, client);
  },
};
