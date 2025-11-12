const { SlashCommandBuilder, InteractionContextType, codeBlock, AttachmentBuilder, CommandInteraction, EmbedBuilder} = require('discord.js');
const { userCanUseBans, fetchUserInfo, checkForDuration} = require('../../helpers/helpers');
const Appeal = require('../../models/appealModel')
const BanCount = require('../../models/banCountModel')
const Cache = require('../../models/userCacheModel')
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
        .addStringOption(option => option
            .setName('duration')
            .setDescription("How long to ban for (e.g., 10m, 2h, 3d, lifetime/forever)")),
    async execute(interaction) {
        try {
            let duration = interaction.options.getString('duration');
            if (userCanUseBans(interaction)) {
                await interaction.deferReply({ ephemeral: true });

                try {
                    await checkForDuration(duration, interaction)
                } catch (e) {
                    if (e instanceof DBABDurationInputError) {
                        interaction.editReply({content: "You input an invalid duration.\nAcceptable durations are of the format [number][interval], e.g. 10s, 5m, 24h, 3d, 2w,\nor a string representing no expiration, lifetime/forever/perm(anent)"})
                    }
                }
            }
        } catch (error) {
            console.error(error);
            try { await interaction.editReply({ content: 'An error occurred while processing the ban command.' }); } catch (e) { /* ignore */ }
        }
    },

};