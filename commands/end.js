const Database = require("@replit/database")
const db = new Database()
const tools = require("../tools");

module.exports.run = (client, msg, args) => {
    if (msg.author.id != process.env.ADMIN) return tools.deleteInvalidCommand(msg, "Not authorized!");
    db.get("start_time").then(start => {
        if (!start) return tools.deleteInvalidCommand(msg, "No game in progress!");
        db.delete("start_time");
        db.delete("last_reap");
        db.delete("game_scores");
        msg.channel.send(`${msg.author.username} ended the game!`);
        msg.delete();
    })
}
exports.name = "end"
