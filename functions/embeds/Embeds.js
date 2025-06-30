const { EmbedBuilder } = require('discord.js');

/**
 * Create a base embed with footer, timestamp, and bot colour.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @returns {EmbedBuilder}
 */
function baseEmbed(interaction) {
  if (!interaction) throw new Error("'interaction' must be provided to baseEmbed");
  const user = interaction.user;
  const footerText = user.tag;
  const footerIcon = user.displayAvatarURL({ dynamic: true });
  const color = interaction.guild?.members?.me?.displayHexColor ?? '#00FFFF';
  return new EmbedBuilder()
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setColor(color)
    .setTimestamp();
}

/**
 * Create a simple embed with only color.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @returns {EmbedBuilder}
 */
function rootEmbed(interaction) {
  if (!interaction) throw new Error("'interaction' must be provided to rootEmbed");
  const color = interaction.guild?.members?.me?.displayHexColor ?? '#00FFFF';
  return new EmbedBuilder().setColor(color);
}

/**
 * Send or edit an info reply with an embed.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {string} text
 * @param {boolean} [ephemeral=false]
 */
async function infoMessage(interaction, text, ephemeral = false) {
  if (!interaction) throw new Error("'interaction' must be provided to infoMessage");
  if (!text) throw new Error("'text' must be provided to infoMessage");
  const embed = new EmbedBuilder()
    .setDescription(text)
    .setColor(interaction.guild?.members?.me?.displayHexColor ?? '#00FFFF');
  if (interaction.replied || interaction.deferred) {
    return interaction.editReply({ embeds: [embed], ephemeral });
  }
  return interaction.reply({ embeds: [embed], ephemeral });
}

/**
 * Send or edit a warning reply (ephemeral orange embed).
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {string} text
 */
async function warnMessage(interaction, text) {
  return infoMessage(interaction, text, true);
}

/**
 * Send or edit an error reply (ephemeral red embed).
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {string} text
 */
async function errorMessage(interaction, text) {
  if (!interaction) throw new Error("'interaction' must be provided to errorMessage");
  if (!text) throw new Error("'text' must be provided to errorMessage");
  const embed = new EmbedBuilder()
    .setDescription(text)
    .setColor('Red');
  if (interaction.replied || interaction.deferred) {
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }
  return interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Send a queue update embed in a channel.
 * @param {import('discord.js').TextChannel} channel
 * @param {string} text
 * @param {string|number} [color]
 */
function queueMessage(channel, text, color) {
  if (!channel) throw new Error("'channel' must be provided to queueMessage");
  if (!text) throw new Error("'text' must be provided to queueMessage");
  const embed = new EmbedBuilder()
    .setDescription(text)
    .setColor(color ?? channel.guild?.members?.me?.displayHexColor ?? '#00FFFF');
  return channel.send({ embeds: [embed] });
}

module.exports = {
  baseEmbed,
  rootEmbed,
  infoMessage,
  warnMessage,
  errorMessage,
  queueMessage,
};
