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
        const decoder = new opus.Decoder({
            rate: 48000,     // частота дискретизации: 48000 Гц
            channels: 2,     // количество каналов: стерео (2)
            frameSize: 960,  // размер фрейма: 20 мс при частоте дискретизации 48000 Гц
            discardPackets: true, // отбрасывать пакеты, которые не удается декодировать
            fec: true,       // использовать Forward Error Correction (FEC) для коррекции ошибок пакетов
            plc: false,      // использовать Packet Loss Concealment (PLC) для скрытия потерянных пакетов
            optimizeForVariability: false,  // оптимизировать для переменного битрейта
        });

        player.on('error', err => {
            console.error('stream error' + err.message);
            setImmediate(function () {
                player.play(resource);
            });
        });

        const audioStream = stream.pipe(decoder).on('error', console.error);
        const resource = createAudioResource(audioStream);
        player.play(resource);
        connection.subscribe(player);
    },
}