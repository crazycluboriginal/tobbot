const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const OWNER_ID = process.env.OWNER_ID;

module.exports = {
  name: 'eval',
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Execute JavaScript code as the bot owner')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('The code to evaluate')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: '⛔ Limited to the bot owner only.', ephemeral: true });
    }

    const code = interaction.options.getString('code');
    await interaction.deferReply({ ephemeral: true });

    try {
      let evaled = eval(code);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

      const embed = new EmbedBuilder()
        .setTitle('Eval Result')
        .addFields(
          { name: 'Input', value: `\`\`\`js\n${code}\n\`\`\`` },
          { name: 'Output', value: `\`\`\`js\n${evaled}\n\`\`\`` }
        )
        .setColor('Green');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({ content: `\`ERROR\` \`\`\`xl\n${error}\n\`\`\`` });
    }
  },

  run: async (client, interaction) => {
    await module.exports.execute(interaction, client);
  },
};
