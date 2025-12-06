const { SlashCommandBuilder, InteractionContextType, codeBlock, AttachmentBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { userCanUseBans } = require('../../helpers/perm_helper.js');
module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban commands [MODs]')
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to ban')),
    async execute(interaction) {
        try {
            if (userCanUseBans(interaction)) {
                await interaction.deferReply({ ephemeral: true });


            }
        } catch (error) {
            console.error(error);
            try { await interaction.editReply({ content: 'An error occurred while processing the ban command.' }); } catch (e) { /* ignore */ }
        }
    }
};