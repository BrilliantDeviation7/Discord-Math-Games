const Discord = require("discord.js");
const { deleteInvalidCommand, randomInt } = require("../tools");
const Fraction = require("fraction.js");
const inDuel = [];

const startingQuotes = [
    "Starting quote here..."
];

const endingQuotes = [
    "Ending quote here..."
];

const threeStr = " ____  \n\
|___ \\ \n\
  __) |\n\
 |__ < \n\
 ___) |\n\
|____/ \n\
";

const twoStr = " ___  \n\
|__ \\ \n\
   ) |\n\
  / / \n\
 / /_ \n\
|____|\n\
";

const oneStr = " __ \n\
/_ |\n\
 | |\n\
 | |\n\
 | |\n\
 |_|\n\
";

function createExpression() {
    const operators = ["  +", "  -", "  x", "  /"];
    var operatorIndex = randomInt(0, 4);
    var term = randomInt(1, 10);
    var expression = term;
    var answer = term;

    for (i = 0; i < 5; i++) {
        term = randomInt(1, 10);
        expression += operators[operatorIndex] + term;
        if (operatorIndex == 0) {
            answer += term;
        } else if (operatorIndex == 1) {
            answer -= term;
        } else if (operatorIndex == 2) {
            answer *= term;
        } else if (operatorIndex == 3) {
            answer /= term;
        }
        operatorIndex = randomInt(0, 4);
    }
    answer = new Fraction(answer);
    return [expression, answer.toFraction()];
}
function startDuel(msg, player1, player2) {
    let duelMsg = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`${player1.username} vs. ${player2.username}\nA duel has begun!`)
        .setDescription("Which mathlete will be quicker?\n" + startingQuotes[randomInt(0, startingQuotes.length)])
    msg.channel.send({ embeds: [duelMsg] }).then(m => {
        setTimeout(function () {
            runDuel(msg, player1, player2, 0)
        }, 5000);
    });
}
function runDuel(msg, player1, player2) {
    const correctResponses = [];
    var [question, answer] = createExpression();
    let questionMsg = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Evaluate the expression:")
        .setDescription("```" + question + "```")
    msg.channel.send({ embeds: [questionMsg], content: `${player1} vs. ${player2}` })

    const filter = m => m.content.includes(answer) || m.author.id === "700743797977514004";
    const collector = msg.channel.createMessageCollector({ filter, time: 15000 });
    collector.on("collect", m => {
        if (m.content === answer) {
            m.delete();
            if ([player1.id, player2.id].includes(m.author.id)) {
                if (!correctResponses.includes(m.author.username)) {
                    m.channel.send(`${m.author.username} correctly evaluated the expression!`)
                    correctResponses.push(m.author.username)
                } else {
                    deleteInvalidCommand(m, "You already answered correctly!", 2000);
                }
            }
        }
        if (m.author.id === "700743797977514004") {
            m.delete();
        }
    });
    collector.on("end", collected => {
        if (correctResponses.length === 0) {
            msg.channel.send(`No player answered correctly. Answer: ${answer}\n**New question in ${"```" + threeStr + "```"}**`).then((m) => {
                setTimeout(function () {
                    m.edit(`No player answered correctly. Answer: ${answer}\n**New question in ${"```" + twoStr + "```"}**`);
                    setTimeout(function () {
                        m.edit(`No player answered correctly. Answer: ${answer}\n**New question in ${"```" + oneStr + "```"}**`);
                        setTimeout(function () {
                            runDuel(msg, player1, player2);
                            m.edit(`No player answered correctly. Answer: ${answer}`);
                        }, 1500)
                    }, 1500)
                }, 1500)
            })
        } else if (correctResponses.length === 1) {
            let winMsg = new Discord.MessageEmbed()
                .setColor("GOLD")
                .setTitle(`${correctResponses[0]} has won!`)
                .setDescription(`The answer was ${answer}.\n${endingQuotes[randomInt(0, endingQuotes.length)]}`)
            // .setImage("")
            msg.channel.send({ embeds: [winMsg] });
            inDuel.splice(inDuel.indexOf(player1.id), 1);
            inDuel.splice(inDuel.indexOf(player2.id), 1);
        } else {
            msg.channel.send(`Both players answered correctly. Answer: ${answer}\n**New question in ${"```" + threeStr + "```"}**`).then((m) => {
                setTimeout(function () {
                    m.edit(`Both players answered correctly. Answer: ${answer}\n**New question in ${"```" + twoStr + "```"}**`);
                    setTimeout(function () {
                        m.edit(`Both players answered correctly. Answer: ${answer}\n**New question in ${"```" + oneStr + "```"}**`);
                        setTimeout(function () {
                            runDuel(msg, player1, player2);
                            m.edit(`Both players answered correctly. Answer: ${answer}\n`);
                        }, 1500)
                    }, 1500)
                }, 1500)
            })
        }
    });
}

module.exports.run = (client, msg, args) => {
    if (inDuel.includes(msg.author.id)) return deleteInvalidCommand(msg, "You are already dueling!");
    if (args.length < 1) return deleteInvalidCommand(msg, "Who are you challenging?");
    const opponent = client.users.cache.get(args[0].replace("<", "").replace("@", "").replace(">", ""));
    if (!opponent) return deleteInvalidCommand(msg, "Invalid opponent username!");
    if (inDuel.includes(opponent.id)) return deleteInvalidCommand(msg, `${opponent.username} is already dueling someone!`);
    if (msg.author.username === opponent.username) return deleteInvalidCommand(msg, "You dueled yourself. Wait, you can't.");

    msg.channel.send(`${opponent}, send "yes" to confirm duel`);
    const filter = m => m.author.username === opponent.username && !m.author.bot && m.content.toLowerCase() === "yes";
    const collector = msg.channel.createMessageCollector({ filter, time: 15000 });
    collector.on("collect", m => {
        if (inDuel.includes(msg.author.id) || inDuel.includes(opponent.id)) return deleteInvalidCommand(m, "Players are already in a duel!");
        startDuel(msg, msg.author, opponent, 0);
        inDuel.push(msg.author.id, opponent.id);
    });
    collector.on("end", collected => {
        if (collected.size < 1) {
            msg.channel.send("Failed to confirm duel.");
        }
    });
}
exports.name = "duel"
