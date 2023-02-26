const { SlashCommandBuilder } = require('discord.js');
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
        await interaction.deferReply();
        const channel = interaction.voice.session_id;
        const message = interaction.options.getString('input');
        console.log(channel);
        interaction.editReply(`${channel}`);
      //  await interaction.editReply(`${message}`);
    },
};