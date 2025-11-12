const { Events, MessageFlags } = require('discord.js')
module.exports = {
    name: Events.GuildBanAdd,
    async execute(ban) {
        let user;
        user = ban.user
        updateCache
    }
}