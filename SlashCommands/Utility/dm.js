const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "dm",
  description: "Send a direct message to a user",
  options: [
    {
      name: "user",
      description: "The user to send the message to",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "message",
      description: "The message to send",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const target = interaction.options.getUser("user");
    const messageContent = interaction.options.getString("message");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
      return interaction.reply({ content: "You don't have permission to send messages.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Anonymous Message")
      .setDescription(messageContent);

    try {
      await target.send({ embeds: [embed] });
      return interaction.reply({ content: `Message successfully sent to ${target.tag}`, ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      if (error.code === 50007) {
        return interaction.reply({ content: "This user has their DMs closed or I can't message them.", ephemeral: true });
      }
      return interaction.reply({ content: "An error occurred while sending the message.", ephemeral: true });
    }
  },
};
