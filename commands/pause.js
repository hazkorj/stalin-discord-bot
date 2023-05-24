const {player} = require('loader');
const commandData = require('config.json').commandsData.pause;

module.exports = {
    data: commandData,
    async execute() {
        player.pause();
    },
}