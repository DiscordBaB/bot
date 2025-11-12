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
 *
 * @param  {{member: GuildMember}} interaction
 * @returns {boolean}
 */
function userCanUseBans(interaction) {
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
module.exports = {
    userCanReload: userCanReload,
    userCanUseAppeals: userCanUseAppeals,
    userCanUseBans: userCanUseBans,
}