const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "track",
  description: "Show the currently playing track",
  options: [],
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({ content: "No track is currently playing.", ephemeral: true });
    }

    const track = queue.current;
    const progress = queue.createProgressBar();

    const embed = new EmbedBuilder()
      .setTitle("Now Playing 🎶")
      .setDescription(track.title)
      .setURL(track.url)
      .addFields(
        { name: "Duration", value: track.duration, inline: true },
        { name: "By", value: track.author, inline: true },
        { name: "Progress", value: progress, inline: false }
      )
      .setThumbnail(track.thumbnail)
      .setColor("Random")
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await interaction.editReply({ embeds: [embed] });
  },
};
