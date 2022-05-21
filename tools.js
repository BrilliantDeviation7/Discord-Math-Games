module.exports = {
    deleteInvalidCommand: function (msg, replyStr, t = 5000) {
        msg.channel.send(replyStr).then(replyMsg => {
            setTimeout(function () {
                msg.channel.messages.fetch(msg.id)
                    .then(msg => msg.delete()) // delete user message
                    .catch(console.error)
                replyMsg.delete(); // delete bot message
            }, t); // 5000 ms default
        });
    },
    isNight: function () {
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var lt = new Date(utc - (3600000 * 5) + 3600000); // local time: EST (UTC+5)
        var h = lt.getHours();
        if (h < 7 || h > 22) return true;
        return false;
    },
    SecondstoTime: function (seconds) {
        date = new Date(seconds * 1000);
        h = date.getUTCHours();
        m = date.getUTCMinutes();
        s = date.getSeconds();
        timeString = h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
        return timeString;
    },
    setMultiplier: function () {
        n = Math.floor(Math.random() * 1000);
        var factor = 1;
        var message = "";
        if (!(n % 10)) factor = 2;
        if (!(n % 60)) factor = 3;
        if (!(n % 80)) factor = 4;
        if (!(n % 100)) factor = 5;
        if (!(n % 200)) factor = 8;
        switch (factor) {
            case 2:
                message = "Double reap!!";
                break;
            case 3:
                message = "Triple reap!!!";
                break;
            case 4:
                message = "Quadruple reap!!!!";
                break;
            case 5:
                message = "Quintuple reap!!!!!";
                break;
            case 8:
                message = "Octuple reap!!!!!!!!";
        }
        return [factor, message];
    },
    freeReap: function () {
        n = Math.floor(Math.random() * 1000);
        if (!(n % 10)) return true;
        return false;
    },
    findUserIndex: function (game_array, id) {
        return game_array.findIndex(player => player[0] === id);
    },
    findUserInfo: function (game_array, id) {
        return game_array.find(player => player[0] === id);
    },
    randomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
};
