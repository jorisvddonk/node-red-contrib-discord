module.exports = function(RED) {
    var discordBotManager = require('./lib/discordBotManager.js');

    function discordSendMessage(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var configNode = RED.nodes.getNode(config.token);
        discordBotManager.getBot(configNode).then(function(bot){
            node.on('input', function(msg) {
                var channel = config.channel || msg.channel;
                if (channel && typeof channel !== 'string') {
                    if (channel.hasOwnProperty('id')) {
                        channel = channel.id;
                    } else {
                        channel = undefined;
                    }
                }
                if (channel) {
                    bot.channels.get(channel).send(msg.payload).then(function(){
                        node.status({fill:"green", shape:"dot", text:"message sent"});
                    }).catch(function(){
                        node.status({fill:"red", shape:"dot", text:"error"});
                    });
                }
            });
            node.on('close', function() {
                discordBotManager.closeBot(bot);
            });
        });    
    }
    RED.nodes.registerType("discordSendMessage", discordSendMessage);
};