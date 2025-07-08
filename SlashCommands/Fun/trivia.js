const fetch = require('node-fetch');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const he = require('he');

module.exports = {
  name: 'trivia',
  description: 'Get a random trivia question.',
  options: [],

  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Get a random trivia question.'),

  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1');
      const json = await response.json();
      const questionData = json.results[0];

      const category = he.decode(questionData.category);
      const question = he.decode(questionData.question);
      const correctAnswer = he.decode(questionData.correct_answer);
      const incorrectAnswers = questionData.incorrect_answers.map(ans => he.decode(ans));
      const answers = [...incorrectAnswers, correctAnswer].sort();

      const answerChoices = answers
        .map((ans, idx) => `${String.fromCharCode(65 + idx)}. ${ans}`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setTitle(question)
        .addFields(
          { name: 'Answer Choices', value: answerChoices },
          { name: 'Category', value: category },
          { name: 'Answer', value: `||${correctAnswer}||` }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Trivia command error:', error);
      await interaction.editReply({ content: 'Failed to fetch a trivia question.' });
    }
  },
};
