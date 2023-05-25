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
            bitrate: 256000,
            frameDuration: 60,
        });
        const info = await ytdl.getInfo(videoUrl);

        // Выбор формата с наибольшим битрейтом
        const bestFormat = info.formats.reduce((prev, current) => {
            return (prev.bitrate || 0) > (current.bitrate || 0) ? prev : current;
        });
        console.log(`Выбран формат: ${bestFormat.qualityLabel} (${bestFormat.audioBitrate}kbps аудио, ${bestFormat.bitrate}kbps видео)`);

        const stream = ytdl(videoUrl,{quality: 'highestaudio', filter: 'audioonly', format: bestFormat});
        player.on('error', err => {
            console.error('stream error' + err.message);
        });
        const resource = createAudioResource(stream);

        connection.subscribe(player);

        stream.on('progress', function (a, b, c) {
            console.log(`a: ${a}, b: ${b}, c: ${c}`);
        });

        stream.once('drain', function () {
            player.play(resource);
        });
    },
}