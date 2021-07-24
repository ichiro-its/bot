const Discord = require("discord.js");

const botToken = process.env.BOT_TOKEN;

const client = new Discord.Client();

console.debug(`Logging in the bot using token ${botToken}...`);
client
  .once("ready", () => {
    console.log(`Bot logged in as ${client.user.username}!`);

    client
      .fetchApplication()
      .then((app) => {
        if (app instanceof Discord.Application) {
          const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${app.id}&scope=bot`;
          console.log(`Invite the bot to your server on ${inviteUrl}`);
        } else {
          console.warn("Invalid app info!");
        }
      })
      .catch((err) => {
        console.warn(`Unable to get the app info! ${err.message}`);
      });
  })
  .on("message", (message) => {
    if (message.author.id === client.user.id) {
      return;
    }

    const mentioned = message.mentions.users.some((user) => user.id === client.user.id);
    if (mentioned) {
      // Remove bot mention text.
      const filteredContent = message.content.replace(`<@!${client.user.id}>`, '');
      console.debug(`Received '${filteredContent}' from ${message.author.username}!`);

      // Echo the message back
      message.channel.send(`${message.author} ${filteredContent}`);
    }
  })
  .login(botToken)
  .catch((err) => {
    console.error(`Failed to login the bot! ${err.message}`);
    process.exit(1);
  });
