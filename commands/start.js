const Database = require('@replit/database');
const db = new Database();
const { deleteInvalidCommand } = require('../tools');

module.exports.run = async (client, msg, args) => {
    if (msg.author.id != process.env.ADMIN) return deleteInvalidCommand(msg, 'Not authorized!');
    if (args.length < 1) {
        return deleteInvalidCommand(msg, 'What game are we playing today?');
    }
    const game = args[0].toLowerCase();
    if (game == 'reaper') {
        let start = await db.get('start_time');
        if (start) return deleteInvalidCommand(msg, 'Game already started!');

        // initialize game starting variables
        startTime = Date.now();
        db.set('start_time', startTime);
        db.set('last_reap', startTime);
        db.set('game_scores', []);

        msg.channel.send(`**${msg.author.username} started new Reaper game!**`);
        msg.delete();

        // create user_scores if not found
        let user_scores = await db.get('user_scores');
        if (!user_scores) db.set('user_scores', []);
    } else if (game == 'greed') {
        return deleteInvalidCommand(msg, 'That game is not complete! Greed Control is in development.');
    } else {
        return deleteInvalidCommand(msg, 'That game is not available!');
    }
};
exports.name = 'start';
