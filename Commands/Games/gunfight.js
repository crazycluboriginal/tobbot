const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} = require('discord.js');

module.exports = {
	name: 'gunfight',
	data: new SlashCommandBuilder()
		.setName('gunfight')
		.setDescription('First one to shoot wins!')
		.addUserOption(option =>
			option
				.setName('opponent')
				.setDescription('User to fight')
				.setRequired(true)
		),

	async execute(interaction) {
		const challenger = interaction.user;
		const opponent = interaction.options.getUser('opponent');

		if (opponent.id === challenger.id) {
			return interaction.reply({ content: 'You cannot fight yourself!', ephemeral: true });
		}

		await interaction.deferReply();

		const positions = {
			three: '_ _        :levitate: :point_right:      **3**        :point_left: :levitate:',
			two:   '_ _        :levitate: :point_right:      **2**        :point_left: :levitate:',
			one:   '_ _        :levitate: :point_right:      **1**        :point_left: :levitate:',
			go:    '_ _        :levitate: :point_right:      **GO!**        :point_left: :levitate:',
			ended1:'_ _     :levitate: :point_right:      **STOP!**        :skull_crossbones: :levitate:',
			ended2:'_ _     :levitate: :skull_crossbones:      **STOP!**        :point_left: :levitate:',
		};

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('shoot1')
				.setLabel('Shoot!')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('useless')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('shoot2')
				.setLabel('Shoot!')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true)
		);

		const msg = await interaction.followUp({
			content: positions.three,
			components: [row],
		});

		const countdown = () => {
			setTimeout(() => msg.edit({ content: positions.two,   components: [row] }), 1000);
			setTimeout(() => msg.edit({ content: positions.one,   components: [row] }), 2000);
			setTimeout(() => {
				row.components[0].setDisabled(false);
				row.components[2].setDisabled(false);
				msg.edit({ content: positions.go, components: [row] });
			}, 3000);
		};
		countdown();

		const filter = i =>
			i.user.id === challenger.id || i.user.id === opponent.id;

		const buttonInteraction = await msg.awaitMessageComponent({
			filter,
			componentType: ComponentType.Button,
			time: 60000,
			max: 1,
		});

		row.components[0].setDisabled(true);
		row.components[2].setDisabled(true);
		await msg.edit({
			content: buttonInteraction.customId === 'shoot1' ? positions.ended1 : positions.ended2,
			components: [row],
		});

		const winner =
			buttonInteraction.customId === 'shoot1' && buttonInteraction.user.id === challenger.id
				? challenger
				: opponent;

		await buttonInteraction.reply({ content: `<@${winner.id}> won!` });
	},

	run: async (client, interaction) => {
		await module.exports.execute(interaction);
	},
};
