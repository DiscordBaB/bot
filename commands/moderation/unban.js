const { SlashCommandBuilder, InteractionContextType, codeBlock, AttachmentBuilder, CommandInteraction, EmbedBuilder} = require('discord.js');
const { userCanUseBans, fetchUserInfo, checkForDuration} = require('../../helpers/helpers');
const Appeal = require('../../models/appealModel')
const BanCount = require('../../models/banCountModel')
const { Canvas } = require('canvas');
const Table2canvas = require('table2canvas');
const fs = require('fs');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban commands [MODs]')
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to ban'))

    async execute(interaction) {
        try {
            let duration = interaction.options.getString('duration');
            if (userCanUseBans(interaction)) {
                await interaction.deferReply({ ephemeral: true });

                try {
                    await checkForDuration(duration, interaction)
                } catch (e) {
                    if
                }
            }
        } catch (error) {
            console.error(error);
            try { await interaction.editReply({ content: 'An error occurred while processing the ban command.' }); } catch (e) { /* ignore */ }
        }
    },

};