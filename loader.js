const {createAudioPlayer} = require("@discordjs/voice");

const player = createAudioPlayer();

player.on('stateChange', subscription => {
    subscription.onStreamError(() => {
        setTimeout(() => {
            player.play(subscription.resource);
        }, 3000);
    });
});

exports.player = player;