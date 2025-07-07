const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
  ChannelType,
  Colors
} = require("discord.js");

module.exports = {
  name: "broadcast",
  description: "Send a broadcast message or embed to a selected channel.",
  options: [
    {
      name: "format",
      description: "Send as a message or embed",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Message", value: "message" },
        { name: "Embed", value: "embed" }
      ]
    },
    {
      name: "channel",
      description: "The channel to send the broadcast to",
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channelTypes: [ChannelType.GuildText]
    },
    {
      name: "text",
      description: "The message to broadcast. Use format: #[Title]##[Header]||[Body]",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "file",
      description: "Upload a file to broadcast",
      type: ApplicationCommandOptionType.Attachment,
      required: false
    }
  ],
  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) &&
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    ) {
      return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    const format = interaction.options.getString("format");
    const channel = interaction.options.getChannel("channel");
    const text = interaction.options.getString("text");
    const file = interaction.options.getAttachment("file");

    if (!text && !file) {
      return interaction.reply({ content: "You must provide either a message text or a file to broadcast.", ephemeral: true });
    }

    try {
      if (format === "message") {
        let messageContent = text || " ";

        if (text) {
          const regex = /([#]{1,2}|\|\|?)\[(.*?)\]/g;
          let match;
          let title, header, bodyText;
          let foundToken = false;

          while ((match = regex.exec(text)) !== null) {
            foundToken = true;
            const marker = match[1];
            const content = match[2].trim();
            if (marker === "#") title = content;
            else if (marker === "##") header = content;
            else if (marker === "||") bodyText = content;
          }

          if (foundToken) {
            messageContent = "";
            if (title) messageContent += `**${title}**\n`;
            if (header) messageContent += `__${header}__\n`;
            if (bodyText) messageContent += bodyText;
          }
        }

        if (messageContent.trim().length === 0) messageContent = " ";

        await channel.send({ content: messageContent, files: file ? [file.url] : [] });

      } else if (format === "embed") {
        const embed = new EmbedBuilder().setColor("Random");

        if (text) {
          const regex = /([#]{1,2}|\|\|?)\[(.*?)\]/g;
          let match;
          let title, description, footer;
          let foundToken = false;

          while ((match = regex.exec(text)) !== null) {
            foundToken = true;
            const marker = match[1];
            const content = match[2].trim();
            if (marker === "#") title = content;
            else if (marker === "##") description = content;
            else if (marker === "||") footer = content;
          }

          if (title) embed.setTitle(title);
          if (description) embed.setDescription(description);
          if (footer) embed.setFooter({ text: footer });
          if (!foundToken) embed.setDescription(text);
        } else {
          embed.setDescription("No message provided.");
        }

        if (file) {
          embed.setImage(file.url);
        }

        await channel.send({ embeds: [embed], files: file ? [file.url] : [] });
      }

      await interaction.reply({ content: `Broadcast successfully sent to ${channel}`, ephemeral: true });
    } catch (err) {
      console.error("Broadcast error:", err);
      await interaction.reply({ content: "An error occurred while trying to send the broadcast.", ephemeral: true });
    }
  }
};
