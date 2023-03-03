const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');


// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
	],
});


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// New collection to store command files names.
client.commands = new Collection();

// Construct path to commands dir
const commandsPath = path.join(__dirname, 'commands');
// Read path to dir and return array of all files that are contained in /commands that are .js
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Loop over the array and dynamically set each command into the collection
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// Log in to Discord with your client's token
client.login(token);