const {createAudioPlayer} = require("@discordjs/voice");

const player = createAudioPlayer();
player.on('error', err => {
    console.error(err);
});

exports.player = player;