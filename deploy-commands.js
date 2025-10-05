const { REST, Routes } = require('discord.js');
const clientId = require('/home/ken/.dbab-config/dbab.json').bot.clientId;
const guildIds = require('/home/ken/.dbab-config/dbab.json').bot.guildIds;
const token = require('/home/ken/.dbab-config/dbab.json').bot.token;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
console.log(guildIds)
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        for (let guildID of guildIds) {
            console.log(`Started refreshing ${commands.length} application (/) commands on ${guildID}.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, guildID),
                    {body: commands},
                );

            console.log(`Successfully reloaded ${data.length} application (/) commands on ${guildID}.`);
        }
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();