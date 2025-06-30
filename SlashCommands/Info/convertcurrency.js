const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convertcurrency')
    .setDescription('Convert an amount from one currency to another')
    .addNumberOption(opt =>
      opt.setName('amount')
         .setDescription('Amount to convert')
         .setRequired(true))
    .addStringOption(opt =>
      opt.setName('from')
         .setDescription('Source currency code (e.g. USD)')
         .setRequired(true))
    .addStringOption(opt =>
      opt.setName('to')
         .setDescription('Target currency code (e.g. EUR)')
         .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const amount = interaction.options.getNumber('amount');
    const from   = interaction.options.getString('from').toUpperCase();
    const to     = interaction.options.getString('to').toUpperCase();

    try {
      const res  = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const rate = res.data.rates?.[to];
      if (!rate) {
        return interaction.editReply(`Unknown currency code: **${to}**.`);
      }
      const converted = (amount * rate).toFixed(2);
      const embed     = new EmbedBuilder()
        .setTitle('💱 Currency Conversion')
        .setDescription(`${amount} ${from} → ${converted} ${to}`)
        .setTimestamp();
      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return interaction.editReply('Failed to fetch exchange rates.');
    }
  },
};
