const { SlashCommandBuilder } = require('discord.js');
const { userCanReload } = require('../../helpers/perm_helper.js');
module.exports = {
    category: 'owner',
    data: new SlashCommandBuilder()
        .setName('acl')
        .setDescription('Reloads a command.')
        .addSubcommand(subcommand => subcommand.setName('new')
            .setDescription('Generates a new ACL entry.')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to create the entry for')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand.setName('update')
            .setDescription('Updates an existing ACL entry.')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ACL Entry ID to update.')
                .setRequired(true))
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to update the entry to.'))
            .addStringOption(option => option
                .setName('perms')
                .setDescription('The new permissions string'))
        )
        .addSubcommand(subcommand => subcommand.setName('remove')
            .setDescription('Remove an ACL entry.')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ACL Entry ID to remove.')
                .setRequired(true))
        ),
    async execute(interaction) {
        try {
            if (userCanReload(interaction)) {
                subcommand = interaction.options.getSubcommand
                switch (subcommand) {
                    case 'new': {
                        const user = interaction.options.getUser('user')
                    }
                    case 'update': {
                        const user = interaction.options.getUser('user')
                        const perms = interaction.options.getString('perms')
                    }
                    case 'remove': {
                        const user = interaction.options.getUser('user')
                        const id = interaction.options.getInteger('id')
                    }
                }
            } else {
                interaction.deferReply({flags: [MessageFlags.Ephemeral]})
                interaction.editReply({content: `Sorry ${interaction.user.toString()}, you do not have permission to use this command.`})
            }
        } catch (error) {

        }
    }
};