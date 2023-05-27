const {joinVoiceChannel, createAudioResource} = require('@discordjs/voice');
const {player} = require('loader');
const ytdl = require('ytdl-core');
const commandData = require('config.json').commandsData.voice;

module.exports = {
    data: commandData,
    async execute(message, args) {
        const videoUrl = args[0];
        const rexExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        if (!videoUrl || !rexExp.test(videoUrl)) return message.reply('Ссылка неопознана, отправьте ссылку на youtube видео');

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply('Вы должны находиться в голосовом канале');

        try {
            const connection = await joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const stream = ytdl(videoUrl,{filter: 'audioonly'});
            const resource = createAudioResource(stream);

            connection.subscribe(player);
            player.play(resource);

            await message.channel.send(`Сейчас играет ${stream.videoDetails.title}`);
        } catch (err) {
            console.error(err);
            await message.reply('Произошла неизвестная ошибка при воспроизведении видео, попробуйте позже');
        }
    },
}