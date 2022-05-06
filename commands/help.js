const Discord = require("discord.js");

module.exports.run = (client, msg, args) => {
    let helpMsg = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor({
            name: "BDimension7s Math Games Bot",
            iconURL: msg.guild.me.displayAvatarURL()
        })
        .addField("Commands", "$reap\n$lb (leaderboard)\n$info (lifetime leaderboard)\n$clock\n$donate\n$help\n$duel @player")
        .addField("Settings", "50% chance player ranked below you steals your reaped time (11PM-7AM EST)\n30% tax at night (doesn't apply to donations)")
    msg.channel.send({ embeds: [helpMsg] });
}
exports.name = "help"
