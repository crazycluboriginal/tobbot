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
      .setColor(Colors.Random)
      .setDescription(
        `**Bot Name:** ${client.user.username}\n` +
        `**Owner:** ๖ۣۜℜⱥjͥƤuͣtͫ#5915\n` +
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
          "**Get Infinity's Invite Link** [Here](https://discord.com/api/oauth2/authorize?client_id=733670294086221865&permissions=8&scope=bot)\n" +
          "**Need Help?** Join Infinity's [Support Server](https://discord.gg/mqWprFc) for assistance"
      })
      .setFooter({ text: "Regards, Infinity Bot Team" });

    await interaction.reply({ embeds: [embed] });
  },
};
