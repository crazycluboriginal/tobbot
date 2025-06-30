const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionsBitField,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('View the dashboard for a specific category')
    .addSubcommand(sub =>
      sub
        .setName('admin')
        .setDescription('Shows the admin menu')
    )
    .addSubcommand(sub =>
      sub
        .setName('welcomer')
        .setDescription('Shows the welcomer menu')
    )
    .addSubcommand(sub =>
      sub
        .setName('logging')
        .setDescription('Shows the logging menu')
    ),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const member = interaction.member;
    const guild = interaction.guild;

    // Helper to fetch member with permissions
    const guildMember = guild.members.cache.get(member.id) || await guild.members.fetch(member.id);

    let row;
    if (sub === 'admin') {
      if (!guildMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Missing Permissions: ADMINISTRATOR required.', ephemeral: true });
      }
      row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('dashboard_admin')
          .setPlaceholder('Select admin option')
          .addOptions([
            { label: 'Antilink', description: 'Enable or disable Antilink', value: 'antilink' },
            { label: 'AutoRole', description: 'Enable or disable AutoRole', value: 'autorole' },
            { label: 'AutoMod', description: 'Enable or disable AutoMod', value: 'automod' },
            { label: 'Prefix', description: 'Change the bot prefix for your server', value: 'prefix' },
          ])
      );

    } else if (sub === 'welcomer') {
      if (!guildMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return interaction.reply({ content: 'Missing Permissions: MANAGE_GUILD required.', ephemeral: true });
      }
      row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('dashboard_welcomer')
          .setPlaceholder('Select welcomer option')
          .addOptions([
            { label: 'Welcome Channel', description: 'Set the welcome channel', value: 'welcome_channel' },
            { label: 'Leave Channel', description: 'Set the leave channel', value: 'leave_channel' },
            { label: 'Welcome Message', description: 'Set the welcome message', value: 'welcome_message' },
            { label: 'Leave Message', description: 'Set the leave message', value: 'leave_message' },
            { label: 'Variables', description: 'Show available variables', value: 'variables' },
          ])
      );

    } else if (sub === 'logging') {
      if (!guildMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return interaction.reply({ content: 'Missing Permissions: MANAGE_GUILD required.', ephemeral: true });
      }
      row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('dashboard_logging')
          .setPlaceholder('Select logging option')
          .addOptions([
            { label: 'Channel Updates', description: 'Log channel updates', value: 'channel_logs' },
            { label: 'Member Updates', description: 'Log member updates', value: 'member_updates' },
            { label: 'Message Logs', description: 'Log messages', value: 'message_logs' },
            { label: 'Role Updates', description: 'Log role updates', value: 'role_updates' },
            { label: 'Server Updates', description: 'Log server updates', value: 'server_updates' },
            { label: 'Voice State', description: 'Log voice state updates', value: 'voice_state_updates' },
          ])
      );
    }

    // Send the menu
    await interaction.reply({
      content: 'Use the dropdown to configure settings.',
      components: [row],
      ephemeral: true,
    });
  },
};
