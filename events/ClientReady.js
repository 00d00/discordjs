import discord from 'discord.js';

export default {
  name: discord.Events.ClientReady,
  async execute(client) {
    console.log('Client Ready!');
  }
}
