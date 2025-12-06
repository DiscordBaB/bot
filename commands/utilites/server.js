const { SlashCommandBuilder, EmbedBuilder, Colors, time, TimestampStyles, channelMention, roleMention, userMention } = require('discord.js');
module.exports = {
    category: 'utilities',
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get a component with server info on it.'),
    async execute(interaction) {
        const serverEmbed = new EmbedBuilder()
            .setColor(Colors.DarkGreen)
            .setTitle('Server Info')
            .addFields(
                { name: "Server Name", value: `${interaction.guild.name}` },
                { name: "Member Count", value: `${interaction.guild.memberCount}` }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${userMention(interaction.author.id)}.` });
        await interaction.reply({ embeds: [serverEmbed] });
    }
};