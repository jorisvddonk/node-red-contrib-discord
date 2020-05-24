module.exports = function(RED) {
    var discordBotManager = require('./lib/discordBotManager.js');
    const { Attachment } = require('discord.js');
    function discordDeleteMessage(config) {
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
                    var channelInstance = bot.channels.get(channel);
                    if (channelInstance) {
                        channelInstance.fetchMessage(msg.channel.lastMessageID).then(msg => msg.delete());
                        //channelInstance.delete(msg.channel.lastMessageID).then(function(){
                        //   node.status({fill:"green", shape:"dot", text:"message sent"});
                        //}).catch(function(err){
                        //   node.error("Couldn't send to channel:" + err);
                        //   node.status({fill:"red", shape:"dot", text:"send error"});
                        //});
                    } else {
                        node.error(`Couldn't delete message '${msg.channel.lastMessageID}' in '${channel}': channel not found.`);
                        node.status({fill:"red", shape:"dot", text:"error"});
                    }
                }
            });
            node.on('close', function() {
                discordBotManager.closeBot(bot);
            });
        });
    }
    RED.nodes.registerType("discordDeleteMessage", discordDeleteMessage);
};
