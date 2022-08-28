const Discord = require('discord.js');

module.exports.run = (client, msg, args) => {
    let helpMsg = new Discord.MessageEmbed()
        .setColor('YELLOW')
        .setAuthor({
            name: "BDimension7's Math Games Discord Bot",
            iconURL: msg.guild.me.displayAvatarURL(),
        })
        .addField(
            'Commands',
            '$reap\n$lb (leaderboard)\n$info (lifetime leaderboard)\n$clock\n$donate\n$help\n$duel @player'
        )
        .addField(
            'Settings',
            '50% chance player ranked below you steals reaped time (11PM-7AM EST)\n30% tax at night (successful reaps)'
        )
        .addField('Github!', '[BDimension7/Discord-Math-Games](https://github.com/BDimension7/Discord-Math-Games)');
    msg.channel.send({ embeds: [helpMsg] });
};
exports.name = 'help';
