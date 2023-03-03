const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Disconnect from channel the bot is in'),
    async execute(interaction) {

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        if (VoiceConnectionStatus.Ready) {
            await interaction.reply('Disconnecting');
            console.log(VoiceConnectionStatus);
            connection.state.subscription.player.stop();
            connection.destroy();
        } else {
            await interaction.editReply('I am not in a channel!');
        }
      //  await interaction.editReply(`${message}`);
    },
};

