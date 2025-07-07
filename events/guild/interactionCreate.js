const { PermissionsBitField } = require('discord.js');
const OwnerID = 677354943925190676;

module.exports = async (interaction, client) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slash.get(interaction.commandName);
  if (!command) return interaction.reply({ content: 'An error occurred.', ephemeral: true });

  if (command.ownerOnly && interaction.user.id !== OwnerID) {
    return interaction.reply({ content: 'Command under development!', ephemeral: true });
  }

  if (command.userPerms) {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member.permissions.has(command.userPerms)) {
      const msg = command.noUserPermsMessage || `You need the \`${command.userPerms}\` permission to use this command!`;
      return interaction.reply({ content: msg, ephemeral: true });
    }
  }

  if (command.botPerms) {
    const botMember = interaction.guild.members.me;
    if (!botMember.permissions.has(command.botPerms)) {
      const msg = command.noBotPermsMessage || `I need the \`${command.botPerms}\` permission to execute this command!`;
      return interaction.reply({ content: msg, ephemeral: true });
    }
  }

  const args = [];
  for (const option of interaction.options.data) {
    if (option.type === 1) {
      args.push(option.name);
      for (const subOption of option.options || []) {
        if (subOption.value !== undefined) args.push(subOption.value);
      }
    } else if (option.value !== undefined) {
      args.push(option.value);
    }
  }

  try {
    if (typeof command.run === 'function') {
      await command.run(client, interaction, args);
    } else if (typeof command.execute === 'function') {
      await command.execute(interaction);
    } else {
      await interaction.reply({ content: 'This command is not properly configured.', ephemeral: true });
    }
  } catch (e) {
    console.error(e);
    interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
};
