const { EmbedBuilder, Colors } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "botinfo",
  description: "Shows the bot info",
  options: [],
  run: async (client, interaction) => {
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}'s Info`, iconURL: client.user.displayAvatarURL() })
      .setColor("Random")
      .setDescription(
        `**Bot Name:** ${client.user.username}\n` +
        `**Owner:** Vectorange\n` +
        `**Total Categories:** 8\n` +
        `**Total Commands:** 141\n` +
        `**Users:** ${client.users.cache.size}\n` +
        `**Servers:** ${client.guilds.cache.size}\n` +
        `**Channels:** ${client.channels.cache.size}\n` +
        `**Uptime and Ping:** ${duration} / ${Math.round(client.ws.ping)}ms\n` +
        `**State:** Under Development\n` +
        `**Online Status:** Up 24/7 (Except during Maintenance)`
      )
      .addFields({
        name: "Some Useful Links",
        value:
          "**Get Vectorange's Invite Link** [Here](https://dsc.gg/tobbot)\n" +
          "**Need Help?** Join Vectorange's [Support Server](https://discord.gg/kRSu2DQM6W) for assistance"
      })
      .setFooter({ text: "© toB Enterprises 2025"});

    await interaction.reply({ embeds: [embed] });
  },
};
