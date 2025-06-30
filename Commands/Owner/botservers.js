const { SlashCommandBuilder } = require('@discordjs/builders');
const OWNER_ID = process.env.OWNER_ID;

module.exports = {
  name: 'botservers',
  data: new SlashCommandBuilder()
    .setName('botservers')
    .setDescription('List all guilds the bot is in (Owner only).'),

  async execute(interaction, client) {
    // Owner-only check
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: '❌ Developer Only', ephemeral: true });
    }

    // Build list of guilds
    const guilds = client.guilds.cache.map(g => `🔹 **${g.name}** | ${g.memberCount} members (ID: ${g.id})`);

    // Reply with ephemeral message
    await interaction.reply({ content: guilds.join('\n'), ephemeral: true });
  },

  run: async (client, interaction) => {
    await module.exports.execute(interaction, client);
  },
};
