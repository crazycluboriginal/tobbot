const { EmbedBuilder, Colors, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "filter",
  description: "Apply or reset the music filters",
  options: [
    {
      name: "apply",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Apply a filter to the music",
      options: [
        {
          name: "filter",
          description: "The filter to toggle",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "list",
      type: ApplicationCommandOptionType.Subcommand,
      description: "List all available filters",
    },
  ],

  run: async (client, interaction) => {
    const sub = interaction.options.getSubcommand();

    if (sub === "apply") {
      await interaction.deferReply({ ephemeral: true });

      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) {
        return interaction.followUp({ content: "I’m currently not playing in this guild.", ephemeral: true });
      }
      if (!client.utils.canModifyQueue(interaction)) return;

      const filterName = interaction.options.getString("filter");
      const enabled = queue.getFiltersEnabled().map(f => f.toLowerCase());
      const key = filterName.toLowerCase();
      const toggleValue = !enabled.includes(key);
      const filterKey = key === "8d" ? "8D" : key;

      await queue.setFilters({ [filterKey]: toggleValue });
      const action = toggleValue ? "Applied" : "Removed";

      return interaction.followUp({ content: `${action} the ${filterName.charAt(0).toUpperCase() + filterName.slice(1)} filter.`, ephemeral: true });
    }

    if (sub === "list") {
      await interaction.deferReply({ ephemeral: true });

      const filters = [
        "8d", "bassboost", "compressor", "dim", "expander", "flanger", "gate",
        "haas", "karaoke", "mcompand", "mono", "mstlr", "mstrr", "nightcore",
        "phaser", "pulsator", "reverse", "softlimiter", "subboost", "surrounding",
        "treble", "tremolo", "vaporwave", "vibrato"
      ];

      const listEmbed = new EmbedBuilder()
        .setTitle("Music Filters")
        .setDescription(filters.map(f => `\`${f}\``).join(', '))
        .setColor(Colors.Blue)
        .setTimestamp();

      return interaction.editReply({ embeds: [listEmbed] });
    }
  },
};
