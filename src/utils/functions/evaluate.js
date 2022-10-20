const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

const evaluate = async (interaction, code) => {
	const clean = async (text, client) => {
		if (text && text.constructor.name == 'Promise') text = await text;
		if (typeof text !== 'string') text = require('util').inspect(text, { depth: 1 });

		text = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));

		text = text.replaceAll(client.token, '[KODY NUKLEARNE NIE RUSZAĆ]');

		return text;
	};

	const colors = require('./colors.json');
	const input = code;
	try {
		const evaled = eval(input);
		const output = await clean(evaled, interaction.client);

		if (output.length > 1024) {
			const outtxt = new AttachmentBuilder(Buffer.from(output), { name: 'output.txt' });
			const embed = new EmbedBuilder()
				.setColor(colors.green)
				.addFields([
					{ name: 'Input', value: `\`\`\`js\n${input}\n\`\`\`` },
					{ name: 'Output', value: 'Output jest w załączonym pliku.' },
				]);
			return await interaction.update({ content: '', embeds: [embed], files: [outtxt] });
		}
		else {
			const embed = new EmbedBuilder()
				.setColor(colors.green)
				.addFields([
					{ name: 'Input', value: `\`\`\`js\n${input}\n\`\`\`` },
					{ name: 'Output', value: `\`\`\`xl\n${output}\n\`\`\`` },
				]);
			return await interaction.update({ content: '', embeds: [embed] });
		}
	}
	catch (error) {
		const embed = new EmbedBuilder()
			.setColor(colors.red)
			.addFields([
				{ name: 'Input', value: `\`\`\`js\n${input}\n\`\`\`` },
				{ name: 'Output', value: `\`\`\`xl\n${error}\n\`\`\`` },
			]);
		return await interaction.update({ content: '', embeds: [embed] });
	}
};

module.exports = { evaluate };