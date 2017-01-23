const Discord = require('discord.js');
var bots = new Map();
var getBot = function(configNode) {
    var bot = undefined;
    if (bots.get(configNode) === undefined) {
        bot = new Discord.Client();
        bot.login(configNode.token);
        bots.set(configNode, bot);
    } else {
        bot = bots.get(configNode);
    }
    bot.numReferences = (bot.numReferences || 0) + 1;
    return bot;
};
var closeBot = function(bot) {
    bot.numReferences -= 1;
    setTimeout(function(){
        if (bot.numReferences === 0) {
            bot.destroy();
            for (var i of bots.entries()) {
                if (i[1] === bot) {
                    bots.delete(i[0]);
                }
            }
        }
    }, 1000);
};
module.exports = {
    getBot: getBot,
    closeBot: closeBot
}