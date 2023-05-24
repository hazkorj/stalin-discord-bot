const {player} = require('loader.js');
const commandData = require('config.json').commandsData.stop;

module.exports = {
    data: commandData,
    async execute() {
        player.stop();
    },
}