const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription("Sends a completely RANDOM post from Reddit. You've been warned."),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const response = await axios.get('https://www.reddit.com/r/random.json');
      const posts = response.data[0].data.children;
      const post = posts[Math.floor(Math.random() * posts.length)].data;

      const embed = new EmbedBuilder()
        .setTitle(post.title)
        .setURL(`https://reddit.com${post.permalink}`)
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setFooter({ text: `👍 ${post.ups} | 💬 ${post.num_comments}` });

      if (post.post_hint === 'image' && post.url) {
        embed.setImage(post.url);
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching random Reddit post:', error);
      await interaction.editReply('Sorry, I couldn’t fetch a reddit post right now.');
    }
  },
};
