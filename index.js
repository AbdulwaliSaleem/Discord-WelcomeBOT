require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // required to detect new joins
  ],
});

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;

// Add, remove, or edit as many messages as you like.
// {user} -> mentions the new member
// {server} -> the server's name
const welcomeMessages = [
  "Welcome {user} to **{server}**! 🎉 Grab a seat, get curious, and stay a while — wonders await.",
  "{user} just wandered into **{server}**... 👀 Ever wondered why? You're about to find out.",
  "Hey {user}, welcome to **{server}**! ✨ We're glad you're here — make yourself comfortable and dive in.",
  "🚀 {user} has landed in **{server}**! Buckle up, this is where the fun (and the wondering) begins.",
  "Welcome aboard, {user}! 🌟 **{server}** just got a little more interesting. Say hi and let's get curious together.",
];

function buildWelcomeMessage(member) {
  const template = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  return template
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{server}/g, member.guild.name);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}. Watching for new members...`);
});

client.on('guildMemberAdd', async (member) => {
  try {
    const channel = await member.guild.channels.fetch(WELCOME_CHANNEL_ID);
    if (!channel) {
      console.error('Welcome channel not found. Check WELCOME_CHANNEL_ID in .env');
      return;
    }
    await channel.send(buildWelcomeMessage(member));
  } catch (err) {
    console.error('Failed to send welcome message:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);
