const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "help",
  description: "Shows the Help Menu",
  options: [
    {
      name: "menu",
      description: "Shows the Help Menu",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client, interaction) => {
    try {
      if (interaction.options.getSubcommand() === "menu") {
        const helpMenu = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("help_menu")
            .setPlaceholder("Help Menu")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
              {
                label: "Settings",
                description: "Change the bot settings",
                value: "settings",
                emoji: "🛠",
              },
              {
                label: "Fun",
                description: "Shows all the fun commands",
                value: "fun",
                emoji: "🎲",
              },
              {
                label: "Info",
                description: "Shows all the informational commands",
                value: "info",
                emoji: "📢",
              },
              {
                label: "Moderation",
                description: "Shows all the moderation commands",
                value: "moderation",
                emoji: "🔒",
              },
              {
                label: "Utility",
                description: "Shows all the utility commands",
                value: "utility",
                emoji: "🔧",
              },
              {
                label: "Games",
                description: "Shows all the game commands",
                value: "game",
                emoji: "🎮",
              },
            ])
        );

        const helpEmbed = new EmbedBuilder()
          .setTitle("Help Menu")
          .setDescription("Choose an option from the menu below!")
          .setColor("GREEN");

        await interaction.reply({ embeds: [helpEmbed], components: [helpMenu] });
      }
    } catch (error) {
      console.error("Error displaying help menu:", error);
      await interaction.reply({ content: "Something went wrong displaying the help menu.", ephemeral: true });
    }
  },
};