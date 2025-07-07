const { EmbedBuilder, Colors, ApplicationCommandOptionType } = require("discord.js");
const translate = require("@iamtraction/google-translate");

const LANG_NAMES = {
  ar: "Arabic",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  fi: "Finnish",
  fr: "French",
  de: "German",
  el: "Greek",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  es: "Spanish",
  sv: "Swedish",
};

module.exports = {
  name: "translate",
  description: "Translates the given message.",
  options: [
    {
      name: "text",
      description: "The text to translate",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "language",
      description: "The target language",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Object.entries(LANG_NAMES).map(([code, name]) => ({ name, value: code })),
    },
  ],

  run: async (client, interaction) => {
    const text = interaction.options.getString("text").trim();
    const language = interaction.options.getString("language");
    const langName = LANG_NAMES[language] || language;

    if (!text) {
      return await interaction.reply({ content: "Please provide text to translate.", ephemeral: true });
    }

    if (text.length > 5000) {
      return await interaction.reply({ content: "Text too long. Please limit to 5000 characters.", ephemeral: true });
    }

    try {
      const res = await translate(text, { to: language });

      if (!res.text || res.text.trim() === "") {
        return await interaction.reply({ content: "Translation failed or returned no result.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle(`Translated to ${langName}`)
        .setDescription(res.text)
        .setColor(Math.floor(Math.random() * 16777215))
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error("Translation error:", err);
      await interaction.reply({
        content: "An error occurred while translating. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
