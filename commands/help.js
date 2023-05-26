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
            const shortNameMessage = ` / ${command.shortName}` || '';
            helpMessage += `${name}${shortNameMessage}: ${command.description}`;
        }
        await message.reply(helpMessage);
    },
}