const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
  Colors
} = require('discord.js');

module.exports = {
  name: 'delete',
  description: 'Delete channels or roles in your server!',
  options: [
    {
      name: 'channel',
      description: 'Delete a channel',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: 'The channel to delete',
          type: ApplicationCommandOptionType.Channel,
          required: true
        }
      ]
    },
    {
      name: 'role',
      description: 'Delete a role',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'role',
          description: 'The role to delete',
          type: ApplicationCommandOptionType.Role,
          required: true
        }
      ]
    }
  ],
  run: async (client, interaction) => {
    const sub = interaction.options.getSubcommand();

    if (sub === 'role') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: 'Missing Permissions!', ephemeral: true });
      }

      const deleteRole = interaction.options.getRole('role');
      const botMember = interaction.guild.members.me;

      if (!deleteRole) {
        return interaction.reply({ content: 'Role not found!', ephemeral: true });
      }
      if (botMember.roles.highest.position <= deleteRole.position) {
        return interaction.reply({ content: 'I cannot delete a role equal to or higher than my highest role!', ephemeral: true });
      }
      if (interaction.member.roles.highest.position <= deleteRole.position) {
        return interaction.reply({ content: 'You cannot delete a role equal to or higher than your highest role!', ephemeral: true });
      }

      try {
        await deleteRole.delete();
        const embed = new EmbedBuilder()
          .setTitle('Role Deleted')
          .setDescription(
            `**Name:** ${deleteRole.name}\n` +
            `**ID:** ${deleteRole.id}\n` +
            `**Deleted By:** ${interaction.user.tag}`
          )
          .setColor(Colors.Red)
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      } catch (err) {
        console.error('Error deleting role:', err);
        return interaction.reply({ content: 'An error occurred while deleting the role.', ephemeral: true });
      }

    } else if (sub === 'channel') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({ content: 'Missing Permissions!', ephemeral: true });
      }

      const deleteChannel = interaction.options.getChannel('channel');

      if (!deleteChannel) {
        return interaction.reply({ content: 'Channel not found!', ephemeral: true });
      }
      try {
        const info = {
          name: deleteChannel.name,
          id: deleteChannel.id,
          type: deleteChannel.type
        };
        await deleteChannel.delete();

        const embed = new EmbedBuilder()
          .setTitle('Channel Deleted')
          .setDescription(
            `**Name:** ${info.name}\n` +
            `**ID:** ${info.id}\n` +
            `**Type:** ${info.type}\n` +
            `**Deleted By:** ${interaction.user.tag}`
          )
          .setColor(Colors.Red)
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      } catch (err) {
        console.error('Error deleting channel:', err);
        return interaction.reply({ content: 'An error occurred while deleting the channel.', ephemeral: true });
      }
    }
  }
};
