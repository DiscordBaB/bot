const { SlashCommandBuilder, InteractionContextType, codeBlock, AttachmentBuilder, CommandInteraction, EmbedBuilder} = require('discord.js');
const { userCanUseBans, fetchUserInfo } = require('../../helpers/helpers');
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
        .addStringOption(option => option
            .setName('duration')
            .setDescription("How long to ban for (e.g., 10m, 2h, 3d, lifetime/forever)")),
    async execute(interaction) {
        try {
            let duration = interaction.options.getString('duration');
            if (userCanUseBans(interaction)) {
                await interaction.deferReply({ ephemeral: true });

                // Validate duration input: allow 'lifetime'/'forever' or number+unit (s,m,h,d,w,y)
                if (duration) {
                    const normalized = duration.trim().toLowerCase();
                    const isPermanent = ['lifetime', 'forever', 'perm', 'permanent'].includes(normalized);
                    const match = normalized.match(/^(\d+)\s*([smhdwy])$/i);

                    if (!isPermanent && !match) {
                        await interaction.editReply({ content: "Invalid duration. Use formats like: 30s, 15m, 2h, 3d, 2w, 1y, or 'lifetime'/'forever'." });
                        return;
                    }

                    // Optionally convert to milliseconds for later processing
                    let durationMs = null;
                    if (match) {
                        const amount = parseInt(match[1], 10);
                        const unit = match[2].toLowerCase();
                        const unitMap = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000, y: 31_536_000_000 };
                        durationMs = amount * unitMap[unit];
                        if (!Number.isFinite(durationMs) || durationMs <= 0) {
                            await interaction.editReply({ content: "Duration must be a positive number followed by a unit: s, m, h, d, w, y." });
                            return;
                        }
                    }

                    // At this point, duration is valid. Further ban logic can use durationMs or treat as permanent.
                    await interaction.editReply({ content: isPermanent ? "Duration accepted: permanent ban." : `Duration accepted: ${normalized} (${durationMs} ms).` });
                } else {
                    await interaction.editReply({ content: "Please provide a duration, e.g., 10m, 2h, 3d, or 'lifetime'." });
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            try { await interaction.editReply({ content: 'An error occurred while processing the ban command.' }); } catch (e) { /* ignore */ }
        }
    },

};