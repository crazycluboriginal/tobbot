const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Tells you a fortune')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('The question you want to ask the magic 8ball')
        .setRequired(true)
    ),

  async execute(interaction) {
    const fortunes = [
      'Yes.',
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes, definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now...',
      'Cannot predict now.',
      'Concentrate and ask again.',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good...',
      'Very doubtful.',
    ];

    const question = interaction.options.getString('question');
    const answer = fortunes[Math.floor(Math.random() * fortunes.length)];

    await interaction.reply(`🎱 **You asked:** ${question}\n**Answer:** ${answer}`);
  },
};
