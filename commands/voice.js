const {joinVoiceChannel, createAudioResource} = require('@discordjs/voice');
const {player} = require('loader');
const ytdl = require('ytdl-core');
const commandData = require('config.json').commandsData.voice;

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
            bitrate: '256000',
            framerate: '60'
        });
        const info = await ytdl.getInfo(videoUrl);

        const stream = ytdl(videoUrl,{quality: 'highestaudio', filter: 'audioonly', format: info.formats.filter((f) => f.container === 'mp3').filter(f => f.audioBitrate)[0]});

        const resource = createAudioResource(stream);

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