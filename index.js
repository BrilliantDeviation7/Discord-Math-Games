const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
    disableMentions: "everyone",
});

const express = require("express");
const app = express();
app.listen(3000, () => {
    console.log("Discord bot is online!");
});
app.get("/", (req, res) => {
    res.send("Discord bot is online!");
});

const fs = require("fs");
client.commands = new Discord.Collection();
const commands = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (file of commands) {
    const commandName = file.split(".")[0];
    const command = require(`./commands/${commandName}`);
    client.commands.set(commandName, command);
}

const Database = require("@replit/database");
const db = new Database();
db.list().then((keys) => {
    console.log(`KEYS: ${keys.join(", ")}`);
});
// db.delete("start_time");

const tools = require("./tools");
const prefix = "$";

client
    .on("debug", console.log)
    .on("warn", console.log)

client.on("ready", async () => {
    client.user.setPresence({
        activities: [{ name: "for night reapers", type: "WATCHING" }],
        status: "online",
    });
});

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    if (!msg.guild.me.permissionsIn(msg.channel).has(Permissions.FLAGS.EMBED_LINKS)) return;
    if (!msg.guild.me.permissionsIn(msg.channel).has(Permissions.FLAGS.SEND_MESSAGES)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift();
    const command = client.commands.get(commandName);

    if (command) {
        command.run(client, msg, args);
    } else {
        tools.deleteInvalidCommand(msg, "Invalid command!");
    }
});

client.login(process.env.TOKEN);
