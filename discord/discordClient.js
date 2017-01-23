module.exports = function(RED) {
    var discordBotManager = require('./lib/discordBotManager.js');

    function discordClient(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.token);
        var bot = discordBotManager.getBot(configNode);
        var node = this;
        this.on('input', function(msg) {
            msg.discord = bot;
            node.send(msg);
        });
        this.on('close', function() {
            discordBotManager.closeBot(bot);
        });
    }
    RED.nodes.registerType("discordClient", discordClient);
};