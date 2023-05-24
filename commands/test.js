const commandData = require('config.json').commandsData.test;

module.exports = {
    data: commandData,
    async execute(message) {
        await message.reply('test!');
    },
}