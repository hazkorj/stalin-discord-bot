const commandsData = require('config.json').commandsData;
const prefix = require('config.json').prefix;

module.exports = {
    data: {
        name: 'help',
        shortName: 'h',
        description: 'Список команд',
    },
    async execute(message) {
        let helpMessage = 'Cписок команд:\n\n';
        for (let key of Object.keys(commandsData)) {
            const command = commandsData[key];
            const name = prefix + command.name;
            let shortName = command.shortName || '';
            let shortNameMessage = shortName;
            if (shortName) {
                shortName = prefix + shortName;
                shortName = ` или ${prefix}${shortName}`;
            }
            helpMessage += `${name}${shortNameMessage} - ${command.description}\n\n`;
        }
        await message.reply(helpMessage);
    },
}