const {joinVoiceChannel, createAudioResource, StreamType} = require('@discordjs/voice');
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
                quality: 'highestaudio'
            },
        });

        const stream = ytdl(videoUrl, {quality: 'highestaudio', qualityfilter: 'audioonly', highWaterMark: 1048576});
        stream.on('error', err => {
            console.error(err);
        });
        const resource = createAudioResource(stream, {
            inlineVolume: true,
            inputType: StreamType.Opus,
            bitrate: '64k',
        });
        player.play(resource);
        connection.subscribe(player);
    },
}