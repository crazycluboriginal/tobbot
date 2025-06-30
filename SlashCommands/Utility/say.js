const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "say",
  description: "Make the bot repeat a message",
  options: [
    {
      name: "message",
      description: "The message to repeat",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const messageToRepeat = interaction.options.getString("message");

    const embed = new EmbedBuilder()
      .setDescription(messageToRepeat)
      .setColor("Random");

    await interaction.reply({ embeds: [embed] });
  },
};
