const commandsData = require('config.json').commandsData;

module.exports = {
    data: {
        name: 'help',
        shortName: 'h',
        description: 'Список команд',
    },
    async execute(message) {
        let helpMessage = '';
        for (let key of Object.keys(commandsData)) {
            const command = commandsData[key];
            const name = command.name;
            const shortName = `${command.shortName}` || '';
            let shortNameMessage = shortName;
            if (shortName) {
                shortNameMessage = ` или ${shortName}`;
            }
            helpMessage += `${name}${shortNameMessage}: ${command.description} \n`;
        }
        await message.reply(helpMessage);
    },
}