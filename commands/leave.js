const {getVoiceConnection} = require('@discordjs/voice');
const commandData = require('config.json').commandsData.leave;

module.exports = {
    data: commandData,
    async execute(message) {
        const connection = getVoiceConnection(message.guildId);
        if (connection) connection.destroy();
    },
}