import discord from 'discord.js';
import fs from 'fs/promises';

const client = new discord.Client({ intents: Object.values(discord.GatewayIntentBits) });

const commands = new discord.Collection();

client.once('ready', async () => {
  const commandFiles = await fs.readdir('./commands');
  const jsFiles = commandFiles.filter(file => file.endsWith('.js'));
  for (const file of jsFiles) {
    let command = await import(`./commands/${file}`);
    command = command.default;

    commands[command.data.name] = command;
    console.log(`Loaded command: ${command.data.name}`);
  }
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data);
  }
  await client.application.commands.set(data);

  const events = await fs.readdir('./events');
  for ( const eventName of events.filter(file => file.endsWith('.js')) ) {
    const data = (await import(`./events/${eventName}`)).default;
    if (data.once) {
      client.once(data.name, (...args) => data.execute(client, ...args));
    } else {
      client.on(data.name, (...args) => data.execute(client, ...args));
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await commands[interaction.commandName].execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: `\`\`\`${error}\`\`\``, ephemeral: true });
  }
});

client.login(process.env.CLIENT_TOKEN);
