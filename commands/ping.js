import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('ping')
    .setDescription('コマンド応答テスト')
  ,
  async execute(interaction) {
    await interaction.reply('Pong!');
  }
};
```
