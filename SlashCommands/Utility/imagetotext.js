const { EmbedBuilder, Colors, ApplicationCommandOptionType } = require("discord.js");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const apiKey = process.env.API_NINJAS_KEY;

module.exports = {
  name: "imagetotext",
  description: "Extract text from an attached image",
  options: [
    {
      name: "image",
      description: "Upload an image file (required)",
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const imageAttachment = interaction.options.getAttachment("image");

    // Check in case of interaction issues
    if (!imageAttachment || !imageAttachment.url) {
      return interaction.reply({ content: "You must upload an image to use this command.", ephemeral: true });
    }

    const imageUrl = imageAttachment.url;

    await interaction.deferReply();

    try {
      const imagePath = path.join(__dirname, "temp_image.jpg");
      const response = await axios.get(imageUrl, { responseType: "stream" });
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        try {
          const form = new FormData();
          form.append("image", fs.createReadStream(imagePath));

          const apiResponse = await axios.post("https://api.api-ninjas.com/v1/imagetotext", form, {
            headers: {
              "X-Api-Key": apiKey,
              ...form.getHeaders(),
            },
          });

          const result = apiResponse.data;
          const extractedText = result.map(item => item.text).join(" ").trim();

          const embed = new EmbedBuilder()
            .setColor(Colors.Random)  // Modern v14 colour usage
            .setTitle("Extracted Text from Image")
            .setDescription(extractedText || "*No text found in the image.*");

          await interaction.editReply({ embeds: [embed] });
        } catch (error) {
          console.error("Text extraction error:", error);
          await interaction.editReply({ content: "Failed to extract text from the image." });
        } finally {
          fs.unlinkSync(imagePath);
        }
      });

      writer.on("error", async (err) => {
        console.error("Image download error:", err);
        await interaction.editReply({ content: "Failed to download the image." });
      });

    } catch (error) {
      console.error("Unexpected error:", error);
      await interaction.editReply({ content: "An unexpected error occurred." });
    }
  },
};
