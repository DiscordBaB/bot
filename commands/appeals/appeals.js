const { SlashCommandBuilder, InteractionContextType, codeBlock, AttachmentBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { userCanUseAppeals } = require('../../helpers/perm_helper.js');
const { formatRecords } = require('../../helpers/helpers.js');
const { fetchUserInfo } = require('../../helpers/helpers.js');
const Appeal = require('../../models/appealModel.js');
const BanCount = require('../../models/banCountModel.js');
const { Canvas } = require('canvas');
const Table2Canvas = require('table2canvas');
const fs = require('fs');



module.exports = {
    category: 'appeals',
    data: new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Appeals commands [MODs]')
        .setContexts(InteractionContextType.Guild)
        .addSubcommand(subcommand => subcommand
            .setName('list-all')
            .setDescription('List Appeals')
            .addIntegerOption(option => option
                .setName('page')
                .setNameLocalizations({ 'en-US': 'page', 'en-GB': 'page', 'es-ES': 'pagina', 'es-419': 'pagina', 'de': 'seite' })
                .setDescription('What page to return. (Default: 1)')))
        .addSubcommand(subcommand => subcommand
            .setName('get')
            .setDescription('Get a single appeal')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('The appeal ID to return.')
                .setRequired(true))),
    async execute(interaction) {
        try {
            if (userCanUseAppeals(interaction)) {
                if (interaction.options.getSubcommand() === 'list-all') {
                    await interaction.deferReply();

                    const page = interaction.options.getInteger('page') || 0;
                    const records = await Appeal.findAll({
                        attributes: ['id', 'userID', 'reason', 'disclaimer'],
                        limit: 10,
                        offset: page * 10,
                        where: {
                            serverID: interaction.guild.id
                        },
                        raw: true,
                    });
                    const formatted_records = await formatRecords(records, interaction);
                    if (formatted_records === false) {
                        interaction.editReply({ content: 'unable to format logs, see console' });
                    } else {
                    }
                    const columns = [
                        {
                            title: 'ID',
                            dataIndex: 'id',
                            textAlign: 'center',
                            textColor: 'red',
                            width: 100
                        },
                        {
                            title: 'User ID\nName',
                            dataIndex: 'userID',
                            textAlign: 'left',
                            width: 220
                        },
                        {
                            title: 'Reason',
                            dataIndex: 'reason',
                            width: 400
                        },
                        {
                            title: 'Accepted\nDisclaimer',
                            dataIndex: 'disclaimer',
                            width: 100
                        }
                    ];
                    const table = new Table2Canvas({
                        canvas: new Canvas(2, 2),
                        columns: columns,
                        dataSource: formatted_records,
                        bgColor: '#949494',
                        text: 'Appeals List'
                    });
                    const buffer = table.canvas.toBuffer();
                    const attachment = new AttachmentBuilder(buffer)
                        .setDescription("Use '/appeal get <ID>' to return a specific appeal.");
                    interaction.editReply({ files: [attachment] });
                } else if (interaction.options.getSubcommand() === 'get') {
                    const appeal_id = interaction.options.getInteger('id');
                    try {
                        const appeal = await Appeal.findByPk(appeal_id);
                        let appeal_userid, // Appeal has userID baked in
                            appeal_username, // Get using userID from userCache
                            appeal_nickname, // Find using userID+serverID from userCache
                            appeal_bancount, // Find using userID+serverID across to BanCountModel
                            appeal_reason, appeal_disclaimer, appeal_embed, appeal_avatar, appeal_info;
                        appeal_info = await fetchUserInfo(appeal) // Fetch user from discord cache, if not there, fetch from Cache Model
                            .then(user_obj => {
                                appeal_username = user_obj.username;
                                appeal_avatar = user_obj.avatar;
                                appeal_;
                            });
                        embed = new EmbedBuilder()
                            .setColor(16753920)
                            .setTitle(`Ban Appeal ID: ${appeal_id}`)
                            .setThumbnail(user_avatar)
                            .addFields(
                                { name: 'UserName', value: '' }
                            );
                    } catch {
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
};