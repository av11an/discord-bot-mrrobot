const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Downloads song from youtube, joins voice channel user is in, plays music file')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('URL to youtube video')),
    async execute(interaction) {
        // defer reply to give time for the bot to respond.

        await interaction.deferReply();
        
        // Validate the input is an actual youtube link.

        var channel = interaction.member.voice.channel;
        const message = interaction.options.getString('input');

                // create connection varible to join and leave
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

            /*
            - ADD TITLE INFO GET
            - GET YTDL TO DOWNLOAD A MUSIC FORMAT
            - AUDIO PLAYER WORKS
            */
           
            ytdl(message, {fitler: 'audioonly'}).pipe(fs.createWriteStream(`/Users/evanellis/Desktop/Projects/js/music-bot/commands/yt-downloads/song.mp4`));
            var resource = `/Users/evanellis/Desktop/Projects/js/music-bot/commands/yt-downloads/song.mp4`

            const player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Pause,},});

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The connection has entered the Ready state - ready to play audio!');
            });

            player.play(resource);

            connection.subscribe(player);
    
            player.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio player has started playing!');
                interaction.editReply(`Now playing ${videoTitle}`);
            });

    },
};
