const { EmbedBuilder, ApplicationCommandOptionType, Colors } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Get information about a user",
  options: [
    {
      name: "user",
      description: "User to get information about",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const user = interaction.options.getUser("user");
      const member = await interaction.guild.members.fetch(user.id);

      const roleMentions = member.roles.cache
        .filter(role => role.id !== interaction.guild.id)
        .map(role => `<@&${role.id}>`);
      const roles = roleMentions.length ? roleMentions.join(", ") : "None";

      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(`User Information for ${user.username}`)
        .setDescription(`Here is some information about ${user}.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "Username", value: user.username, inline: true },
          { name: "User ID",          value: user.id, inline: true },
          { name: "Account Created",value: user.createdAt.toDateString(), inline: false },
          { name: "Joined Server", value: member.joinedAt.toDateString(), inline: false },
          { name: "Roles",  value: roles,  inline: false }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("An error occurred:", error);
      await interaction.reply({ content: "Oops! Something went wrong.", ephemeral: true });
    }
  },
};
