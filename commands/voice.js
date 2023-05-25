const {joinVoiceChannel, createAudioResource} = require('@discordjs/voice');
const {player} = require('loader');
const ytdl = require('ytdl-core');
const commandData = require('config.json').commandsData.voice;
const { opus } = require('prism-media');

module.exports = {
    data: commandData,
    async execute(message, args) {
        const videoUrl = args[0];
        const rexExp = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/;
        if (!videoUrl || !rexExp.test(videoUrl)) return message.reply('Ссылка неопознана');

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('вы должны находиться в голосовом канале');

        const connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            voiceEncoder: {
                type: 'opus',
                quality: 'highestaudio',
            },
            opusEncoded: true,
            fec: true,
        });

        const stream = ytdl(videoUrl,{quality: 'highestaudio', filter: 'audioonly'});
        const decoder = new opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
        const audioStream = stream.pipe(decoder).on('error', console.error);

        const resource = createAudioResource(audioStream);

        player.on('error', err => {
            console.error('stream error' + err.message);
            setImmediate(function () {
                player.play(resource);
            });
        });

        connection.subscribe(player);

        setTimeout(function () {
            console.log('playing');
            player.play(resource);
        }, 5000);
    },
}