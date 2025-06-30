const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, Colors } = require("discord.js");

module.exports = {
  name: "sudo",
  description: "Execute administrative actions",
  options: [
    {
      name: "action",
      description: "Action to execute",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Kick",  value: "kick"  },
        { name: "Ban",   value: "ban"   },
        { name: "Warn",  value: "warn"  },
      ],
    },
    {
      name: "target",
      description: "User to target",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for action",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    const action = interaction.options.getString("action");
    const member = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason") || "No reason specified";

    if (action === "kick") {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: "You don't have permission to kick members.", ephemeral: true });
      }
      if (!member.kickable) {
        return interaction.reply({ content: "I cannot kick this user.", ephemeral: true });
      }

      try {
        await member.kick(reason);
        return interaction.reply({ content: `${member.user.tag} was kicked. Reason: ${reason}` });
      } catch (error) {
        console.error(error);
        return interaction.reply({ content: `Failed to kick ${member.user.tag}.`, ephemeral: true });
      }
    }

    if (action === "ban") {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: "You don't have permission to ban members.", ephemeral: true });
      }
      if (!member.bannable) {
        return interaction.reply({ content: "I cannot ban this user.", ephemeral: true });
      }

      try {
        await member.ban({ reason });
        try {
          await member.send({ content: `You have been banned from ${interaction.guild.name}. Reason: ${reason}` });
        } catch {}
        return interaction.reply({ content: `${member.user.tag} was banned. Reason: ${reason}` });
      } catch (error) {
        console.error(error);
        return interaction.reply({ content: `Failed to ban ${member.user.tag}.`, ephemeral: true });
      }
    }

    if (action === "warn") {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply({ content: "You don't have permission to warn members.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle("You have been warned")
        .setDescription(`Reason: ${reason}`)
        .setColor(Colors.Red)
        .setTimestamp();

      try {
        await member.send({ embeds: [embed] });
        return interaction.reply({ content: `Warned ${member.user.tag} for "${reason}"` });
      } catch (error) {
        console.warn(error);
        return interaction.reply({ content: `Warned ${member.user.tag}, but could not DM them.` });
      }
    }
  },
};
