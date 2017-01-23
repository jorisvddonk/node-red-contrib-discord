module.exports = function(RED) {
    var discordBotManager = require('./lib/discordBotManager.js');

    function discordSendMessage(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = discordBotManager.getBot(configNode);
    
        this.on('input', function(msg) {
            bot.channels.get(config.channel || msg.channel).send(msg.payload);
        });
        this.on('close', function() {
            discordBotManager.closeBot(bot);
        });
    }
    RED.nodes.registerType("discordSendMessage", discordSendMessage);
};