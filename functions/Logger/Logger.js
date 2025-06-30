const {
  PermissionsBitField,
  EmbedBuilder,
  ThreadChannel,
  DMChannel,
} = require('discord.js');
const { codeBlock } = require('@discordjs/builders');

// Use environment variable for error channel instead of missing config.json
const ERROR_LOGS_CHANNEL = process.env.ERROR_LOGS_CHANNEL;

/**
 * Sends an error log embed to the configured error-logging channel
 * @param {import('discord.js').Client} client
 * @param {Error} error
 * @param {string} [type]
 */
async function sendErrorLog(client, error, type) {
  const msg = error.message || '';
  if (msg.includes('Missing Access') || msg.includes('Missing Permissions')) return;
  if (error.stack?.includes('DeprecationWarning: Listening to events on the Db class')) return;

  if (!ERROR_LOGS_CHANNEL) {
    console.error('No ERROR_LOGS_CHANNEL configured');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(type || 'Error')
    .setDescription(codeBlock(error.stack || String(error)))
    .setColor(0xFF0000)
    .setTimestamp();

  try {
    const channel = client.channels.cache.get(ERROR_LOGS_CHANNEL)
      || await client.channels.fetch(ERROR_LOGS_CHANNEL);
    if (channel.isTextBased()) {
      await channel.send({ embeds: [embed] });
    }
  } catch (e) {
    console.error('Failed to send error log embed:', e);
  }
}

/**
 * Checks if the bot has necessary permissions in the channel
 * @param {import('discord.js').TextChannel | ThreadChannel | DMChannel} channel
 * @returns {boolean}
 */
function havePermissions(channel) {
  if (channel instanceof ThreadChannel || channel instanceof DMChannel) return true;
  const perms = channel.permissionsFor(channel.guild.members.me);
  return perms.has(PermissionsBitField.Flags.ViewChannel) &&
         perms.has(PermissionsBitField.Flags.SendMessages) &&
         perms.has(PermissionsBitField.Flags.EmbedLinks);
}

module.exports = { sendErrorLog, havePermissions };
