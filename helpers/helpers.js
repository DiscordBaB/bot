const {GuildMember, Interaction} = require("discord.js");
const bot_owner_ids = require('/home/ken/.dbab-config/dbab.json').bot.owner_ids

/**
 *
 *
 * @param  {{member: GuildMember}} interaction
 * @returns {boolean}
 */
function userCanUseAppeals(interaction) {
    let member = interaction.member;
    // @ts-ignore
    return (member.roles.cache.some(role => role.name === "Mod") ||
        member.roles.cache.some(role => role.name === 'Head Mod') ||
        member.roles.cache.some(role => role.name === 'Developer') ||
        member.roles.cache.some(role => role.name === 'Owner'));
}

/**
 *
 * @param {{member: GuildMember}} interaction
 * @returns boolean
 */
function userCanReload(interaction) {
    let member = interaction.member;
    return bot_owner_ids.includes(member.id.toString())
}

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
async function fetchUserInfo(user_id, interaction) {
    let user_info;
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

module.exports = { userCanReload: userCanReload, userCanUseAppeals: userCanUseAppeals, formatRecords: formatRecords, fetchUserInfo: fetchUserInfo}