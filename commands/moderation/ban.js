const { SlashCommandBuilder, InteractionContextType, codeBlock, AttachmentBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { fetchUserInfo, checkForDuration } = require('../../helpers/helpers.js');
const { userCanUseBans } = require('../../helpers/perm_helper.js');
const Appeal = require('../../models/appealModel.mjs');
const BanCount = require('../../models/banCountModel.mjs');
const Cache = require('../../models/userCacheModel.ts');
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
            .setName('user') // Who
            .setDescription('The user to ban'))
        .addStringOption(option => option
            .setName('duration') // How Long
            .setDescription("How long to ban for (e.g., 10m, 2h, 3d, lifetime/forever)"))
        .addStringOption(option => option
            .setName('reason') // Why
            .setDescription("The reason for the ban.")),
    async execute(interaction) {
        try {
            let duration = interaction.options.getString('duration');
            if (userCanUseBans(interaction)) {
                await interaction.deferReply({ ephemeral: true });
                // TODO: cache user if possible here
                try {
                    await checkForDuration(duration, interaction);
                } catch (e) {
                    if (e instanceof DBABDurationInputError) {
                        interaction.editReply({ content: "You input an invalid duration.\nAcceptable durations are of the format [number][interval], e.g. 10s, 5m, 24h, 3d, 2w,\nor a string representing no expiration, lifetime/forever/perm(anent)" });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            try { await interaction.editReply({ content: 'An error occurred while processing the ban command.' }); } catch (e) { /* ignore */ }
        }
    }
}