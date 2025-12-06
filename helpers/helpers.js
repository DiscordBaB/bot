const userCache = require('../models/userCacheModel.ts');

/**
 *
 * @param {[{id: number, userID: string, reason: string, disclaimer: number}]} records
 * @param {{guild: {members: GuildMemberManager}}} interaction
 */
async function formatRecords(records, interaction) {
    const formatted = []
    for (let record of records) {
        const updated_id = (function () {return record.id})();
        let updated_userID
        let nickname;
        let userID;
        let member_object;
        let userID_row_string;
        await interaction.guild.members.fetch(record.userID)
            .then(member => {
                member_object = member
                nickname = member_object.nickname
                userID = member_object.user.id
                userID_row_string = `${nickname}\n(${userID})`
            })
            .catch(async error => {
                member_object = false
                await interaction.client.users.fetch(record.userID)
                    .then(user => {
                        userID_row_string = `@${user.username}`
                    })
                    .catch(error => {
                        if (error.status === 404) {
                            userID_row_string = `${record.userID}\n(USER_NOT_RESOLVABLE)`
                        } else {
                            userID_row_string = `${record.userID}`
                        }
                    });
            });
        updated_userID = userID_row_string
        const updated_reason = (function () {
            return record.reason
        })();
        const updated_disclaimer = (function() {
            if (record.disclaimer === 1) {
                return 'Yes'
            } else if (record.disclaimer === 0) {
                return 'No'
            } else {
                return 'No'
            }
        })();
        const formatted_record = {id: updated_id, userID: updated_userID, reason: updated_reason, disclaimer: updated_disclaimer}
        formatted.push(formatted_record)
    }
    if (formatted) {
        return formatted
    } else {
        return false
    }
}

// Fetch user info from Discord or from Cache Model, else return minimal object
async function fetchUserInfo(user_id, interaction) {
    let user_info;
    // try getting from model first
    
    const cached_user = await userCache.findOne({
        where: {
            userID: user_id,
        }
    })
    .then(result => {
        return result
    })
    .catch(error => {
        console.error('Error fetching from userCache:', error);
        return null;
    });
    if (cached_user) {
        user_info = {
            username: cached_user.username,
            avatar: cached_user.avatar,
            discrim: cached_user.discriminator,
            bot: cached_user.bot,
            createdAt: cached_user.createdAt,
            id: cached_user.userID,
        }
        return user_info
    }
    // else try fetching from discord
    let user_obj;
    await interaction.client.users.fetch(user_id)
        .then(user => {
            user_obj = user
            user_info = {
                username: user_obj.username,
                avatar: user_obj.avatar,
                discrim: user_obj.discriminator,
                bot: user_obj.bot,
                createdAt: user_obj.createdAt,
                id: user_obj.id,
            }
        })
        .catch(async error => {
            if (error.status === 404) {
                user_info = {
                    user_id: user_id,

                }
            }
        })
}

async function checkForDuration(duration, interaction) {
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
    }
}

module.exports = {
    formatRecords: formatRecords,
    fetchUserInfo: fetchUserInfo,
    checkForDuration: checkForDuration,
};