const {player} = require('loader');
const commandData = require('config.json').commandsData.unpause;

module.exports = {
    data: commandData,
    async execute() {
        player.unpause();
    },
}